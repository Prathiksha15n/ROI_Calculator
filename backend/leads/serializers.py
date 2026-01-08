"""
Serializers for Lead API endpoints.
Handles validation for email and Indian phone number format.
"""
import re
from rest_framework import serializers
from .models import Lead


class LeadSerializer(serializers.ModelSerializer):
    """
    Serializer for Lead model.
    
    Validates:
    - Email format (standard email validation)
    - Indian phone number format (+91 followed by exactly 10 digits)
    
    Request fields:
    - name: Maps to full_name
    - email: User's email
    - phone: Maps to phone_number (must be in +91XXXXXXXXXX format)
    """
    name = serializers.CharField(source='full_name', max_length=150, write_only=True)
    phone = serializers.CharField(source='phone_number', max_length=15, write_only=True)

    class Meta:
        model = Lead
        fields = ['id', 'name', 'email', 'phone', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_email(self, value):
        """
        Validate email format.
        Django's EmailField already validates basic format,
        but we add explicit validation for clarity.
        """
        if not value:
            raise serializers.ValidationError("Email is required.")
        
        # Basic email format check (Django's EmailField also validates)
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, value):
            raise serializers.ValidationError("Invalid email format.")
        
        return value.lower().strip()

    def validate_phone(self, value):
        """
        Validate Indian phone number format.
        Must be: +91 followed by exactly 10 digits
        Example: +919876543210
        """
        if not value:
            raise serializers.ValidationError("Phone number is required.")
        
        # Remove any whitespace
        value = value.strip()
        
        # Check if it starts with +91
        if not value.startswith('+91'):
            raise serializers.ValidationError(
                "Phone number must be in Indian format: +91 followed by 10 digits. "
                "Example: +919876543210"
            )
        
        # Extract digits after +91
        digits = value[3:]
        
        # Check if exactly 10 digits
        if not digits.isdigit():
            raise serializers.ValidationError(
                "Phone number must contain only digits after +91."
            )
        
        if len(digits) != 10:
            raise serializers.ValidationError(
                "Phone number must have exactly 10 digits after +91."
            )
        
        return value

    def validate_name(self, value):
        """Validate name field."""
        if not value or not value.strip():
            raise serializers.ValidationError("Name is required.")
        
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters.")
        
        return value.strip()


