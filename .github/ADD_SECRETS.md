# 🔐 Adding Vercel Secrets to GitHub

You have your Vercel credentials! Now add them to GitHub Actions.

## Step-by-Step Guide

### 1. Go to GitHub Repository Settings

```
Your Repository → Settings → Secrets and variables → Actions
```

### 2. Create New Repository Secrets

Click **"New repository secret"** for each of these:

#### Secret 1: VERCEL_TOKEN
- **Name:** `VERCEL_TOKEN`
- **Value:** Your token from above
- Click **"Add secret"**

#### Secret 2: VERCEL_ORG_ID (or VERCEL_USER_ID)
- **Name:** `VERCEL_ORG_ID`
- **Value:** Your user/org ID
- Click **"Add secret"**

#### Secret 3: VERCEL_PROJECT_ID
- **Name:** `VERCEL_PROJECT_ID`
- **Value:** Your project ID
- Click **"Add secret"**

### 3. Verify All Secrets Added

Go to **Settings → Secrets and variables → Actions**

You should see all three secrets listed:
- ✅ `VERCEL_TOKEN`
- ✅ `VERCEL_ORG_ID`
- ✅ `VERCEL_PROJECT_ID`

---

## ✅ You're Ready!

Once secrets are added:

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Configure Vercel deployment"
   git push origin main
   ```

2. GitHub Actions will automatically:
   - Run CI tests
   - Build your app
   - Deploy to Vercel production

3. Monitor progress at: **Actions tab** in your repository

---

## 🚀 Testing It Works

### Create a Test Pull Request

1. Create a branch:
   ```bash
   git checkout -b test-deploy
   ```

2. Make a small change (e.g., update README)

3. Push and create PR:
   ```bash
   git push origin test-deploy
   ```

4. Watch GitHub Actions:
   - Should create a **preview deployment**
   - Will comment preview link on PR

### Merge to Test Production

1. Merge the PR to `main`

2. GitHub Actions will:
   - Run full CI pipeline
   - Deploy to **production** on Vercel
   - Show link in workflow logs

---

## 📊 What to Expect

### On Pull Request
```
✅ Build successful
✅ Preview deployment created
🔗 Preview URL: https://xxx-preview.vercel.app
```

### After Merging to Main
```
✅ Build successful
✅ Production deployment
🌐 Live at: https://your-domain.vercel.app
```

---

## 🐛 If Something Goes Wrong

### Check GitHub Actions Logs
1. Go to **Actions** tab
2. Click the failed workflow
3. Expand the logs to see errors

### Common Issues

**Error: "Invalid token"**
- Verify VERCEL_TOKEN is correct
- Not expired or revoked
- Has correct permissions

**Error: "Project not found"**
- Check VERCEL_PROJECT_ID is correct
- Project exists in Vercel
- You have access to it

**Error: "Organization not found"**
- Verify VERCEL_ORG_ID is your user ID
- Or your organization ID if using team

---

## 📞 Need Help?

1. **Check workflow logs** in GitHub Actions
2. **Check Vercel dashboard** for deployment info
3. **Review** [.github/VERCEL_SETUP.md](.github/VERCEL_SETUP.md) for details
4. **Contact Vercel support** if deployment fails

---

**Ready to deploy? Push your code!** 🚀
