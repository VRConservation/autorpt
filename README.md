# autorpt

[![image](https://img.shields.io/pypi/v/autorpt.svg)](https://pypi.python.org/pypi/autorpt)
[![image](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**autorpt is an automated word, html, and pdf report generator using Excel and Markdown files**

Choose your workflow:
- **Web Interface**: User-friendly interface in your browser - perfect for non-technical users
- **Command Line**: Fast, scriptable automation for power users

- User works from a folder with two files in the reports folder of this repo: [content.md](https://github.com/VRConservation/autorpt/blob/main/reports/content.md) and [budget.xlsx](https://github.com/VRConservation/autorpt/blob/main/reports/budget.xlsx). The two files can be downloaded at the links provided and copied to a folder on your local drive.
- Copy and adapt the files or add your own files to generate the reports.
- See basic usage section below for how to set it up. Videos coming soon.
- Documentation: https://VRConservation.github.io/autorpt.

## Installation

```bash
pip install autorpt
```

To install with development dependencies:

```bash
git clone https://github.com/VRConservation/autorpt.git
cd autorpt
pip install -r requirements.txt
pip install -r requirements_dev.txt
pip install -e .
```

## Features

- **Web Interface**: Modern, browser-based interface with visual editor
  - **Familiar Experience**: WYSIWYG editor similar to Word/Google Docs
  - **Drag & Drop**: Easy Excel file uploads
  - **Tabbed Layout**: Report, Budget, and Preview tabs in a collapsible side panel
  - **Report Templates**: Pre-built sections for common report types
  - **Text Snippets**: Save and reuse frequently used text
  - **File History**: Track all generated reports
  - **Multiple Formats**: Export to Word, PDF, HTML, or Markdown
- **Auto-Discovery**: Automatically finds and combines all `.md` and `.xlsx` files in your content folder
- **Excel Table Integration**: Any Excel file becomes a formatted table in your report
- **Markdown Content**: Write content in markdown format for easy editing and version control
- **Mixed Content Support**: Combine multiple markdown files and Excel tables in one report
- **Customizable Content**: Use example files or create your own content structure
- **Command Line Interface**: Simple commands for different workflows
- **Python API**: Use programmatically in your own scripts
- **Visual Charts**: Automatically generates budget comparison charts
- **Professional Formatting**: Clean, business-ready Word document output
- **PDF Conversion**: Built-in PDF generation from Word documents

## Quick Start

#### Option 1: Web Interface (Recommended for Most Users)

Launch the web interface in your browser:

```bash
auto start
```

This opens a user-friendly web interface where you can:
- Write and edit report content with a visual editor
- Upload Excel budget files with drag & drop
- Preview your report in real-time
- Generate reports in Word, PDF, HTML, or Markdown format
- Save text snippets for reuse
- View history of generated reports

**Perfect for**: Non-technical users, collaborative editing, quick report generation

#### Option 2: Command Line (For Power Users & Automation)

1. **Prepare your content in the `reports/` folder**:
    - Edit the provided example files:
        - `reports/budget.xlsx` (your budget data)
        - `reports/content.md` (report content with YAML frontmatter)

2. **Generate a Word document report**:

    ```bash
    auto
    ```

    - This creates a Word document (`report_YYYY-MM-DD.docx`) in the `reports/` folder
    - Content is read from `content.md` with budget table inserted at the `[insert budget from budget.xlsx here]` placeholder

3. **Generate a PDF report** (requires [Typst](https://github.com/typst/typst)):

    ```bash
    auto --typst
    ```

    - This creates a PDF (`report_YYYY-MM-DD.pdf`) in the `reports/` folder
    - Uses `report.typ` Typst template for professional PDF formatting

4. **Generate both Word and PDF**:

    ```bash
    auto --all
    ```

**Perfect for**: Automation scripts, batch processing, CI/CD pipelines

---

### Installation File Structure

Your project directory should contain:

```
autorpt/
├── reports/                         # Content folder for your report files
│   ├── budget.xlsx                  # Your budget data
│   ├── content.md                   # Report content with YAML frontmatter
│   ├── report.typ                   # Typst template for PDF (auto-generated)
│   ├── report_YYYY-MM-DD.docx  # Generated Word documents
│   └── report_YYYY-MM-DD.pdf        # Generated PDF documents
├── autorpt/
│   ├── __init__.py
│   └── autorpt.py                   # Main script
└── setup.py
```

### Content Format

**`reports/content.md`** format:

```markdown
---
title: Monthly Report
date: May 08, 2026
---

# Monthly Report

# Summary

Your summary content here...

# Budget

The current budget is shown below

[insert budget from budget.xlsx here]

## Budget Comments

Additional notes about budget...

# Deliverables Progress

Progress details...

- Item 1
- Item 2

# Challenges

Current challenges...

# Next Period Activities

Planned activities...
```

The `[insert budget from budget.xlsx here]` placeholder will be automatically replaced with a formatted budget table in both Word and PDF formats.

## Command Line Options

```bash
# Web Interface (opens browser automatically)
auto start

# Start web server without opening browser
auto start --no-browser

# Specify custom port for web server
auto start --port 5000

# Generate Word document from content.md and budget.xlsx
auto

# Generate PDF from content.md using Typst
auto --typst

# Generate both Word and PDF
auto --all

# Enable verbose output
auto --verbose
auto start --verbose
```

The web server auto-clears any stale process on the configured port before starting, so you'll never hit "port in use" errors.

# Requirements

- **Python 3.9+**
- **python-docx**: For Word document generation
- **pandas + openpyxl**: For reading Excel budget files
- **Typst** (optional, for PDF generation): https://github.com/typst/typst

Install Typst for PDF support:

- macOS: `brew install typst`
- Linux: Follow instructions at https://github.com/typst/typst
- Windows: Download from https://github.com/typst/typst/releases

## Output

The package generates:

- **Word Document** (`report_YYYY-MM-DD.docx`): Professional formatted report with budget table
- **PDF Document** (`report_YYYY-MM-DD.pdf`): Clean PDF version using Typst template
- Both formats include formatted budget tables with proper alignment and styling
- Reports are created in the `reports/` folder
