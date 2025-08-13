from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import database
from .utils import success_response, error_response, validate_pagination, create_pagination_info

products_bp = Blueprint('products', __name__, url_prefix='/v1')

@products_bp.route('/products', methods=['GET'])
def get_products():
    try:
        page, per_page = validate_pagination()
        
        # Get filters from query parameters
        category_id = request.args.get('category_id', type=int)
        market_id = request.args.get('market_id', type=int)
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        sort_by = request.args.get('sort_by', 'created_at')
        sort_order = request.args.get('sort_order', 'desc')
        
        filters = {
            'category_id': category_id,
            'market_id': market_id,
            'min_price': min_price,
            'max_price': max_price,
            'sort_by': sort_by,
            'sort_order': sort_order,
            'page': page,
            'per_page': per_page
        }
        
        products, total_count = database.get_products_with_filters(filters)
        pagination = create_pagination_info(page, per_page, total_count)
        
        return success_response(products, "Products retrieved successfully", pagination)
        
    except Exception as e:
        return error_response(f"Failed to retrieve products: {str(e)}", 500)

@products_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = database.get_product_by_id(product_id)
        if not product:
            return error_response("Product not found", 404)
        
        return success_response(product, "Product retrieved successfully")
        
    except Exception as e:
        return error_response(f"Failed to retrieve product: {str(e)}", 500)

@products_bp.route('/products/search', methods=['GET'])
def search_products():
    try:
        query = request.args.get('query', '').strip()
        if not query:
            return error_response("Search query is required", 400)
        
        page, per_page = validate_pagination()
        
        # Additional filters
        category_id = request.args.get('category_id', type=int)
        market_id = request.args.get('market_id', type=int)
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        
        filters = {
            'query': query,
            'category_id': category_id,
            'market_id': market_id,
            'min_price': min_price,
            'max_price': max_price,
            'page': page,
            'per_page': per_page
        }
        
        products, total_count = database.search_products(filters)
        pagination = create_pagination_info(page, per_page, total_count)
        
        return success_response(products, "Search results retrieved successfully", pagination)
        
    except Exception as e:
        return error_response(f"Search failed: {str(e)}", 500)

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = database.get_all_categories()
        return success_response(categories, "Categories retrieved successfully")
        
    except Exception as e:
        return error_response(f"Failed to retrieve categories: {str(e)}", 500)

@products_bp.route('/categories/<int:category_id>/products', methods=['GET'])
def get_category_products(category_id):
    try:
        page, per_page = validate_pagination()
        
        # Check if category exists
        category = database.get_category_by_id(category_id)
        if not category:
            return error_response("Category not found", 404)
        
        products, total_count = database.get_products_by_category(category_id, page, per_page)
        pagination = create_pagination_info(page, per_page, total_count)
        
        return success_response(products, f"Products for category retrieved successfully", pagination)
        
    except Exception as e:
        return error_response(f"Failed to retrieve category products: {str(e)}", 500)

@products_bp.route('/markets', methods=['GET'])
def get_markets():
    try:
        markets = database.get_all_markets()
        return success_response(markets, "Markets retrieved successfully")
        
    except Exception as e:
        return error_response(f"Failed to retrieve markets: {str(e)}", 500)

@products_bp.route('/markets/<int:market_id>', methods=['GET'])
def get_market(market_id):
    try:
        market = database.get_market_by_id(market_id)
        if not market:
            return error_response("Market not found", 404)
        
        return success_response(market, "Market retrieved successfully")
        
    except Exception as e:
        return error_response(f"Failed to retrieve market: {str(e)}", 500)

@products_bp.route('/markets/<int:market_id>/products', methods=['GET'])
def get_market_products(market_id):
    try:
        page, per_page = validate_pagination()
        
        # Check if market exists
        market = database.get_market_by_id(market_id)
        if not market:
            return error_response("Market not found", 404)
        
        products, total_count = database.get_products_by_market(market_id, page, per_page)
        pagination = create_pagination_info(page, per_page, total_count)
        
        return success_response(products, f"Products for market retrieved successfully", pagination)
        
    except Exception as e:
        return error_response(f"Failed to retrieve market products: {str(e)}", 500)

# Review endpoints
@products_bp.route('/products/<int:product_id>/reviews', methods=['GET'])
def get_product_reviews(product_id):
    try:
        page, per_page = validate_pagination()
        
        reviews, total_count = database.get_product_reviews(product_id, page, per_page)
        pagination = create_pagination_info(page, per_page, total_count)
        
        return success_response(reviews, "Reviews retrieved successfully", pagination)
        
    except Exception as e:
        return error_response(f"Failed to retrieve reviews: {str(e)}", 500)

@products_bp.route('/products/<int:product_id>/reviews', methods=['POST'])
@jwt_required()
def add_product_review(product_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        rating = data.get('rating')
        comment = data.get('comment', '').strip()
        
        if not rating or not (1 <= rating <= 5):
            return error_response("Rating must be between 1 and 5", 400)
        
        # Check if user has purchased this product
        has_purchased = database.check_user_purchased_product(user_id, product_id)
        if not has_purchased:
            return error_response("You can only review products you have purchased", 400)
        
        # Check if user already reviewed this product
        existing_review = database.get_user_product_review(user_id, product_id)
        if existing_review:
            return error_response("You have already reviewed this product", 400)
        
        review_id = database.add_product_review(user_id, product_id, rating, comment)
        if review_id < 0:
            return error_response("Failed to add review", 500)
        
        return success_response({'review_id': review_id}, "Review added successfully")
        
    except Exception as e:
        return error_response(f"Failed to add review: {str(e)}", 500)