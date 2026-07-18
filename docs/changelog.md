# Changelog

## Unreleased (2026-07-18)

### Fixes

- Fix changelog workflow: checkout main branch instead of detached HEAD.
    
- Fixing codespell error.
    
- Fixing gui.
    
- Refactor autorpt.py for improved readability and organization; update setup.py to ensure UTF-8 encoding when reading README.md.
    
- Fixing docs_build error.
    
- Fixed requirements docs txt files.
    
- Fixing errors trying to fix pdf generation outside of folder.
    
- Fixing pdf commands.
    
- Fixing linting errors.
    
- Fix pip install packages for pdf.ipynb example.
    
- Fixing requirements location.
    
### New

- Add automated version management and deployment workflows for v1.0.0.
    
  - Add GitHub Actions workflow for automated version bumping
  - Add custom server deployment workflow for documentation
  - Add comprehensive deployment guide (DEPLOYMENT.md)
  - Add quick reference guide (QUICKREF.md)
  - Sync with PyPI version 1.0.0
- Added pdf module to mkdocs.
    
- Added codespell to dev rqmts.
    
- Added pdf.md and doc (#1).
    
- Added colab badge and example.
    
- Added lines to pdf.ipynb.
    
- Added pdf conversion functions.
    
- Added autorpt script budget and content.md.
    
- Added features description to readme.
    
### Other

- Bump version: 1.1.3 → 1.1.4, fix PyPI secrets inheritance.
    
- Bump version: 1.1.2 → 1.1.3.
    
- Bump versioning fixes.
    
- Bump version: 1.1.1 → 1.1.2.
    
- Bug changes.
    
- Bump version: 1.1.0 → 1.1.1.
    
- Bump.md update.
    
- Bump.md updated.
    
- Bump version: 1.0.0 → 1.1.0.
    
- Styling saves.
    
- Web version, fixing bugs.
    
- Bump version: 0.1.3 → 1.0.0.
    
- Command changes.
    
- Readme addition.
    
- Autorpt up and running and pdf via typst.
    
- Doc.yml fix.
    
- Autorpt.py linting fix and docs-build fix.
    
- Bump version: 0.1.2 → 0.1.3.
    
- And autorpt.py changes.
    
- Linting fix autorpt.py.
    
- Bibtext faq correction.
    
- Spelling errors fixed.
    
- Bump version: 0.1.1 → 0.1.2.
    
- Report folder functionality and readme.md update.
    
- Changing hard coding to general md and xlsx files.
    
- Pdf changes.
    
- Bump version: 0.1.0 → 0.1.1.
    
- Moved requirements back to root.
    
- Bump version: 0.0.2 → 0.1.0.
    
- Bump version: 0.0.1 → 0.0.2.
    
- Docs deploy fixing.
    
- Docs build error.
    
- Gdal conflict resolution.
    
- Init commit.
    
### Updates

- Updated readme with new commands.
    
- Changed url in mkdocs.
    
- Update changelog with dates and v0.1.3 changes/fixes.
    
- Updated doc-build.yml and pdf_readme.
    
- Updated changelog again.
    
- Updated changelog to work with bumpversion.
    
- Changelog update automation with actions and changelog-update yml.
    
- Changelog update and common.py common functions.
    
- Deleted autorpt fixed markdown converter added autorpt.md and gen_auto for api reference.
    
- Updated index.md usage.md and added pdf.ipynb, ran mkdocs build.
    
- Update readme.
    

## v0.1.2 - 4 Aug, 2025

**Added**

- PDF module documentation in MkDocs
- Jupyter notebook example for PDF operations (`pdf.ipynb`)
- Google Colab integration with badge and examples
- Codespell to development requirements for spell checking

**Fixed**

- Linting errors in codebase
- Pip install packages for PDF notebook example
- Hard-coded file paths replaced with general markdown and Excel file handling

**Changed**

- Updated README.md with enhanced documentation
- Improved index.md and usage.md documentation
- Enhanced PDF functionality and examples

## v0.1.1 - 28 Jul, 2025

**Changed**

- Convert doc to pdf functionality and cleaned up file structure

## v0.1.0 - 26 Jul, 2025

**Changed**

- Working report creator

## v0.0.2 - 26 Jul, 2025

**Changed**

- Added badges, features, and fixed docs github actions issues

## v0.0.1 - Initial Release

**Changed**

- init commit
