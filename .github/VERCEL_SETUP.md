# Vercel Deployment Setup Guide

## 📋 Prerequisites

- Vercel account (free or paid) at [vercel.com](https://vercel.com)
- GitHub repository connected to Vercel
- Project created in Vercel dashboard

---

## 🔑 Required Secrets for GitHub Actions

Add these secrets to your GitHub repository: **Settings → Secrets and variables → Actions**

### 1. **VERCEL_TOKEN** (Required)
Your Vercel authentication token for CI/CD.

**How to get it:**
1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name it: `github-actions-token`
4. Copy the token
5. Add to GitHub as secret: `VERCEL_TOKEN`

### 2. **VERCEL_ORG_ID** (Required)
Your Vercel organization/team ID.

**How to get it:**
1. Go to [vercel.com/account](https://vercel.com/account)
2. Look for "Team ID" in account settings
3. Or run: `vercel whoami`
4. Add to GitHub as secret: `VERCEL_ORG_ID`

### 3. **VERCEL_PROJECT_ID** (Required)
Your specific Vercel project ID.

**How to get it:**
```bash
# In your project directory:
vercel projects list

# Or look for it in project settings:
# Settings → General → Project ID in Vercel dashboard
```
Add to GitHub as secret: `VERCEL_PROJECT_ID`

### 4. **SLACK_WEBHOOK_URL** (Optional)
For Slack notifications on deployments.

**How to get it:**
1. Go to your Slack workspace settings
2. Create an app and incoming webhook
3. Add to GitHub as secret: `SLACK_WEBHOOK_URL`

---

## 📝 Environment Variables Configuration

### Setup Vercel Environment Variables

In **Vercel Dashboard → Project Settings → Environment Variables**, add:

```env
# Production Environment
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.com/api

# Development Environment (optional)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### GitHub Actions Environment Variables

Create a `.env.production` file in your project:

```env
# Only include variables that don't contain secrets
NEXT_PUBLIC_APP_NAME=Food Ordering
NEXT_PUBLIC_APP_VERSION=1.0.0
```

---

## 🚀 Deployment Workflow

### What Happens When You Push

**On Pull Request to `main` or `develop`:**
1. ✅ CI pipeline runs (lint, tests, build)
2. ✅ Vercel preview deployment created
3. ✅ Comment added to PR with preview link
4. ✅ Can merge anytime (preview is ephemeral)

**On Push to `main` (after merge):**
1. ✅ CI pipeline runs validation
2. ✅ Production deployment to Vercel
3. ✅ Live at your custom domain
4. ✅ Slack notification sent (if configured)

---

## 🔗 Connecting Repository to Vercel

### Option 1: Direct GitHub Integration (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Vercel auto-configures Next.js settings
5. Click "Deploy"
6. Configure environment variables in Vercel dashboard

**Note:** This creates automatic deployments. Disable in Settings if using GitHub Actions only.

### Option 2: GitHub Actions Only

1. Disable Vercel's automatic deployments:
   - Vercel Dashboard → Settings → Git → Uncheck "Production deployments"
2. Use GitHub Actions workflow (already configured)
3. Manual deployments via `workflow_dispatch`

---

## 🌍 Custom Domain Setup

### Add Domain to Vercel

1. Go to **Vercel Dashboard → Domains**
2. Add your domain (e.g., `pizza.com`)
3. Follow DNS configuration:
   - For root: Add `A` record to `76.76.19.132`
   - For subdomain: Add `CNAME` to `cname.vercel-dns.com`
4. Wait for DNS propagation (5-48 hours)
5. Auto-renew SSL certificate

---

## 📊 Monitoring Deployments

### Real-time Logs

**GitHub Actions:**
- Go to `Actions` tab in your repository
- Click the workflow run
- View detailed logs in real-time

**Vercel Logs:**
- Vercel Dashboard → Deployments
- Click any deployment to view logs and metrics

### View Deployment Status

```bash
# Using Vercel CLI
vercel --prod  # View production
vercel preview # View previews
```

---

## 🛠️ Troubleshooting

### Deployment Fails with "Project Not Found"

**Fix:**
1. Verify `VERCEL_PROJECT_ID` is correct
2. Run: `vercel projects list`
3. Update secret in GitHub

### Build Fails After Merge

**Check:**
1. Does it build locally? `npm run build`
2. Check environment variables in Vercel dashboard
3. Review build logs in Vercel deployment

### Preview Deployment Not Created

**Fix:**
1. Ensure PR is against `main` or `develop`
2. Verify secrets are set correctly
3. Check GitHub Actions logs for errors

### Environment Variables Not Appearing

**Solution:**
1. Redeploy with: `vercel --prod --force`
2. Or trigger GitHub Actions manually
3. Check "Show Sensitive Builds" in Vercel settings

---

## 💡 Best Practices

### 1. **Protect Main Branch**
```yaml
Settings → Branches → main
- ✅ Require status checks to pass
- ✅ Require approvals before merging
- ✅ Require branches to be up to date
```

### 2. **Use Environment Protection**
```yaml
Settings → Environments → production
- ✅ Required reviewers
- ✅ Deployment branches (main only)
- ✅ Custom deployment URLs
```

### 3. **Monitor Build Times**
- Keep bundle under 500KB
- Use dynamic imports for large components
- Monitor with Vercel Analytics

### 4. **Rollback Strategy**
```bash
# Quick rollback in Vercel Dashboard
Deployments → Choose previous version → Promote to Production
```

### 5. **Preview URLs**
- Share preview URLs from PR comments
- Test before merging to main
- Never share production URLs in public PRs

---

## 📚 Quick Commands

```bash
# Login to Vercel
vercel login

# Link project
vercel link

# Deploy preview
vercel

# Deploy to production
vercel --prod

# View projects
vercel projects list

# View deployments
vercel deployments

# Check environment
vercel env ls
```

---

## 🔄 Advanced Configuration

### Monorepo Support

If using monorepo, configure in `vercel.json`:

```json
{
  "buildCommand": "npm run build -- --filter=my-app",
  "outputDirectory": "apps/my-app/.next"
}
```

### Custom Build Settings

Create `vercel.json` in project root:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "env": {
    "NEXT_PUBLIC_API_URL": "@next-public-api-url"
  },
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Edge Functions (Optional)

For serverless functions:

```bash
# Create API routes in app/api/
# Vercel automatically converts to Edge Functions
```

---

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs
- **GitHub Actions:** https://docs.github.com/en/actions
- **Vercel Support:** https://vercel.com/support
- **Community:** https://github.com/vercel/next.js/discussions

---

## ✅ Deployment Checklist

- [ ] Created Vercel account
- [ ] Created project in Vercel
- [ ] Added `VERCEL_TOKEN` secret
- [ ] Added `VERCEL_ORG_ID` secret
- [ ] Added `VERCEL_PROJECT_ID` secret
- [ ] Configured environment variables in Vercel
- [ ] Set up custom domain (optional)
- [ ] Configured branch protection rules
- [ ] Tested preview deployment on PR
- [ ] Tested production deployment on main
- [ ] Set up Slack notifications (optional)
- [ ] Documented deployment process for team

---

**Your app is now deployed with Vercel! 🚀**

For any issues, check Vercel dashboard or GitHub Actions logs.
