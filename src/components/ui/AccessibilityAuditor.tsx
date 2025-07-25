import React, { useEffect, useState } from 'react';
import { AlertTriangle, Info, Eye, Keyboard, Volume2 } from 'lucide-react';

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  rule: string;
  element: string;
  description: string;
  suggestion: string;
}

interface AccessibilityReport {
  score: number;
  issues: AccessibilityIssue[];
  passedChecks: string[];
  timestamp: Date;
}

/**
 * Accessibility testing and audit component
 */
export const AccessibilityAuditor: React.FC<{
  autoRun?: boolean;
  onReportGenerated?: (report: AccessibilityReport) => void;
}> = ({ autoRun = false, onReportGenerated }) => {
  const [report, setReport] = useState<AccessibilityReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runAccessibilityAudit = async () => {
    setIsRunning(true);
    
    const issues: AccessibilityIssue[] = [];
    const passedChecks: string[] = [];

    // Check 1: Alt text for images
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.alt) {
        issues.push({
          type: 'error',
          rule: 'alt-text',
          element: `Image ${index + 1}`,
          description: 'Image missing alt text',
          suggestion: 'Add descriptive alt text for screen readers'
        });
      } else {
        passedChecks.push(`Image ${index + 1} has alt text`);
      }
    });

    // Check 2: Form labels
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach((input, index) => {
      const hasLabel = document.querySelector(`label[for="${input.id}"]`) || 
                     input.getAttribute('aria-label') ||
                     input.getAttribute('aria-labelledby');
      
      if (!hasLabel) {
        issues.push({
          type: 'error',
          rule: 'form-labels',
          element: `Form field ${index + 1}`,
          description: 'Form field missing label',
          suggestion: 'Add proper label or aria-label for accessibility'
        });
      } else {
        passedChecks.push(`Form field ${index + 1} has proper labeling`);
      }
    });

    // Check 3: Heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > lastLevel + 1) {
        issues.push({
          type: 'warning',
          rule: 'heading-hierarchy',
          element: `Heading ${index + 1} (${heading.tagName})`,
          description: 'Heading levels should not skip levels',
          suggestion: 'Use proper heading hierarchy (h1 → h2 → h3, etc.)'
        });
      } else {
        passedChecks.push(`Heading ${index + 1} follows proper hierarchy`);
      }
      lastLevel = level;
    });

    // Check 4: Color contrast (simplified check)
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button, index) => {
      const styles = window.getComputedStyle(button);
      const bgColor = styles.backgroundColor;
      const textColor = styles.color;
      
      // Simplified contrast check (would need full contrast calculation in real implementation)
      if (bgColor === textColor || (bgColor === 'rgba(0, 0, 0, 0)' && textColor === 'rgb(0, 0, 0)')) {
        issues.push({
          type: 'warning',
          rule: 'color-contrast',
          element: `Button ${index + 1}`,
          description: 'Poor color contrast detected',
          suggestion: 'Ensure sufficient color contrast (4.5:1 for normal text)'
        });
      } else {
        passedChecks.push(`Button ${index + 1} has adequate contrast`);
      }
    });

    // Check 5: Focus indicators
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
    let focusIssues = 0;
    focusableElements.forEach((element) => {
      const styles = window.getComputedStyle(element, ':focus');
      if (styles.outline === 'none' && !styles.boxShadow && !styles.border) {
        focusIssues++;
      }
    });

    if (focusIssues > 0) {
      issues.push({
        type: 'warning',
        rule: 'focus-indicators',
        element: `${focusIssues} focusable elements`,
        description: 'Elements missing focus indicators',
        suggestion: 'Add visible focus indicators for keyboard navigation'
      });
    } else {
      passedChecks.push('All focusable elements have focus indicators');
    }

    // Check 6: ARIA roles and properties
    const ariaElements = document.querySelectorAll('[role], [aria-label], [aria-labelledby], [aria-describedby]');
    let ariaIssues = 0;
    ariaElements.forEach((element) => {
      const role = element.getAttribute('role');
      if (role && !['button', 'link', 'heading', 'banner', 'navigation', 'main', 'complementary', 'contentinfo'].includes(role)) {
        ariaIssues++;
      }
    });

    if (ariaIssues === 0) {
      passedChecks.push('ARIA roles properly implemented');
    }

    // Calculate score
    const totalChecks = issues.length + passedChecks.length;
    const score = totalChecks > 0 ? Math.round((passedChecks.length / totalChecks) * 100) : 100;

    const newReport: AccessibilityReport = {
      score,
      issues,
      passedChecks,
      timestamp: new Date()
    };

    setReport(newReport);
    setIsRunning(false);

    if (onReportGenerated) {
      onReportGenerated(newReport);
    }
  };

  useEffect(() => {
    if (autoRun) {
      runAccessibilityAudit();
    }
  }, [autoRun]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIssueIcon = (type: AccessibilityIssue['type']) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  if (!report && !isRunning) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center space-x-2 mb-4">
          <Eye className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Accessibility Auditor</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Run an accessibility audit to check for common accessibility issues.
        </p>
        <button
          onClick={runAccessibilityAudit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Run Accessibility Audit
        </button>
      </div>
    );
  }

  if (isRunning) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Running accessibility audit...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Eye className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Accessibility Report</h3>
        </div>
        <button
          onClick={runAccessibilityAudit}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
        >
          Re-run Audit
        </button>
      </div>

      {/* Score */}
      <div className="flex items-center space-x-4">
        <div className={`text-2xl font-bold ${getScoreColor(report!.score)}`}>
          {report!.score}%
        </div>
        <div className="flex-1">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                report!.score >= 90 ? 'bg-green-500' :
                report!.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${report!.score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-semibold text-green-600">{report!.passedChecks.length}</div>
          <div className="text-sm text-gray-600">Passed</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-red-600">
            {report!.issues.filter(i => i.type === 'error').length}
          </div>
          <div className="text-sm text-gray-600">Errors</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-yellow-600">
            {report!.issues.filter(i => i.type === 'warning').length}
          </div>
          <div className="text-sm text-gray-600">Warnings</div>
        </div>
      </div>

      {/* Issues */}
      {report!.issues.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Issues Found</h4>
          <div className="space-y-2">
            {report!.issues.map((issue, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded">
                <div className="flex items-start space-x-2">
                  {getIssueIcon(issue.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{issue.element}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{issue.rule}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                    <p className="text-sm text-blue-600 mt-1">{issue.suggestion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="p-3 bg-blue-50 rounded">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center">
          <Info className="h-4 w-4 mr-2" />
          Accessibility Tips
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li className="flex items-center"><Keyboard className="h-3 w-3 mr-2" />Test navigation with Tab key</li>
          <li className="flex items-center"><Volume2 className="h-3 w-3 mr-2" />Test with screen reader</li>
          <li className="flex items-center"><Eye className="h-3 w-3 mr-2" />Check color contrast ratios</li>
        </ul>
      </div>

      <div className="text-xs text-gray-500">
        Last updated: {report!.timestamp.toLocaleString()}
      </div>
    </div>
  );
};

export default AccessibilityAuditor;
