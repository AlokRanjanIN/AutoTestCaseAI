import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getComplianceMatrix } from '../services/api';

const ComplianceMatrix = () => {
  const [matrixData, setMatrixData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStandard, setSelectedStandard] = useState('all');

  const standards = [
    { code: 'FDA', name: 'FDA', color: '#ffc658' },
    { code: 'IEC_62304', name: 'IEC 62304', color: '#ff7300' },
    { code: 'ISO_9001', name: 'ISO 9001', color: '#00ff00' },
    { code: 'ISO_13485', name: 'ISO 13485', color: '#0088fe' },
    { code: 'ISO_27001', name: 'ISO 27001', color: '#00c49f' },
    { code: 'GDPR', name: 'GDPR', color: '#ffbb28' }
  ];

  useEffect(() => {
    loadComplianceMatrix();
  }, []);

  const loadComplianceMatrix = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration - replace with actual API call
      const mockData = {
        FDA: { overall_score: 92, covered_count: 3, total_count: 4, gaps_count: 1 },
        IEC_62304: { overall_score: 70, covered_count: 3, total_count: 4, gaps_count: 1 },
        ISO_9001: { overall_score: 88, covered_count: 2, total_count: 3, gaps_count: 1 },
        ISO_13485: { overall_score: 82, covered_count: 2, total_count: 3, gaps_count: 1 },
        ISO_27001: { overall_score: 90, covered_count: 3, total_count: 4, gaps_count: 1 },
        GDPR: { overall_score: 95, covered_count: 4, total_count: 5, gaps_count: 1 }
      };
      setMatrixData(mockData);
    } catch (err) {
      console.error('Failed to load compliance matrix:', err);
    } finally {
      setLoading(false);
    }
  };

  const getComplianceLevel = (score) => {
    if (score >= 90) return { level: 'Excellent', color: '#22c55e', icon: '🟢' };
    if (score >= 80) return { level: 'Good', color: '#eab308', icon: '🟡' };
    if (score >= 70) return { level: 'Needs Improvement', color: '#f97316', icon: '🟠' };
    return { level: 'Critical', color: '#ef4444', icon: '🔴' };
  };

  const chartData = matrixData ? Object.entries(matrixData).map(([standard, data]) => ({
    name: standards.find(s => s.code === standard)?.name || standard,
    score: data.overall_score,
    covered: data.covered_count,
    total: data.total_count,
    gaps: data.gaps_count
  })) : [];

  const pieData = matrixData ? Object.entries(matrixData).map(([standard, data]) => ({
    name: standards.find(s => s.code === standard)?.name || standard,
    value: data.overall_score,
    color: standards.find(s => s.code === standard)?.color || '#8884d8'
  })) : [];

  if (loading) {
    return (
      <div className="compliance-matrix loading">
        <div className="loading-spinner"></div>
        <p>Loading compliance matrix...</p>
      </div>
    );
  }

  return (
    <div className="compliance-matrix">
      <div className="section-header">
        <h2>📊 Multi-Standard Compliance Matrix</h2>
        <p>Comprehensive compliance analysis across all healthcare and regulatory standards</p>
      </div>

      <div className="matrix-overview">
        <div className="overview-stats">
          <div className="stat-card">
            <span className="stat-value">8</span>
            <span className="stat-label">Standards Covered</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {matrixData ? Math.round(Object.values(matrixData).reduce((sum, data) => sum + data.overall_score, 0) / Object.keys(matrixData).length) : 0}%
            </span>
            <span className="stat-label">Average Compliance</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {matrixData ? Object.values(matrixData).reduce((sum, data) => sum + data.gaps_count, 0) : 0}
            </span>
            <span className="stat-label">Total Gaps</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {matrixData ? Object.values(matrixData).filter(data => data.overall_score >= 80).length : 0}
            </span>
            <span className="stat-label">Standards Above 80%</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>📈 Compliance Scores by Standard</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#8884d8" name="Compliance Score %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>🥧 Compliance Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="standards-grid">
        {matrixData && Object.entries(matrixData).map(([standardCode, data]) => {
          const standard = standards.find(s => s.code === standardCode);
          const compliance = getComplianceLevel(data.overall_score);
          
          return (
            <div key={standardCode} className="standard-card">
              <div className="standard-header">
                <h3>{standard?.name || standardCode}</h3>
                <div className="compliance-badge" style={{ backgroundColor: compliance.color }}>
                  {compliance.icon} {compliance.level}
                </div>
              </div>

              <div className="score-display">
                <div className="score-circle" style={{ borderColor: compliance.color }}>
                  <span className="score-value">{data.overall_score}%</span>
                </div>
                <div className="score-details">
                  <div className="score-item">
                    <span className="label">Covered:</span>
                    <span className="value">{data.covered_count}/{data.total_count}</span>
                  </div>
                  <div className="score-item">
                    <span className="label">Gaps:</span>
                    <span className="value">{data.gaps_count}</span>
                  </div>
                </div>
              </div>

              <div className="standard-description">
                {getStandardDescription(standardCode)}
              </div>

              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${data.overall_score}%`,
                    backgroundColor: compliance.color 
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="recommendations-section">
        <h3>💡 Cross-Standard Recommendations</h3>
        <div className="recommendations-grid">
          <div className="recommendation-card priority-high">
            <h4>🔴 High Priority</h4>
            <ul>
              <li>Address IEC 62304 software lifecycle gaps</li>
              <li>Enhance HITECH breach notification procedures</li>
              <li>Strengthen access control implementations</li>
            </ul>
          </div>
          <div className="recommendation-card priority-medium">
            <h4>🟡 Medium Priority</h4>
            <ul>
              <li>Improve documentation across ISO standards</li>
              <li>Enhance audit trail comprehensiveness</li>
              <li>Strengthen risk management processes</li>
            </ul>
          </div>
          <div className="recommendation-card priority-low">
            <h4>🟢 Low Priority</h4>
            <ul>
              <li>Optimize performance monitoring</li>
              <li>Enhance user training programs</li>
              <li>Improve continuous monitoring</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStandardDescription = (standardCode) => {
  const descriptions = {
    HIPAA: "Health Insurance Portability and Accountability Act - Protects healthcare data privacy and security",
    HITECH: "Health Information Technology for Economic and Clinical Health Act - Enhances HIPAA protections",
    FDA: "Food and Drug Administration regulations for medical device software validation",
    IEC_62304: "International standard for medical device software lifecycle processes",
    ISO_9001: "Quality management systems standard for consistent service delivery",
    ISO_13485: "Quality management systems specific to medical devices",
    ISO_27001: "Information security management systems standard",
    GDPR: "General Data Protection Regulation for EU data privacy and protection"
  };
  return descriptions[standardCode] || "Healthcare compliance standard";
};

export default ComplianceMatrix;
