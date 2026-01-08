from django.contrib import admin
from .models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    """Admin interface for Lead model."""
    list_display = ['email', 'full_name', 'phone_number', 'created_at']
    list_filter = ['created_at']
    search_fields = ['email', 'full_name', 'phone_number']
    readonly_fields = ['created_at']
    ordering = ['-created_at']


