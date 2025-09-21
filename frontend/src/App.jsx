import React, { useState, useEffect } from 'react';
import RequirementInput from './components/RequirementInput';
import TestCaseDisplay from './components/TestCaseDisplay';
import ComplianceReport from './components/ComplianceReport';
import DocumentProcessor from './components/DocumentProcessor';
import GDPRDashboard from './components/GDPRDashboard';
import SystemStatus from './components/SystemStatus';
import ComplianceMatrix from './components/ComplianceMatrix';
import { generateTestCases, validateRequirements, getSystemStatus } from './services/api';
import './styles/App.css';

function App() {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);
  const [currentView, setCurrentView] = useState('generator');

  useEffect(() => {
    loadSystemStatus();
  }, []);

  const loadSystemStatus = async () => {
    try {
      const status = await getSystemStatus();
      setSystemStatus(status);
    } catch (err) {
      console.error('Failed to load system status:', err);
    }
  };

  const handleGenerateTests = async (requirements, testType, complianceStandard, documentData = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await generateTestCases(requirements, testType, complianceStandard);
      setTestResults({
        ...results,
        documentData: documentData
      });
    } catch (err) {
      setError('Failed to generate test cases. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleValidateRequirements = async (requirements) => {
    try {
      const validation = await validateRequirements(requirements);
      return validation;
    } catch (err) {
      console.error('Validation error:', err);
      return { 
        valid: false, 
        suggestions: ['Validation service unavailable'],
        google_cloud_service: 'Fallback Mode'
      };
    }
  };

  const Navigation = () => (
    <nav className="app-navigation">
      <div className="nav-brand">
        <h1>🏥 Healthcare Test Generator</h1>
        <span className="nav-subtitle">AI-Powered • Google Cloud • Enterprise Ready</span>
      </div>
      <div className="nav-links">
        <button 
          className={`nav-link ${currentView === 'generator' ? 'active' : ''}`}
          onClick={() => setCurrentView('generator')}
        >
          📝 Test Generator
        </button>
        <button 
          className={`nav-link ${currentView === 'documents' ? 'active' : ''}`}
          onClick={() => setCurrentView('documents')}
        >
          📄 Document Processor
        </button>
        <button 
          className={`nav-link ${currentView === 'compliance' ? 'active' : ''}`}
          onClick={() => setCurrentView('compliance')}
        >
          📊 Compliance Matrix
        </button>
        <button 
          className={`nav-link ${currentView === 'gdpr' ? 'active' : ''}`}
          onClick={() => setCurrentView('gdpr')}
        >
          🔒 GDPR Dashboard
        </button>
        <button 
          className={`nav-link ${currentView === 'status' ? 'active' : ''}`}
          onClick={() => setCurrentView('status')}
        >
          ⚡ System Status
        </button>
      </div>
      <div className="nav-status">
        {systemStatus && (
          <div className="status-indicators">
            <span className={`status-dot ${systemStatus.services?.google_ai ? 'active' : 'inactive'}`}></span>
            <span className="status-text">Google AI: {systemStatus.services?.google_ai ? 'Active' : 'Offline'}</span>
            <span className={`status-dot ${systemStatus.gdpr_compliant ? 'active' : 'inactive'}`}></span>
            <span className="status-text">GDPR: {systemStatus.gdpr_compliant ? 'Compliant' : 'Non-compliant'}</span>
          </div>
        )}
      </div>
    </nav>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'documents':
        return <DocumentProcessor onGenerateTests={handleGenerateTests} />;
      case 'compliance':
        return <ComplianceMatrix />;
      case 'gdpr':
        return <GDPRDashboard />;
      case 'status':
        return <SystemStatus systemStatus={systemStatus} onRefresh={loadSystemStatus} />;
      default:
        return (
          <div className="generator-view">
            <RequirementInput
              onGenerateTests={handleGenerateTests}
              onValidateRequirements={handleValidateRequirements}
              loading={loading}
            />
            
            {error && (
              <div className="error-message">
                <p>❌ {error}</p>
              </div>
            )}

            {testResults && (
              <div className="results-section">
                <div className="results-header">
                  <h2>🎯 Generated Results</h2>
                  <div className="results-metadata">
                    <span className="metadata-item">
                      🤖 {testResults.metadata?.google_cloud_ai || 'AI-Powered'}
                    </span>
                    <span className="metadata-item">
                      📋 {testResults.metadata?.compliance_standard || 'Healthcare Compliant'}
                    </span>
                    <span className="metadata-item">
                      🔒 {testResults.metadata?.gdpr_compliant ? 'GDPR Compliant' : 'Privacy Protected'}
                    </span>
                    <span className="metadata-item">
                      ⏰ Generated: {new Date(testResults.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                {testResults.documentData && (
                  <div className="document-info">
                    <h3>📄 Processed Document</h3>
                    <p><strong>Format:</strong> {testResults.documentData.format}</p>
                    <p><strong>Processing Method:</strong> {testResults.documentData.processing_method}</p>
                  </div>
                )}

                <TestCaseDisplay testCases={testResults.test_cases} />
                <ComplianceReport report={testResults.compliance_report} />
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="App">
      <Navigation />

      <main className="main-content">
        <div className="container">
          {renderCurrentView()}
        </div>
      </main>

      <footer className="App-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>🏥 Healthcare Test Generator</h4>
            <p>AI-Powered Test Case Generation for Healthcare Software Compliance</p>
          </div>
          <div className="footer-section">
            <h4>🤖 Google Cloud AI</h4>
            <p>Powered by Gemini 1.5 Pro • BigQuery Analytics • Firestore Storage</p>
          </div>
          <div className="footer-section">
            <h4>🔒 Compliance Standards</h4>
            <p>FDA • IEC 62304 • ISO 9001/13485/27001 • GDPR</p>
          </div>
          <div className="footer-section">
            <h4>🔗 Enterprise Integration</h4>
            <p>Jira • Azure DevOps • Polarion • JUnit • Cucumber</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
