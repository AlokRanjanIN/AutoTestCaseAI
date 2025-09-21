import React, { useState, useEffect } from 'react';
import { getGDPRStatus, getGDPRComplianceReport, handleDataSubjectRights } from '../services/api';

const GDPRDashboard = () => {
  const [gdprStatus, setGdprStatus] = useState(null);
  const [complianceReport, setComplianceReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rightsRequest, setRightsRequest] = useState({
    type: 'access',
    userId: '',
    dataType: ''
  });

  useEffect(() => {
    loadGDPRData();
  }, []);

  const loadGDPRData = async () => {
    setLoading(true);
    try {
      const [status, report] = await Promise.all([
        getGDPRStatus(),
        getGDPRComplianceReport()
      ]);
      setGdprStatus(status);
      setComplianceReport(report);
    } catch (err) {
      console.error('Failed to load GDPR data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRightsRequest = async (e) => {
    e.preventDefault();
    try {
      const result = await handleDataSubjectRights(
        rightsRequest.type,
        rightsRequest.userId,
        rightsRequest.dataType
      );
      alert(`Rights request processed successfully. Request ID: ${result.request_id}`);
      setRightsRequest({ type: 'access', userId: '', dataType: '' });
    } catch (err) {
      alert(`Rights request failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="gdpr-dashboard loading">
        <div className="loading-spinner"></div>
        <p>Loading GDPR compliance data...</p>
      </div>
    );
  }

  return (
    <div className="gdpr-dashboard">
      <div className="section-header">
        <h2>🔒 GDPR Compliance Dashboard</h2>
        <p>Comprehensive GDPR compliance monitoring and data subject rights management</p>
      </div>

      {gdprStatus && (
        <div className="gdpr-status-grid">
          <div className="status-card">
            <h3>🛡️ Compliance Status</h3>
            <div className="status-indicator">
              <span className={`status-dot ${gdprStatus.gdpr_compliant ? 'compliant' : 'non-compliant'}`}></span>
              <span className="status-text">
                {gdprStatus.gdpr_compliant ? 'Fully Compliant' : 'Needs Attention'}
              </span>
            </div>
            <div className="compliance-details">
              <div className="detail-item">
                <span className="label">Privacy by Design:</span>
                <span className={`value ${gdprStatus.privacy_by_design ? 'yes' : 'no'}`}>
                  {gdprStatus.privacy_by_design ? '✅ Implemented' : '❌ Missing'}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">DPIA Conducted:</span>
                <span className={`value ${gdprStatus.data_protection_impact_assessed ? 'yes' : 'no'}`}>
                  {gdprStatus.data_protection_impact_assessed ? '✅ Completed' : '❌ Required'}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Consent Management:</span>
                <span className={`value ${gdprStatus.consent_management_active ? 'yes' : 'no'}`}>
                  {gdprStatus.consent_management_active ? '✅ Active' : '❌ Inactive'}
                </span>
              </div>
            </div>
          </div>

          <div className="status-card">
            <h3>👤 Data Subject Rights</h3>
            <div className="rights-status">
              <div className="right-item">
                <span className="right-name">Right of Access (Art. 15)</span>
                <span className="right-status implemented">✅</span>
              </div>
              <div className="right-item">
                <span className="right-name">Right to Rectification (Art. 16)</span>
                <span className="right-status implemented">✅</span>
              </div>
              <div className="right-item">
                <span className="right-name">Right to Erasure (Art. 17)</span>
                <span className="right-status implemented">✅</span>
              </div>
              <div className="right-item">
                <span className="right-name">Right to Data Portability (Art. 20)</span>
                <span className="right-status implemented">✅</span>
              </div>
              <div className="right-item">
                <span className="right-name">Right to Object (Art. 21)</span>
                <span className="right-status implemented">✅</span>
              </div>
            </div>
          </div>

          <div className="status-card">
            <h3>🔧 Technical Measures</h3>
            <div className="measures-list">
              <div className="measure-item">
                <span className="measure-icon">🔐</span>
                <span className="measure-text">Data Encryption (at rest & in transit)</span>
              </div>
              <div className="measure-item">
                <span className="measure-icon">🎭</span>
                <span className="measure-text">Data Pseudonymization</span>
              </div>
              <div className="measure-item">
                <span className="measure-icon">🛡️</span>
                <span className="measure-text">Access Controls & Authentication</span>
              </div>
              <div className="measure-item">
                <span className="measure-icon">📊</span>
                <span className="measure-text">Regular Security Assessments</span>
              </div>
            </div>
          </div>

          <div className="status-card">
            <h3>📋 Organizational Measures</h3>
            <div className="measures-list">
              <div className="measure-item">
                <span className="measure-icon">📝</span>
                <span className="measure-text">Data Protection Impact Assessments</span>
              </div>
              <div className="measure-item">
                <span className="measure-icon">🎓</span>
                <span className="measure-text">Staff Training on Data Protection</span>
              </div>
              <div className="measure-item">
                <span className="measure-icon">📄</span>
                <span className="measure-text">Data Processing Agreements</span>
              </div>
              <div className="measure-item">
                <span className="measure-icon">🚨</span>
                <span className="measure-text">Incident Response Procedures</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rights-request-section">
        <h3>📝 Data Subject Rights Request</h3>
        <form onSubmit={handleRightsRequest} className="rights-form">
          <div className="form-row">
            <div className="form-group">
              <label>Request Type:</label>
              <select
                value={rightsRequest.type}
                onChange={(e) => setRightsRequest({...rightsRequest, type: e.target.value})}
              >
                <option value="access">Right of Access (Art. 15)</option>
                <option value="rectification">Right to Rectification (Art. 16)</option>
                <option value="erasure">Right to Erasure (Art. 17)</option>
                <option value="portability">Right to Data Portability (Art. 20)</option>
                <option value="object">Right to Object (Art. 21)</option>
              </select>
            </div>
            <div className="form-group">
              <label>User ID:</label>
              <input
                type="text"
                value={rightsRequest.userId}
                onChange={(e) => setRightsRequest({...rightsRequest, userId: e.target.value})}
                placeholder="Enter user identifier"
                required
              />
            </div>
            <div className="form-group">
              <label>Data Type (Optional):</label>
              <select
                value={rightsRequest.dataType}
                onChange={(e) => setRightsRequest({...rightsRequest, dataType: e.target.value})}
              >
                <option value="">All Data Types</option>
                <option value="test_cases">Test Cases</option>
                <option value="requirements">Requirements</option>
                <option value="user_data">User Data</option>
                <option value="audit_logs">Audit Logs</option>
              </select>
            </div>
          </div>
          <button type="submit" className="submit-rights-request">
            📤 Submit Rights Request
          </button>
        </form>
      </div>

      {complianceReport && (
        <div className="compliance-report-section">
          <h3>📊 Detailed Compliance Report</h3>
          <div className="report-grid">
            <div className="report-card">
              <h4>🎯 GDPR Principles</h4>
              <div className="principles-checklist">
                {Object.entries(complianceReport.gdpr_principles_implemented).map(([principle, implemented]) => (
                  <div key={principle} className="principle-item">
                    <span className={`principle-status ${implemented ? 'implemented' : 'missing'}`}>
                      {implemented ? '✅' : '❌'}
                    </span>
                    <span className="principle-name">
                      {principle.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="report-card">
              <h4>🔧 Technical Measures</h4>
              <ul className="measures-checklist">
                {complianceReport.technical_measures.map((measure, index) => (
                  <li key={index} className="measure-implemented">
                    ✅ {measure}
                  </li>
                ))}
              </ul>
            </div>

            <div className="report-card">
              <h4>📋 Organizational Measures</h4>
              <ul className="measures-checklist">
                {complianceReport.organizational_measures.map((measure, index) => (
                  <li key={index} className="measure-implemented">
                    ✅ {measure}
                  </li>
                ))}
              </ul>
            </div>

            <div className="report-card">
              <h4>📞 Contact Information</h4>
              <div className="contact-info">
                <p><strong>DPO:</strong> {complianceReport.dpo_contact}</p>
                <p><strong>Supervisory Authority:</strong> {complianceReport.supervisory_authority}</p>
                <p><strong>Certification:</strong> {complianceReport.compliance_certification}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GDPRDashboard;
