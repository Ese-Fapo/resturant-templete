# GitHub Actions Quick Reference

## 📁 Project Structure

```
.github/
├── workflows/
│   ├── ci.yml                 # Main CI pipeline
│   ├── code-quality.yml       # Security & quality checks
│   ├── deploy.yml             # Production deployment
│   └── lighthouse.yml         # Performance audits
├── WORKFLOWS.md               # Detailed documentation
├── ENVIRONMENT_CONFIG.yml     # Environment setup guide
└── dependabot.yml             # Optional: Automated dependency updates
```

---

## 🚀 Quick Commands

### Run workflows locally (simulate GH Actions)

```bash
# Install act (GitHub Actions local executor)
# macOS: brew install act
# Windows: choco install act-cli
# Linux: curl https://raw.githubusercontent.com/nektos/act/master/install.sh | bash

# Run all workflows
act

# Run specific workflow
act -j build

# Run with specific Node version
act -P ubuntu-latest=ghcr.io/catthehacker/ubuntu:full-latest

# Run and view logs
act -v
```

---

## 📊 Workflow Status

Check your workflows at: `https://github.com/YOUR_USERNAME/YOUR_REPO/actions`

---

## 🔄 Manual Workflow Triggers

### Deploy Manually
Go to Actions → Deploy to Production → Run workflow

### Run Quality Checks
Go to Actions → Code Quality & Security → Run workflow

---

## ✅ Pre-commit Hooks (Optional)

Create `.husky/pre-commit`:
```bash
#!/bin/sh
npm run lint
npm test -- --passWithNoTests
```

---

## 📈 Monitoring

### Check Build Status Badge
Add to README:
```markdown
![Build Status](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml/badge.svg)
```

### View Reports
- **Eslint**: Artifacts in Actions
- **Tests**: Summary in workflow logs
- **Lighthouse**: Comments on PRs
- **Security**: Alerts tab in repository

---

## 🆘 Quick Fixes

| Issue | Solution |
|-------|----------|
| Build fails | Run `npm ci && npm run build` locally |
| Tests fail | Run `npm test` locally |
| Lint errors | Run `npm run lint -- --fix` |
| Build timeout | Increase timeout in workflow (timeout-minutes) |
| Deploy fails | Check secrets are set in Settings → Secrets |

---

## 💡 Tips

1. **Use drafts for testing**
   - Create draft PRs to test workflows without merging
   
2. **Check artifacts**
   - Download eslint-report.json from Actions for detailed issues
   
3. **Monitor dependencies**
   - Enable Dependabot for automated updates
   
4. **Use environments**
   - Production and development environments in Settings
   
5. **Required checks**
   - Set required status checks in branch protection rules

---

## 📚 Useful Resources

- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Security Best Practices](https://docs.github.com/en/actions/security-guides)

---

## 🎯 Next Steps

1. Push to GitHub
2. Create a PR to trigger CI
3. Check Actions tab for results
4. Review pull request checks
5. Merge when all checks pass
6. Automatic deployment to production

---

**Need help?** Check `.github/WORKFLOWS.md` for detailed documentation.
