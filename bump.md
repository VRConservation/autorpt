# Install bump2version
pip install bump2version

# Dry run to see what would change (safe)
bump2version --dry-run --verbose patch

# Actually bump the version
bump2version patch   # 1.0.0 → 1.0.1
bump2version minor   # 1.0.0 → 1.1.0
bump2version major   # 1.0.0 → 2.0.0

# Push changes and tags
git push
git push --tags

or git push && git push --tags