import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { processDocument } from '../services/api';

const DocumentProcessor = ({ onGenerateTests }) => {
  const [processing, setProcessing] = useState(false);
  const [processedDocument, setProcessedDocument] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setProcessing(true);
    setError(null);

    try {
      const result = await processDocument(file);
      setProcessedDocument(result);
    } catch (err) {
      setError(`Failed to process document: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/xml': ['.xml'],
      'text/html': ['.html'],
      'text/markdown': ['.md']
    },
    maxFiles: 1
  });

  const handleGenerateFromDocument = () => {
    if (processedDocument && processedDocument.result.extracted_text) {
      onGenerateTests(
        processedDocument.result.extracted_text,
        'functional',
        'HIPAA',
        {
          filename: processedDocument.filename,
          format: processedDocument.result.metadata.format,
          processing_method: 'Google Cloud AI Document Processing'
        }
      );
    }
  };

  return (
    <div className="document-processor">
      <div className="section-header">
        <h2>📄 Document Processor</h2>
        <p>Upload healthcare specifications in multiple formats for AI-powered test case generation</p>
      </div>

      <div className="supported-formats">
        <h3>📋 Supported Formats</h3>
        <div className="format-grid">
          <div className="format-item">
            <span className="format-icon">📄</span>
            <span className="format-name">PDF Documents</span>
            <span className="format-desc">Requirements specs, compliance docs</span>
          </div>
          <div className="format-item">
            <span className="format-icon">📝</span>
            <span className="format-name">Word Documents</span>
            <span className="format-desc">.doc, .docx format specifications</span>
          </div>
          <div className="format-item">
            <span className="format-icon">🔗</span>
            <span className="format-name">XML Files</span>
            <span className="format-desc">Structured requirement data</span>
          </div>
          <div className="format-item">
            <span className="format-icon">🌐</span>
            <span className="format-name">HTML/Markdown</span>
            <span className="format-desc">Web-based documentation</span>
          </div>
        </div>
      </div>

      <div className="upload-section">
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''} ${processing ? 'processing' : ''}`}>
          <input {...getInputProps()} />
          {processing ? (
            <div className="processing-state">
              <div className="loading-spinner large"></div>
              <p>🤖 Processing document with Google Cloud AI...</p>
              <small>Extracting text, analyzing structure, and preparing for test generation</small>
            </div>
          ) : isDragActive ? (
            <div className="drag-state">
              <p>📁 Drop your healthcare document here...</p>
            </div>
          ) : (
            <div className="idle-state">
              <div className="upload-icon">📤</div>
              <p><strong>Click to select</strong> or <strong>drag & drop</strong> your healthcare document</p>
              <small>PDF, Word, XML, HTML, Markdown files supported • Max 10MB</small>
              <div className="upload-features">
                <span className="feature">🤖 AI-Powered Extraction</span>
                <span className="feature">🔒 GDPR Compliant</span>
                <span className="feature">⚡ Real-time Processing</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      {processedDocument && (
        <div className="processed-document">
          <div className="document-info">
            <h3>✅ Document Processed Successfully</h3>
            <div className="document-metadata">
              <div className="metadata-item">
                <span className="label">📄 File:</span>
                <span className="value">{processedDocument.filename}</span>
              </div>
              <div className="metadata-item">
                <span className="label">📋 Format:</span>
                <span className="value">{processedDocument.result.metadata.format}</span>
              </div>
              <div className="metadata-item">
                <span className="label">⏰ Processed:</span>
                <span className="value">{new Date(processedDocument.processed_at).toLocaleString()}</span>
              </div>
              <div className="metadata-item">
                <span className="label">🤖 AI Service:</span>
                <span className="value">{processedDocument.google_cloud_service}</span>
              </div>
              <div className="metadata-item">
                <span className="label">🔒 GDPR:</span>
                <span className="value">{processedDocument.gdpr_compliant ? 'Compliant' : 'Standard'}</span>
              </div>
            </div>
          </div>

          <div className="extracted-content">
            <h4>📖 Extracted Content Preview</h4>
            <div className="content-preview">
              <pre>{processedDocument.result.extracted_text?.substring(0, 500)}...</pre>
            </div>
            <div className="content-stats">
              <span>Characters: {processedDocument.result.extracted_text?.length || 0}</span>
              <span>Words: {processedDocument.result.extracted_text?.split(/\s+/).length || 0}</span>
            </div>
          </div>

          <div className="action-buttons">
            <button 
              onClick={handleGenerateFromDocument}
              className="generate-btn primary"
            >
              🚀 Generate Test Cases from Document
            </button>
            <button 
              onClick={() => setProcessedDocument(null)}
              className="clear-btn secondary"
            >
              🗑️ Clear and Process New Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentProcessor;
