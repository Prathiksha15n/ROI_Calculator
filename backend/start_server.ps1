# PowerShell script to set email variables and start Django server
# Usage: .\start_server.ps1

Write-Host "Setting up Gmail SMTP configuration..." -ForegroundColor Green

# Set email environment variables
$env:EMAIL_HOST = "smtp.gmail.com"
$env:EMAIL_PORT = "587"
$env:EMAIL_USE_TLS = "True"
$env:EMAIL_HOST_USER = "digitalmavencommunity@gmail.com"
$env:EMAIL_HOST_PASSWORD = "fhek fyua vxrg kfxt"
$env:EMAIL_FROM_ADDRESS = "digitalmavencommunity@gmail.com"

Write-Host "Email configuration loaded!" -ForegroundColor Green
Write-Host ""
Write-Host "Starting Django development server..." -ForegroundColor Cyan
Write-Host "Server will be available at: http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host "API endpoint: http://127.0.0.1:8000/api/leads/" -ForegroundColor Cyan
Write-Host ""

# Start Django server
python manage.py runserver


