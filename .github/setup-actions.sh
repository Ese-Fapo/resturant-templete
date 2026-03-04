#!/bin/bash

# GitHub Actions Setup Script
# Run this script to configure GitHub Actions for your project

echo "🚀 GitHub Actions Setup for Food Ordering App"
echo "=============================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please run 'git init' first."
    exit 1
fi

echo "✅ Git repository found"
echo ""

# Display next steps
echo "📋 Next Steps to Enable GitHub Actions:"
echo ""
echo "1️⃣  Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Add GitHub Actions workflows'"
echo "   git push origin main"
echo ""

echo "2️⃣  Configure Required Secrets (if needed):"
echo "   Go to: Settings → Secrets and variables → Actions"
echo ""
echo "   Optional secrets to add:"
echo "   • VERCEL_TOKEN (for Vercel deployments)"
echo "   • NETLIFY_TOKEN & NETLIFY_SITE_ID (for Netlify deployments)"
echo "   • SONAR_TOKEN (for SonarCloud analysis)"
echo "   • SLACK_WEBHOOK_URL (for Slack notifications)"
echo ""

echo "3️⃣  Set Up Branch Protection Rules:"
echo "   Go to: Settings → Branches → main"
echo "   Enable:"
echo "   • Require status checks to pass before merging"
echo "   • Select: 'CI Pipeline' and 'Code Quality & Security'"
echo "   • Require branches to be up to date"
echo ""

echo "4️⃣  Enable Environments (optional):"
echo "   Go to: Settings → Environments"
echo "   Create 'production' environment with required approvals"
echo ""

echo "5️⃣  Create Your First Pull Request:"
echo "   git checkout -b feature/test"
echo "   git commit --allow-empty -m 'test: trigger workflows'"
echo "   git push origin feature/test"
echo "   Then create a PR on GitHub"
echo ""

echo "✨ Setup Complete!"
echo ""
echo "📊 Monitor your workflows at:"
echo "   https://github.com/YOUR_USERNAME/YOUR_REPO/actions"
echo ""
echo "📚 Documentation available in:"
echo "   • .github/WORKFLOWS.md (Detailed guide)"
echo "   • .github/QUICK_REFERENCE.md (Quick commands)"
echo "   • .github/ENVIRONMENT_CONFIG.yml (Config reference)"
echo ""
