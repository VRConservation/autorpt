# setup-aliases.ps1 - Set up simple autorpt aliases
# Run this once to set up convenient aliases

Write-Host "Setting up autorpt aliases..." -ForegroundColor Cyan

# Get the parent directory (autorpt root) since we're now in pdf/ subfolder
$currentDir = (Get-Location).Parent

# Create aliases for the current session
New-Alias -Name "autorpt-pdf" -Value "$currentDir\pdf\autorpt-pdf.ps1" -Force
New-Alias -Name "pdf-latest" -Value "python" -Force
New-Alias -Name "pdf-all" -Value "python" -Force  
New-Alias -Name "pdf-new" -Value "python" -Force

# Create functions instead of simple aliases for complex commands
function pdf-latest { python autorpt\autorpt.py --pdf-only }
function pdf-all { python autorpt\autorpt.py --pdf-all }
function pdf-new { python autorpt\autorpt.py --pdf }

Write-Host ""
Write-Host "Aliases and functions created for this session:" -ForegroundColor Green
Write-Host "   autorpt-pdf          # Run the PowerShell script" -ForegroundColor White
Write-Host "   pdf-latest           # Convert latest report to PDF" -ForegroundColor White
Write-Host "   pdf-all              # Convert all reports to PDF" -ForegroundColor White
Write-Host "   pdf-new              # Generate new report + PDF" -ForegroundColor White
Write-Host ""
Write-Host "Examples:" -ForegroundColor Yellow
Write-Host "   pdf-latest           # Quick PDF conversion" -ForegroundColor Gray
Write-Host "   pdf-all              # Convert everything" -ForegroundColor Gray
Write-Host "   pdf-new              # New report with PDF" -ForegroundColor Gray
Write-Host ""
Write-Host "Note: These are only active in this PowerShell session." -ForegroundColor Yellow
Write-Host "To make them permanent, add them to your PowerShell profile." -ForegroundColor Yellow
