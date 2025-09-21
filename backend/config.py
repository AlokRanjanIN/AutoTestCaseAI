import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Google AI Settings (new SDK)
    GOOGLE_AI_API_KEY = os.environ.get('GOOGLE_AI_API_KEY')
    
    # Google Cloud Settings (enterprise features)
    GOOGLE_CLOUD_PROJECT = os.environ.get('GOOGLE_CLOUD_PROJECT')
    GOOGLE_CLOUD_REGION = os.environ.get('GOOGLE_CLOUD_REGION') or 'us-central1'
    GOOGLE_APPLICATION_CREDENTIALS = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
    
    # Vertex AI Settings
    VERTEX_AI_LOCATION = 'us-central1'
    
    # Healthcare compliance settings
    FDA_ENABLED = True
    IEC_62304_ENABLED = True
    ISO_9001_ENABLED = True
    ISO_13485_ENABLED = True
    ISO_27001_ENABLED = True
    GDPR_ENABLED = True
    
    # Test case generation settings
    MAX_TEST_CASES_PER_REQUEST = 50
    MIN_REQUIREMENT_LENGTH = 10
    
    # FastAPI settings
    API_HOST = "0.0.0.0"
    API_PORT = 5000
