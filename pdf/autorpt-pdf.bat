@echo off
REM Simple batch script for autorpt PDF operations
REM Usage: autorpt-pdf.bat [option]

if "%1"=="" (
    echo 📄 Converting most recent report to PDF...
    python autorpt\autorpt.py --pdf-only
    goto end
)

if "%1"=="all" (
    echo 📁 Converting all reports to PDF...
    python autorpt\autorpt.py --pdf-all
    goto end
)

if "%1"=="new" (
    echo 🚀 Generating new report with PDF...
    python autorpt\autorpt.py --pdf
    goto end
)

if "%1"=="help" (
    echo.
    echo 📚 autorpt-pdf.bat - Simple PDF operations
    echo.
    echo Usage:
    echo   autorpt-pdf.bat           Convert most recent report to PDF
    echo   autorpt-pdf.bat all       Convert all reports to PDF
    echo   autorpt-pdf.bat new       Generate new report + PDF
    echo   autorpt-pdf.bat help      Show this help
    echo.
    goto end
)

echo ❌ Unknown option: %1
echo Use "autorpt-pdf.bat help" for usage information

:end
