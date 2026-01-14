"""
Test script to verify Gmail SMTP configuration
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

print("=" * 50)
print("Testing Gmail SMTP Configuration")
print("=" * 50)
print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
print(f"EMAIL_PORT: {settings.EMAIL_PORT}")
print(f"EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
print(f"EMAIL_HOST_PASSWORD: {'***SET***' if settings.EMAIL_HOST_PASSWORD else 'NOT SET'}")
print(f"EMAIL_FROM_ADDRESS: {settings.EMAIL_FROM_ADDRESS}")
print("=" * 50)

try:
    print("\nSending test email...")
    send_mail(
        subject='Test Email - Career ROI Tool',
        message='This is a test email to verify SMTP configuration is working correctly.',
        from_email=settings.EMAIL_FROM_ADDRESS,
        recipient_list=['digitalmavencommunity@gmail.com'],
        fail_silently=False,
    )
    print("\n✅ SUCCESS: Test email sent successfully!")
    print("Please check your inbox at digitalmavencommunity@gmail.com")
except Exception as e:
    print(f"\n❌ ERROR: Failed to send email")
    print(f"Error details: {str(e)}")
    print("\nTroubleshooting:")
    print("1. Verify the App Password is correct")
    print("2. Check that 2FA is enabled on the Gmail account")
    print("3. Ensure 'Less secure app access' is not required (use App Password instead)")
    print("4. Check firewall/network settings")





