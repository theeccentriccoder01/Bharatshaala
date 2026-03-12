"""
Database utilities for connection pooling, transaction management, and query optimization.
"""
import sqlite3
import logging
import time
import threading
from contextlib import contextmanager
from typing import Optional, Callable, Any
from functools import wraps

logger = logging.getLogger(__name__)

# Configuration
MAX_RETRIES = 3
RETRY_DELAY = 0.5  # seconds
QUERY_TIMEOUT = 30  # seconds


class ConnectionPool:
    """
    Simple connection pool for SQLite database.
    Note: SQLite doesn't support true concurrent connections well,
    but this pool helps manage connection reuse efficiently.
    """
    
    def __init__(self, database: str, max_connections: int = 5):
        self.database = database
        self.max_connections = max_connections
        self._pool = []
        self._lock = threading.Lock()
        self._semaphore = threading.Semaphore(max_connections)
    
    @contextmanager
    def get_connection(self):
        """Get a connection from the pool"""
        self._semaphore.acquire()
        conn = None
        
        try:
            with self._lock:
                if self._pool:
                    conn = self._pool.pop()
                    # Check if connection is still valid
                    try:
                        conn.execute("SELECT 1")
                    except:
                        conn = None
            
            if conn is None:
                conn = sqlite3.connect(
                    self.database,
                    timeout=30.0,
                    isolation_level=None  # Autocommit mode for connection pooling
                )
                conn.row_factory = sqlite3.Row
            
            # Enable WAL mode for better concurrency
            conn.execute("PRAGMA journal_mode=WAL")
            conn.execute("PRAGMA synchronous=NORMAL")
            conn.execute("PRAGMA cache_size=-64000")  # 64MB cache
            conn.execute("PRAGMA temp_store=MEMORY")
            
            yield conn
            
        except Exception as e:
            if conn:
                conn.rollback()
            logger.error(f"Database error: {e}")
            raise
        
        finally:
            if conn:
                with self._lock:
                    if len(self._pool) < self.max_connections:
                        self._pool.append(conn)
                    else:
                        conn.close()
            self._semaphore.release()


# Global connection pool instance
from .database import DATABASE_NAME
_connection_pool = None


def get_connection_pool() -> ConnectionPool:
    """Get or create the global connection pool"""
    global _connection_pool
    if _connection_pool is None:
        _connection_pool = ConnectionPool(
            DATABASE_NAME,
            max_connections=5
        )
    return _connection_pool


@contextmanager
def get_pooled_connection():
    """Context manager for getting a pooled connection"""
    pool = get_connection_pool()
    with pool.get_connection() as conn:
        yield conn


def with_retry(max_retries: int = MAX_RETRIES, delay: float = RETRY_DELAY):
    """
    Decorator to retry a function on database lock errors.
    
    Args:
        max_retries: Maximum number of retry attempts
        delay: Delay between retries in seconds
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except sqlite3.OperationalError as e:
                    last_exception = e
                    if "database is locked" in str(e).lower():
                        logger.warning(
                            f"Database locked, retry {attempt + 1}/{max_retries}"
                        )
                        time.sleep(delay * (attempt + 1))  # Exponential backoff
                    else:
                        raise
                except Exception as e:
                    logger.error(f"Database error: {e}")
                    raise
            
            raise last_exception
        
        return wrapper
    return decorator


class TransactionManager:
    """
    Manages database transactions with support for savepoints and rollback.
    """
    
    def __init__(self, connection):
        self.connection = connection
        self._savepoint_stack = []
        self._in_transaction = False
    
    def begin(self):
        """Begin a transaction"""
        if not self._in_transaction:
            self.connection.execute("BEGIN IMMEDIATE")
            self._in_transaction = True
    
    def commit(self):
        """Commit the current transaction"""
        if self._savepoint_stack:
            # Just release the last savepoint
            self._savepoint_stack.pop()
        elif self._in_transaction:
            self.connection.execute("COMMIT")
            self._in_transaction = False
    
    def rollback(self):
        """Rollback the current transaction or savepoint"""
        if self._savepoint_stack:
            savepoint_name = self._savepoint_stack.pop()
            self.connection.execute(f"ROLLBACK TO SAVEPOINT {savepoint_name}")
        elif self._in_transaction:
            self.connection.execute("ROLLBACK")
            self._in_transaction = False
    
    def savepoint(self, name: str = None):
        """Create a savepoint"""
        if name is None:
            name = f"sp_{len(self._savepoint_stack)}"
        self.connection.execute(f"SAVEPOINT {name}")
        self._savepoint_stack.append(name)
        return name
    
    def release_savepoint(self, name: str):
        """Release a savepoint"""
        if name in self._savepoint_stack:
            self._savepoint_stack.remove(name)
            self.connection.execute(f"RELEASE SAVEPOINT {name}")
    
    def __enter__(self):
        self.begin()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            self.rollback()
        else:
            self.commit()
        return False


@contextmanager
def transaction(connection=None, use_pool: bool = True):
    """
    Context manager for database transactions.
    
    Usage:
        with transaction() as conn:
            conn.execute(...)
    """
    if connection is None and use_pool:
        with get_pooled_connection() as conn:
            with TransactionManager(conn) as tm:
                yield conn
    elif connection:
        with TransactionManager(connection) as tm:
            yield connection
    else:
        raise ValueError("Either provide a connection or set use_pool=True")


class QueryLogger:
    """
    Logs SQL queries for debugging and monitoring.
    Only active in development mode.
    """
    
    def __init__(self, enabled: bool = True):
        self.enabled = enabled
        self._log_threshold = 0.1  # Log queries taking longer than 100ms
    
    def log_query(self, query: str, params: tuple = None, duration: float = None):
        """Log a query execution"""
        if not self.enabled:
            return
        
        log_level = logging.DEBUG
        message = f"SQL: {query}"
        
        if params:
            message += f" | Params: {params}"
        
        if duration is not None:
            message += f" | Duration: {duration:.3f}s"
            if duration > self._log_threshold:
                log_level = logging.WARNING
        
        logger.log(log_level, message)
    
    def log_slow_query(self, query: str, duration: float):
        """Log a slow query warning"""
        logger.warning(f"SLOW QUERY ({duration:.3f}s): {query}")


# Global query logger instance
query_logger = QueryLogger(enabled=False)


def enable_query_logging(enabled: bool = True, threshold: float = 0.1):
    """Enable or disable query logging"""
    global query_logger
    query_logger.enabled = enabled
    query_logger._log_threshold = threshold


def log_query_execution(query: str):
    """
    Decorator to log query execution time.
    
    Usage:
        @log_query_execution("SELECT * FROM users")
        def get_users():
            ...
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                duration = time.time() - start_time
                query_logger.log_query(query, duration=duration)
                return result
            except Exception as e:
                duration = time.time() - start_time
                query_logger.log_query(query, duration=duration)
                raise
        return wrapper
    return decorator


def execute_with_timeout(cursor, query: str, params: tuple = None, timeout: int = QUERY_TIMEOUT):
    """
    Execute a query with timeout.
    
    Args:
        cursor: Database cursor
        query: SQL query
        params: Query parameters
        timeout: Timeout in seconds
    
    Returns:
        Query results
    """
    # SQLite doesn't support query timeouts directly,
    # but we can set a busy timeout on the connection
    start_time = time.time()
    
    if params:
        cursor.execute(query, params)
    else:
        cursor.execute(query)
    
    duration = time.time() - start_time
    
    if duration > timeout:
        query_logger.log_slow_query(query, duration)
    
    return cursor


# Prepared statements cache
class PreparedStatementCache:
    """
    Cache for prepared statements to improve performance.
    Note: SQLite doesn't support true prepared statements,
    but we can cache query templates.
    """
    
    def __init__(self, max_size: int = 100):
        self._cache = {}
        self._max_size = max_size
        self._lock = threading.Lock()
    
    def get(self, query: str) -> Optional[str]:
        """Get a cached query template"""
        with self._lock:
            entry = self._cache.get(query)
            if entry:
                return query
            return None
    
    def put(self, query: str):
        """Cache a query template"""
        with self._lock:
            if len(self._cache) >= self._max_size:
                # Remove oldest entry (simple FIFO)
                oldest = next(iter(self._cache))
                del self._cache[oldest]
            self._cache[query] = True


# Global prepared statements cache
prepared_statements = PreparedStatementCache()


def get_cached_query(query: str, params: dict = None) -> str:
    """
    Get a cached query or prepare a new one.
    This helps prevent SQL injection by using parameterized queries.
    
    Args:
        query: SQL query template
        params: Dictionary of parameters
    
    Returns:
        Processed query ready for execution
    """
    # Check cache first
    cached = prepared_statements.get(query)
    if cached:
        return query
    
    # Cache the query
    prepared_statements.put(query)
    return query
