import json
import uuid
import re
from typing import List, Dict
from datetime import datetime
from models import TestCase, TestStep, TestCaseType, Priority
from services.google_ai_service import GoogleCloudAIService

class TestCaseGenerator:
    def __init__(self):
        self.google_ai_service = GoogleCloudAIService()
        
        # Updated healthcare patterns (removed HIPAA-specific terms)
        self.healthcare_patterns = {
            "medical_device": ["medical device", "device software", "clinical device"],
            "authentication": ["login", "access control", "user authentication", "authorization"],
            "data_encryption": ["encryption", "secure transmission", "data protection"],
            "audit_trail": ["audit log", "tracking", "monitoring", "compliance logging"],
            "quality_management": ["quality system", "QMS", "quality control"],
            "risk_management": ["risk management", "hazard analysis", "risk assessment"],
            "validation": ["validation", "verification", "testing", "V&V"]
        }

    async def generate_test_cases(self, requirements: str, test_type: str, compliance_standard: str) -> List[TestCase]:
        """Generate comprehensive test cases from requirements using AI"""
        try:
            # Use rule-based generation as fallback if OpenAI is not available
            if not self.google_ai_service.ai_enabled:
                return self._generate_rule_based_tests(requirements, test_type, compliance_standard)
            
            test_cases_data = await self.google_ai_service.generate_comprehensive_test_cases(
                requirements, test_type, compliance_standard
            )
            
            return self._convert_to_test_cases(test_cases_data, test_type, compliance_standard)
            
        except Exception as e:
            print(f"AI generation failed, using rule-based fallback: {e}")
            return self._generate_rule_based_tests(requirements, test_type, compliance_standard)

    def _generate_rule_based_tests(self, requirements: str, test_type: str, compliance_standard: str) -> List[TestCase]:
        """Generate test cases using rule-based approach as fallback"""
        test_cases = []
        req_lower = requirements.lower()
        
        # Generate FDA-specific tests
        if compliance_standard == "FDA" or "fda" in req_lower or "21 cfr" in req_lower:
            test_cases.append(self._create_fda_test())
        
        # Generate IEC 62304 tests
        if compliance_standard == "IEC_62304" or "iec 62304" in req_lower or "medical device software" in req_lower:
            test_cases.append(self._create_iec62304_test())
            
        # Generate ISO tests
        if compliance_standard in ["ISO_9001", "ISO_13485", "ISO_27001"] or "iso" in req_lower:
            test_cases.append(self._create_iso_test(compliance_standard))
            
        # Generate GDPR tests
        if compliance_standard == "GDPR" or "gdpr" in req_lower or "data protection" in req_lower:
            test_cases.append(self._create_gdpr_test())

        # Generate general healthcare tests
        if any(pattern in req_lower for pattern in self.healthcare_patterns["medical_device"]):
            test_cases.append(self._create_medical_device_test())
            
        return test_cases

    def _create_fda_test(self) -> TestCase:
        return TestCase(
            id=str(uuid.uuid4()),
            title="FDA 21 CFR Part 820 Design Controls Validation",
            description="Verify medical device software meets FDA design control requirements",
            test_type=TestCaseType.COMPLIANCE,
            priority=Priority.CRITICAL,
            preconditions=["FDA design controls implemented", "Validation procedures documented"],
            test_steps=[
                TestStep(1, "Review design control documentation", "Complete design history file available"),
                TestStep(2, "Verify design validation evidence", "Software validation meets 21 CFR 820.30(g)"),
                TestStep(3, "Check risk management integration", "Risk management per ISO 14971 documented"),
                TestStep(4, "Validate change control process", "Design changes controlled per 21 CFR 820.30(i)")
            ],
            expected_outcome="Medical device software meets FDA design control requirements",
            compliance_tags=["FDA-21CFR820.30", "Design-Controls", "Medical-Device"],
            requirements_traceability=["REQ-FDA-001"],
            created_at=datetime.utcnow().isoformat(),
            estimated_duration=45
        )

    def _create_iec62304_test(self) -> TestCase:
        return TestCase(
            id=str(uuid.uuid4()),
            title="IEC 62304 Software Lifecycle Process Validation",
            description="Verify software development follows IEC 62304 lifecycle processes",
            test_type=TestCaseType.COMPLIANCE,
            priority=Priority.HIGH,
            preconditions=["IEC 62304 processes implemented", "Software safety classification completed"],
            test_steps=[
                TestStep(1, "Verify software development planning", "Development plan per IEC 62304-5.1 exists"),
                TestStep(2, "Check requirements analysis", "Requirements analysis per IEC 62304-5.2 documented"),
                TestStep(3, "Validate integration testing", "Integration testing per IEC 62304-5.5 completed"),
                TestStep(4, "Verify risk management activities", "Risk management per IEC 62304-7.1 integrated")
            ],
            expected_outcome="Software development complies with IEC 62304 lifecycle processes",
            compliance_tags=["IEC62304", "Software-Lifecycle", "Medical-Device-Software"],
            requirements_traceability=["REQ-IEC62304-001"],
            created_at=datetime.utcnow().isoformat(),
            estimated_duration=60
        )

    def _create_iso_test(self, standard: str) -> TestCase:
        standard_details = {
            "ISO_9001": {
                "title": "ISO 9001 Quality Management System Validation",
                "description": "Verify quality management system meets ISO 9001 requirements",
                "tags": ["ISO9001", "QMS", "Quality-Management"]
            },
            "ISO_13485": {
                "title": "ISO 13485 Medical Device QMS Validation", 
                "description": "Verify medical device quality management system per ISO 13485",
                "tags": ["ISO13485", "Medical-Device-QMS", "Quality-System"]
            },
            "ISO_27001": {
                "title": "ISO 27001 Information Security Management Validation",
                "description": "Verify information security management system per ISO 27001",
                "tags": ["ISO27001", "ISMS", "Information-Security"]
            }
        }
        
        details = standard_details.get(standard, standard_details["ISO_9001"])
        
        return TestCase(
            id=str(uuid.uuid4()),
            title=details["title"],
            description=details["description"],
            test_type=TestCaseType.COMPLIANCE,
            priority=Priority.HIGH,
            preconditions=[f"{standard} system implemented", "Documentation and procedures available"],
            test_steps=[
                TestStep(1, f"Review {standard} documentation", "Complete documentation per standard requirements"),
                TestStep(2, f"Verify {standard} processes", "All required processes implemented and operational"),
                TestStep(3, f"Check {standard} monitoring", "Monitoring and measurement activities active"),
                TestStep(4, f"Validate {standard} improvement", "Continual improvement process demonstrated")
            ],
            expected_outcome=f"System meets {standard} requirements with documented evidence",
            compliance_tags=details["tags"],
            requirements_traceability=[f"REQ-{standard}-001"],
            created_at=datetime.utcnow().isoformat(),
            estimated_duration=40
        )

    def _create_gdpr_test(self) -> TestCase:
        return TestCase(
            id=str(uuid.uuid4()),
            title="GDPR Data Protection Compliance Validation",
            description="Verify data processing meets GDPR requirements for healthcare data",
            test_type=TestCaseType.COMPLIANCE,
            priority=Priority.CRITICAL,
            preconditions=["GDPR compliance framework implemented", "Privacy by design integrated"],
            test_steps=[
                TestStep(1, "Verify privacy by design implementation", "Privacy by design per Article 25 implemented"),
                TestStep(2, "Check data subject rights support", "Rights per Articles 15-22 supported"),
                TestStep(3, "Validate consent management", "Consent management per Article 7 operational"),
                TestStep(4, "Review data processing documentation", "Processing activities per Article 30 documented")
            ],
            expected_outcome="Data processing fully complies with GDPR requirements",
            compliance_tags=["GDPR", "Data-Protection", "Privacy-by-Design"],
            requirements_traceability=["REQ-GDPR-001"],
            created_at=datetime.utcnow().isoformat(),
            estimated_duration=35
        )

    def _create_medical_device_test(self) -> TestCase:
        return TestCase(
            id=str(uuid.uuid4()),
            title="Medical Device Software Validation",
            description="Comprehensive validation of medical device software functionality and safety",
            test_type=TestCaseType.FUNCTIONAL,
            priority=Priority.CRITICAL,
            preconditions=["Medical device software installed", "Test data and environment prepared"],
            test_steps=[
                TestStep(1, "Verify core medical device functions", "All intended medical functions operate correctly"),
                TestStep(2, "Test safety-critical features", "Safety-critical functions meet safety requirements"),
                TestStep(3, "Validate user interface for clinical use", "UI suitable for healthcare professional use"),
                TestStep(4, "Check integration with medical systems", "Proper integration with hospital/clinic systems")
            ],
            expected_outcome="Medical device software meets functional and safety requirements",
            compliance_tags=["Medical-Device", "Safety-Critical", "Clinical-Use"],
            requirements_traceability=["REQ-DEVICE-001"],
            created_at=datetime.utcnow().isoformat(),
            estimated_duration=90
        )

    def validate_requirements(self, requirements: str) -> Dict:
        """Validate requirements completeness"""
        validation_result = {
            "valid": True,
            "suggestions": [],
            "completeness_score": 0,
            "missing_elements": []
        }
        
        # Updated required elements (removed HIPAA-specific)
        required_elements = [
            ("functional requirements", r"(shall|must|should).*(function|feature|capability)"),
            ("acceptance criteria", r"(accept|criteria|condition)"),
            ("user roles", r"(user|role|actor|stakeholder)"),
            ("data requirements", r"(data|information|record)"),
            ("quality requirements", r"(quality|performance|reliability)"),
            ("regulatory requirements", r"(fda|iec|iso|gdpr|regulation|compliance)")
        ]
        
        found_elements = 0
        for element_name, pattern in required_elements:
            if re.search(pattern, requirements, re.IGNORECASE):
                found_elements += 1
            else:
                validation_result["missing_elements"].append(element_name)
        
        validation_result["completeness_score"] = (found_elements / len(required_elements)) * 100
        
        if validation_result["completeness_score"] < 70:
            validation_result["valid"] = False
            validation_result["suggestions"].append("Requirements appear incomplete. Consider adding more detailed functional specifications.")
        
        # Healthcare-specific validation (updated keywords)
        healthcare_keywords = ["medical device", "clinical", "healthcare", "patient", "quality", "safety", "regulatory", "fda", "iso", "gdpr"]
        if not any(keyword in requirements.lower() for keyword in healthcare_keywords):
            validation_result["suggestions"].append("Consider adding healthcare-specific context and regulatory compliance requirements.")
        
        return validation_result

    def export_to_junit(self, test_cases: List[Dict]) -> str:
        """Export to JUnit XML format"""
        xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml += f'<testsuite name="HealthcareTests" tests="{len(test_cases)}">\n'
        
        for test_case in test_cases:
            xml += f'  <testcase name="{test_case["title"]}" classname="Healthcare">\n'
            xml += f'    <system-out>{test_case["description"]}</system-out>\n'
            xml += '  </testcase>\n'
        
        xml += '</testsuite>'
        return xml

    def export_to_cucumber(self, test_cases: List[Dict]) -> str:
        """Export to Cucumber/Gherkin format"""
        content = "Feature: Healthcare Application Testing\n\n"
        
        for test_case in test_cases:
            content += f"  Scenario: {test_case['title']}\n"
            content += f"    Given the system is ready\n"
            
            for step in test_case['test_steps']:
                content += f"    When {step['action']}\n"
                content += f"    Then {step['expected_result']}\n"
            
            content += "\n"
        
        return content
