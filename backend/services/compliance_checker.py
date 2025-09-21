from typing import List, Dict
from datetime import datetime
from models import ComplianceReport
from services.google_ai_service import GoogleCloudAIService

class ComplianceChecker:
    def __init__(self):
        self.google_ai_service = GoogleCloudAIService()
        
        # Comprehensive healthcare compliance standards
        self.standards = {
            "FDA": {
                "requirements": [
                    {"id": "21CFR820.30", "description": "Design Controls", "severity": "Required"},
                    {"id": "21CFR820.75", "description": "Process Validation", "severity": "Required"},
                    {"id": "21CFR11.10", "description": "Electronic Records", "severity": "Required"},
                    {"id": "21CFR11.50", "description": "Electronic Signatures", "severity": "Required"}
                ]
            },
            "IEC_62304": {
                "requirements": [
                    {"id": "IEC62304-5.1", "description": "Software Development Planning", "severity": "Required"},
                    {"id": "IEC62304-5.2", "description": "Software Requirements Analysis", "severity": "Required"},
                    {"id": "IEC62304-5.5", "description": "Software Integration Testing", "severity": "Required"},
                    {"id": "IEC62304-7.1", "description": "Software Risk Management", "severity": "Required"}
                ]
            },
            "ISO_9001": {
                "requirements": [
                    {"id": "ISO9001-4.4", "description": "Quality Management System", "severity": "Required"},
                    {"id": "ISO9001-8.2", "description": "Monitoring and Measurement", "severity": "Required"},
                    {"id": "ISO9001-8.5", "description": "Improvement", "severity": "Required"}
                ]
            },
            "ISO_13485": {
                "requirements": [
                    {"id": "ISO13485-4.2", "description": "Documentation Requirements", "severity": "Required"},
                    {"id": "ISO13485-7.3", "description": "Design and Development", "severity": "Required"},
                    {"id": "ISO13485-8.2", "description": "Monitoring and Measurement", "severity": "Required"}
                ]
            },
            "ISO_27001": {
                "requirements": [
                    {"id": "ISO27001-A.9", "description": "Access Control", "severity": "Required"},
                    {"id": "ISO27001-A.10", "description": "Cryptography", "severity": "Required"},
                    {"id": "ISO27001-A.12", "description": "Operations Security", "severity": "Required"},
                    {"id": "ISO27001-A.18", "description": "Compliance", "severity": "Required"}
                ]
            },
            "GDPR": {
                "requirements": [
                    {"id": "GDPR-Art.5", "description": "Principles of Processing", "severity": "Required"},
                    {"id": "GDPR-Art.6", "description": "Lawfulness of Processing", "severity": "Required"},
                    {"id": "GDPR-Art.25", "description": "Privacy by Design", "severity": "Required"},
                    {"id": "GDPR-Art.32", "description": "Security of Processing", "severity": "Required"},
                    {"id": "GDPR-Art.35", "description": "Data Protection Impact Assessment", "severity": "Required"}
                ]
            }
        }

    async def check_compliance_with_ai(self, requirements: str, test_cases: List, standard: str) -> ComplianceReport:
        """Check compliance using Google Cloud AI analysis"""
        
        try:
            # Use Google AI for advanced gap analysis
            ai_analysis = await self.google_ai_service.analyze_compliance_gaps(
                requirements, 
                [tc.to_dict() if hasattr(tc, 'to_dict') else tc for tc in test_cases], 
                standard
            )
            
            # Convert AI analysis to ComplianceReport format
            if ai_analysis.get("google_ai_analysis", False):
                compliance_reqs = []
                
                # Get standard requirements
                standard_reqs = self.standards.get(standard, {}).get("requirements", [])
                
                for req in standard_reqs:
                    # Check if requirement is covered by AI analysis
                    covered_reqs = ai_analysis.get("covered_requirements", [])
                    missing_coverage = ai_analysis.get("missing_coverage", [])
                    
                    # Determine coverage status based on AI analysis
                    if any(req["description"] in covered_req for covered_req in covered_reqs):
                        coverage_status = "Covered"
                    elif any(req["description"] in missing for missing in missing_coverage):
                        coverage_status = "Not Covered"
                    else:
                        coverage_status = "Partially Covered"
                    
                    compliance_reqs.append({
                        "standard": standard,
                        "requirement_id": req["id"],
                        "description": req["description"],
                        "severity": req["severity"],
                        "coverage_status": coverage_status
                    })
                
                return ComplianceReport(
                    standard=standard,
                    overall_score=ai_analysis.get("overall_compliance_score", 70),
                    requirements=compliance_reqs,
                    recommendations=ai_analysis.get("recommendations", []),
                    gaps=ai_analysis.get("missing_coverage", []),
                    generated_at=datetime.utcnow().isoformat()
                )
            else:
                # Fallback to traditional analysis
                return self.check_compliance(requirements, test_cases, standard)
                
        except Exception as e:
            print(f"AI compliance analysis failed: {e}")
            return self.check_compliance(requirements, test_cases, standard)

    def check_compliance(self, requirements: str, test_cases: List, standard: str) -> ComplianceReport:
        """Traditional compliance checking (fallback)"""
        
        compliance_reqs = []
        covered_requirements = 0
        total_requirements = len(self.standards.get(standard, {}).get("requirements", []))
        
        for req in self.standards.get(standard, {}).get("requirements", []):
            coverage_status = "Covered" if self._is_requirement_covered(req, test_cases) else "Not Covered"
            if coverage_status == "Covered":
                covered_requirements += 1
                
            compliance_reqs.append({
                "standard": standard,
                "requirement_id": req["id"],
                "description": req["description"],
                "severity": req["severity"],
                "coverage_status": coverage_status
            })
        
        overall_score = (covered_requirements / total_requirements * 100) if total_requirements > 0 else 0
        
        recommendations = self._generate_recommendations(overall_score, standard)
        gaps = self._identify_gaps(compliance_reqs)
        
        return ComplianceReport(
            standard=standard,
            overall_score=overall_score,
            requirements=compliance_reqs,
            recommendations=recommendations,
            gaps=gaps,
            generated_at=datetime.utcnow().isoformat()
        )

    def _is_requirement_covered(self, requirement: Dict, test_cases: List) -> bool:
        """Check if a compliance requirement is covered by test cases"""
        
        # Enhanced keyword mapping for all standards
        req_keywords = {
            # HIPAA Keywords
            "Access Control": ["authentication", "access", "login", "authorization", "user management"],
            "Transmission Security": ["encryption", "secure", "transmission", "ssl", "tls", "https"],
            "Security Officer": ["admin", "security", "officer", "administrator", "security role"],
            "Audit Controls": ["audit", "log", "tracking", "monitoring", "compliance logging"],
            "Minimum Necessary": ["minimum necessary", "role-based", "least privilege", "data minimization"],
            "Information Access Management": ["access management", "user permissions", "role assignment"],
            
            # HITECH Keywords  
            "Breach Notification": ["breach", "notification", "alert", "incident", "security breach"],
            "Encryption Requirements": ["encryption", "cryptographic", "data protection", "secure storage"],
            
            # FDA Keywords
            "Design Controls": ["design", "validation", "verification", "requirements traceability"],
            "Process Validation": ["process validation", "testing", "quality assurance"],
            "Electronic Records": ["electronic records", "data integrity", "record keeping"],
            "Electronic Signatures": ["digital signature", "electronic signature", "authentication"],
            
            # IEC 62304 Keywords
            "Software Development Planning": ["development plan", "lifecycle", "planning", "project management"],
            "Software Requirements Analysis": ["requirements analysis", "specification", "functional requirements"],
            "Software Integration Testing": ["integration testing", "system testing", "validation"],
            "Software Risk Management": ["risk management", "hazard analysis", "risk assessment"],
            
            # ISO 9001 Keywords
            "Quality Management System": ["quality management", "QMS", "process control"],
            "Monitoring and Measurement": ["monitoring", "measurement", "performance evaluation"],
            "Improvement": ["continuous improvement", "corrective action", "preventive action"],
            
            # ISO 13485 Keywords
            "Documentation Requirements": ["documentation", "document control", "records management"],
            "Design and Development": ["design control", "development process", "product realization"],
            
            # ISO 27001 Keywords
            "Cryptography": ["cryptography", "encryption", "key management", "crypto controls"],
            "Operations Security": ["operations security", "secure operations", "operational procedures"],
            "Compliance": ["compliance", "regulatory", "legal requirements", "audit"],
            
            # GDPR Keywords
            "Principles of Processing": ["data minimization", "purpose limitation", "lawfulness"],
            "Lawfulness of Processing": ["lawful basis", "consent", "legitimate interest"],
            "Privacy by Design": ["privacy by design", "data protection by design", "privacy engineering"],
            "Security of Processing": ["data security", "technical measures", "organizational measures"],
            "Data Protection Impact Assessment": ["DPIA", "impact assessment", "privacy assessment"]
        }
        
        keywords = req_keywords.get(requirement["description"], [requirement["description"].lower()])
        
        for test_case in test_cases:
            if hasattr(test_case, 'title') and hasattr(test_case, 'description'):
                test_content = f"{test_case.title} {test_case.description}".lower()
            elif isinstance(test_case, dict):
                test_content = f"{test_case.get('title', '')} {test_case.get('description', '')}".lower()
            else:
                continue
                
            if any(keyword.lower() in test_content for keyword in keywords):
                return True
        
        return False

    def _generate_recommendations(self, score: float, standard: str) -> List[str]:
        """Generate compliance recommendations"""
        recommendations = []
        
        if score < 50:
            recommendations.extend([
                f"Critical: {standard} compliance is significantly below requirements",
                "Immediate action required to address compliance gaps",
                "Conduct comprehensive risk assessment",
                "Implement emergency compliance measures"
            ])
        elif score < 80:
            recommendations.extend([
                f"Warning: {standard} compliance needs improvement", 
                "Review and enhance existing security controls",
                "Strengthen audit and monitoring capabilities",
                "Update policies and procedures"
            ])
        else:
            recommendations.extend([
                f"Good: {standard} compliance is on track",
                "Continue monitoring and maintaining current standards",
                "Consider advanced security enhancements"
            ])
        
        # Standard-specific recommendations
        standard_recommendations = {
            "HIPAA": [
                "Ensure Business Associate Agreements are in place",
                "Implement minimum necessary access principles", 
                "Regular security awareness training for workforce"
            ],
            "FDA": [
                "Validate all computerized systems used in clinical trials",
                "Implement electronic signature controls",
                "Ensure data integrity throughout system lifecycle"
            ],
            "IEC_62304": [
                "Implement software lifecycle processes per IEC 62304",
                "Conduct software risk management activities",
                "Maintain software configuration management"
            ],
            "ISO_27001": [
                "Implement information security management system",
                "Conduct regular security risk assessments",
                "Maintain security incident response procedures"
            ],
            "GDPR": [
                "Implement privacy by design principles",
                "Conduct data protection impact assessments",
                "Ensure data subject rights are supported"
            ]
        }
        
        if standard in standard_recommendations:
            recommendations.extend(standard_recommendations[standard])
        
        recommendations.extend([
            "Regular compliance audits recommended",
            "Document all security measures and procedures",
            "Maintain incident response procedures"
        ])
        
        return recommendations

    def _identify_gaps(self, compliance_reqs: List[Dict]) -> List[str]:
        """Identify compliance gaps"""
        gaps = []
        
        for req in compliance_reqs:
            if req["coverage_status"] == "Not Covered":
                gaps.append(f"{req['requirement_id']}: {req['description']}")
        
        return gaps

    def get_supported_standards(self) -> List[str]:
        """Get list of supported compliance standards"""
        return list(self.standards.keys())

    def get_standard_details(self, standard: str) -> Dict:
        """Get detailed information about a specific standard"""
        return self.standards.get(standard, {})

    def get_compliance_matrix(self, requirements: str, test_cases: List) -> Dict[str, Dict]:
        """Generate compliance matrix across all standards"""
        matrix = {}
        
        for standard in self.standards.keys():
            try:
                compliance_report = self.check_compliance(requirements, test_cases, standard)
                matrix[standard] = {
                    "overall_score": compliance_report.overall_score,
                    "covered_count": len([req for req in compliance_report.requirements if req["coverage_status"] == "Covered"]),
                    "total_count": len(compliance_report.requirements),
                    "gaps_count": len(compliance_report.gaps)
                }
            except Exception as e:
                matrix[standard] = {
                    "error": f"Analysis failed: {str(e)}",
                    "overall_score": 0
                }
        
        return matrix
