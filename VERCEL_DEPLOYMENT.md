# Vercel Deployment Quick Start

Your project is configured for **Vercel deployment with GitHub Actions**. Here's how to get started:

## ⚡ 5-Minute Setup

### Step 1: Get Your Vercel Credentials
```bash
# Option A: Using bash/zsh (macOS, Linux)
./setup-vercel.sh

# Option B: Using PowerShell (Windows)
.\setup-vercel.ps1

# Option C: Manual setup (all platforms)
# 1. Go to https://vercel.com/new
# 2. Import your GitHub repository
# 3. Get credentials from vercel.com/account
```

### Step 2: Add Secrets to GitHub
Go to **Settings → Secrets and variables → Actions** and add:

| Secret | Where to Find |
|--------|---------------|
| `VERCEL_TOKEN` | https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | https://vercel.com/account (Team ID) |
| `VERCEL_PROJECT_ID` | https://vercel.com/YOUR_ORG/YOUR_PROJECT/settings |

### Step 3: Push to GitHub
```bash
git push origin main
```

**That's it!** 🎉 Your app will automatically deploy.

---

## 🚀 What Happens Next

### On Pull Request:
- ✅ Runs tests & linting
- ✅ Creates **preview deployment**
- ✅ Posts preview link in PR comment
- ✅ Auto-updates as you push changes

### On Merge to Main:
- ✅ Runs full CI pipeline
- ✅ **Deploys to production**
- ✅ Goes live immediately
- ✅ Sends Slack notification (if configured)

---

## 📊 Monitor Your Deployments

**GitHub Actions:**
- Go to repository `Actions` tab
- View workflow run status
- Check detailed logs

**Vercel Dashboard:**
- Visit [vercel.com/dashboard](https://vercel.com/dashboard)
- See all deployments
- Monitor performance and logs
- View analytics

---

## 🌍 Custom Domain

1. Get your domain (e.g., `pizza.com`)
2. Go to **Vercel Dashboard → Domains**
3. Add your domain
4. Update DNS records:
   - **Root domain**: Add `A` record → `76.76.19.132`
   - **Subdomain**: Add `CNAME` → `cname.vercel-dns.com`
5. SSL certificate auto-generates (free!)

---

## 🔐 Environment Variables

### Add to Vercel Dashboard

Go to **Project Settings → Environment Variables** and add:

```env
# Production
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<generate-with-openssl>

# Optional
DATABASE_URL=your_db_url
```

### Add to GitHub Secrets (if needed)

Only if using in workflows that need them:
```
PRODUCTION_DATABASE_URL=...
```

---

## ✅ Deployment Checklist

- [ ] Vercel account created
- [ ] Project created in Vercel
- [ ] `VERCEL_TOKEN` added to GitHub secrets
- [ ] `VERCEL_ORG_ID` added to GitHub secrets
- [ ] `VERCEL_PROJECT_ID` added to GitHub secrets
- [ ] Environment variables set in Vercel
- [ ] First push to main completed
- [ ] Deployment appears in Vercel dashboard
- [ ] Preview link works on PR
- [ ] Production link works on main
- [ ] Custom domain configured (optional)
- [ ] Slack notifications set up (optional)

---

## 🐛 Troubleshooting

### Build fails after push
```bash
# Test locally first
npm ci
npm run build

# Check what might be wrong
npm run lint
npm test
```

### Secrets not working
1. Verify secret names spelling (case-sensitive)
2. Secrets must be added BEFORE push
3. For existing deployments, trigger rerun in GitHub Actions

### Preview not created on PR
- PR must target `main` or `develop`
- Check GitHub Actions logs
- Verify all secrets are set

### Domain not resolving
- Wait 24-48 hours for DNS propagation
- Check DNS records in Vercel dashboard
- Verify domain provider settings

---

## 📚 Detailed Documentation

- **Vercel Setup:** [.github/VERCEL_SETUP.md](.github/VERCEL_SETUP.md)
- **Workflows Guide:** [.github/WORKFLOWS.md](.github/WORKFLOWS.md)
- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment

---

## 📞 Need Help?

1. Check Vercel Dashboard logs
2. Review GitHub Actions workflow logs
3. Read detailed docs in `.github/VERCEL_SETUP.md`
4. Visit [Vercel Support](https://vercel.com/support)

---

## 🎯 Next Steps

1. **Protect main branch:**
   - Settings → Branches → Add rule for `main`
   - Require status checks to pass

2. **Set up notifications:**
   - Add `SLACK_WEBHOOK_URL` to GitHub secrets
   - Get notified on deployments

3. **Monitor analytics:**
   - Enable Vercel Analytics in project settings
   - Track performance metrics

4. **Optimize performance:**
   - Run Lighthouse checks in PR workflow
   - Aim for 90+ Lighthouse score

---

**Happy deploying! 🚀**

For questions or issues, check the detailed guides above or contact Vercel support.
