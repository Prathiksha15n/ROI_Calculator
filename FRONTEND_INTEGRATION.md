# Frontend-Backend Integration Guide

## React API Integration Example

This document shows how the React frontend integrates with the Django backend API.

### API Endpoint

**POST** `http://127.0.0.1:8000/api/leads/`

### Request Format

```javascript
fetch("http://127.0.0.1:8000/api/leads/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: fullName,      // User's full name
    email: email,        // User's email address
    phone: phoneNumber   // Indian phone number in +91XXXXXXXXXX format
  })
})
```

### Complete Example with Error Handling

```javascript
const handleSubmit = async (e) => {
  e.preventDefault()
  
  // Format phone to Indian format (+91XXXXXXXXXX)
  const formattedPhone = formatPhoneNumber(phoneNumber)
  
  try {
    const response = await fetch("http://127.0.0.1:8000/api/leads/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: formattedPhone
      })
    })

    const data = await response.json()

    if (!response.ok) {
      // Handle validation errors
      if (response.status === 400 && data.errors) {
        // data.errors will contain field-specific errors:
        // { email: ["Invalid email format."], phone: ["Phone number must be in Indian format..."] }
        console.error("Validation errors:", data.errors)
        return
      }
      throw new Error(data.message || "Failed to submit form")
    }

    // Success response: { success: true, message: "Roadmap email sent" }
    alert("We've emailed your personalized career roadmap. Please check your inbox.")
    
    // Redirect to homepage after 2-3 seconds
    setTimeout(() => {
      window.location.href = "/"
    }, 2500)

  } catch (error) {
    console.error("Error submitting form:", error)
    alert("An error occurred. Please try again later.")
  }
}
```

### Response Formats

#### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Roadmap email sent"
}
```

#### Error Response (400 Bad Request)
```json
{
  "success": false,
  "errors": {
    "email": ["Invalid email format."],
    "phone": ["Phone number must be in Indian format: +91 followed by 10 digits. Example: +919876543210"],
    "name": ["Name is required."]
  }
}
```

### Phone Number Formatting Helper

```javascript
const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '')
  
  // If it starts with 91 and has 12 digits, add + prefix
  if (digitsOnly.startsWith('91') && digitsOnly.length === 12) {
    return `+${digitsOnly}`
  }
  // If it has 10 digits, assume it's Indian number and add +91
  if (digitsOnly.length === 10) {
    return `+91${digitsOnly}`
  }
  // If it already has +91, return as is
  if (phone.startsWith('+91')) {
    return phone.replace(/\D/g, '').replace(/^91/, '+91')
  }
  // Default: try to format as +91XXXXXXXXXX
  if (digitsOnly.length >= 10) {
    const last10 = digitsOnly.slice(-10)
    return `+91${last10}`
  }
  return phone
}
```

### Implementation Notes

1. **CORS**: The Django backend is configured to allow requests from `localhost:5173` (Vite default) and `localhost:3000` (Create React App default).

2. **Validation**: Both frontend and backend validate the data. Frontend validation provides immediate feedback, while backend validation ensures data integrity.

3. **Error Handling**: The backend returns structured error objects that can be mapped to form fields for display.

4. **Success Flow**: On successful submission:
   - Show success message
   - Close modal (if applicable)
   - Redirect to homepage after 2-3 seconds

### Current Implementation

The integration is already implemented in:
- `src/components/LeadCaptureModal.jsx` - Main form component with API integration




