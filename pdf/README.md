# PDF Helper Scripts

This folder contains helper scripts and documentation for the PDF conversion functionality in autorpt.

## Files

-   **`PDF_README.md`** - Complete documentation for PDF conversion features
-   **`autorpt-pdf.ps1`** - PowerShell script for easy PDF operations
-   **`autorpt-pdf.bat`** - Windows batch script for easy PDF operations
-   **`setup-aliases.ps1`** - Sets up simple command aliases like `pdf-latest`

## Quick Start

From the main autorpt directory, you can:

### Option 1: Use the PowerShell script

```powershell
.\pdf\autorpt-pdf.ps1           # Convert latest report
.\pdf\autorpt-pdf.ps1 all       # Convert all reports
.\pdf\autorpt-pdf.ps1 new       # Generate new + PDF
```

### Option 2: Set up simple aliases

```powershell
.\pdf\setup-aliases.ps1         # Run once to set up aliases
pdf-latest                      # Then use simple commands
pdf-all                         # Convert all reports
pdf-new                         # Generate new report + PDF
```

### Option 3: Use built-in commands

```powershell
python autorpt\autorpt.py --pdf-only    # Convert latest report
python autorpt\autorpt.py --pdf-all     # Convert all reports
python autorpt\autorpt.py --pdf         # Generate new + PDF
```

## Note

The core PDF functionality is in `autorpt\pdf.py`. These are just convenience scripts to make it easier to use.
