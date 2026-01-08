"""
Lead model for storing user information from Career ROI tool.
"""
from django.db import models


class Lead(models.Model):
    """
    Model to store lead information from Career ROI calculator.
    
    Fields:
    - email: Primary key - User's email address (validated, unique)
    - full_name: User's full name (max 150 characters)
    - phone_number: Indian phone number in +91XXXXXXXXXX format
    - created_at: Timestamp when lead was created (auto-set on creation)
    """
    email = models.EmailField(primary_key=True)
    full_name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'leads'
        ordering = ['-created_at']
        verbose_name = 'Lead'
        verbose_name_plural = 'Leads'

    def __str__(self):
        return f"{self.full_name} ({self.email})"

