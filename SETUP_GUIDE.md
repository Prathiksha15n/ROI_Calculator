# Complete Setup Guide - Career ROI Tool Backend

This guide walks you through setting up the Django backend for the Career ROI tool.

## Prerequisites

1. **Python 3.8+** installed
2. **MySQL** server running on localhost:3306
3. **Node.js** (for React frontend - already set up)

## Backend Setup Steps

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Required packages:**
- Django 4.2.7
- Django REST Framework 3.14.0
- django-cors-headers 4.3.1
- mysqlclient 2.2.0 (MySQL database driver)
- reportlab 4.0.7 (PDF generation)

### 2. Database Setup

#### Create MySQL Database

```sql
CREATE DATABASE Roi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Verify Database Credentials

The database configuration is in `backend/backend/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'Roi',
        'USER': 'root',
        'PASSWORD': 'admin123',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

**Note:** Update these credentials if your MySQL setup differs.

### 3. Run Database Migrations

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

This creates the `leads` table in your MySQL database.

### 4. Email Configuration

#### Option A: Environment Variables (Recommended)

Set these environment variables before running the server:

```bash
# Windows PowerShell
$env:EMAIL_HOST="smtp.gmail.com"
$env:EMAIL_PORT="587"
$env:EMAIL_USE_TLS="True"
$env:EMAIL_HOST_USER="your-email@gmail.com"
$env:EMAIL_HOST_PASSWORD="your-app-password"
$env:EMAIL_FROM_ADDRESS="enquiry@digitalmaven.co.in"

# Linux/Mac
export EMAIL_HOST=smtp.gmail.com
export EMAIL_PORT=587
export EMAIL_USE_TLS=True
export EMAIL_HOST_USER=your-email@gmail.com
export EMAIL_HOST_PASSWORD=your-app-password
export EMAIL_FROM_ADDRESS=enquiry@digitalmaven.co.in
```

#### Option B: Direct Configuration

Edit `backend/backend/settings.py` and update the email settings directly (not recommended for production).

#### Gmail Setup (if using Gmail SMTP)

1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account → Security → App Passwords
3. Generate an App Password for "Mail"
4. Use this App Password (not your regular password) as `EMAIL_HOST_PASSWORD`

### 5. Start Django Development Server

```bash
cd backend
python manage.py runserver
```

The API will be available at: `http://127.0.0.1:8000/api/leads/`

### 6. Test the API

You can test the endpoint using curl:

```bash
curl -X POST http://127.0.0.1:8000/api/leads/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+919876543210"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Roadmap email sent"
}
```

## Frontend Integration

The React frontend is already configured to connect to the backend. Ensure:

1. Django server is running on `http://127.0.0.1:8000`
2. React dev server is running (usually `http://localhost:5173` for Vite)
3. CORS is properly configured (already set in `settings.py`)

## Project Structure

```
roi_cal/
├── backend/                    # Django backend
│   ├── backend/               # Django project
│   │   ├── settings.py        # Database, CORS, Email config
│   │   └── urls.py           # Main URL routing
│   ├── leads/                 # Leads app
│   │   ├── models.py         # Lead model (database schema)
│   │   ├── serializers.py   # API validation
│   │   ├── views.py         # API endpoint logic
│   │   ├── urls.py          # App URL routing
│   │   ├── utils.py         # PDF generation
│   │   └── admin.py         # Django admin interface
│   ├── manage.py
│   └── requirements.txt
└── src/                       # React frontend
    └── components/
        └── LeadCaptureModal.jsx  # Form submission
```

## API Endpoint Details

### POST /api/leads/

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Roadmap email sent"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "errors": {
    "email": ["Invalid email format."],
    "phone": ["Phone number must be in Indian format: +91 followed by 10 digits."]
  }
}
```

## Validation Rules

1. **Email:** Must be valid email format
2. **Phone:** Must be in format `+91` followed by exactly 10 digits (e.g., `+919876543210`)
3. **Name:** Must be at least 2 characters

## Email Flow

When a lead is created:

1. Lead data is validated
2. Lead is saved to MySQL database
3. PDF roadmap is generated
4. Email is sent to user's email address with:
   - Subject: "Your Personalized Full Stack Marketing Career Roadmap"
   - Personalized body with user's name
   - PDF attachment: `Full_Stack_Marketing_Roadmap.pdf`
5. Temporary PDF file is cleaned up

## Troubleshooting

### MySQL Connection Error

- Verify MySQL is running: `mysql -u root -p`
- Check database exists: `SHOW DATABASES;`
- Verify credentials in `settings.py`

### Email Not Sending

- Check SMTP credentials are correct
- For Gmail: Ensure App Password is used (not regular password)
- Check firewall/network allows SMTP connections
- Verify `EMAIL_FROM_ADDRESS` is authorized to send emails

### CORS Errors

- Ensure `corsheaders` is in `INSTALLED_APPS`
- Ensure `CorsMiddleware` is in `MIDDLEWARE` (before CommonMiddleware)
- Check `CORS_ALLOWED_ORIGINS` includes your React dev server URL

### PDF Generation Issues

- Ensure `reportlab` is installed: `pip install reportlab`
- Check `PDF_TEMP_DIR` has write permissions
- PDF generation failures won't block email sending (email sent without attachment)

## Production Considerations

1. **Security:**
   - Change `SECRET_KEY` in `settings.py`
   - Use environment variables for sensitive data
   - Set `DEBUG = False`
   - Configure proper `ALLOWED_HOSTS`

2. **Database:**
   - Use production-grade MySQL configuration
   - Set up database backups

3. **Email:**
   - Use dedicated SMTP service (SendGrid, AWS SES, etc.)
   - Set up email delivery monitoring

4. **Static Files:**
   - Configure `STATIC_ROOT` and run `collectstatic`
   - Use a web server (Nginx) to serve static files

## Next Steps

1. Test the complete flow: Submit form → Check email inbox
2. Verify lead appears in database
3. Check Django admin at `http://127.0.0.1:8000/admin/` (create superuser first: `python manage.py createsuperuser`)


