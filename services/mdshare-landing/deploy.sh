#!/bin/bash

# MDShare Web Deployment Script
# Usage: ./deploy.sh [development|staging|production]

set -e

ENVIRONMENT=${1:-development}
PROJECT_NAME="mdshare-web"

echo "🚀 Starting MDShare Web deployment..."
echo "Environment: $ENVIRONMENT"
echo "Project: $PROJECT_NAME"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    print_error "Wrangler CLI is not installed. Please install it first:"
    echo "npm install -g wrangler"
    exit 1
fi

# Check if user is logged in to Cloudflare
if ! wrangler whoami &> /dev/null; then
    print_error "You are not logged in to Cloudflare. Please login first:"
    echo "wrangler login"
    exit 1
fi

# Set environment-specific variables
case $ENVIRONMENT in
    development)
        BRANCH="dev"
        DOMAIN="mdshare-dev.pages.dev"
        ;;
    staging)
        BRANCH="staging"
        DOMAIN="mdshare-staging.pages.dev"
        ;;
    production)
        BRANCH="main"
        DOMAIN="mdshare.pages.dev"
        ;;
    *)
        print_error "Invalid environment. Use: development, staging, or production"
        exit 1
        ;;
esac

print_status "Building for $ENVIRONMENT environment..."

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Run linting
print_status "Running linting..."
npm run lint

# Build the project
print_status "Building project..."
npm run build:cf

if [ ! -d ".vercel/output/static" ]; then
    print_error "Build failed. Output directory not found."
    exit 1
fi

print_success "Build completed successfully!"

# Deploy to Cloudflare Pages
print_status "Deploying to Cloudflare Pages..."

if wrangler pages deploy .vercel/output/static --project-name="$PROJECT_NAME" --branch="$BRANCH"; then
    print_success "Deployment completed successfully!"
    print_success "URL: https://$DOMAIN"
    
    # Get deployment URL
    DEPLOYMENT_URL=$(wrangler pages deployment list --project-name="$PROJECT_NAME" | head -n 2 | tail -n 1 | awk '{print $3}')
    if [ ! -z "$DEPLOYMENT_URL" ]; then
        print_success "Deployment URL: $DEPLOYMENT_URL"
    fi
    
    # Run post-deployment checks
    print_status "Running post-deployment checks..."
    
    # Wait a moment for deployment to be ready
    sleep 10
    
    # Check if the site is accessible
    if curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" | grep -q "200"; then
        print_success "Site is accessible and responding correctly!"
    else
        print_warning "Site may not be fully ready yet. Please check manually."
    fi
    
else
    print_error "Deployment failed!"
    exit 1
fi

print_success "🎉 MDShare Web deployment to $ENVIRONMENT completed successfully!"
print_success "🌐 Live at: https://$DOMAIN"
