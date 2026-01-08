"""
Utility functions for lead processing.

NOTE: PDF generation has been DEPRECATED.
The system now uses a static PDF file located at:
backend/leads/assets/FSM_Roadmap.pdf

The generate_roadmap_pdf() function below is kept for reference only
and is no longer used in the application.
"""
import os
from django.conf import settings

try:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
    from reportlab.lib.enums import TA_CENTER, TA_LEFT
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False


def generate_roadmap_pdf(lead):
    """
    [DEPRECATED] Generate a PDF roadmap document for the lead.
    
    This function is NO LONGER USED. The system now uses a static PDF file
    located at: backend/leads/assets/FSM_Roadmap.pdf
    
    This function is kept for reference only and should not be called.
    
    Returns:
        str: Path to the generated PDF file, or None if PDF generation fails
    """
    if not REPORTLAB_AVAILABLE:
        # If reportlab is not available, return None
        # The email will still be sent without attachment
        print("Warning: reportlab not available. PDF generation skipped.")
        return None
    
    try:
        # Create temporary directory if it doesn't exist
        temp_dir = getattr(settings, 'PDF_TEMP_DIR', '/tmp')
        if not os.path.exists(temp_dir):
            os.makedirs(temp_dir)
        
        # Generate PDF filename
        pdf_filename = f"roadmap_{lead.id}_{lead.email.replace('@', '_at_')}.pdf"
        pdf_path = os.path.join(temp_dir, pdf_filename)
        
        # Create PDF document
        doc = SimpleDocTemplate(
            pdf_path,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18
        )
        
        # Container for PDF content
        story = []
        
        # Define styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor='#1a1a1a',
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            textColor='#2c3e50',
            spaceAfter=12,
            spaceBefore=20
        )
        
        body_style = ParagraphStyle(
            'CustomBody',
            parent=styles['BodyText'],
            fontSize=11,
            textColor='#333333',
            spaceAfter=12,
            alignment=TA_LEFT,
            leading=14
        )
        
        # Title
        story.append(Paragraph("Full Stack Marketing Career Roadmap", title_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Personalized greeting
        story.append(Paragraph(
            f"Prepared for: {lead.full_name}",
            ParagraphStyle(
                'Greeting',
                parent=styles['BodyText'],
                fontSize=12,
                textColor='#555555',
                alignment=TA_CENTER
            )
        ))
        story.append(Spacer(1, 0.3*inch))
        
        # Introduction
        story.append(Paragraph(
            "This roadmap is designed to guide you through your journey to becoming "
            "a full-stack marketing professional. It covers essential skills, tools, "
            "and strategies that will help you advance your career and achieve higher "
            "salary outcomes.",
            body_style
        ))
        story.append(Spacer(1, 0.2*inch))
        
        # Section 1: Core Marketing Foundations
        story.append(Paragraph("1. Core Marketing Foundations & Strategy", heading_style))
        story.append(Paragraph(
            "• Market research and customer insights<br/>"
            "• Brand positioning and messaging<br/>"
            "• Marketing strategy development<br/>"
            "• Campaign planning and execution<br/>"
            "• Content strategy and creation",
            body_style
        ))
        story.append(Spacer(1, 0.15*inch))
        
        # Section 2: Growth & Performance
        story.append(Paragraph("2. Growth, Performance & Analytics", heading_style))
        story.append(Paragraph(
            "• Digital marketing channels (SEO, SEM, Social Media)<br/>"
            "• Performance marketing and paid advertising<br/>"
            "• Marketing analytics and data interpretation<br/>"
            "• Conversion optimization<br/>"
            "• ROI measurement and reporting",
            body_style
        ))
        story.append(Spacer(1, 0.15*inch))
        
        # Section 3: AI & MarTech
        story.append(Paragraph("3. AI & MarTech Capabilities", heading_style))
        story.append(Paragraph(
            "• Marketing automation platforms<br/>"
            "• AI-powered marketing tools<br/>"
            "• CRM systems and customer data platforms<br/>"
            "• Marketing technology stack integration<br/>"
            "• Data-driven decision making",
            body_style
        ))
        story.append(Spacer(1, 0.15*inch))
        
        # Section 4: Career Path
        story.append(Paragraph("4. Structured Career Path", heading_style))
        story.append(Paragraph(
            "• Entry-level positions and skill building<br/>"
            "• Mid-level specialization opportunities<br/>"
            "• Senior roles and leadership development<br/>"
            "• Continuous learning and skill updates<br/>"
            "• Networking and industry engagement",
            body_style
        ))
        story.append(Spacer(1, 0.2*inch))
        
        # Closing
        story.append(Paragraph(
            "Use this roadmap as a reference to plan your next career moves. "
            "Focus on building skills systematically and applying them in real-world "
            "scenarios to maximize your growth potential.",
            body_style
        ))
        story.append(Spacer(1, 0.3*inch))
        
        # Footer
        story.append(Paragraph(
            "Wishing you clarity and growth ahead,<br/>"
            "<b>Team Digital Maven</b><br/>"
            "Digital Maven & MIT",
            ParagraphStyle(
                'Footer',
                parent=styles['BodyText'],
                fontSize=10,
                textColor='#666666',
                alignment=TA_CENTER
            )
        ))
        
        # Build PDF
        doc.build(story)
        
        return pdf_path
        
    except Exception as e:
        # Log error but don't fail the entire request
        print(f"Error generating PDF: {str(e)}")
        return None

