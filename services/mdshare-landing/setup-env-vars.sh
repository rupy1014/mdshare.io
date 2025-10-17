#!/bin/bash

# MDShare Web Environment Variables Setup Script
# This script helps you set up environment variables for Cloudflare Pages

set -e

PROJECT_NAME="mdshare-web"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

print_status "Setting up environment variables for MDShare Web..."

# Function to set a secret
set_secret() {
    local key=$1
    local description=$2
    
    echo -n "Enter $description: "
    read -s value
    echo
    
    if [ -z "$value" ]; then
        print_warning "Skipping $key (empty value)"
        return
    fi
    
    if wrangler pages secret put "$key" --project-name="$PROJECT_NAME" <<< "$value"; then
        print_success "Set $key successfully"
    else
        print_error "Failed to set $key"
    fi
}

# Function to set a variable
set_variable() {
    local key=$1
    local value=$2
    
    if wrangler pages secret put "$key" --project-name="$PROJECT_NAME" <<< "$value"; then
        print_success "Set $key = $value"
    else
        print_error "Failed to set $key"
    fi
}

# Set up required environment variables
print_status "Setting up required environment variables..."

# OpenAI API Key (for AI features)
set_secret "OPENAI_API_KEY" "OpenAI API Key (for AI features)"

# App URLs
print_status "Setting up app URLs..."

# Get the current deployment URL
CURRENT_URL=$(wrangler pages deployment list --project-name="$PROJECT_NAME" | head -n 2 | tail -n 1 | awk '{print $3}' 2>/dev/null || echo "")

if [ -z "$CURRENT_URL" ]; then
    CURRENT_URL="https://mdshare-web.pages.dev"
    print_warning "Could not detect current URL, using default: $CURRENT_URL"
fi

set_variable "NEXT_PUBLIC_APP_URL" "$CURRENT_URL"
set_variable "NEXT_PUBLIC_API_URL" "$CURRENT_URL"

# Optional: Analytics and monitoring
print_status "Setting up optional environment variables..."

echo "Do you want to set up Google Analytics? (y/n)"
read -r setup_analytics
if [[ $setup_analytics =~ ^[Yy]$ ]]; then
    set_secret "NEXT_PUBLIC_GA_ID" "Google Analytics ID (e.g., G-XXXXXXXXXX)"
fi

echo "Do you want to set up Sentry for error monitoring? (y/n)"
read -r setup_sentry
if [[ $setup_sentry =~ ^[Yy]$ ]]; then
    set_secret "SENTRY_DSN" "Sentry DSN"
    set_variable "NEXT_PUBLIC_SENTRY_DSN" "$(echo -n "Enter Sentry DSN again: " && read -s sentry_dsn && echo $sentry_dsn)"
fi

# List current secrets
print_status "Current environment variables:"
wrangler pages secret list --project-name="$PROJECT_NAME"

print_success "Environment variables setup completed!"
print_status "You can now deploy your application with: ./deploy.sh production"
