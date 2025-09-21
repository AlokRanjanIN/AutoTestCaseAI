from dataclasses import dataclass, asdict
from typing import List, Dict, Optional
from datetime import datetime
from enum import Enum

class TestCaseType(Enum):
    FUNCTIONAL = "functional"
    SECURITY = "security"
    PERFORMANCE = "performance"
    COMPLIANCE = "compliance"

class Priority(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

@dataclass
class TestStep:
    step_number: int
    action: str
    expected_result: str
    test_data: Optional[str] = None

    def to_dict(self):
        return asdict(self)

@dataclass
class TestCase:
    id: str
    title: str
    description: str
    test_type: TestCaseType
    priority: Priority
    preconditions: List[str]
    test_steps: List[TestStep]
    expected_outcome: str
    compliance_tags: List[str]
    requirements_traceability: List[str]
    created_at: str
    estimated_duration: int

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "test_type": self.test_type.value,
            "priority": self.priority.value,
            "preconditions": self.preconditions,
            "test_steps": [step.to_dict() for step in self.test_steps],
            "expected_outcome": self.expected_outcome,
            "compliance_tags": self.compliance_tags,
            "requirements_traceability": self.requirements_traceability,
            "created_at": self.created_at,
            "estimated_duration": self.estimated_duration
        }

@dataclass
class ComplianceReport:
    standard: str
    overall_score: float
    requirements: List[Dict]
    recommendations: List[str]
    gaps: List[str]
    generated_at: str

    def to_dict(self):
        return asdict(self)
