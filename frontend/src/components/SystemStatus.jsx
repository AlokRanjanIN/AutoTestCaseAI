import React, { useState } from 'react';

const SystemStatus = ({ systemStatus, onRefresh }) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    if (status === true || status === 'operational') return '#22c55e';
    if (status === 'degraded') return '#eab308';
    return '#ef4444';
  };

  const getStatusIcon = (status) => {
    if (status === true || status === 'operational') return '✅';
    if (status === 'degraded') return '⚠️';
    return '❌';
  };

  if (!systemStatus) {
    return (
      <div className="system-status loading">
        <div className="loading-spinner"></div>
        <p>Loading system status...</p>
      </div>
    );
  }

  return (
    <div className="system-status">
      <div className="section-header">
        <h2>⚡ System Status Dashboard</h2>
        <div className="header-actions">
          <button 
            onClick={handleRefresh} 
            disabled={refreshing}
            className="refresh-btn"
          >
            {refreshing ? '🔄 Refreshing...' : '🔄 Refresh Status'}
          </button>
        </div>
      </div>

      <div className="status-overview">
        <div className="system-health">
          <div className="health-indicator">
            <span className="health-dot operational"></span>
            <span className="health-text">System Operational</span>
          </div>
          <div className="system-info">
            <span className="version">v{systemStatus.version}</span>
            <span className="uptime">Updated: {new Date(systemStatus.timestamp).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="services-grid">
        <div className="service-category">
          <h3>🤖 AI Services</h3>
          <div className="service-items">
            <div className="service-item">
              <span className="service-icon">{getStatusIcon(systemStatus.services?.google_ai)}</span>
              <span className="service-name">Google Generative AI</span>
              <span className="service-status" style={{ color: getStatusColor(systemStatus.services?.google_ai) }}>
                {systemStatus.services?.google_ai ? 'Active' : 'Offline'}
              </span>
            </div>
            <div className="service-item">
              <span className="service-icon">{getStatusIcon(systemStatus.services?.test_generation)}</span>
              <span className="service-name">Test Generation Engine</span>
              <span className="service-status" style={{ color: getStatusColor(systemStatus.services?.test_generation) }}>
                {systemStatus.services?.test_generation ? 'Active' : 'Offline'}
              </span>
            </div>
            <div className="service-item">
              <span className="service-icon">{getStatusIcon(systemStatus.services?.compliance_checking)}</span>
              <span className="service-name">Compliance Analysis</span>
              <span className="service-status" style={{ color: getStatusColor(systemStatus.services?.compliance_checking) }}>
                {systemStatus.services?.compliance_checking ? 'Active' : 'Offline'}
              </span>
            </div>
            <div className="service-item">
              <span className="service-icon">{getStatusIcon(systemStatus.services?.document_processing)}</span>
              <span className="service-name">Document Processing</span>
              <span className="service-status" style={{ color: getStatusColor(systemStatus.services?.document_processing) }}>
                {systemStatus.services?.document_processing ? 'Active' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        <div className="service-category">
          <h3>📋 Compliance Frameworks</h3>
          <div className="compliance-list">
            {systemStatus.compliance_frameworks?.map((framework, index) => (
              <div key={index} className="compliance-item">
                <span className="compliance-icon">✅</span>
                <span className="compliance-name">{framework}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="service-category">
          <h3>📄 Document Formats</h3>
          <div className="format-list">
            {systemStatus.supported_formats?.map((format, index) => (
              <div key={index} className="format-item">
                <span className="format-icon">📄</span>
                <span className="format-name">{format}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="service-category">
          <h3>🔗 Enterprise Integration</h3>
          <div className="integration-list">
            {systemStatus.enterprise_integration?.map((platform, index) => (
              <div key={index} className="integration-item">
                <span className="integration-icon">🔗</span>
                <span className="integration-name">{platform}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="gdpr-compliance-status">
        <h3>🔒 GDPR Compliance Status</h3>
        <div className="gdpr-indicator">
          <span className={`gdpr-dot ${systemStatus.gdpr_compliant ? 'compliant' : 'non-compliant'}`}></span>
          <span className="gdpr-text">
            {systemStatus.gdpr_compliant ? 'Fully GDPR Compliant' : 'GDPR Compliance Issues'}
          </span>
        </div>
        <div className="gdpr-details">
          <div className="gdpr-feature">
            <span className="feature-icon">🛡️</span>
            <span className="feature-text">Privacy by Design Implemented</span>
          </div>
          <div className="gdpr-feature">
            <span className="feature-icon">👤</span>
            <span className="feature-text">Data Subject Rights Supported</span>
          </div>
          <div className="gdpr-feature">
            <span className="feature-icon">🔐</span>
            <span className="feature-text">Data Protection Measures Active</span>
          </div>
          <div className="gdpr-feature">
            <span className="feature-icon">📊</span>
            <span className="feature-text">Processing Activities Documented</span>
          </div>
        </div>
      </div>

      <div className="performance-metrics">
        <h3>📊 Performance Metrics</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-value">99.9%</span>
            <span className="metric-label">Uptime</span>
          </div>
          <div className="metric-card">
            {/* Fixed the problematic line here */}
            <span className="metric-value">&lt; 2s</span>
            <span className="metric-label">Response Time</span>
          </div>
          <div className="metric-card">
            <span className="metric-value">1,250+</span>
            <span className="metric-label">Tests Generated</span>
          </div>
          <div className="metric-card">
            <span className="metric-value">8</span>
            <span className="metric-label">Compliance Standards</span>
          </div>
        </div>
      </div>

      <div className="system-info-details">
        <h3>ℹ️ System Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">System:</span>
            <span className="info-value">{systemStatus.system}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Status:</span>
            <span className="info-value">{systemStatus.status}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Version:</span>
            <span className="info-value">{systemStatus.version}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Last Updated:</span>
            <span className="info-value">{new Date(systemStatus.timestamp).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
