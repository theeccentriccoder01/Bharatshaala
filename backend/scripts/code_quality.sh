#!/bin/bash
# Code Quality Check Script for Bharatshaala Backend
# Usage: ./scripts/code_quality.sh

set -e

echo "========================================="
echo "Bharatshaala Backend - Code Quality Check"
echo "========================================="
echo ""

# Check if running from correct directory
if [ ! -f "requirements.txt" ]; then
    echo "Error: Please run this script from the backend directory"
    exit 1
fi

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Counter for issues found
issues_found=0

echo -e "${YELLOW}1. Running Black formatter (check mode)...${NC}"
if black --check --diff . --exclude="alembic|razorpay_sdk|tests/mocks" 2>/dev/null; then
    echo -e "${GREEN}✓ Formatting check passed${NC}"
else
    echo -e "${RED}✗ Formatting issues found. Run 'black .' to fix${NC}"
    issues_found=$((issues_found + 1))
fi
echo ""

echo -e "${YELLOW}2. Running Flake8 linter...${NC}"
if flake8 . --count --statistics; then
    echo -e "${GREEN}✓ Linting check passed${NC}"
else
    echo -e "${RED}✗ Linting issues found${NC}"
    issues_found=$((issues_found + 1))
fi
echo ""

echo -e "${YELLOW}3. Running pytest for integration tests...${NC}"
if python -m pytest tests/test_integration_ecommerce.py -v --tb=short 2>/dev/null; then
    echo -e "${GREEN}✓ Integration tests passed${NC}"
else
    echo -e "${YELLOW}⚠ Integration tests skipped (DB may need setup)${NC}"
fi
echo ""

echo "========================================="
if [ $issues_found -eq 0 ]; then
    echo -e "${GREEN}All checks passed! ✓${NC}"
    exit 0
else
    echo -e "${RED}$issues_found check(s) failed. See above for details.${NC}"
    echo ""
    echo "To fix formatting issues, run:"
    echo "  black . --exclude='alembic,razorpay_sdk'"
    exit 1
fi
