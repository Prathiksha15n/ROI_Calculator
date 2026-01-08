# Email Configuration Guide

## Current Status
❌ **Emails are NOT being sent** - SMTP credentials are not configured.

## How to Configure Email Sending

### Option 1: Using Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character app password

3. **Set Environment Variables** (PowerShell):
   ```powershell
   $env:EMAIL_HOST="smtp.gmail.com"
   $env:EMAIL_PORT="587"
   $env:EMAIL_USE_TLS="True"
   $env:EMAIL_HOST_USER="your-email@gmail.com"
   $env:EMAIL_HOST_PASSWORD="your-16-char-app-password"
   $env:EMAIL_FROM_ADDRESS="enquiry@digitalmaven.co.in"
   ```

4. **Restart Django Server** after setting environment variables

### Option 2: Using Other SMTP Services

#### SendGrid:
```powershell
$env:EMAIL_HOST="smtp.sendgrid.net"
$env:EMAIL_PORT="587"
$env:EMAIL_USE_TLS="True"
$env:EMAIL_HOST_USER="apikey"
$env:EMAIL_HOST_PASSWORD="your-sendgrid-api-key"
$env:EMAIL_FROM_ADDRESS="enquiry@digitalmaven.co.in"
```

#### AWS SES:
```powershell
$env:EMAIL_HOST="email-smtp.us-east-1.amazonaws.com"
$env:EMAIL_PORT="587"
$env:EMAIL_USE_TLS="True"
$env:EMAIL_HOST_USER="your-aws-smtp-username"
$env:EMAIL_HOST_PASSWORD="your-aws-smtp-password"
$env:EMAIL_FROM_ADDRESS="enquiry@digitalmaven.co.in"
```

## Testing Email Configuration

After setting environment variables, test with:

```python
python manage.py shell
```

Then in the shell:
```python
from django.core.mail import send_mail
from django.conf import settings

print("EMAIL_HOST:", settings.EMAIL_HOST)
print("EMAIL_HOST_USER:", settings.EMAIL_HOST_USER)
print("EMAIL_FROM_ADDRESS:", settings.EMAIL_FROM_ADDRESS)

# Test email
send_mail(
    'Test Email',
    'This is a test email from Django.',
    settings.EMAIL_FROM_ADDRESS,
    ['your-test-email@gmail.com'],
    fail_silently=False,
)
```

## Important Notes

1. **For Gmail:** You MUST use an App Password, not your regular password
2. **FROM Address:** Must be authorized to send from your SMTP server
3. **Environment Variables:** Must be set before starting Django server
4. **Testing:** Always test with a real email address first

## Current Configuration

- **EMAIL_HOST:** smtp.gmail.com (default)
- **EMAIL_PORT:** 587 (default)
- **EMAIL_USE_TLS:** True (default)
- **EMAIL_HOST_USER:** ❌ NOT SET
- **EMAIL_HOST_PASSWORD:** ❌ NOT SET
- **EMAIL_FROM_ADDRESS:** enquiry@digitalmaven.co.in

## Troubleshooting

### Error: "Authentication failed"
- Check that EMAIL_HOST_USER and EMAIL_HOST_PASSWORD are correct
- For Gmail, ensure you're using an App Password, not regular password

### Error: "Connection refused"
- Check firewall settings
- Verify SMTP host and port are correct

### Error: "FROM address not authorized"
- Ensure EMAIL_FROM_ADDRESS matches an authorized sender in your SMTP account


