from typing import Dict, List, Optional
import requests
import json
from jira import JIRA
import os

class ALMIntegrationService:
    def __init__(self):
        self.jira_enabled = False
        self.azure_enabled = False
        self.polarion_enabled = False
        
        # Initialize Jira connection
        try:
            jira_url = os.environ.get('JIRA_URL')
            jira_user = os.environ.get('JIRA_USER')  
            jira_token = os.environ.get('JIRA_TOKEN')
            
            if jira_url and jira_user and jira_token:
                self.jira = JIRA(server=jira_url, basic_auth=(jira_user, jira_token))
                self.jira_enabled = True
        except Exception as e:
            print(f"Jira connection failed: {e}")
        
        # Initialize Azure DevOps connection
        try:
            self.azure_url = os.environ.get('AZURE_DEVOPS_URL')
            self.azure_token = os.environ.get('AZURE_DEVOPS_TOKEN')
            if self.azure_url and self.azure_token:
                self.azure_enabled = True
        except Exception as e:
            print(f"Azure DevOps connection failed: {e}")

    def export_to_jira(self, test_cases: List[Dict], project_key: str) -> Dict:
        """Export test cases to Jira"""
        if not self.jira_enabled:
            return {"error": "Jira not configured", "exported_count": 0}
        
        exported_issues = []
        
        try:
            for test_case in test_cases:
                compliance_tags = test_case.get('compliance_tags', [])
                filtered_tags = [tag for tag in compliance_tags if not any(x in tag.upper() for x in ['HIPAA', 'HITECH'])]

                issue_dict = {
                    'project': {'key': project_key},
                    'summary': test_case.get('title', 'Generated Test Case'),
                    'description': self._format_jira_description(test_case),
                    'issuetype': {'name': 'Test'},
                    'labels': filtered_tags,
                    'customfield_healthcare_standard': test_case.get('regulatory_framework', 'FDA')
                }
                
                new_issue = self.jira.create_issue(fields=issue_dict)
                exported_issues.append({
                    'jira_key': new_issue.key,
                    'test_case_id': test_case.get('id'),
                    'url': f"{self.jira._options['server']}/browse/{new_issue.key}"
                })
            
            return {
                "success": True,
                "exported_count": len(exported_issues),
                "jira_issues": exported_issues
            }
            
        except Exception as e:
            return {"error": f"Jira export failed: {str(e)}", "exported_count": 0}

    def export_to_azure_devops(self, test_cases: List[Dict], project: str, team: str) -> Dict:
        """Export test cases to Azure DevOps"""
        if not self.azure_enabled:
            return {"error": "Azure DevOps not configured", "exported_count": 0}
        
        exported_items = []
        
        try:
            headers = {
                'Content-Type': 'application/json-patch+json',
                'Authorization': f'Basic {self.azure_token}'
            }
            
            for test_case in test_cases:
                work_item_data = [
                    {"op": "add", "path": "/fields/System.Title", "value": test_case.get('title')},
                    {"op": "add", "path": "/fields/System.Description", "value": self._format_azure_description(test_case)},
                    {"op": "add", "path": "/fields/Microsoft.VSTS.TCM.Steps", "value": self._format_azure_steps(test_case)},
                    {"op": "add", "path": "/fields/System.Tags", "value": "; ".join(test_case.get('compliance_tags', []))}
                ]
                
                url = f"{self.azure_url}/{project}/_apis/wit/workitems/$Test Case?api-version=6.0"
                response = requests.post(url, headers=headers, json=work_item_data)
                
                if response.status_code == 200:
                    work_item = response.json()
                    exported_items.append({
                        'azure_id': work_item['id'],
                        'test_case_id': test_case.get('id'),
                        'url': work_item['_links']['html']['href']
                    })
            
            return {
                "success": True,
                "exported_count": len(exported_items),
                "azure_work_items": exported_items
            }
            
        except Exception as e:
            return {"error": f"Azure DevOps export failed: {str(e)}", "exported_count": 0}

    def _format_jira_description(self, test_case: Dict) -> str:
        """Format test case for Jira description"""
        description = f"*Test Case Description:* {test_case.get('description', '')}\n\n"
        description += f"*Regulatory Framework:* {test_case.get('regulatory_framework', 'N/A')}\n"
        description += f"*Priority:* {test_case.get('priority', 'Medium')}\n"
        description += f"*Risk Level:* {test_case.get('risk_level', 'Medium')}\n\n"
        
        description += "*Test Steps:*\n"
        for step in test_case.get('test_steps', []):
            description += f"{step.get('step_number', 1)}. {step.get('action', '')}\n"
            description += f"   Expected: {step.get('expected_result', '')}\n"
        
        description += f"\n*Expected Outcome:* {test_case.get('expected_outcome', '')}\n"
        description += f"*Compliance Tags:* {', '.join(test_case.get('compliance_tags', []))}\n"
        
        return description

    def _format_azure_description(self, test_case: Dict) -> str:
        """Format test case for Azure DevOps description"""
        return f"""
        <div>
        <h3>Test Case Description</h3>
        <p>{test_case.get('description', '')}</p>
        
        <h3>Regulatory Framework</h3>
        <p>{test_case.get('regulatory_framework', 'N/A')}</p>
        
        <h3>Expected Outcome</h3>
        <p>{test_case.get('expected_outcome', '')}</p>
        
        <h3>GDPR Considerations</h3>
        <ul>
        {''.join([f'<li>{consideration}</li>' for consideration in test_case.get('gdpr_considerations', [])])}
        </ul>
        </div>
        """

    def _format_azure_steps(self, test_case: Dict) -> str:
        """Format test steps for Azure DevOps"""
        steps_html = "<steps>"
        for step in test_case.get('test_steps', []):
            steps_html += f"""
            <step id="{step.get('step_number', 1)}" type="ActionStep">
                <parameterizedString isformatted="true">
                    <![CDATA[{step.get('action', '')}]]>
                </parameterizedString>
                <parameterizedString isformatted="true">
                    <![CDATA[{step.get('expected_result', '')}]]>
                </parameterizedString>
                <description>
                    <![CDATA[Test Data: {step.get('test_data', 'N/A')}]]>
                </description>
            </step>
            """
        steps_html += "</steps>"
        return steps_html

    def get_integration_status(self) -> Dict:
        """Get ALM integration status"""
        return {
            "jira": {
                "enabled": self.jira_enabled,
                "capabilities": ["Test Case Creation", "Issue Linking", "Custom Fields"] if self.jira_enabled else []
            },
            "azure_devops": {
                "enabled": self.azure_enabled,
                "capabilities": ["Work Item Creation", "Test Case Management", "Traceability"] if self.azure_enabled else []
            },
            "polarion": {
                "enabled": self.polarion_enabled,
                "capabilities": ["Requirements Management", "Test Management"] if self.polarion_enabled else []
            },
            "supported_exports": ["JUnit XML", "Cucumber/Gherkin", "TestNG", "CSV", "Excel"]
        }
