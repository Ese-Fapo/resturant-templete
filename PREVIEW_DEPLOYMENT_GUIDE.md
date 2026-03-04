# 🔍 Preview Deployment Guide

Deploy to Vercel preview URL before going to production. Safe and fast way to test!

---

## 🚀 Step-by-Step: Deploy Preview

### 1. Create a Feature Branch
```bash
cd "c:\Users\USER\Desktop\food_ordering templete\my-app"
git checkout -b fix/deployment-test
```

### 2. Make Your Changes (or just commit what you have)
```bash
# Stage all changes
git add .

# Commit
git commit -m "Test preview deployment to Vercel"

# Check what we're pushing
git status
```

### 3. Push to GitHub
```bash
git push origin fix/deployment-test
```

**Output should show:**
```
remote: Create a pull request for 'fix/deployment-test' on GitHub
remote:   https://github.com/YOUR_USERNAME/YOUR_REPO/pull/NEW
```

---

## 4. Create Pull Request on GitHub

Click the link from step 3, or:

1. Go to: `https://github.com/YOUR_USERNAME/YOUR_REPO/pulls`
2. Click **"New pull request"**
3. Select:
   - Base: `main`
   - Compare: `fix/deployment-test`
4. Click **"Create pull request"**

---

## 5. Wait for Preview Deployment

Once PR is created, GitHub Actions will **automatically**:

1. ✅ Run tests
2. ✅ Build app  
3. ✅ Deploy to Vercel **preview**
4. ✅ Post preview URL in PR comments

**Timeline:** 5-10 minutes

---

## 6. Find Your Preview URL

In the PR, look for a comment from `vercel` bot:

```
🔍 Preview for this PR:
https://your-project-vercel.app
```

Click it! Your app is running on preview.

---

## 📊 What's Different About Preview?

| Aspect | Main/Production | Preview |
|--------|-----------------|---------|
| **Triggers on** | Push to `main` | Create PR |
| **Deployment** | Real production | Test environment |
| **URL** | yourdomain.com | random-url.vercel.app |
| **Data** | Production DB | Dev DB |
| **Usage** | Live for users | Only you test |
| **Cost** | Counts deployments | Counts deployments |
| **Rollback** | Need to push fix | Simple: close PR |

---

## ✅ Testing Preview

Once preview is live:

1. ✅ Check functionality works
2. ✅ Test authentication
3. ✅ Test API calls
4. ✅ Check responsive design
5. ✅ Verify environment variables work

**If something is broken:**
- Fix locally
- Push new commit to same branch
- Preview auto-updates (2-3 min)
- Re-test

**If everything works:**
- Merge PR to `main`
- Production deployment auto-starts
- App is live in 5-10 min

---

## 🐛 Debugging in Preview

### View Vercel Logs
1. Go to: `https://vercel.com/dashboard`
2. Click your project
3. Go to **"Deployments"** tab
4. Find the preview deployment
5. Click it
6. View **"Function Logs"** or **"Build Logs"**

### Common Issues

**Preview won't load:**
- Check browser console (F12)
- Check Vercel Function Logs
- Look for 500 errors

**API not working:**
- Check environment variables in Vercel
- Verify database connection string
- Check API endpoint in code

**Styling broken:**
- Clear browser cache (Ctrl+Shift+R)
- Check Tailwind build
- Verify CSS imports

---

## 📋 Full Workflow Example

```bash
# 1. Create branch
git checkout -b fix/test

# 2. Make changes (or skip if testing current code)
# ... your edits ...

# 3. Commit
git add .
git commit -m "Test changes"

# 4. Push
git push origin fix/test

# 5. Open PR in browser
# https://github.com/YOUR_REPO/pull/NEW

# 6. Wait for "Deploy Preview" job to complete (5-10 min)

# 7. Find preview URL in PR comments

# 8. Test at preview URL

# 9. If good: merge to main
# If bad: push fixes and re-test
```

---

## 🎯 Current Step

You're here:
```
Branch created
    ↓
Code committed
    ↓
**YOU ARE HERE: Push branch to GitHub**
    ↓
Create PR
    ↓
GitHub Actions builds & tests
    ↓
Vercel deploys preview
    ↓
Preview URL in PR comments
    ↓
Test preview
    ↓
Merge to main (or push fixes)
```

---

## 🚀 Ready?

```bash
# Check status
git status

# Push branch
git push origin fix/deployment-test

# Then create PR on GitHub
# Link will be in output above
```

---

## ⚡ Quick Commands Recap

```bash
# Check branch
git branch

# Create branch
git checkout -b fix/test

# Push branch
git push origin fix/test

# Switch back to main
git checkout main

# Delete local branch
git branch -d fix/test

# Delete remote branch
git push origin --delete fix/test
```

---

**Need help?**
- Check GitHub Actions logs for build errors
- Check Vercel logs for deployment issues
- Review PR comments for preview URL

**Good luck! 🍀**
