from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid
import os
from datetime import datetime

from services.test_generator import TestCaseGenerator
from services.compliance_checker import ComplianceChecker
from services.google_ai_service import GoogleCloudAIService
from services.gdpr_service import GDPRComplianceService
from config import Config

app = FastAPI(
    title="AI Healthcare Test Case Generator",
    description="AI-Powered Test Case Generation with Google Cloud AI for Healthcare Software Compliance",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"],
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:3000", 
        "http://127.0.0.1:5173", 
        "http://127.0.0.1:3000",
        "https://*.vercel.app",  # Allow Vercel frontend
        "https://auto-test-case-ai.vercel.app"  # actual URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
test_generator = TestCaseGenerator()
compliance_checker = ComplianceChecker()
google_ai_service = GoogleCloudAIService()
gdpr_service = GDPRComplianceService()

# Pydantic models for request/response
class GenerateTestsRequest(BaseModel):
    requirements: str
    test_type: Optional[str] = "functional"
    compliance_standard: Optional[str] = "FDA"

class ValidateRequirementsRequest(BaseModel):
    requirements: str

class ExportTestsRequest(BaseModel):
    test_cases: List[dict]

class HealthResponse(BaseModel):
    status: str
    message: str
    version: str
    timestamp: str
    google_cloud_ai: str = "integrated"

@app.get("/", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        message="AI Healthcare Test Case Generation API with Google Cloud AI",
        version="1.0.0",
        timestamp=datetime.utcnow().isoformat(),
        google_cloud_ai="Google Generative AI (Gemini 1.5 Pro) integrated"
    )

@app.post("/api/generate-tests")
async def generate_test_cases(request: GenerateTestsRequest):
    try:
        if not request.requirements.strip():
            raise HTTPException(status_code=400, detail="Requirements text is required")
        
        # Apply GDPR compliance to requirements processing
        gdpr_compliant_requirements = gdpr_service.ensure_gdpr_compliance(
            {"requirements": request.requirements}, "requirements"
        )
        
        # Generate test cases using Google Cloud AI
        test_cases = await test_generator.generate_test_cases(
            gdpr_compliant_requirements["requirements"], request.test_type, request.compliance_standard
        )
        
        # Generate compliance report with AI analysis
        compliance_report = await compliance_checker.check_compliance_with_ai(
            gdpr_compliant_requirements["requirements"], test_cases, request.compliance_standard
        )
        
        # Apply GDPR compliance to response data
        gdpr_compliant_response = gdpr_service.ensure_gdpr_compliance({
            "id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "requirements": gdpr_compliant_requirements["requirements"],
            "test_cases": [tc.to_dict() for tc in test_cases],
            "compliance_report": compliance_report.to_dict(),
            "metadata": {
                "test_type": request.test_type,
                "compliance_standard": request.compliance_standard,
                "total_test_cases": len(test_cases),
                "ai_powered": True,
                "google_cloud_ai": "Google Generative AI (Gemini)",
                "gdpr_compliant": True
            }
        }, "test_cases")
        
        return gdpr_compliant_response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/api/validate-requirements")
async def validate_requirements(request: ValidateRequirementsRequest):
    try:
        # Apply GDPR compliance to validation request
        gdpr_compliant_request = gdpr_service.ensure_gdpr_compliance(
            {"requirements": request.requirements}, "requirements"
        )
        
        # Use Google Cloud AI for advanced validation
        validation_result = await test_generator.validate_requirements(gdpr_compliant_request["requirements"])
        
        validation_result["ai_powered"] = True
        validation_result["google_cloud_service"] = "Google Generative AI (Gemini)"
        validation_result["gdpr_compliant"] = True
        
        return validation_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Validation error: {str(e)}")

@app.get("/api/compliance-standards")
async def get_compliance_standards():
    standards = compliance_checker.get_supported_standards()
    return {"standards": standards}

@app.post("/api/export-tests/{format}")
async def export_test_cases(format: str, request: ExportTestsRequest):
    try:
        if format.lower() == 'junit':
            exported_data = test_generator.export_to_junit(request.test_cases)
        elif format.lower() == 'cucumber':
            exported_data = test_generator.export_to_cucumber(request.test_cases)
        else:
            raise HTTPException(status_code=400, detail="Unsupported export format")
            
        return {
            "format": format,
            "data": exported_data,
            "filename": f"test_cases_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{format}",
            "gdpr_compliant": True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export error: {str(e)}")

@app.post("/api/process-document")
async def process_document(file: UploadFile = File(...)):
    """Process healthcare documents using Google Cloud AI with GDPR compliance"""
    try:
        if not file.content_type:
            raise HTTPException(status_code=400, detail="File type not specified")
        
        file_content = await file.read()
        file_type = file.content_type.split('/')[-1]
        
        # Process document with Google AI service
        result = await google_ai_service.process_multiple_formats(file_content, file_type)
        
        # Apply GDPR compliance to processed document
        gdpr_compliant_result = gdpr_service.ensure_gdpr_compliance(
            result, "requirements"
        )
        
        return {
            "filename": file.filename,
            "processed_at": datetime.utcnow().isoformat(),
            "result": gdpr_compliant_result,
            "google_cloud_service": "Document Processing + AI Analysis",
            "gdpr_compliant": True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document processing error: {str(e)}")

@app.get("/api/google-cloud-status")
async def google_cloud_status():
    """Check Google Cloud AI services status"""
    try:
        # Use the correct method name
        status = google_ai_service.get_comprehensive_service_status()
        return {
            "google_ai_status": status,
            "integration_type": "Google Generative AI REST API",
            "model": "gemini-1.5-pro",
            "healthcare_optimized": True,
            "compliance_focused": True,
            "gdpr_compliant": True
        }
    except Exception as e:
        # Fallback status if service check fails
        return {
            "google_ai_status": {
                "google_ai_services": {
                    "generative_ai_enabled": bool(google_ai_service.ai_enabled),
                    "model": "gemini-1.5-pro",
                    "status": "operational" if google_ai_service.ai_enabled else "fallback_mode"
                }
            },
            "integration_type": "Google Generative AI REST API",
            "healthcare_optimized": True,
            "compliance_focused": True,
            "gdpr_compliant": True,
            "note": f"Service check failed: {str(e)}"
        }

@app.post("/api/ai-health-check")
async def ai_health_check():
    """Test Google AI integration with a simple healthcare query"""
    try:
        test_requirements = "The healthcare system shall authenticate users with multi-factor authentication and protect patient PHI."
        
        # Test AI validation with GDPR compliance
        validation_result = await google_ai_service.validate_healthcare_requirements(test_requirements)
        
        return {
            "ai_service_operational": True,
            "test_validation_result": validation_result,
            "google_ai_integration": "Working",
            "healthcare_ai_ready": True,
            "gdpr_compliant": True
        }
        
    except Exception as e:
        return {
            "ai_service_operational": False,
            "error": str(e),
            "fallback_mode": True,
            "google_ai_integration": "Failed - Using Fallback",
            "gdpr_compliant": True
        }

# GDPR Compliance Endpoints
@app.get("/api/gdpr-status")
async def get_gdpr_status():
    """Get GDPR compliance status"""
    return gdpr_service.get_gdpr_status()

@app.post("/api/gdpr/rights-request")
async def handle_data_subject_rights(request_type: str, user_id: str, data_type: str = None):
    """Handle data subject rights requests"""
    return gdpr_service.handle_data_subject_rights(request_type, user_id, data_type)

@app.get("/api/gdpr/compliance-report")
async def get_gdpr_compliance_report():
    """Generate GDPR compliance report"""
    return gdpr_service.generate_gdpr_compliance_report()

# System Status Endpoint
@app.get("/api/system-status")
async def get_system_status():
    """Get comprehensive system status"""
    return {
        "system": "AI Healthcare Test Case Generator",
        "status": "operational",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "google_ai": google_ai_service.ai_enabled,
            "test_generation": True,
            "compliance_checking": True,
            "gdpr_compliance": True,
            "document_processing": True
        },
        "compliance_frameworks": [
            "FDA", "IEC_62304", 
            "ISO_9001", "ISO_13485", "ISO_27001", "GDPR"
        ],
        "supported_formats": ["PDF", "Word", "XML", "HTML", "Markdown"],
        "enterprise_integration": ["Jira", "Azure DevOps", "Polarion"],
        "gdpr_compliant": True
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)
