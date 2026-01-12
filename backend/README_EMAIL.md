# Email Configuration - IMPORTANT

## Problem
The backend is returning "Lead saved successfully. Email delivery may be delayed" because email credentials are not being loaded when Django starts.

## Solution

**You MUST set environment variables BEFORE starting Django server.**

### Method 1: Use the Start Script (Easiest)

```powershell
.\start_server.ps1
```

This script automatically sets all email variables and starts the server.

### Method 2: Set Variables Manually

**In PowerShell, run these commands BEFORE starting Django:**

```powershell
$env:EMAIL_HOST="smtp.gmail.com"
$env:EMAIL_PORT="587"
$env:EMAIL_USE_TLS="True"
$env:EMAIL_HOST_USER="digitalmavencommunity@gmail.com"
$env:EMAIL_HOST_PASSWORD="fhek fyua vxrg kfxt"
$env:EMAIL_FROM_ADDRESS="digitalmavencommunity@gmail.com"

# Then start Django
python manage.py runserver
```

### Method 3: Set in Same Command (One-liner)

```powershell
$env:EMAIL_HOST_USER="digitalmavencommunity@gmail.com"; $env:EMAIL_HOST_PASSWORD="fhek fyua vxrg kfxt"; $env:EMAIL_FROM_ADDRESS="digitalmavencommunity@gmail.com"; python manage.py runserver
```

## Verify Configuration

After setting variables, verify they're loaded:

```powershell
python manage.py shell -c "from django.conf import settings; import os; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings'); import django; django.setup(); print('EMAIL_HOST_USER:', settings.EMAIL_HOST_USER if settings.EMAIL_HOST_USER else 'NOT SET'); print('EMAIL_HOST_PASSWORD:', 'SET' if settings.EMAIL_HOST_PASSWORD else 'NOT SET')"
```

## Current Status Check

Run this to check if credentials are loaded:
```powershell
python test_email.py
```

If it says "NOT SET", you need to set the environment variables and restart Django.

## Why This Happens

Environment variables in PowerShell are session-specific. If you:
1. Set variables in one terminal
2. Start Django in another terminal
3. Or set variables after Django is already running

The Django process won't have access to those variables.

**Solution:** Always set variables in the SAME terminal session BEFORE starting Django.



