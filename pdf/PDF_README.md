# PDF Conversion for autorpt

Complete guide to PDF conversion functionality in the autorpt package.

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

## Quick Start

### 🚀 Recommended: Built-in Commands

The simplest way to work with PDFs using enhanced autorpt commands:

```bash
# Generate new report and convert to PDF
python autorpt/autorpt.py --pdf

# Convert most recent report to PDF (no new generation)
python autorpt/autorpt.py --pdf-only

# Convert all Word reports to PDF
python autorpt/autorpt.py --pdf-all
```

### 🛠️ Convenience Scripts

Use the provided scripts for even easier access from the main autorpt directory:

#### PowerShell Script

```powershell
.\pdf\autorpt-pdf.ps1           # Convert latest report
.\pdf\autorpt-pdf.ps1 all       # Convert all reports
.\pdf\autorpt-pdf.ps1 new       # Generate new + PDF
```

#### Windows Batch Script

```batch
.\pdf\autorpt-pdf.bat           # Convert latest report
.\pdf\autorpt-pdf.bat all       # Convert all reports
.\pdf\autorpt-pdf.bat new       # Generate new + PDF
```

#### Simple Aliases (PowerShell)

```powershell
# Set up aliases once
.\pdf\setup-aliases.ps1

# Then use simple commands
pdf-latest                      # Convert latest report
pdf-all                         # Convert all reports
pdf-new                         # Generate new report + PDF
```

## Detailed Usage

### Command Line Options

#### autorpt.py integration options:

-   `--pdf`: Generate report and convert to PDF
-   `--pdf-only`: Convert most recent report to PDF (no generation)
-   `--pdf-all`: Convert all Word reports in reports/ folder to PDF
-   `-v, --verbose`: Enable verbose output

#### Standalone pdf.py script options:

-   `-f, --file FILE`: Convert a specific Word document
-   `-a, --all`: Convert all Word documents in directory
-   `-d, --dir DIR`: Input directory (default: reports)
-   `-o, --output DIR`: Output directory for PDFs
-   `-v, --verbose`: Enable verbose output

### Advanced Examples

#### Single File Conversion

```bash
# Convert specific file
python autorpt/pdf.py -f reports/project_report_2025-08-04.docx

# Convert with custom output directory
python autorpt/pdf.py -f report.docx -o pdfs/
```

#### Batch Conversion

```bash
# Convert all reports with verbose output
python autorpt/pdf.py -a -v

# Convert from custom directory to specific output
python autorpt/pdf.py -a -d reports -o pdfs
```

#### Integration Workflows

```bash
# Generate custom report with PDF
python autorpt/autorpt.py -i budget.xlsx -o monthly_report.docx --pdf

# Add content and convert
python autorpt/autorpt.py --auto-content --pdf

# Generate from mixed content with PDF
python autorpt/autorpt.py --mixed file1.md data.xlsx --pdf
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
# Generate today's report and convert to PDF
python autorpt/autorpt.py --pdf
```

### Example 2: Archive All Reports

```bash
# Convert all existing reports to PDFs with verbose output
python autorpt/pdf.py -a -v
```

### Example 3: Custom Monthly Report

```bash
# Generate custom report with markdown content
python autorpt/autorpt.py --auto-content --content-folder monthly_data --pdf
```

### Example 4: Organized Output

```bash
# Convert all reports to organized PDF directory
python autorpt/pdf.py -a -d reports -o pdfs/$(date +%Y-%m)
```

## Integration Notes

-   PDF conversion integrates seamlessly with all autorpt features
-   Works with auto-discovery, mixed content, and custom workflows
-   Maintains file naming conventions
-   Supports all autorpt command-line options
-   Can be used programmatically in custom scripts

For more information about autorpt's core functionality, see the main README.md file.
