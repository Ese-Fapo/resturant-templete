# Vercel Deployment Setup Script (PowerShell)
# This script helps configure your Vercel deployment on Windows

Write-Host "🚀 Vercel Deployment Setup" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host ""

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI already installed: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔐 Step 1: Authenticate with Vercel" -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Cyan
Write-Host "You'll be opened in a browser to authenticate..." -ForegroundColor White
Write-Host ""

vercel login

Write-Host ""
Write-Host "📁 Step 2: Link Your Project" -ForegroundColor Cyan
Write-Host "----------------------------" -ForegroundColor Cyan
Write-Host "Choose 'Y' to link to an existing Vercel project" -ForegroundColor White
Write-Host "or create a new one" -ForegroundColor White
Write-Host ""

vercel link

Write-Host ""
Write-Host "🌍 Step 3: Get Your Secrets" -ForegroundColor Cyan
Write-Host "---------------------------" -ForegroundColor Cyan
Write-Host ""

$vercelOrg = vercel whoami
Write-Host "Your Vercel Organization/User ID:" -ForegroundColor White
Write-Host "VERCEL_ORG_ID=$vercelOrg" -ForegroundColor Yellow
Write-Host ""

Write-Host "To get VERCEL_PROJECT_ID, the value should be in:" -ForegroundColor White
Write-Host ".vercel\project.json (local file)" -ForegroundColor Yellow
Write-Host "or visit your project settings on Vercel dashboard" -ForegroundColor Yellow
Write-Host ""

Write-Host "🔑 Step 4: Create Access Token" -ForegroundColor Cyan
Write-Host "------------------------------" -ForegroundColor Cyan
Write-Host "1. Go to: https://vercel.com/account/tokens" -ForegroundColor White
Write-Host "2. Create a new token named 'github-actions-token'" -ForegroundColor White
Write-Host "3. Copy the token" -ForegroundColor White
Write-Host ""
Write-Host "Then add to GitHub:" -ForegroundColor White
Write-Host "1. Go to: Settings → Secrets and variables → Actions" -ForegroundColor White
Write-Host "2. Create these secrets:" -ForegroundColor White
Write-Host "   • VERCEL_TOKEN: (your API token)" -ForegroundColor Yellow
Write-Host "   • VERCEL_ORG_ID: $vercelOrg" -ForegroundColor Yellow
Write-Host "   • VERCEL_PROJECT_ID: (from project settings)" -ForegroundColor Yellow
Write-Host ""

Write-Host "⚙️  Step 5: Environment Variables" -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor Cyan
Write-Host "Set these in Vercel Dashboard → Settings → Environment Variables:" -ForegroundColor White
Write-Host ""
Write-Host "Required for production:" -ForegroundColor White
Write-Host "  NEXT_PUBLIC_API_URL=https://your-domain.com/api" -ForegroundColor Yellow
Write-Host ""
Write-Host "Optional:" -ForegroundColor White
Write-Host "  NEXTAUTH_URL=https://your-domain.com" -ForegroundColor Yellow
Write-Host "  NEXTAUTH_SECRET=(generate with openssl or another tool)" -ForegroundColor Yellow
Write-Host ""

Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Push your code: git push origin main" -ForegroundColor White
Write-Host "2. GitHub Actions will deploy to Vercel automatically" -ForegroundColor White
Write-Host "3. Monitor at: https://github.com/YOUR_REPO/actions" -ForegroundColor White
Write-Host ""
Write-Host "📚 Full guide: .github/VERCEL_SETUP.md" -ForegroundColor White
Write-Host ""
