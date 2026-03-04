#!/bin/bash

# Vercel Deployment Setup Script
# This script helps configure your Vercel deployment

set -e

echo "🚀 Vercel Deployment Setup"
echo "=============================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI installed"
fi

echo ""
echo "🔐 Step 1: Authenticate with Vercel"
echo "-----------------------------------"
echo "You'll be opened in a browser to authenticate..."
echo ""

vercel login

echo ""
echo "📁 Step 2: Link Your Project"
echo "----------------------------"
echo "Choose 'Y' to link to an existing Vercel project"
echo "or create a new one"
echo ""

vercel link

echo ""
echo "🌍 Step 3: Get Your Secrets"
echo "---------------------------"

# Get Vercel user/org info
VERCEL_ORG_ID=$(vercel whoami --cwd .)
VERCEL_PROJECT=$(vercel projects ls --cwd . | head -n 1)

echo ""
echo "Your Vercel Organization/User ID:"
echo "VERCEL_ORG_ID=$VERCEL_ORG_ID"
echo ""
echo "To get VERCEL_PROJECT_ID, run:"
echo "vercel projects list"
echo ""

echo "🔑 Step 4: Create Access Token"
echo "------------------------------"
echo "Go to: https://vercel.com/account/tokens"
echo "Create a new token and copy it"
echo ""
echo "Then add to GitHub:"
echo "1. Go to: Settings → Secrets and variables → Actions"
echo "2. Create these secrets:"
echo "   • VERCEL_TOKEN: (your API token)"
echo "   • VERCEL_ORG_ID: $VERCEL_ORG_ID"
echo "   • VERCEL_PROJECT_ID: (from 'vercel projects list')"
echo ""

echo "⚙️  Step 5: Environment Variables"
echo "--------------------------------"
echo "Set these in Vercel Dashboard → Settings → Environment Variables:"
echo ""
echo "Required for production:"
echo "  NEXT_PUBLIC_API_URL=https://your-domain.com/api"
echo ""
echo "Optional:"
echo "  NEXTAUTH_URL=https://your-domain.com"
echo "  NEXTAUTH_SECRET=(generate with: openssl rand -hex 32)"
echo ""

echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Push your code: git push origin main"
echo "2. GitHub Actions will deploy to Vercel automatically"
echo "3. Monitor at: https://github.com/YOUR_REPO/actions"
echo ""
echo "📚 Full guide: .github/VERCEL_SETUP.md"
echo ""
