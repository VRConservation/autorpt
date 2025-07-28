# autorpt-pdf.ps1 - Simple PDF operations for autorpt
# Usage: .\autorpt-pdf.ps1 [option]

param(
    [string]$Action = "latest"
)

function Show-Help {
    Write-Host ""
    Write-Host "📚 autorpt-pdf.ps1 - Simple PDF operations" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\autorpt-pdf.ps1                Convert most recent report to PDF" -ForegroundColor White
    Write-Host "  .\autorpt-pdf.ps1 all            Convert all reports to PDF" -ForegroundColor White
    Write-Host "  .\autorpt-pdf.ps1 new            Generate new report + PDF" -ForegroundColor White
    Write-Host "  .\autorpt-pdf.ps1 help           Show this help" -ForegroundColor White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\autorpt-pdf.ps1                # Quick PDF of latest report" -ForegroundColor Gray
    Write-Host "  .\autorpt-pdf.ps1 all            # Convert everything" -ForegroundColor Gray
    Write-Host "  .\autorpt-pdf.ps1 new            # New report + PDF" -ForegroundColor Gray
    Write-Host ""
}

switch ($Action.ToLower()) {
    "latest" {
        Write-Host "📄 Converting most recent report to PDF..." -ForegroundColor Green
        python autorpt\autorpt.py --pdf-only
    }
    "all" {
        Write-Host "📁 Converting all reports to PDF..." -ForegroundColor Green
        python autorpt\autorpt.py --pdf-all
    }
    "new" {
        Write-Host "🚀 Generating new report with PDF..." -ForegroundColor Green
        python autorpt\autorpt.py --pdf
    }
    "help" {
        Show-Help
    }
    default {
        Write-Host "❌ Unknown option: $Action" -ForegroundColor Red
        Write-Host "Use '.\autorpt-pdf.ps1 help' for usage information" -ForegroundColor Yellow
    }
}
