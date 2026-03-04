# 🔐 Add Secrets to GitHub - Step by Step

Follow this guide to add your 3 Vercel credentials to GitHub.

---

## Where to Go

1. Open your repository on GitHub
2. Click **Settings** (top right)
3. Click **Secrets and variables** (left menu)
4. Click **Actions**

**Direct URL:**
```
https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions
```

Replace:
- `YOUR_USERNAME` with your GitHub username
- `YOUR_REPO` with your repository name

---

## Add Secret #1: VERCEL_TOKEN

1. Click **"New repository secret"** button (green)

2. **Name field:** Type exactly:
   ```
   VERCEL_TOKEN
   ```
   (no spaces, exact case)

3. **Secret field:** Paste your token:
   ```
   [paste your VERCEL_TOKEN value here]
   ```

4. Click **"Add secret"** button

✅ You should see `VERCEL_TOKEN` listed

---

## Add Secret #2: VERCEL_ORG_ID

1. Click **"New repository secret"** button again

2. **Name field:** Type exactly:
   ```
   VERCEL_ORG_ID
   ```
   (or `VERCEL_USER_ID` if you have that)

3. **Secret field:** Paste your ID:
   ```
   [paste your VERCEL_ORG_ID value here]
   ```

4. Click **"Add secret"** button

✅ You should see `VERCEL_ORG_ID` listed

---

## Add Secret #3: VERCEL_PROJECT_ID

1. Click **"New repository secret"** button again

2. **Name field:** Type exactly:
   ```
   VERCEL_PROJECT_ID
   ```
   (no spaces, exact case)

3. **Secret field:** Paste your project ID:
   ```
   [paste your VERCEL_PROJECT_ID value here]
   ```

4. Click **"Add secret"** button

✅ You should see `VERCEL_PROJECT_ID` listed

---

## ✅ Verify All 3 Are Added

After adding all 3 secrets, you should see this on the page:

```
Actions secrets and variables

Actions secrets (3)
├── VERCEL_TOKEN
├── VERCEL_ORG_ID
└── VERCEL_PROJECT_ID
```

---

## ⚠️ Important Notes

- **Secret names are case-sensitive!**
  - ❌ `vercel_token` (wrong)
  - ✅ `VERCEL_TOKEN` (correct)

- **No extra spaces!**
  - ❌ ` VERCEL_TOKEN ` (wrong)
  - ✅ `VERCEL_TOKEN` (correct)

- **Copy values exactly as provided**
  - No quotes around the values
  - No extra characters

- **You can't see values after adding**
  - GitHub hides secret values (for security)
  - But you can update or delete them if wrong

---

## ❌ If You Made a Mistake

1. Find the secret in the "Actions secrets" list
2. Click the **pencil icon** to edit
3. Update the value
4. Click **"Update secret"**

Or delete and re-add:
1. Click the secret name
2. Click **"Delete"** button
3. Add it again with **"New repository secret"**

---

## 🚀 After Adding Secrets

Once all 3 are added:

```bash
# Commit your changes
git add .
git commit -m "Configure Vercel deployment"

# Push to GitHub
git push origin main
```

GitHub Actions will automatically start deploying!

---

## 📊 What Happens Next

1. Go to: **Actions** tab in your repository
2. Watch the workflow run:
   - ✅ Build & Test
   - ✅ Deploy Preview (if PR) OR Deploy Production (if main)
3. See the deployment progress in real-time

---

## 🆘 If Deployment Fails

**Check the workflow logs:**
1. Go to **Actions** tab
2. Click the failed workflow run
3. Click the failed job
4. Look for error messages

**Common secrets error:**
```
Error: Secret "VERCEL_TOKEN" is not defined
```

**Fix:**
1. Verify secret name spelling (case-sensitive)
2. Make sure you're in the right repository
3. Re-add the secret
4. Re-run the workflow

---

## ✨ That's It!

Your secrets are now secure in GitHub, and your deployment workflow is ready to use.

**Next:** Push your code!

```bash
git push origin main
```

---

See [DEPLOY_NOW.md](./DEPLOY_NOW.md) for quick commands.
