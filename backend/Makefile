# Makefile for Bharatshaala Backend
# Provides convenient shortcuts for common development tasks

.PHONY: help install dev test lint format clean run

PYTHON := python
FLASK_PORT ?= 5000

help:
	@echo "Bharatshaala Backend - Available Commands"
	@echo "=========================================="
	@echo ""
	@echo "Installation & Setup:"
	@echo "  make install        - Install backend dependencies"
	@echo "  make env           - Create development .env file"
	@echo ""
	@echo "Development:"
	@echo "  make dev           - Run development server"
	@echo "  make run           - Run production-like server"
	@echo "  make shell         - Open Python shell with app context"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint          - Run flake8 linter"
	@echo "  make format        - Format code with black"
	@echo "  make check         - Run all quality checks (lint + format check)"
	@echo ""
	@echo "Testing:"
	@echo "  make test          - Run all tests"
	@echo "  make test-integration - Run integration tests only"
	@echo "  make test-coverage - Run tests with coverage report"
	@echo ""
	@echo "Database:"
	@echo "  make db-migrate    - Run database migrations"
	@echo "  make db-init       - Initialize database"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean         - Remove cache and build files"
	@echo "  make clean-db      - Remove SQLite database"
	@echo ""

install:
	@echo "Installing dependencies..."
	$(PYTHON) -m pip install --upgrade pip
	$(PYTHON) -m pip install -r requirements.txt
	@echo "✓ Dependencies installed"

env:
	@if [ -f .env ]; then \
		echo ".env file already exists"; \
	else \
		echo "Creating .env file from .env.example..."; \
		cp .env.example .env; \
		echo "✓ .env created. Please update with your secrets!"; \
	fi

dev:
	@echo "Starting development server on port $(FLASK_PORT)..."
	FLASK_ENV=development FLASK_PORT=$(FLASK_PORT) $(PYTHON) run.py

run:
	@echo "Starting production-like server..."
	gunicorn wsgi:app --bind 0.0.0.0:$(FLASK_PORT) --workers 4

shell:
	@echo "Opening Flask shell..."
	FLASK_ENV=development $(PYTHON) -c "from base import create_app; app = create_app(); ctx = app.app_context(); ctx.push(); import code; code.interact(local=dict(app=app, ctx=ctx))"

lint:
	@echo "Running Flake8 linter..."
	flake8 . --count --statistics --max-complexity=10
	@echo "✓ Linting complete"

format:
	@echo "Checking code formatting with Black..."
	black --check --diff . --exclude="alembic,razorpay_sdk,tests/mocks"
	@echo "✓ Format check complete"

format-fix:
	@echo "Formatting code with Black..."
	black . --exclude="alembic,razorpay_sdk"
	@echo "✓ Code formatted"

check: lint format
	@echo "✓ All quality checks passed"

test:
	@echo "Running all tests..."
	$(PYTHON) -m pytest tests/ -v --tb=short

test-integration:
	@echo "Running integration tests..."
	$(PYTHON) -m pytest tests/test_integration_ecommerce.py -v --tb=short

test-razorpay:
	@echo "Running Razorpay SDK tests..."
	$(PYTHON) -m pytest tests/test_client_*.py -v --tb=short

test-coverage:
	@echo "Running tests with coverage..."
	$(PYTHON) -m pytest tests/ --cov=. --cov-report=html --cov-report=term-missing
	@echo "✓ Coverage report generated in htmlcov/index.html"

db-migrate:
	@echo "Running database migrations..."
	alembic upgrade head

db-init:
	@echo "Initializing database..."
	$(PYTHON) -c "from base import create_app; from database import initialize_database; app = create_app(); ctx = app.app_context(); ctx.push(); initialize_database(); print('✓ Database initialized')"

clean:
	@echo "Cleaning cache files..."
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .mypy_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	@echo "✓ Cache cleaned"

clean-db:
	@echo "Removing SQLite database..."
	rm -f *.db sql.db bharatshaala.db
	@echo "✓ Database removed"

.DEFAULT_GOAL := help
