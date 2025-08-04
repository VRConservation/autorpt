# PDF Conversion for autorpt

Complete guid### 🚀 Current Working Commands (Use These Now)

For immediate use with the current version:

```bash
# Convert most recent report to PDF (most common use case)
python -m autorpt.autorpt --pdf

# Convert all Word reports to PDF
python -m autorpt.autorpt --pdf-all

# Generate new report and convert to PDF
python -m autorpt.autorpt --generate --pdf
```

> **💡 Key Point:** These commands work from any directory right now! Use the module syntax until you install the editable version.n functionality in the autorpt package.

## Overview

Convert Word reports (.docx) to PDF format with powerful automation options. The PDF conversion feature provides multiple interfaces: direct command-line usage, convenience scripts, and programmatic integration.

## Installation

Install the required PDF conversion dependency:

```bash
pip install docx2pdf>=0.1.8
```

Or install from requirements:

```bash
pip install -r requirements.txt
```

### Installing the Latest Development Version

**For developers working with source code:**

```bash
# From the autorpt project directory
pip install -e .
```

This installs autorpt in "editable" mode, so your code changes immediately affect the `autorpt` command.

**For end users on other computers:**

The commands work right now using module syntax:

```bash
# Current commands that work everywhere (with autorpt installed)
python -m autorpt.autorpt --pdf         # Convert latest report
python -m autorpt.autorpt --pdf-all     # Convert all reports
python -m autorpt.autorpt --generate --pdf  # Generate + convert
```

## Quick Start

### 🚀 Recommended: Simple Console Commands (Works Anywhere)\*

The simplest way to work with PDFs using clean, intuitive commands:

```bash
# Convert most recent report to PDF (most common use case)
autorpt --pdf

# Convert all Word reports to PDF
autorpt --pdf-all

# Generate new report and convert to PDF (if needed)
autorpt --generate --pdf
```

> **💡 Key Point:** These commands work from any directory once autorpt is installed. No aliases or complex paths needed!

> **⚠️ Availability Note:** These simplified commands will be available in autorpt v0.1.3+. For current installations, use the module syntax shown in the Development section below.

### � Install for Simple Commands (Optional)

To use the shorter commands (`autorpt --pdf` instead of `python -m autorpt.autorpt --pdf`):

```bash
# From the autorpt project directory
pip install -e .

# Then you can use:
autorpt --pdf              # Convert latest report
autorpt --pdf-all          # Convert all reports
autorpt --generate --pdf   # Generate + convert
```

## Detailed Usage

### Command Line Options

#### autorpt integration options:

-   `--pdf`: Convert most recent report to PDF (primary use case)
-   `--pdf-all`: Convert all Word reports in reports/ folder to PDF
-   `--generate --pdf`: Generate new report and convert to PDF
-   `--pdf-only`: (Legacy) Same as `--pdf`
-   `-v, --verbose`: Enable verbose output

#### Standalone pdf.py script options (for development):

-   `-f, --file FILE`: Convert a specific Word document
-   `-a, --all`: Convert all Word documents in directory
-   `-d, --dir DIR`: Input directory (default: reports)
-   `-o, --output DIR`: Output directory for PDFs
-   `-v, --verbose`: Enable verbose output

### Advanced Examples

#### Single File Conversion

```bash
# Convert specific file (development/debugging)
python -m autorpt.pdf -f reports/project_report_2025-08-04.docx

# Convert with custom output directory
python -m autorpt.pdf -f report.docx -o pdfs/
```

#### Batch Conversion

```bash
# Convert all reports with verbose output (development)
python -m autorpt.pdf -a -v

# Convert from custom directory to specific output
python -m autorpt.pdf -a -d reports -o pdfs
```

#### Integration Workflows

```bash
# Generate custom report with PDF
autorpt --generate -i budget.xlsx -o monthly_report.docx --pdf

# Add content and convert
autorpt --generate --auto-content --pdf

# Generate from mixed content with PDF
autorpt --generate --mixed file1.md data.xlsx --pdf

# Convert existing reports (most common)
autorpt --pdf              # Latest report
autorpt --pdf-all          # All reports
```

### Programmatic Usage

```python
from autorpt.pdf import convert_to_pdf, convert_all_reports
from autorpt.autorpt import ReportGenerator

# Method 1: Direct conversion
success, pdf_path = convert_to_pdf("reports/my_report.docx")
if success:
    print(f"PDF created: {pdf_path}")

# Method 2: Batch conversion
results = convert_all_reports("reports", "pdfs")
print(f"Converted {results['success']} files")

# Method 3: Integrated workflow
generator = ReportGenerator()
generator.generate_report()    # Creates Word report
pdf_path = generator.rpt_pdf() # Converts to PDF
```

## Features

-   ✅ **Single & Batch Conversion**: Convert individual files or entire directories
-   ✅ **Flexible Output**: Specify custom output directories
-   ✅ **Error Handling**: Comprehensive validation and error reporting
-   ✅ **Retry Logic**: Automatic retry with Word process cleanup
-   ✅ **File Size Reporting**: Shows file sizes after conversion
-   ✅ **Progress Tracking**: Visual progress for batch operations
-   ✅ **Cross-platform Scripts**: PowerShell and batch file support

## File Structure

This `pdf/` folder contains:

-   **`PDF_README.md`** - This comprehensive documentation
-   **`autorpt-pdf.ps1`** - PowerShell script for easy PDF operations
-   **`autorpt-pdf.bat`** - Windows batch script for easy PDF operations
-   **`setup-aliases.ps1`** - Sets up convenient command aliases

The core PDF functionality is in `autorpt/pdf.py`.

## Requirements

-   **Windows**: Microsoft Word must be installed (uses COM interface)
-   **macOS/Linux**: Alternative solutions may be needed
-   **Python Package**: docx2pdf>=0.1.8
-   **Python Version**: 3.9+

## Error Handling & Troubleshooting

### Robust Error Handling

The PDF conversion includes:

-   ✅ Dependency availability checks
-   ✅ Input file validation
-   ✅ Output verification
-   ✅ Automatic Word process cleanup
-   ✅ Retry logic with delays
-   ✅ Helpful error messages with solutions

### Common Issues & Solutions

#### "No such file or directory" when running autorpt commands

This usually means you're trying to use project-relative paths outside the project directory.

**Solutions:**

```bash
# ✅ Use the simple console commands (works anywhere)
autorpt --pdf              # Convert latest report
autorpt --pdf-all          # Convert all reports

# ✅ For generating new reports with PDF
autorpt --generate --pdf

# ❌ Don't use relative paths outside project directory
python autorpt/autorpt.py --pdf  # Only works from project root

# ❌ Don't use complex module syntax unless debugging
python -m autorpt.autorpt --pdf-only
```

#### "PDF conversion not available"

```bash
# Solution: Install the required package
pip install docx2pdf
```

#### "Error converting to PDF"

-   Ensure Microsoft Word is installed
-   Close the Word document if it's open
-   Check file permissions
-   Try running as administrator

#### "Word file not found"

-   Verify the file path is correct
-   Ensure the Word document exists
-   Check that file isn't locked by another process

#### Performance Tips

-   Close Word documents before conversion
-   Allow extra time for large documents
-   Ensure sufficient disk space for PDF output
-   Use batch mode for multiple files

## Examples

### Example 1: Daily Report Workflow

```bash
# Convert today's most recent report to PDF
autorpt --pdf
```

### Example 2: Archive All Reports

```bash
# Convert all existing reports to PDFs
autorpt --pdf-all
```

### Example 3: Custom Monthly Report

```bash
# Generate custom report with markdown content and convert to PDF
autorpt --generate --auto-content --content-folder monthly_data --pdf
```

### Example 4: Organized Output

```bash
# Convert all reports to organized PDF directory (development)
python -m autorpt.pdf -a -d reports -o pdfs/$(date +%Y-%m)
```

## Integration Notes

-   PDF conversion integrates seamlessly with all autorpt features
-   Works with auto-discovery, mixed content, and custom workflows
-   Maintains file naming conventions
-   Supports all autorpt command-line options
-   Can be used programmatically in custom scripts

For more information about autorpt's core functionality, see the main README.md file.
