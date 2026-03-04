# GitHub Actions Workflows

This project includes comprehensive GitHub Actions workflows for continuous integration, code quality, and deployment.

## 📋 Available Workflows

### 1. **CI Pipeline** (`.github/workflows/ci.yml`)
Runs on every push and pull request to `main` and `develop` branches.

**What it does:**
- ✅ Tests on Node.js 18.x and 20.x
- ✅ Installs dependencies using npm cache
- ✅ Runs ESLint (continues even if there are warnings)
- ✅ Runs Jest tests
- ✅ Builds the Next.js application
- ✅ Verifies build artifacts

**Triggers:**
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

---

### 2. **Code Quality & Security** (`.github/workflows/code-quality.yml`)
Runs security checks and code quality analysis.

**What it does:**
- ✅ Checks for npm vulnerabilities (audit-level: moderate)
- ✅ Runs ESLint with JSON report output
- ✅ Uploads artifacts for review
- ✅ Optional SonarCloud integration for code analysis

**Triggers:**
- Push to `main` or `develop`
- Pull requests to `main` or `develop`
- Weekly schedule (Sundays at 00:00 UTC)

**Required Secrets (optional):**
- `SONAR_TOKEN`: For SonarCloud integration

---

### 3. **Deployment** (`.github/workflows/deploy.yml`)
Deploys to Vercel on every push to main branch and creates preview deployments on pull requests.

**What it does:**
- ✅ Runs build and test verification
- ✅ Creates preview deployments on pull requests
- ✅ Deploys to production on main branch push
- ✅ Uses official Vercel GitHub Action
- ✅ Sends Slack notifications on deployment

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual workflow dispatch

**Required Secrets:**
- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID
- `SLACK_WEBHOOK_URL`: For Slack notifications (optional)

**Deployment Features:**
- 🔄 Automatic preview deployments on PRs
- 🚀 Automatic production deployments on main
- 💬 GitHub PR comments with preview links
- 📊 Vercel integration with GitHub checks
- 🔔 Slack notifications on success/failure

**See:** [VERCEL_SETUP.md](./VERCEL_SETUP.md) for detailed Vercel configuration

---

### 4. **Performance & Lighthouse** (`.github/workflows/lighthouse.yml`)
Runs Lighthouse audits on pull requests to check performance and accessibility.

**What it does:**
- ✅ Builds the application
- ✅ Starts production server
- ✅ Runs Lighthouse CI
- ✅ Comments results on PR with scores
- ✅ Checks performance thresholds

**Triggers:**
- Pull requests to `main` or `develop`

---

## 🔑 Setting Up Secrets

To enable optional deployment features, add these secrets to your GitHub repository:

### For Vercel Deployment:
1. Get your Vercel token from [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Go to Settings → Secrets and variables → Actions
3. Add secret: `VERCEL_TOKEN`

### For Netlify Deployment:
1. Get your Netlify token from personal access tokens
2. Get your Site ID from Netlify site settings
3. Add secrets: `NETLIFY_TOKEN` and `NETLIFY_SITE_ID`

### For SonarCloud Integration:
1. Create account at [sonarcloud.io](https://sonarcloud.io)
2. Get your token
3. Add secret: `SONAR_TOKEN`

### For Slack Notifications:
1. Create an incoming webhook at your Slack workspace
2. Add secret: `SLACK_WEBHOOK_URL`

---

## ⚙️ Configuration Files

### `lighthouserc.js`
Configures Lighthouse CI settings:
- **Performance**: Minimum 80 score
- **Accessibility**: Minimum 90 score
- **Best Practices**: Minimum 80 score
- **SEO**: Minimum 80 score

---

## 📊 Workflow Status Badges

Add these to your README.md:

```markdown
![CI Pipeline](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml/badge.svg)
![Code Quality](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/code-quality.yml/badge.svg)
![Deploy](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy.yml/badge.svg)
```

---

## 🚀 Quick Start

1. **Push code to GitHub** - CI pipeline runs automatically
2. **Create a Pull Request** - Code quality and Lighthouse checks run
3. **Merge to main** - Deployment workflow triggers automatically
4. **Monitor results** - Check the "Actions" tab in GitHub

---

## 📝 Customization

### Modify Node.js versions:
Edit `ci.yml` matrix section:
```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x]
```

### Change deployment triggers:
Edit `deploy.yml` branches:
```yaml
on:
  push:
    branches: [ main, production ]
```

### Adjust performance thresholds:
Edit `lighthouserc.js` assertions section

---

## 🆘 Troubleshooting

### Workflow fails to build:
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Check for TypeScript errors: `npm run build`

### Deployment fails:
- Verify secrets are set correctly
- Check deployment service status
- Review deployment logs in Actions tab

### Performance checks failing:
- Build and test locally: `npm run build && npm start`
- Adjust thresholds in `lighthouserc.js`
- Check actual performance: `npm run lighthouse`

---

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Lighthouse CI](https://github.com/treosh/lighthouse-ci-action)
- [ESLint Configuration](https://eslint.org/docs/rules/)

---

## 📞 Support

For issues or questions about these workflows, check:
1. GitHub Actions logs under the "Actions" tab
2. Deployment service documentation (Vercel/Netlify)
3. GitHub Actions troubleshooting guide
