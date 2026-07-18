# Deployment Guide

This guide explains how to manage versions and deploy documentation for the autorpt project.

## Version Management

### Current Version
The project is currently at version **1.0.0**.

### Automated Version Bumping

We use `bump2version` for automated version management. Version numbers are automatically updated in:
- `setup.py`
- `setup.cfg`
- `autorpt/__init__.py`
- `docs/changelog.md`

#### How to Bump Version

1. Go to GitHub Actions in your repository
2. Select the "Bump Version" workflow
3. Click "Run workflow"
4. Choose the version bump type:
   - **patch**: 1.0.0 → 1.0.1 (bug fixes)
   - **minor**: 1.0.0 → 1.1.0 (new features, backward compatible)
   - **major**: 1.0.0 → 2.0.0 (breaking changes)
5. Click "Run workflow"

This will:
- Update version numbers in all files
- Create a git commit
- Create and push a git tag
- Create a GitHub release
- Trigger PyPI deployment automatically

### Manual Version Bumping

If you prefer to bump versions locally:

```bash
# Install bump2version
pip install bump2version

# Bump patch version (1.0.0 -> 1.0.1)
bump2version patch

# Bump minor version (1.0.0 -> 1.1.0)
bump2version minor

# Bump major version (1.0.0 -> 2.0.0)
bump2version major
```

Then push the changes and tags:
```bash
git push
git push --tags
```

## PyPI Deployment

PyPI deployment is automated through GitHub Actions when a new release is created.

### Prerequisites

Ensure these secrets are set in your GitHub repository settings (Settings → Secrets → Actions):
- `PYPI_USERS`: Your PyPI username
- `PYPI_PASSWORD`: Your PyPI password or API token

The deployment happens automatically when:
1. A new GitHub release is created (manually or via bump-version workflow)
2. The PyPI workflow builds and uploads the package to PyPI

## Documentation Deployment

### GitHub Pages (Automatic)

Documentation is automatically built and deployed to GitHub Pages on every push to the `main` branch.

**Current URL**: https://vrconservation.github.io/autorpt/

The workflow:
1. Builds the MkDocs documentation
2. Runs tests and spell checking
3. Deploys to GitHub Pages

### Custom Domain (3point.xyz/autorpt)

To serve documentation at `https://3point.xyz/autorpt`:

#### Option 1: GitHub Pages with Custom Domain

1. Create a `docs/CNAME` file with your domain:
   ```
   3point.xyz
   ```

2. Configure DNS settings for 3point.xyz:
   - Add a CNAME record pointing to `vrconservation.github.io`
   - Or add A records pointing to GitHub's IP addresses

3. In GitHub repository settings:
   - Go to Settings → Pages
   - Under "Custom domain", enter `3point.xyz`
   - Enable "Enforce HTTPS"

**Note**: GitHub Pages serves from the root domain. To serve from `/autorpt` subdirectory, you'll need to configure your web server (see Option 2).

#### Option 2: Custom Web Server

If you're hosting 3point.xyz on your own server:

1. **Build documentation locally or in CI**:
   ```bash
   pip install -r requirements_dev.txt
   mkdocs build
   ```

2. **Deploy the `site/` directory** to your server:
   - Use FTP/SFTP to upload to `/var/www/3point.xyz/autorpt/`
   - Or use rsync: `rsync -avz site/ user@3point.xyz:/var/www/3point.xyz/autorpt/`

3. **Configure web server** (e.g., Nginx):
   ```nginx
   location /autorpt {
       alias /var/www/3point.xyz/autorpt;
       index index.html;
       try_files $uri $uri/ =404;
   }
   ```

#### Option 3: Automated Deployment to Custom Server

The `.github/workflows/deploy-custom.yml` workflow is ready for automated deployment.

Required secrets in GitHub repository settings:
- `SSH_PRIVATE_KEY`: Your SSH private key
- `REMOTE_HOST`: Your server hostname (e.g., 3point.xyz)
- `REMOTE_USER`: SSH username
- `REMOTE_PATH`: Deployment path (e.g., /var/www/3point.xyz/autorpt)

To enable, uncomment the `on:` section in the workflow file.

### Local Documentation Preview

To preview documentation locally:

```bash
# Install dependencies
pip install -r requirements_dev.txt
pip install .

# Serve documentation with live reload
mkdocs serve

# Access at http://127.0.0.1:8000
```

## Troubleshooting

### Version mismatch between files
If version numbers get out of sync, run:
```bash
bump2version patch --new-version 1.0.0
```

### PyPI deployment fails
Check that:
1. Secrets are correctly set in GitHub
2. Package version is higher than the last published version
3. Package builds successfully: `python setup.py sdist bdist_wheel`

### Documentation build fails
1. Check that all dependencies are installed: `pip install -r requirements_dev.txt`
2. Test build locally: `mkdocs build`
3. Check for broken links or missing files in error messages

### Custom domain not working
1. Verify DNS records are correctly configured
2. Check that CNAME file contains the correct domain
3. Allow up to 24 hours for DNS propagation
4. Check GitHub Pages settings in repository

## Workflow Summary

### Regular Development Flow
1. Make changes and commit to feature branch
2. Create pull request to `main`
3. Docs are built and tested automatically
4. Merge to `main`
5. Docs are automatically deployed

### Release Flow
1. Go to GitHub Actions
2. Run "Bump Version" workflow with appropriate version type
3. Workflow creates release and tag
4. PyPI deployment happens automatically
5. Update changelog if needed
6. Announce release

## Additional Resources

- [bump2version documentation](https://github.com/c4urself/bump2version)
- [MkDocs documentation](https://www.mkdocs.org/)
- [GitHub Pages documentation](https://docs.github.com/en/pages)
- [PyPI deployment guide](https://packaging.python.org/tutorials/packaging-projects/)
