# Requirements Files

This folder contains Python package requirements for different use cases.

## Files

-   **`requirements.txt`** - Core production dependencies

    -   Use this for basic autorpt functionality
    -   Includes PDF conversion support (docx2pdf)

-   **`requirements_dev.txt`** - Development dependencies

    -   Use this for development and testing
    -   Includes testing frameworks and development tools

-   **`requirements_docs.txt`** - Documentation dependencies
    -   Use this for building documentation
    -   Includes MkDocs and related packages

## Installation

From the main autorpt directory:

```bash
# Install core dependencies
pip install -r requirements/requirements.txt

# Install development dependencies
pip install -r requirements/requirements_dev.txt

# Install documentation dependencies
pip install -r requirements/requirements_docs.txt

# Install all dependencies
pip install -r requirements/requirements.txt -r requirements/requirements_dev.txt -r requirements/requirements_docs.txt
```

## Note

The main `requirements.txt` file includes docx2pdf for PDF conversion functionality. If you don't need PDF features, you can manually install just the core packages:

```bash
pip install pandas matplotlib python-docx openpyxl
```
