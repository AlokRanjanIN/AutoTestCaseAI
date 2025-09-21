import React, { useState } from 'react';

const RequirementInput = ({ onGenerateTests, onValidateRequirements, loading }) => {
  const [requirements, setRequirements] = useState('');
  const [testType, setTestType] = useState('functional');
  const [complianceStandard, setComplianceStandard] = useState('FDA');
  const [validation, setValidation] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Enhanced compliance standards
  const complianceStandards = [
    { value: 'FDA', label: 'FDA - Food & Drug Administration', description: 'Medical device regulations (21 CFR)' },
    { value: 'IEC_62304', label: 'IEC 62304 - Medical Device Software', description: 'Software lifecycle processes' },
    { value: 'ISO_9001', label: 'ISO 9001 - Quality Management', description: 'Quality management systems' },
    { value: 'ISO_13485', label: 'ISO 13485 - Medical Device QMS', description: 'Medical device quality systems' },
    { value: 'ISO_27001', label: 'ISO 27001 - Information Security', description: 'Information security management' },
    { value: 'GDPR', label: 'GDPR - Data Protection Regulation', description: 'EU data privacy and protection' }
  ];

  const testTypes = [
    { value: 'functional', label: 'Functional Testing', description: 'Core functionality and business logic' },
    { value: 'security', label: 'Security Testing', description: 'Security controls and vulnerabilities' },
    { value: 'compliance', label: 'Compliance Testing', description: 'Regulatory compliance validation' },
    { value: 'performance', label: 'Performance Testing', description: 'System performance and scalability' },
    { value: 'usability', label: 'Usability Testing', description: 'User experience and accessibility' },
    { value: 'integration', label: 'Integration Testing', description: 'System and API integration' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (requirements.trim()) {
      const validationResult = await onValidateRequirements(requirements);
      setValidation(validationResult);
      
      if (validationResult.valid || validationResult.completeness_score > 50) {
        onGenerateTests(requirements, testType, complianceStandard);
      }
    }
  };

  const handleRequirementsChange = (e) => {
    setRequirements(e.target.value);
    setValidation(null);
  };

  const insertSampleRequirement = (type) => {
    const samples = {
      fda: `The medical device software shall be validated according to FDA 21 CFR Part 820.30 design controls. The system must implement electronic signature controls per 21 CFR Part 11, ensuring non-repudiation and data integrity. All software changes shall be validated through documented testing procedures, and risk management processes must be implemented per ISO 14971. The software shall maintain complete traceability from requirements through testing, with automated verification of critical safety functions.`,
      
      iec62304: `The medical device software development shall follow IEC 62304 lifecycle processes. Software safety classification must be performed per IEC 62304-4.3. The system shall implement software requirements analysis per IEC 62304-5.2 with documented specifications. Risk management activities must be integrated throughout the software lifecycle per IEC 62304-7.1, and software configuration management shall be implemented per IEC 62304-8.`,
      
      gdpr: `The healthcare data processing system shall implement privacy by design principles per GDPR Article 25. User consent must be obtained and managed per Article 7, with clear withdrawal mechanisms. The system shall support data subject rights including access (Article 15), rectification (Article 16), and erasure (Article 17). Data processing activities must be logged per Article 30, and a Data Protection Impact Assessment must be conducted for high-risk processing.`
    };
    
    setRequirements(samples[type] || '');
    setValidation(null);
  };

  return (
    <div className="requirement-input">
      <div className="section-header">
        <h2>📝 Input Healthcare Software Requirements</h2>
        <div className="header-actions">
          <button 
            type="button"
            className="toggle-advanced"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? '📋 Simple View' : '⚙️ Advanced Options'}
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="requirements">
            Software Requirements:
            <span className="required">*</span>
          </label>
          
          <div className="sample-buttons">

            <button type="button" onClick={() => insertSampleRequirement('fda')} className="sample-btn">
              🏥 FDA Sample
            </button>
            <button type="button" onClick={() => insertSampleRequirement('iec62304')} className="sample-btn">
              ⚕️ IEC 62304 Sample
            </button>
            <button type="button" onClick={() => insertSampleRequirement('gdpr')} className="sample-btn">
              🔒 GDPR Sample
            </button>
          </div>
          
          <textarea
            id="requirements"
            value={requirements}
            onChange={handleRequirementsChange}
            placeholder="Enter your healthcare software requirements here... 

For best results, include:
• Specific functional requirements with 'shall' or 'must' statements
• Security and privacy requirements
• Data handling and encryption specifications
• User authentication and authorization requirements
• Audit and logging requirements
• Regulatory compliance requirements

Example: The system shall authenticate healthcare providers using multi-factor authentication and encrypt all PHI using AES-256..."
            rows="12"
            required
          />
          <div className="character-count">
            {requirements.length} characters
            {requirements.length > 0 && (
              <span className={requirements.length < 100 ? 'warning' : 'success'}>
                {requirements.length < 100 ? ' (Add more detail for better results)' : ' ✓'}
              </span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="testType">Test Type:</label>
            <select
              id="testType"
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
            >
              {testTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <small className="form-help">
              {testTypes.find(t => t.value === testType)?.description}
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="complianceStandard">Compliance Standard:</label>
            <select
              id="complianceStandard"
              value={complianceStandard}
              onChange={(e) => setComplianceStandard(e.target.value)}
            >
              {complianceStandards.map(standard => (
                <option key={standard.value} value={standard.value}>
                  {standard.label}
                </option>
              ))}
            </select>
            <small className="form-help">
              {complianceStandards.find(s => s.value === complianceStandard)?.description}
            </small>
          </div>
        </div>

        {showAdvanced && (
          <div className="advanced-options">
            <h3>⚙️ Advanced Options</h3>
            <div className="form-row">
              <div className="form-group">
                <label>
                  <input type="checkbox" defaultChecked />
                  Enable AI-powered enhancement
                </label>
                <small className="form-help">Use Google Gemini for intelligent test generation</small>
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" defaultChecked />
                  GDPR compliance mode
                </label>
                <small className="form-help">Apply data protection principles to generated tests</small>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>
                  <input type="checkbox" />
                  Generate integration tests for ALM tools
                </label>
                <small className="form-help">Include Jira, Azure DevOps, Polarion integration tests</small>
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" />
                  Include enterprise toolchain validation
                </label>
                <small className="form-help">Add tests for enterprise workflow integration</small>
              </div>
            </div>
          </div>
        )}

        {validation && (
          <div className={`validation-result ${validation.valid ? 'valid' : 'warning'}`}>
            <h4>📊 AI Requirements Analysis:</h4>
            <div className="validation-metrics">
              <div className="metric">
                <span className="metric-label">Completeness Score:</span>
                <span className="metric-value">{validation.completeness_score}%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Healthcare Context:</span>
                <span className="metric-value">{validation.healthcare_context_score || 'N/A'}%</span>
              </div>
              <div className="metric">
                <span className="metric-label">AI Service:</span>
                <span className="metric-value">{validation.google_cloud_service || 'Standard'}</span>
              </div>
            </div>
            
            {validation.suggestions && validation.suggestions.length > 0 && (
              <div>
                <strong>💡 AI Suggestions:</strong>
                <ul>
                  {validation.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {validation.healthcare_specific_recommendations && (
              <div>
                <strong>🏥 Healthcare Recommendations:</strong>
                <ul>
                  {validation.healthcare_specific_recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {validation.missing_elements && validation.missing_elements.length > 0 && (
              <div>
                <strong>⚠️ Missing Elements:</strong>
                <ul>
                  {validation.missing_elements.map((element, index) => (
                    <li key={index}>{element}</li>
                  ))}
                </ul>
              </div>
            )}

            {validation.identified_healthcare_entities && (
              <div>
                <strong>🎯 Detected Healthcare Entities:</strong>
                <div className="entity-tags">
                  {validation.identified_healthcare_entities.map((entity, index) => (
                    <span key={index} className="entity-tag">{entity}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="submit-section">
          <button type="submit" disabled={loading || !requirements.trim()}>
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                ⏳ Generating Test Cases with Google AI...
              </>
            ) : (
              '🚀 Generate Test Cases with AI'
            )}
          </button>
          
          <div className="submit-info">
            <small>
              🤖 Powered by Google Gemini 1.5 Pro • 🔒 GDPR Compliant • ⚡ Enterprise Ready
            </small>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RequirementInput;
