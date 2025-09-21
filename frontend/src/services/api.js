const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-deployment-url.herokuapp.com' 
  : 'http://127.0.0.1:5000';

// Core API functions
export const generateTestCases = async (requirements, testType, complianceStandard) => {
  const response = await fetch(`${API_BASE_URL}/api/generate-tests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requirements,
      test_type: testType,
      compliance_standard: complianceStandard,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate test cases');
  }

  return response.json();
};

export const validateRequirements = async (requirements) => {
  const response = await fetch(`${API_BASE_URL}/api/validate-requirements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ requirements }),
  });

  if (!response.ok) {
    throw new Error('Failed to validate requirements');
  }

  return response.json();
};

// Document processing
export const processDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/process-document`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to process document');
  }

  return response.json();
};

// System status
export const getSystemStatus = async () => {
  const response = await fetch(`${API_BASE_URL}/api/system-status`);

  if (!response.ok) {
    throw new Error('Failed to get system status');
  }

  return response.json();
};

export const getGoogleCloudStatus = async () => {
  const response = await fetch(`${API_BASE_URL}/api/google-cloud-status`);

  if (!response.ok) {
    throw new Error('Failed to get Google Cloud status');
  }

  return response.json();
};

// GDPR functions
export const getGDPRStatus = async () => {
  const response = await fetch(`${API_BASE_URL}/api/gdpr-status`);

  if (!response.ok) {
    throw new Error('Failed to get GDPR status');
  }

  return response.json();
};

export const getGDPRComplianceReport = async () => {
  const response = await fetch(`${API_BASE_URL}/api/gdpr/compliance-report`);

  if (!response.ok) {
    throw new Error('Failed to get GDPR compliance report');
  }

  return response.json();
};

export const handleDataSubjectRights = async (requestType, userId, dataType = null) => {
  const response = await fetch(`${API_BASE_URL}/api/gdpr/rights-request?request_type=${requestType}&user_id=${userId}${dataType ? `&data_type=${dataType}` : ''}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to process rights request');
  }

  return response.json();
};

// Compliance matrix
export const getComplianceMatrix = async (requirements = '', testCases = []) => {
  // This would typically make an API call to get the compliance matrix
  // For now, returning mock data since the backend endpoint isn't implemented yet
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        HIPAA: { overall_score: 85, covered_count: 5, total_count: 6, gaps_count: 1 },
        HITECH: { overall_score: 78, covered_count: 2, total_count: 3, gaps_count: 1 },
        FDA: { overall_score: 92, covered_count: 3, total_count: 4, gaps_count: 1 },
        IEC_62304: { overall_score: 70, covered_count: 3, total_count: 4, gaps_count: 1 },
        ISO_9001: { overall_score: 88, covered_count: 2, total_count: 3, gaps_count: 1 },
        ISO_13485: { overall_score: 82, covered_count: 2, total_count: 3, gaps_count: 1 },
        ISO_27001: { overall_score: 90, covered_count: 3, total_count: 4, gaps_count: 1 },
        GDPR: { overall_score: 95, covered_count: 4, total_count: 5, gaps_count: 1 }
      });
    }, 1000);
  });
};

// Export functions
export const exportTestCases = async (testCases, format) => {
  const response = await fetch(`${API_BASE_URL}/api/export-tests/${format}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ test_cases: testCases }),
  });

  if (!response.ok) {
    throw new Error(`Failed to export test cases in ${format} format`);
  }

  return response.json();
};

// Health check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/`);

  if (!response.ok) {
    throw new Error('Health check failed');
  }

  return response.json();
};
