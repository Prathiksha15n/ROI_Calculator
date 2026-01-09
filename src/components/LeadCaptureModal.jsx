import React, { useState, useEffect, useRef } from 'react'
import './LeadCaptureModal.css'

// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const LeadCaptureModal = ({ isOpen, onClose, careerProfile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const modalRef = useRef(null)

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: '', email: '', phone: '' })
      setErrors({})
      setIsSubmitting(false)
    }
  }, [isOpen])

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) {
      return 'Name is required'
    }
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters'
    }
    return ''
  }

  const validateEmail = (email) => {
    if (!email.trim()) {
      return 'Email is required'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address'
    }
    return ''
  }

  const validatePhone = (phone) => {
    if (!phone.trim()) {
      return 'Phone number is required'
    }
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '')
    // Check if it's a valid Indian phone number format
    // Should be +91 followed by 10 digits, or just 10/12 digits that can be formatted
    if (digitsOnly.length < 10) {
      return 'Phone number must be at least 10 digits'
    }
    // Backend will validate the exact +91XXXXXXXXXX format
    return ''
  }

  const handleChange = (field, value) => {
    // For phone, only allow digits, spaces, +, -, and parentheses
    if (field === 'phone') {
      value = value.replace(/[^\d\s\+\-\(\)]/g, '')
    }
    
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleBlur = (field) => {
    let error = ''
    switch (field) {
      case 'name':
        error = validateName(formData.name)
        break
      case 'email':
        error = validateEmail(formData.email)
        break
      case 'phone':
        error = validatePhone(formData.phone)
        break
      default:
        break
    }
    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }))
    }
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields
    const nameError = validateName(formData.name)
    const emailError = validateEmail(formData.email)
    const phoneError = validatePhone(formData.phone)
    
    if (nameError || emailError || phoneError) {
      setErrors({
        name: nameError,
        email: emailError,
        phone: phoneError,
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      // Format phone number to Indian format (+91XXXXXXXXXX)
      const formattedPhone = formatPhoneNumber(formData.phone)
      
      // Prepare request payload matching Django API expectations
      // Backend expects: name, email, phone (not full_name, phone_number)
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formattedPhone
      }

      // Make API call to Django backend
      // Endpoint: POST ${API_BASE_URL}/api/leads/
      const response = await fetch(`${API_BASE_URL}/api/leads/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle validation errors from Django backend
        if (response.status === 400 && data.errors) {
          const apiErrors = {}
          
          // Map backend error fields to frontend field names
          if (data.errors.email) {
            apiErrors.email = Array.isArray(data.errors.email) 
              ? data.errors.email[0] 
              : data.errors.email
          }
          if (data.errors.phone) {
            apiErrors.phone = Array.isArray(data.errors.phone) 
              ? data.errors.phone[0] 
              : data.errors.phone
          }
          if (data.errors.name) {
            apiErrors.name = Array.isArray(data.errors.name) 
              ? data.errors.name[0] 
              : data.errors.name
          }
          
          setErrors(apiErrors)
          setIsSubmitting(false)
          return
        }
        
        // Handle other errors
        throw new Error(data.message || 'Failed to submit form')
      }

      // Success - backend returns: { success: true, message: "Roadmap email sent" }
      console.log('Lead saved and email sent:', data)
      setIsSubmitting(false)
      onClose()
      
      // Show success message and redirect to homepage after 2-3 seconds
      alert('We\'ve emailed your personalized career roadmap. Please check your inbox.')
      
      // Redirect to homepage after 2.5 seconds
      setTimeout(() => {
        window.location.href = '/'
      }, 2500)
      
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors({
        submit: error.message || 'An error occurred. Please try again later.'
      })
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      !errors.name &&
      !errors.email &&
      !errors.phone
    )
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ×
        </button>

        <div className="modal-content">
          <h2 className="modal-title">Get Your Personalized Career Roadmap</h2>
          
          <p className="modal-subtitle">
            Based on your skills and experience, we'll share a clear roadmap
            to reach your projected growth.
          </p>

          <p className="modal-trust-line">
            We respect your privacy. No spam. Only career guidance.
          </p>

          <form onSubmit={handleSubmit} className="lead-form">
            <div className="form-field">
              <label htmlFor="name" className="field-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className={`field-input ${errors.name ? 'error' : ''}`}
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <span className="field-error">{errors.name}</span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="email" className="field-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className={`field-input ${errors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="phone" className="field-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className={`field-input ${errors.phone ? 'error' : ''}`}
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="+91 98765 43210"
              />
              {errors.phone && (
                <span className="field-error">{errors.phone}</span>
              )}
            </div>

            {errors.submit && (
              <div className="field-error" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              className={`form-submit ${!isFormValid() || isSubmitting ? 'disabled' : ''}`}
              disabled={!isFormValid() || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Get My Career Roadmap →'}
            </button>

            <p className="form-hint">Takes less than a minute</p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LeadCaptureModal

