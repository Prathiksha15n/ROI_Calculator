# Django Backend - Career ROI Tool

Backend API for the Career ROI / Career Intelligence tool.

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Database Setup

1. Ensure MySQL is running on `localhost:3306`
2. Create the database:
   ```sql
   CREATE DATABASE Roi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Verify MySQL credentials in `backend/settings.py`:
   - Database: `Roi`
   - Username: `root`
   - Password: `admin123`
   - Host: `localhost`
   - Port: `3306`

### 3. Run Migrations

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### 4. Email Configuration

Set environment variables for email (or update `settings.py` directly for development):

```bash
# For Gmail (example)
export EMAIL_HOST=smtp.gmail.com
export EMAIL_PORT=587
export EMAIL_USE_TLS=True
export EMAIL_HOST_USER=your-email@gmail.com
export EMAIL_HOST_PASSWORD=your-app-password
export EMAIL_FROM_ADDRESS=enquiry@digitalmaven.co.in
```

**Note:** For Gmail, you need to:
- Enable 2-Factor Authentication
- Generate an App Password (not your regular password)
- Use the App Password as `EMAIL_HOST_PASSWORD`

### 5. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/api/leads/`

## API Endpoint

### POST /api/leads/

Create a new lead and send roadmap email.

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

## Project Structure

```
backend/
├── backend/          # Django project settings
│   ├── settings.py   # Database, CORS, Email config
│   └── urls.py       # Main URL routing
├── leads/            # Leads app
│   ├── models.py     # Lead model
│   ├── serializers.py # API serializers with validation
│   ├── views.py      # API views
│   ├── urls.py       # App URL routing
│   └── utils.py      # PDF generation utility
└── requirements.txt  # Python dependencies
```

## Frontend Integration

The React frontend should POST to:
```
http://127.0.0.1:8000/api/leads/
```

With headers:
```
Content-Type: application/json
```


