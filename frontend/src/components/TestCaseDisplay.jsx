import React, { useState } from 'react';

const TestCaseDisplay = ({ testCases }) => {
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [exportFormat, setExportFormat] = useState('junit');

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/export-tests/${exportFormat}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test_cases: testCases }),
      });

      const result = await response.json();
      
      // Create downloadable file
      const blob = new Blob([result.data], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: '#dc3545',
      high: '#fd7e14',
      medium: '#ffc107',
      low: '#28a745'
    };
    return colors[priority] || '#6c757d';
  };

  return (
    <div className="test-case-display">
      <div className="section-header">
        <h2>🧪 Generated Test Cases</h2>
        <div className="export-controls">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
          >
            <option value="junit">JUnit XML</option>
            <option value="cucumber">Cucumber/Gherkin</option>
          </select>
          <button onClick={handleExport} className="export-btn">
            📥 Export {exportFormat.toUpperCase()}
          </button>
        </div>
      </div>

      <div className="test-cases-summary">
        <p><strong>Total Test Cases:</strong> {testCases.length}</p>
        <div className="priority-breakdown">
          {['critical', 'high', 'medium', 'low'].map(priority => {
            const count = testCases.filter(tc => tc.priority === priority).length;
            return count > 0 ? (
              <span key={priority} className="priority-badge" style={{backgroundColor: getPriorityColor(priority)}}>
                {priority}: {count}
              </span>
            ) : null;
          })}
        </div>
      </div>

      <div className="test-cases-grid">
        {testCases.map((testCase, index) => (
          <div key={testCase.id} className="test-case-card">
            <div className="test-case-header">
              <h3>{testCase.title}</h3>
              <div className="test-case-meta">
                <span className="priority" style={{color: getPriorityColor(testCase.priority)}}>
                  {testCase.priority.toUpperCase()}
                </span>
                <span className="test-type">{testCase.test_type}</span>
                <span className="duration">⏱ {testCase.estimated_duration}min</span>
              </div>
            </div>

            <p className="description">{testCase.description}</p>

            <div className="compliance-tags">
              {testCase.compliance_tags.map((tag, idx) => (
                <span key={idx} className="compliance-tag">{tag}</span>
              ))}
            </div>

            <button
              className="view-details-btn"
              onClick={() => setSelectedTestCase(selectedTestCase === testCase.id ? null : testCase.id)}
            >
              {selectedTestCase === testCase.id ? 'Hide Details' : 'View Details'}
            </button>

            {selectedTestCase === testCase.id && (
              <div className="test-case-details">
                <div className="preconditions">
                  <h4>📋 Preconditions:</h4>
                  <ul>
                    {testCase.preconditions.map((condition, idx) => (
                      <li key={idx}>{condition}</li>
                    ))}
                  </ul>
                </div>

                <div className="test-steps">
                  <h4>🔄 Test Steps:</h4>
                  <ol>
                    {testCase.test_steps.map((step, idx) => (
                      <li key={idx}>
                        <strong>Action:</strong> {step.action}<br/>
                        <strong>Expected:</strong> {step.expected_result}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="expected-outcome">
                  <h4>✅ Expected Outcome:</h4>
                  <p>{testCase.expected_outcome}</p>
                </div>

                {testCase.requirements_traceability.length > 0 && (
                  <div className="traceability">
                    <h4>🔗 Requirements Traceability:</h4>
                    <ul>
                      {testCase.requirements_traceability.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestCaseDisplay;
