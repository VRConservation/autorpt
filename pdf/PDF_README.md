# PDF Conversion for autorpt

This document describes the PDF conversion functionality added to the autorpt package.

## Ove### autorpt.py enhanced options:

-   `-p, --pdf`: Also convert the generated report to PDF
-   `--pdf-only`: Convert most recent report to PDF (no generation)
-   `--pdf-all`: Convert all Word reports to PDFew

The PDF conversion feature allows you to convert Word reports (.docx) to PDF format. This functionality is provided through a separate `pdf.py` module for better modularity.

## Installation

Before using PDF conversion, you need to install the required dependency:

```bash
pip install docx2pdf
```

Or install from the updated requirements.txt:

```bash
pip install -r requirements/requirements.txt
```

## Usage

### 1. Simple Commands (Recommended)

The easiest way to work with PDFs using enhanced autorpt commands:

```bash
# Generate new report and convert to PDF
python autorpt/autorpt.py --pdf

# Convert most recent report to PDF (no new generation)
python autorpt/autorpt.py --pdf-only

# Convert all Word reports to PDF
python autorpt/autorpt.py --pdf-all
```

### 2. Super Simple Scripts

Use the provided scripts for even easier access:

```powershell
# PowerShell script
.\autorpt-pdf.ps1           # Convert latest report
.\autorpt-pdf.ps1 all       # Convert all reports
.\autorpt-pdf.ps1 new       # Generate new + PDF

# Windows batch script
.\autorpt-pdf.bat           # Convert latest report
.\autorpt-pdf.bat all       # Convert all reports
.\autorpt-pdf.bat new       # Generate new + PDF

# Set up short aliases
.\setup-aliases.ps1         # Run once to set up aliases
pdf-latest                  # Then use simple commands
pdf-all                     # Convert all reports
pdf-new                     # Generate new report + PDF
```

### 3. Command Line Usage (Standalone)

Convert individual files or entire directories using the dedicated PDF script:

```bash
# Convert a single file
python autorpt/pdf.py -f reports/project_report_2025-07-28.docx

# Convert all Word documents in the reports directory
python autorpt/pdf.py -a

# Convert all files from a specific directory to an output directory
python autorpt/pdf.py -a -d reports -o pdfs

# Convert with verbose output
python autorpt/pdf.py -f report.docx -v
```

### 4. Integration with Report Generation (Legacy)

When generating reports, you can automatically convert to PDF:

```bash
# Generate report and convert to PDF
python autorpt/autorpt.py --pdf

# With custom input and output
python autorpt/autorpt.py -i budget.xlsx -o my_report.docx --pdf
```

### 5. Programmatic Usage

```python
from autorpt.pdf import convert_to_pdf, convert_all_reports
from autorpt.autorpt import ReportGenerator

# Method 1: Direct conversion
success, pdf_path = convert_to_pdf("reports/my_report.docx")

# Method 2: Convert all reports
results = convert_all_reports("reports", "pdfs")

# Method 3: Using ReportGenerator
generator = ReportGenerator()
generator.generate_report()  # Creates Word report
success = generator.rpt_pdf()  # Converts to PDF
```

## Features

-   **Single File Conversion**: Convert individual Word documents to PDF
-   **Batch Conversion**: Convert all Word documents in a directory
-   **Flexible Output**: Specify custom output directories
-   **Error Handling**: Comprehensive error reporting and validation
-   **File Size Reporting**: Shows file sizes after conversion
-   **Automatic Naming**: PDFs have the same name as source Word files

## Command Line Options

### pdf.py script options:

-   `-f, --file`: Convert a specific Word document
-   `-a, --all`: Convert all Word documents in a directory
-   `-d, --dir`: Input directory (default: reports)
-   `-o, --output`: Output directory for PDFs
-   `-v, --verbose`: Enable verbose output

### autorpt.py integration:

-   `-p, --pdf`: Also convert the generated report to PDF

## Requirements

-   **Windows**: Microsoft Word must be installed (uses COM interface)
-   **macOS/Linux**: Alternative solutions may be needed
-   **Python Package**: docx2pdf>=0.1.8

## Error Handling

The PDF conversion includes robust error handling:

-   Checks for docx2pdf availability
-   Validates input file existence
-   Verifies successful PDF creation
-   Provides helpful error messages
-   Suggests solutions for common issues

## Examples

### Example 1: Generate and Convert Report

```bash
# Generate today's report and convert to PDF
python autorpt/autorpt.py --pdf
```

### Example 2: Convert Existing Reports

```bash
# Convert all existing reports to PDFs
python autorpt/pdf.py -a -v
```

### Example 3: Custom Workflow

```bash
# Generate report with custom name, then convert
python autorpt/autorpt.py -o monthly_report.docx
python autorpt/pdf.py -f reports/monthly_report.docx
```

## Troubleshooting

### Common Issues:

1. **"PDF conversion not available"**

    - Install docx2pdf: `pip install docx2pdf`

2. **"Error converting to PDF"**

    - Ensure Microsoft Word is installed
    - Close the Word document if it's open
    - Check file permissions

3. **"Word file not found"**
    - Verify the file path is correct
    - Ensure the Word document exists

### Tips:

-   Word documents should not be open during conversion
-   Large documents may take longer to convert
-   Check available disk space for PDF output
