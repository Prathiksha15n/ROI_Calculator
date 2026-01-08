# PowerShell script to set Gmail SMTP environment variables
# Run this script before starting Django server: .\setup_email.ps1

Write-Host "Setting Gmail SMTP environment variables..." -ForegroundColor Green

$env:EMAIL_HOST = "smtp.gmail.com"
$env:EMAIL_PORT = "587"
$env:EMAIL_USE_TLS = "True"
$env:EMAIL_HOST_USER = "digitalmavencommunity@gmail.com"
$env:EMAIL_HOST_PASSWORD = "fhek fyua vxrg kfxt"
$env:EMAIL_FROM_ADDRESS = "digitalmavencommunity@gmail.com"

Write-Host "Environment variables set successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "EMAIL_HOST: $env:EMAIL_HOST"
Write-Host "EMAIL_PORT: $env:EMAIL_PORT"
Write-Host "EMAIL_USE_TLS: $env:EMAIL_USE_TLS"
Write-Host "EMAIL_HOST_USER: $env:EMAIL_HOST_USER"
Write-Host "EMAIL_FROM_ADDRESS: $env:EMAIL_FROM_ADDRESS"
Write-Host ""
Write-Host "Note: These variables are set for this PowerShell session only." -ForegroundColor Yellow
Write-Host "To make them permanent, add them to your system environment variables." -ForegroundColor Yellow
Write-Host ""
Write-Host "You can now start Django server: python manage.py runserver" -ForegroundColor Cyan


