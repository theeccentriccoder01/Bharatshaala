"""Initial database schema migration

Revision ID: 001_initial
Revises: 
Create Date: 2024-01-01 00:00:00

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # User Table
    op.create_table('User',
        sa.Column('UserId', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('AccountType', sa.Text(), nullable=False),
        sa.Column('Email', sa.Text(), nullable=False),
        sa.Column('Name', sa.Text(), nullable=False),
        sa.Column('Password', sa.Text(), nullable=False),
        sa.Column('StoreID', sa.Integer(), nullable=True),
        sa.Column('PhoneNumber', sa.Text(), nullable=True),
        sa.Column('Address', sa.Text(), nullable=True),
        sa.Column('City', sa.Text(), nullable=True),
        sa.Column('State', sa.Text(), nullable=True),
        sa.Column('Pincode', sa.Text(), nullable=True),
        sa.Column('DateCreated', sa.TIMESTAMP, nullable=True),
        sa.Column('LastLogin', sa.TIMESTAMP, nullable=True),
        sa.Column('IsActive', sa.Boolean, nullable=True),
        sa.Column('IsVerified', sa.Boolean, nullable=True),
        sa.PrimaryKeyConstraint('UserId'),
        sa.UniqueConstraint('Email')
    )
    op.create_index('ix_user_email', 'User', ['Email'], unique=True)
    op.create_index('ix_user_store_id', 'User', ['StoreID'], unique=False)

    # InvitationCodes Table
    op.create_table('InvitationCodes',
        sa.Column('StoreId', sa.Integer(), nullable=False),
        sa.Column('InvitationCode', sa.Text(), nullable=False),
        sa.Column('StoreName', sa.Text(), nullable=True),
        sa.Column('IsActive', sa.Boolean, nullable=True),
        sa.Column('CreatedDate', sa.TIMESTAMP, nullable=True),
        sa.PrimaryKeyConstraint('StoreId'),
        sa.UniqueConstraint('InvitationCode')
    )

    # Categories Table
    op.create_table('Categories',
        sa.Column('CategoryId', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('CategoryName', sa.Text(), nullable=False),
        sa.Column('CategoryNameHindi', sa.Text(), nullable=True),
        sa.Column('ParentCategoryId', sa.Integer(), nullable=True),
        sa.Column('Description', sa.Text(), nullable=True),
        sa.Column('IsActive', sa.Boolean, nullable=True),
        sa.Column('SortOrder', sa.Integer(), nullable=True),
        sa.Column('DateCreated', sa.TIMESTAMP, nullable=True),
        sa.ForeignKeyConstraint(['ParentCategoryId'], ['Categories.CategoryId'], ),
        sa.PrimaryKeyConstraint('CategoryId'),
        sa.UniqueConstraint('CategoryName')
    )

    # Store Table
    op.create_table('Store',
        sa.Column('StoreId', sa.Integer(), nullable=False),
        sa.Column('ItemId', sa.Integer(), nullable=False),
        sa.Column('Quantity', sa.Integer(), nullable=False),
        sa.Column('Price', sa.Numeric(10, 2), nullable=False),
        sa.Column('ItemName', sa.Text(), nullable=False),
        sa.Column('Image', sa.LargeBinary(), nullable=True),
        sa.Column('CategoryId', sa.Integer(), nullable=True),
        sa.Column('Description', sa.Text(), nullable=True),
        sa.Column('IsActive', sa.Boolean, nullable=True),
        sa.Column('DateAdded', sa.TIMESTAMP, nullable=True),
        sa.Column('DateModified', sa.TIMESTAMP, nullable=True),
        sa.ForeignKeyConstraint(['CategoryId'], ['Categories.CategoryId'], ),
        sa.PrimaryKeyConstraint('StoreId', 'ItemId')
    )
    op.create_index('ix_store_category_id', 'Store', ['CategoryId'], unique=False)

    # Cart Table
    op.create_table('cart',
        sa.Column('CartId', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('StoreId', sa.Integer(), nullable=False),
        sa.Column('ItemId', sa.Integer(), nullable=False),
        sa.Column('CustomerId', sa.Integer(), nullable=False),
        sa.Column('Quantity', sa.Integer(), nullable=False),
        sa.Column('Price', sa.Numeric(10, 2), nullable=False),
        sa.Column('ItemName', sa.Text(), nullable=False),
        sa.Column('OrderId', sa.Text(), nullable=True),
        sa.Column('DateAdded', sa.TIMESTAMP, nullable=True),
        sa.ForeignKeyConstraint(['CustomerId'], ['User.UserId'], ),
        sa.PrimaryKeyConstraint('CartId'),
        sa.UniqueConstraint('StoreId', 'ItemId', 'CustomerId', name='uq_cart_store_item_customer')
    )

    # Orders Table
    op.create_table('orders',
        sa.Column('OrderDetailId', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('StoreId', sa.Integer(), nullable=False),
        sa.Column('ItemId', sa.Integer(), nullable=False),
        sa.Column('CustomerId', sa.Integer(), nullable=False),
        sa.Column('Quantity', sa.Integer(), nullable=False),
        sa.Column('Price', sa.Numeric(10, 2), nullable=False),
        sa.Column('ItemName', sa.Text(), nullable=False),
        sa.Column('OrderId', sa.Text(), nullable=False),
        sa.Column('OrderStatus', sa.Text(), nullable=True),
        sa.Column('OrderDate', sa.Date(), nullable=False),
        sa.Column('OrderTime', sa.Time(), nullable=False),
        sa.Column('DeliveryAddress', sa.Text(), nullable=True),
        sa.Column('TrackingNumber', sa.Text(), nullable=True),
        sa.Column('DeliveryDate', sa.Date(), nullable=True),
        sa.Column('PaymentStatus', sa.Text(), nullable=True),
        sa.Column('TotalAmount', sa.Numeric(10, 2), nullable=True),
        sa.ForeignKeyConstraint(['CustomerId'], ['User.UserId'], ),
        sa.PrimaryKeyConstraint('OrderDetailId')
    )
    op.create_index('ix_orders_customer_id', 'orders', ['CustomerId'], unique=False)
    op.create_index('ix_orders_status', 'orders', ['OrderStatus'], unique=False)
    op.create_index('ix_orders_order_id', 'orders', ['OrderId'], unique=False)

    # Inventory Table
    op.create_table('inventory',
        sa.Column('InventoryId', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('VendorId', sa.Integer(), nullable=False),
        sa.Column('VendorName', sa.Text(), nullable=False),
        sa.Column('StoreId', sa.Integer(), nullable=False),
        sa.Column('ItemId', sa.Integer(), nullable=False),
        sa.Column('ItemName', sa.Text(), nullable=False),
        sa.Column('ItemDesc', sa.Text(), nullable=True),
        sa.Column('ItemImage', sa.LargeBinary(), nullable=True),
        sa.Column('Quantity', sa.Integer(), nullable=False),
        sa.Column('Price', sa.Numeric(10, 2), nullable=False),
        sa.Column('CategoryId', sa.Integer(), nullable=True),
        sa.Column('SKU', sa.Text(), nullable=True),
        sa.Column('MinStockLevel', sa.Integer(), nullable=True),
        sa.Column('MaxStockLevel', sa.Integer(), nullable=True),
        sa.Column('IsActive', sa.Boolean, nullable=True),
        sa.Column('DateAdded', sa.TIMESTAMP, nullable=True),
        sa.Column('DateModified', sa.TIMESTAMP, nullable=True),
        sa.ForeignKeyConstraint(['VendorId'], ['User.UserId'], ),
        sa.ForeignKeyConstraint(['CategoryId'], ['Categories.CategoryId'], ),
        sa.PrimaryKeyConstraint('InventoryId'),
        sa.UniqueConstraint('SKU'),
        sa.UniqueConstraint('VendorId', 'ItemId', name='uq_inventory_vendor_item')
    )
    op.create_index('ix_inventory_category_id', 'inventory', ['CategoryId'], unique=False)
    op.create_index('ix_inventory_vendor_id', 'inventory', ['VendorId'], unique=False)

    # Payments Table
    op.create_table('payments',
        sa.Column('PaymentId', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('OrderId', sa.Text(), nullable=False),
        sa.Column('CustomerId', sa.Integer(), nullable=False),
        sa.Column('Amount', sa.Numeric(10, 2), nullable=False),
        sa.Column('PaymentMethod', sa.Text(), nullable=False),
        sa.Column('PaymentStatus', sa.Text(), nullable=True),
        sa.Column('TransactionId', sa.Text(), nullable=True),
        sa.Column('GatewayResponse', sa.Text(), nullable=True),
        sa.Column('PaymentDate', sa.TIMESTAMP, nullable=True),
        sa.Column('RefundAmount', sa.Numeric(10, 2), nullable=True),
        sa.Column('RefundDate', sa.TIMESTAMP, nullable=True),
        sa.ForeignKeyConstraint(['CustomerId'], ['User.UserId'], ),
        sa.PrimaryKeyConstraint('PaymentId'),
        sa.UniqueConstraint('TransactionId')
    )
    op.create_index('ix_payments_order_id', 'payments', ['OrderId'], unique=False)

    # Reviews Table
    op.create_table('reviews',
        sa.Column('ReviewId', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('ProductId', sa.Integer(), nullable=False),
        sa.Column('StoreId', sa.Integer(), nullable=False),
        sa.Column('CustomerId', sa.Integer(), nullable=False),
        sa.Column('OrderId', sa.Text(), nullable=True),
        sa.Column('Rating', sa.Integer(), nullable=False),
        sa.Column('ReviewTitle', sa.Text(), nullable=True),
        sa.Column('ReviewText', sa.Text(), nullable=True),
        sa.Column('IsVerifiedPurchase', sa.Boolean, nullable=True),
        sa.Column('IsApproved', sa.Boolean, nullable=True),
        sa.Column('HelpfulCount', sa.Integer(), nullable=True),
        sa.Column('DateCreated', sa.TIMESTAMP, nullable=True),
        sa.ForeignKeyConstraint(['CustomerId'], ['User.UserId'], ),
        sa.PrimaryKeyConstraint('ReviewId')
    )
    op.create_index('ix_reviews_product_id', 'reviews', ['ProductId'], unique=False)

    # Wishlist Table
    op.create_table('wishlist',
        sa.Column('WishlistId', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('CustomerId', sa.Integer(), nullable=False),
        sa.Column('StoreId', sa.Integer(), nullable=False),
        sa.Column('ItemId', sa.Integer(), nullable=False),
        sa.Column('ItemName', sa.Text(), nullable=False),
        sa.Column('Price', sa.Numeric(10, 2), nullable=False),
        sa.Column('DateAdded', sa.TIMESTAMP, nullable=True),
        sa.ForeignKeyConstraint(['CustomerId'], ['User.UserId'], ),
        sa.PrimaryKeyConstraint('WishlistId'),
        sa.UniqueConstraint('CustomerId', 'StoreId', 'ItemId', name='uq_wishlist_customer_item')
    )


def downgrade() -> None:
    op.drop_table('wishlist')
    op.drop_table('reviews')
    op.drop_table('payments')
    op.drop_table('inventory')
    op.drop_table('orders')
    op.drop_table('cart')
    op.drop_table('Store')
    op.drop_table('Categories')
    op.drop_table('InvitationCodes')
    op.drop_table('User')
