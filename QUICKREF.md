# Version Management & Deployment Quick Reference

## 🚀 Quick Actions

### Bump Version
1. Go to: [Actions](../../actions/workflows/bump-version.yml) → Bump Version
2. Click "Run workflow"
3. Select: `patch` | `minor` | `major`
4. Click "Run workflow" button

**Result**: New version created, tagged, and released → PyPI deployment triggered

### Deploy Documentation
- **Automatic**: Pushes to `main` deploy to GitHub Pages
- **Manual**: [Actions](../../actions/workflows/deploy-custom.yml) → Deploy Docs to Custom Server → Run workflow

## 📋 Version Bump Types

| Type | Example | When to Use |
|------|---------|-------------|
| `patch` | 1.0.0 → 1.0.1 | Bug fixes, documentation updates |
| `minor` | 1.0.0 → 1.1.0 | New features (backward compatible) |
| `major` | 1.0.0 → 2.0.0 | Breaking changes |

## 🔗 Important Links

- **Documentation**: https://3point.xyz/autorpt
- **GitHub Pages**: https://vrconservation.github.io/autorpt
- **PyPI Package**: https://pypi.org/project/autorpt/
- **Repository**: https://github.com/VRConservation/autorpt

## 📦 Current Setup

### Automated Workflows
- ✅ **Bump Version**: Manual trigger to create new releases
- ✅ **PyPI Deployment**: Automatic on release creation
- ✅ **GitHub Pages**: Automatic on push to main
- ⚙️ **Custom Server**: Manual trigger (requires configuration)

### Version Files
Version is managed in these files (auto-updated by bump2version):
- `setup.py`
- `setup.cfg`
- `autorpt/__init__.py`
- `docs/changelog.md`

## 🛠️ Local Development

### Install Development Dependencies
```bash
pip install -r requirements_dev.txt
pip install bump2version
```

### Preview Documentation Locally
```bash
mkdocs serve
# Open http://127.0.0.1:8000
```

### Manual Version Bump (Local)
```bash
# Bump version locally
bump2version patch|minor|major

# Push changes and tags
git push
git push --tags
```

### Build Package Locally
```bash
python setup.py sdist bdist_wheel
```

## 🔐 Required Secrets

### For PyPI Deployment
- `PYPI_USERS`: PyPI username
- `PYPI_PASSWORD`: PyPI password/token

### For Custom Server Deployment (Optional)
- `SSH_PRIVATE_KEY`: SSH private key
- `REMOTE_HOST`: Server hostname
- `REMOTE_USER`: SSH username  
- `REMOTE_PATH`: Deployment path

**Set secrets at**: Settings → Secrets and variables → Actions

## 📝 Release Checklist

Before bumping version:
- [ ] Update documentation if needed
- [ ] Update changelog in `docs/changelog.md`
- [ ] Run tests locally: `python -m unittest discover tests/`
- [ ] Build docs locally: `mkdocs build`
- [ ] Commit all changes

After bumping version:
- [ ] Verify GitHub release was created
- [ ] Check PyPI deployment succeeded
- [ ] Verify documentation was deployed
- [ ] Test installation: `pip install autorpt==<version>`

## 🐛 Troubleshooting

### Version mismatch
```bash
bump2version patch --new-version 1.0.0
```

### PyPI deployment failed
- Check secrets are set correctly
- Verify version is higher than last published
- Check [Actions tab](../../actions) for error details

### Documentation not deploying
- Check [Actions tab](../../actions) for build errors
- Verify locally: `mkdocs build`
- Check DNS settings for custom domain

### Custom domain not working
- Verify DNS CNAME record points to `vrconservation.github.io`
- Check repository Settings → Pages
- Allow 24 hours for DNS propagation

## 📚 Full Documentation

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.
