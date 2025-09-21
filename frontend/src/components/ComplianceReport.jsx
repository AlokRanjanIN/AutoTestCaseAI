import React from 'react';

const ComplianceReport = ({ report }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    return '#dc3545';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Critical';
  };

  return (
    <div className="compliance-report">
      <h2>📊 Compliance Report - {report.standard}</h2>
      
      <div className="compliance-overview">
        <div className="score-display">
          <div 
            className="score-circle"
            style={{ borderColor: getScoreColor(report.overall_score) }}
          >
            <span className="score-value" style={{ color: getScoreColor(report.overall_score) }}>
              {Math.round(report.overall_score)}%
            </span>
            <span className="score-label">{getScoreLabel(report.overall_score)}</span>
          </div>
        </div>

        <div className="compliance-summary">
          <h3>Compliance Status</h3>
          <div className="status-metrics">
            <div className="metric">
              <span className="metric-value">
                {report.requirements.filter(req => req.coverage_status === 'Covered').length}
              </span>
              <span className="metric-label">Requirements Covered</span>
            </div>
            <div className="metric">
              <span className="metric-value">{report.gaps.length}</span>
              <span className="metric-label">Gaps Identified</span>
            </div>
            <div className="metric">
              <span className="metric-value">{report.recommendations.length}</span>
              <span className="metric-label">Recommendations</span>
            </div>
          </div>
        </div>
      </div>

      <div className="compliance-details">
        <div className="requirements-section">
          <h3>📋 Requirements Coverage</h3>
          <div className="requirements-table">
            <div className="table-header">
              <span>Requirement ID</span>
              <span>Description</span>
              <span>Severity</span>
              <span>Status</span>
            </div>
            {report.requirements.map((req, index) => (
              <div key={index} className="table-row">
                <span className="req-id">{req.requirement_id}</span>
                <span className="req-description">{req.description}</span>
                <span className="req-severity">{req.severity}</span>
                <span className={`req-status ${req.coverage_status.toLowerCase().replace(' ', '-')}`}>
                  {req.coverage_status === 'Covered' ? '✅' : '❌'} {req.coverage_status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {report.gaps.length > 0 && (
          <div className="gaps-section">
            <h3>⚠️ Compliance Gaps</h3>
            <ul className="gaps-list">
              {report.gaps.map((gap, index) => (
                <li key={index} className="gap-item">{gap}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="recommendations-section">
          <h3>💡 Recommendations</h3>
          <ul className="recommendations-list">
            {report.recommendations.map((recommendation, index) => (
              <li key={index} className="recommendation-item">{recommendation}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="report-footer">
        <p className="generated-time">
          Generated on: {new Date(report.generated_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ComplianceReport;
