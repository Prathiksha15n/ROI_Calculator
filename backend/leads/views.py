"""
API views for Lead management.
Handles POST requests to create leads and send roadmap emails.
"""
import os
import traceback
from threading import Thread
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.db import IntegrityError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Lead
from .serializers import LeadSerializer


class LeadCreateView(APIView):
    """
    API endpoint to create a lead and send roadmap email.
    
    POST /api/leads/
    
    Request body:
    {
        "name": "string",
        "email": "string",
        "phone": "+91XXXXXXXXXX"
    }
    
    Response (success):
    {
        "success": true,
        "message": "Roadmap email sent"
    }
    
    Response (error):
    {
        "success": false,
        "errors": {
            "email": ["error message"],
            "phone": ["error message"]
        }
    }
    """
    
    def post(self, request):
        """
        Create a new lead and send roadmap email asynchronously.
        
        Process:
        1. Validate request data using serializer
        2. Save lead to database
        3. Start email sending in background thread (non-blocking)
        4. Return success response immediately (< 300ms target)
        
        Note: Email sending happens asynchronously and does not block the API response.
        """
        serializer = LeadSerializer(data=request.data)
        
        if not serializer.is_valid():
            # Return validation errors in clean JSON format
            return Response(
                {
                    "success": False,
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Save lead to database
        # Handle duplicate email case (email is primary key)
        try:
            lead = serializer.save()
        except IntegrityError as e:
            # Catch database constraint violations (duplicate email)
            return Response(
                {
                    "success": False,
                    "errors": {
                        "email": ["This email has already been registered. Each email can only be submitted once."]
                    }
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            # Re-raise other exceptions to be handled by outer try-except
            raise
        
        # Send email asynchronously in background thread
        # API responds immediately without waiting for email
        Thread(
            target=send_roadmap_email_async,
            args=(lead.email, lead.full_name, lead.email)
        ).start()
        
        # Return success response immediately (email sending happens in background)
        return Response(
            {
                "success": True,
                "message": "Roadmap email sent"
            },
            status=status.HTTP_201_CREATED
        )
    

def send_roadmap_email_async(email_address, full_name, lead_email):
    """
    Asynchronous function to send roadmap email in background thread.
    
    This function runs in a separate thread and does NOT block the API response.
    All errors are logged but do not affect the API response.
    
    Args:
        email_address: Email address to send to (same as lead_email, kept for compatibility)
        full_name: Full name of the lead
        lead_email: Email address (primary key, used for logging)
    """
    # Close any existing database connections before starting thread
    # This is important for Django threads
    from django.db import connections
    connections.close_all()
    
    try:
        # Verify email configuration
        if not settings.EMAIL_HOST_USER or not settings.EMAIL_HOST_PASSWORD:
            error_msg = f"[Email Thread] Error for email {lead_email}: Email credentials not configured"
            print(error_msg)
            print(f"[Email Thread] EMAIL_HOST_USER: {settings.EMAIL_HOST_USER if settings.EMAIL_HOST_USER else 'NOT SET'}")
            print(f"[Email Thread] EMAIL_HOST_PASSWORD: {'SET' if settings.EMAIL_HOST_PASSWORD else 'NOT SET'}")
            return
        
        # Path to static PDF file
        # BASE_DIR points to backend/ directory, so we go: leads/assets/FSM_Roadmap.pdf
        pdf_path = os.path.join(settings.BASE_DIR, "leads", "assets", "FSM_Roadmap.pdf")

        
        # Verify PDF file exists
        if not os.path.exists(pdf_path):
            error_msg = f"[Email Thread] Error for email {lead_email}: PDF not found at {pdf_path}"
            print(error_msg)
            print(f"[Email Thread] BASE_DIR: {settings.BASE_DIR}")
            print(f"[Email Thread] Checking if directory exists: {os.path.dirname(pdf_path)}")
            print(f"[Email Thread] Directory exists: {os.path.exists(os.path.dirname(pdf_path))}")
            return
        
        # HTML email template
        html_email_body = f"""<!DOCTYPE html>
<html lang="en" style="margin:0;padding:0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <title>Digital Maven — Full Stack Marketing Career Roadmap</title>
  <style>
    body,table,td,a {{ -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }}
    table,td {{ mso-table-lspace:0pt; mso-table-rspace:0pt; border-collapse:collapse; }}
    img {{ -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; display:block; }}
    body {{ margin:0; padding:0; width:100% !important; height:100% !important; background:#f5f7fb; }}
    .w-600{{width:600px;max-width:600px;}}
    .px-24{{padding-left:24px;padding-right:24px;}}
    .py-16{{padding-top:16px;padding-bottom:16px;}}
    .py-24{{padding-top:24px;padding-bottom:24px;}}
    .small{{font-size:13px;color:#4a5568;}}
    .shadow{{box-shadow:0 6px 24px rgba(0,0,0,.08);}}
    .center{{text-align:center;}}
    .lead{{font-size:16px;line-height:1.6;color:#0f172a;}}
    .h1{{font-size:24px;line-height:1.25;margin:0;color:#0f172a;font-weight:800;}}
    .tag{{display:inline-block;background:#003F88;color:#fff;font-weight:700;font-size:12px;letter-spacing:.6px;padding:6px 10px;border-radius:999px;}}
    .hero{{
      background: linear-gradient(135deg, #003F88 0%, #1a5db8 50%, #F77F00 120%);
      text-align:center;
      padding:18px 24px;
    }}
    @media screen and (max-width:620px){{
      .w-600{{width:100%!important;max-width:100%!important;}}
      .px-24{{padding-left:16px!important;padding-right:16px!important;}}
      .h1{{font-size:22px!important;}}
    }}
  </style>
</head>
<body>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:24px;">
        <table role="presentation" class="w-600 shadow" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;">
          <!-- HERO: LOGO ONLY -->
          <tr>
            <td class="hero">
              <img src="https://drive.google.com/thumbnail?id=1Kki4IFKVM2-ukPrfkgo6Yv_eYNqn13RJ&sz=w1000" alt="Digital Maven" width="140" style="margin:auto;height:auto;">
            </td>
          </tr>
          <!-- HEADLINE -->
          <tr>
            <td class="px-24 py-24 center">
              <div style="height:10px;"></div>
              <h1 class="h1">Your Full Stack Marketing Career Roadmap</h1>
            </td>
          </tr>
          <!-- BODY -->
          <tr>
            <td class="px-24 py-24">
              <p class="lead" style="margin:0 0 12px 0;">Hi {full_name},</p>
              <p class="lead" style="margin:0 0 12px 0;">
                Thank you for using the Career ROI tool.
              </p>
              <p class="lead" style="margin:0 0 12px 0;">
                Based on your skills and experience, we've prepared a <strong>Full Stack Marketing Career Roadmap</strong> to help you understand how to grow toward higher-impact roles and stronger salary outcomes.
              </p>
              <p class="lead" style="margin:0 0 8px 0;">This roadmap covers:</p>
              <ul class="lead" style="margin:0 0 12px 18px;padding:0;">
                <li>Core marketing foundations and strategy</li>
                <li>Growth, performance, and analytics skills</li>
                <li>AI and MarTech capabilities shaping modern marketing</li>
                <li>A structured path to becoming a full-stack marketing professional</li>
              </ul>
              <p class="lead" style="margin:0 0 12px 0;">
                You'll find the roadmap attached to this email as a PDF.
              </p>
              <p class="lead" style="margin:0 0 12px 0;">
                Take your time to go through it and use it as a reference to plan your next career moves.
              </p>
              <p class="lead" style="margin:0;">
                Wishing you clarity and growth ahead,<br>
                <strong>Team Digital Maven</strong>
              </p>
            </td>
          </tr>
          <!-- FOOTER -->
          <tr>
            <td class="px-24 py-16" style="background:#f0f4fb;border-top:1px solid #e6ebf5;">
              <div class="small" style="text-align:center;color:#0f172a;">
                Digital Maven &amp; MIT
              </div>
              <div class="small" style="margin-top:6px;text-align:center;">
                © 2025 Digital Maven
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

        # Plain text fallback
        plain_text_body = f"""Hi {full_name},

Thank you for using the Career ROI tool.

Based on your skills and experience, we've prepared a Full Stack Marketing Career Roadmap to help you understand how to grow toward higher-impact roles and stronger salary outcomes.

This roadmap covers:
• Core marketing foundations and strategy
• Growth, performance, and analytics skills
• AI and MarTech capabilities shaping modern marketing
• A structured path to becoming a full-stack marketing professional

You'll find the roadmap attached to this email as a PDF.

Take your time to go through it and use it as a reference to plan your next career moves.

Wishing you clarity and growth ahead,
Team Digital Maven

Digital Maven & MIT"""

        # Create email message with HTML content
        email = EmailMultiAlternatives(
            subject="Your Personalized Full Stack Marketing Career Roadmap",
            body=plain_text_body,
            from_email=settings.EMAIL_FROM_ADDRESS,
            to=[email_address],
        )
        email.attach_alternative(html_email_body, "text/html")
        
        # Attach static PDF file (same file for all leads)
        email.attach_file(pdf_path)
        
        # Send email
        print(f"[Email Thread] Attempting to send email to {email_address}...")
        print(f"[Email Thread] From: {settings.EMAIL_FROM_ADDRESS}")
        print(f"[Email Thread] PDF path: {pdf_path}")
        
        email.send()
        print(f"[Email Thread] ✅ Email sent successfully to {email_address}")
        
    except Exception as e:
        # Log error but do NOT raise - this runs in background thread
        error_details = traceback.format_exc()
        print(f"[Email Thread] ❌ Failed to send email to {email_address}")
        print(f"[Email Thread] Error: {str(e)}")
        print(f"[Email Thread] Error type: {type(e).__name__}")
        print(f"[Email Thread] Full traceback:\n{error_details}")
        
        # Also log to a file for debugging (optional)
        try:
            log_file = os.path.join(settings.BASE_DIR, 'email_errors.log')
            with open(log_file, 'a') as f:
                f.write(f"\n{'='*60}\n")
                f.write(f"Timestamp: {__import__('datetime').datetime.now()}\n")
                f.write(f"Email: {email_address}\n")
                f.write(f"Error: {str(e)}\n")
                f.write(f"Traceback:\n{error_details}\n")
        except Exception:
            pass  # Don't fail if logging fails

