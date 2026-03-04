# ✅ Vercel Deployment Verification Checklist

Before pushing your code, verify everything is set up correctly.

---

## 🔐 Step 1: Add Secrets to GitHub

Go to: **Repository Settings → Secrets and variables → Actions**

### Add These 3 Secrets

```
1. VERCEL_TOKEN
   Value: [Your token]

2. VERCEL_ORG_ID / VERCEL_USER_ID
   Value: [Your user/org ID]

3. VERCEL_PROJECT_ID
   Value: [Your project ID]
```

**Verification:**
- [ ] All 3 secrets are visible in GitHub
- [ ] No typos in secret names (case-sensitive!)
- [ ] Values are copied correctly (no extra spaces)

**See:** [.github/ADD_SECRETS.md](.github/ADD_SECRETS.md) for detailed steps

---

## 🚀 Step 2: Verify Workflow Configuration

The deployment workflow is already configured correctly. It uses your secrets in:

**`.github/workflows/deploy.yml`**

```yaml
# Preview Deployments (on Pull Requests)
deploy-preview:
  if: github.event_name == 'pull_request'
  uses: vercel/action@v7
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

# Production Deployments (on main branch)
deploy-production:
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  uses: vercel/action@v7
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

**Verification:**
- [ ] Secret names match exactly in workflow
- [ ] Workflow uses official Vercel action (v7)
- [ ] Conditions are correct (PR vs main)

---

## 📋 Step 3: Code Readiness

```bash
# Verify in your project directory:

# 1. No uncommitted changes (except in .next or node_modules)
git status

# 2. Can build locally
npm run build

# 3. No obvious errors
npm run lint

# 4. Tests pass
npm test -- --passWithNoTests
```

**Verification:**
- [ ] Local build succeeds
- [ ] No lint errors
- [ ] Tests pass (or marked as optional)
- [ ] `.gitignore` includes `.env.local`

---

## 🔄 Step 4: Git Configuration

```bash
# Ensure you're on main branch
git checkout main

# Pull latest updates
git pull origin main

# All secrets committed? NO! ⚠️
# .env files in .gitignore? YES!
grep ".env" .gitignore
```

**Verification:**
- [ ] On correct branch (main or create PR)
- [ ] Repository is up to date
- [ ] No .env files will be committed
- [ ] All secrets are in GitHub, NOT in git

---

## ✨ Step 5: Ready to Deploy

**Option A: Create a Pull Request (Test Preview)**

```bash
# Create test branch
git checkout -b test-deployment

# Make a small change (optional)
# For example, update a comment in README.md

# Commit and push
git add .
git commit -m "test: trigger deployment workflow"
git push origin test-deployment

# Go to GitHub and create a Pull Request
# Watch GitHub Actions → Actions tab
# You should see preview deployment link in PR comment
```

**Option B: Merge to Main (Production)**

```bash
# Make sure main is checked out
git checkout main

# Push your changes
git push origin main

# Watch GitHub Actions → Actions tab
# You should see production deployment running
```

**Verification (after pushing):**
- [ ] GitHub Actions workflow triggered
- [ ] Build job started
- [ ] Can see logs in Actions tab
- [ ] Deployment job runs with your secrets
- [ ] No "secret not found" errors

---

## 📊 Expected Results

### On Pull Request
```
✅ Build & Test job passes
✅ Deploy Preview job starts
✅ Vercel preview URL appears in PR comment
🔗 Preview link: https://xxx-preview.vercel.app
```

### After Merging to Main
```
✅ Build & Test job passes
✅ Deploy Production job starts
✅ Vercel production deployment completes
🌐 Live at: https://your-domain.vercel.app
```

---

## 🐛 Troubleshooting

### Secrets Not Working?

**Error in workflow logs:**
```
Secret "VERCEL_TOKEN" is not defined
```

**Fix:**
1. Go to Settings → Secrets → Verify all 3 secrets exist
2. Check spelling (case-sensitive)
3. Re-add the secret if needed
4. Re-run the workflow

### Build Fails?

**Check:**
1. Can you build locally? `npm run build`
2. Are there untracked files you need to commit?
3. Check Git status: `git status`

### Deployment Doesn't Complete?

**Check:**
1. GitHub Actions logs (in Actions tab)
2. Vercel dashboard for errors
3. Project ID matches between GitHub and Vercel
4. Token hasn't expired

---

## 🎯 Final Checklist Before Pushing

- [ ] 3 GitHub secrets added (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID)
- [ ] `.env.local` is in `.gitignore`
- [ ] No secrets in git (verify: `git log -p` doesn't show secrets)
- [ ] Local build succeeds
- [ ] Lint passes
- [ ] Tests pass
- [ ] Using correct branch (main for production)
- [ ] Ready to push!

---

## 🚀 Deploy Now!

```bash
# Final check
git status
npm run build

# Push to GitHub
git push origin main

# Monitor at:
# https://github.com/YOUR_USERNAME/YOUR_REPO/actions
```

---

## 📞 Still Having Issues?

1. **Check GitHub Actions logs** - Most helpful
2. **Check Vercel dashboard** - For deployment errors
3. **Review** [.github/VERCEL_SETUP.md](.github/VERCEL_SETUP.md) - Detailed guide
4. **Contact support:**
   - Vercel: https://vercel.com/support
   - GitHub: https://github.com/support

---

**You're ready! Push your code and watch it deploy! 🎉**
