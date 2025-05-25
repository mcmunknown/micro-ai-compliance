import { SCAN_TYPES } from './credits'
import { AuditAnalysisResult, isValidAnalysisResult, generateRedFlagId } from './types/analysis'

const STRUCTURED_PROMPTS = {
  basic: {
    systemPrompt: `You are an ATO/IRS audit risk analyzer. Return ONLY valid JSON matching this exact structure. Do not include any other text, explanations, or markdown:

{
  "summary": {
    "auditRiskScore": <number 0-100>,
    "auditProbability": "<number>% chance of audit",
    "riskLevel": "<LOW|MEDIUM|HIGH|CRITICAL>",
    "estimatedPenalties": {
      "minimum": <number>,
      "maximum": <number>,
      "likely": <number>
    },
    "complianceScore": <number 0-100>
  },
  "redFlags": [
    {
      "id": "<unique_id>",
      "severity": "<LOW|MEDIUM|HIGH|CRITICAL>",
      "type": "<CASH_THRESHOLD|MISSING_REPORT|GST_MISMATCH|INCOME_SPIKE|DEDUCTION_ANOMALY>",
      "originalText": "<exact text from document>",
      "issue": "<specific problem description>",
      "taxCodeViolation": "<specific tax code section>",
      "penalty": {
        "amount": <number>,
        "calculation": "<how penalty was calculated>",
        "statutory": "<law reference>"
      },
      "fix": {
        "action": "<specific action to fix>",
        "deadline": "<ISO date string>",
        "form": "<form number if applicable>"
      }
    }
  ],
  "recommendations": [
    {
      "priority": "<IMMEDIATE|URGENT|MEDIUM|LOW>",
      "action": "<specific action>",
      "reason": "<why this is needed>",
      "deadline": "<ISO date string if applicable>",
      "estimatedTime": "<time to complete>",
      "difficulty": "<EASY|MODERATE|COMPLEX>",
      "professionalRequired": <true|false>
    }
  ],
  "timeline": [
    {
      "id": "<unique_id>",
      "title": "<task title>",
      "description": "<task description>",
      "deadline": "<ISO date string>",
      "priority": "<IMMEDIATE|URGENT|MEDIUM|LOW>",
      "status": "PENDING",
      "estimatedTime": "<time estimate>",
      "relatedRedFlag": "<red flag id if applicable>"
    }
  ],
  "requiredForms": [
    {
      "formNumber": "<form number>",
      "name": "<form name>",
      "deadline": "<ISO date string>",
      "penalty": <number>,
      "description": "<what this form is for>",
      "filingMethod": "<ONLINE|PAPER|BOTH>"
    }
  ]
}`,
    userPrompt: `Analyze this document for ATO/IRS audit risks. Focus on:
- Cash transactions over $10,000 (AUSTRAC/FinCEN reporting)
- Unexplained income changes >20%
- Missing required reports
- GST/Sales tax mismatches
- International transfers
- Unusual deduction patterns

Document content:
{text}`
  },
  deep: {
    systemPrompt: `You are a senior tax compliance auditor. Return ONLY valid JSON matching this exact structure. Provide detailed forensic analysis:

{
  "summary": {
    "auditRiskScore": <number 0-100>,
    "auditProbability": "<number>% chance of audit within 2 years",
    "riskLevel": "<LOW|MEDIUM|HIGH|CRITICAL>",
    "estimatedPenalties": {
      "minimum": <number>,
      "maximum": <number>,
      "likely": <number>
    },
    "complianceScore": <number 0-100>
  },
  "redFlags": [
    {
      "id": "<unique_id>",
      "severity": "<LOW|MEDIUM|HIGH|CRITICAL>",
      "type": "<detailed violation type>",
      "originalText": "<exact problematic text>",
      "issue": "<specific compliance violation>",
      "taxCodeViolation": "<specific code section with details>",
      "penalty": {
        "amount": <calculated penalty amount>,
        "calculation": "<detailed penalty calculation>",
        "statutory": "<complete legal reference>"
      },
      "fix": {
        "action": "<detailed remediation steps>",
        "deadline": "<ISO date string>",
        "form": "<specific form needed>"
      }
    }
  ],
  "recommendations": [
    {
      "priority": "<IMMEDIATE|URGENT|MEDIUM|LOW>",
      "action": "<detailed specific action>",
      "reason": "<detailed justification>",
      "deadline": "<ISO date string if applicable>",
      "estimatedTime": "<detailed time estimate>",
      "difficulty": "<EASY|MODERATE|COMPLEX>",
      "professionalRequired": <true|false>
    }
  ],
  "timeline": [
    {
      "id": "<unique_id>",
      "title": "<detailed task title>",
      "description": "<comprehensive task description>",
      "deadline": "<ISO date string>",
      "priority": "<IMMEDIATE|URGENT|MEDIUM|LOW>",
      "status": "PENDING",
      "estimatedTime": "<detailed time estimate>",
      "relatedRedFlag": "<red flag id if applicable>"
    }
  ],
  "requiredForms": [
    {
      "formNumber": "<complete form number>",
      "name": "<full official form name>",
      "deadline": "<ISO date string>",
      "penalty": <specific penalty amount>,
      "description": "<detailed explanation of form purpose>",
      "filingMethod": "<ONLINE|PAPER|BOTH>"
    }
  ]
}`,
    userPrompt: `Perform detailed forensic analysis of this document for tax compliance. Examine:
- All cash transactions and reporting requirements
- Income patterns and anomalies
- Deduction legitimacy and documentation
- International compliance obligations
- Related party transactions
- Industry-specific regulations

Document content:
{text}`
  },
  ultra: {
    systemPrompt: `You are a forensic tax compliance expert. Return ONLY valid JSON with comprehensive analysis:

{
  "summary": {
    "auditRiskScore": <number 0-100>,
    "auditProbability": "<number>% probability of audit selection",
    "riskLevel": "<LOW|MEDIUM|HIGH|CRITICAL>",
    "estimatedPenalties": {
      "minimum": <conservative estimate>,
      "maximum": <worst case scenario>,
      "likely": <most probable outcome>
    },
    "complianceScore": <number 0-100>
  },
  "redFlags": [
    {
      "id": "<unique_id>",
      "severity": "<LOW|MEDIUM|HIGH|CRITICAL>",
      "type": "<comprehensive violation category>",
      "originalText": "<exact problematic text with context>",
      "issue": "<detailed compliance violation explanation>",
      "taxCodeViolation": "<complete legal citation with subsections>",
      "penalty": {
        "amount": <precisely calculated penalty>,
        "calculation": "<step-by-step penalty calculation>",
        "statutory": "<complete legal authority and precedent>"
      },
      "fix": {
        "action": "<comprehensive remediation strategy>",
        "deadline": "<ISO date string with legal basis>",
        "form": "<all required forms and amendments>"
      }
    }
  ],
  "recommendations": [
    {
      "priority": "<IMMEDIATE|URGENT|MEDIUM|LOW>",
      "action": "<comprehensive strategic action>",
      "reason": "<detailed risk analysis and justification>",
      "deadline": "<ISO date string if applicable>",
      "estimatedTime": "<detailed professional time estimate>",
      "difficulty": "<EASY|MODERATE|COMPLEX>",
      "professionalRequired": <true|false>
    }
  ],
  "timeline": [
    {
      "id": "<unique_id>",
      "title": "<strategic milestone title>",
      "description": "<comprehensive action description>",
      "deadline": "<ISO date string>",
      "priority": "<IMMEDIATE|URGENT|MEDIUM|LOW>",
      "status": "PENDING",
      "estimatedTime": "<professional time estimate>",
      "relatedRedFlag": "<red flag id if applicable>"
    }
  ],
  "requiredForms": [
    {
      "formNumber": "<complete form designation>",
      "name": "<full official form title>",
      "deadline": "<ISO date string with statutory basis>",
      "penalty": <specific penalty with interest>,
      "description": "<comprehensive form purpose and requirements>",
      "filingMethod": "<ONLINE|PAPER|BOTH>"
    }
  ]
}`,
    userPrompt: `Conduct comprehensive forensic tax compliance analysis suitable for board-level reporting:
- Complete transaction-level review
- Statistical anomaly detection
- Multi-jurisdiction compliance assessment
- Criminal vs civil risk evaluation
- Audit defense strategy requirements
- Professional service needs assessment

Document content:
{text}`
  }
}

export async function analyzeDocumentStructured(
  text: string, 
  scanType: keyof typeof SCAN_TYPES = 'basic'
): Promise<AuditAnalysisResult> {
  try {
    const scanConfig = STRUCTURED_PROMPTS[scanType]
    const userPrompt = scanConfig.userPrompt.replace('{text}', text)
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://micro-ai-compliance.vercel.app',
        'X-Title': 'Micro AI Compliance Scanner'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: scanConfig.systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: scanType === 'basic' ? 2000 : scanType === 'deep' ? 4000 : 6000,
        temperature: 0.1, // Lower temperature for more consistent JSON
        response_format: { type: "json_object" } // Force JSON response
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenRouter API error:', error)
      throw new Error('Failed to analyze document')
    }

    const data = await response.json()
    let analysisResult = data.choices[0].message.content

    // Parse JSON response
    let parsedResult: any
    try {
      parsedResult = JSON.parse(analysisResult)
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError)
      console.error('Raw response:', analysisResult)
      throw new Error('AI returned invalid JSON format')
    }

    // Generate unique IDs for red flags and timeline items if missing
    if (parsedResult.redFlags) {
      parsedResult.redFlags = parsedResult.redFlags.map((flag: any) => ({
        ...flag,
        id: flag.id || generateRedFlagId(),
        fix: {
          ...flag.fix,
          deadline: new Date(flag.fix.deadline)
        }
      }))
    }

    if (parsedResult.timeline) {
      parsedResult.timeline = parsedResult.timeline.map((item: any) => ({
        ...item,
        id: item.id || generateRedFlagId(),
        deadline: new Date(item.deadline)
      }))
    }

    if (parsedResult.recommendations) {
      parsedResult.recommendations = parsedResult.recommendations.map((rec: any) => ({
        ...rec,
        deadline: rec.deadline ? new Date(rec.deadline) : undefined
      }))
    }

    if (parsedResult.requiredForms) {
      parsedResult.requiredForms = parsedResult.requiredForms.map((form: any) => ({
        ...form,
        deadline: new Date(form.deadline)
      }))
    }

    // Validate the structured response
    if (!isValidAnalysisResult(parsedResult)) {
      console.error('Invalid analysis result structure:', parsedResult)
      throw new Error('AI returned invalid analysis structure')
    }

    return parsedResult as AuditAnalysisResult
  } catch (error) {
    console.error('Structured analysis error:', error)
    throw new Error('Failed to analyze document with structured format')
  }
}

// Keep the legacy function for backward compatibility during transition
export async function analyzeDocument(text: string, scanType: keyof typeof SCAN_TYPES = 'basic'): Promise<string> {
  // For now, call the structured version and convert back to text
  // This will be removed once all components are updated
  try {
    const structuredResult = await analyzeDocumentStructured(text, scanType)
    
    // Convert structured result back to markdown for legacy compatibility
    let markdown = `# Compliance Analysis Report\n\n`
    markdown += `## 🎯 Risk Score: ${structuredResult.summary.auditRiskScore}/100\n`
    markdown += `**Audit Risk Level**: ${structuredResult.summary.riskLevel}\n`
    markdown += `**Audit Probability**: ${structuredResult.summary.auditProbability}\n`
    markdown += `**Compliance Score**: ${structuredResult.summary.complianceScore}%\n\n`
    
    if (structuredResult.redFlags.length > 0) {
      markdown += `## 🚩 Critical Red Flags\n`
      structuredResult.redFlags.forEach((flag, idx) => {
        markdown += `### ${idx + 1}. ${flag.issue}\n`
        markdown += `- **Severity**: ${flag.severity}\n`
        markdown += `- **Violation**: ${flag.taxCodeViolation}\n`
        markdown += `- **Potential Penalty**: $${flag.penalty.amount.toLocaleString()}\n`
        markdown += `- **Action Required**: ${flag.fix.action}\n\n`
      })
    }

    if (structuredResult.recommendations.length > 0) {
      markdown += `## 💡 Recommendations\n`
      structuredResult.recommendations.forEach((rec, idx) => {
        markdown += `### ${idx + 1}. ${rec.action}\n`
        markdown += `- **Priority**: ${rec.priority}\n`
        markdown += `- **Time Required**: ${rec.estimatedTime}\n`
        markdown += `- **Difficulty**: ${rec.difficulty}\n\n`
      })
    }

    return markdown
  } catch (error) {
    // Fallback to original analysis if structured fails
    console.error('Structured analysis failed, falling back to original:', error)
    return analyzeDocumentLegacy(text, scanType)
  }
}

// Legacy analysis function (original implementation)
async function analyzeDocumentLegacy(text: string, scanType: keyof typeof SCAN_TYPES = 'basic'): Promise<string> {
  const SCAN_PROMPTS = {
    basic: {
      prompt: `You are an AI tax compliance expert. Analyze this document for ATO/IRS compliance risks.

Provide a concise report with:

## 🎯 Risk Score: [X/10]
One-line assessment of overall compliance risk level.

## 🚩 Critical Red Flags
- List 3-5 most serious compliance issues found
- Focus on tax evasion indicators, unreported income, suspicious deductions
- Include specific amounts or percentages where relevant

## ⚠️ Medium Risk Items  
- List 2-3 moderate concerns that need attention
- Include missing documentation or unclear transactions

## ✅ Compliant Areas
- List 2-3 areas that appear properly documented

## 💡 Quick Recommendations
- 3 immediate actions to reduce audit risk
- Focus on what can be fixed quickly

Keep it concise and actionable. Use clear business language.

Document content:
{text}`,
      maxTokens: 1000
    },
    deep: {
      prompt: `You are a senior tax compliance auditor. Perform a detailed forensic analysis of this document for ATO/IRS compliance.

## 📊 Executive Summary
### Overall Risk Assessment: [X/10]
- **Risk Level**: [Critical/High/Medium/Low]
- **Audit Probability**: [High/Medium/Low]
- **Estimated Financial Impact**: $[amount] in potential penalties
- **Key Finding**: [One sentence summary of most critical issue]

## 🚨 Critical Compliance Violations
For each violation found, provide:
- **Issue**: [Specific violation]
- **Transaction Details**: [Date, amount, parties involved]
- **Tax Code Reference**: [Relevant section violated]
- **Potential Penalty**: $[estimated amount]
- **Evidence**: [Quote specific problematic entries]

## 📋 Transaction-Level Analysis
Review all financial entries and flag:
- Unusual patterns or sudden changes in income/expenses
- Transactions lacking proper documentation
- Related-party transactions requiring scrutiny
- International transfers needing reporting
- Cash transactions over reporting thresholds

## ⚖️ Legal & Regulatory Framework
- **Primary Violations**: [List specific tax codes]
- **Reporting Requirements Missed**: [Forms that should have been filed]
- **Statute of Limitations Status**: [Years still open for audit]
- **Criminal vs Civil Risk**: [Assessment of violation severity]

## 🌍 Jurisdiction-Specific Issues
- **Federal Compliance**: [IRS/ATO specific issues]
- **State/Province Issues**: [Local tax concerns]
- **International Considerations**: [Cross-border complications]

## 🛡️ Remediation Strategy
1. **Immediate Actions** (Within 7 days)
   - [Specific steps to stop ongoing violations]
2. **Short-term Fixes** (Within 30 days)
   - [Documentation to gather]
   - [Amendments to file]
3. **Long-term Improvements**
   - [System changes needed]
   - [Professional help required]

## 📈 Risk Mitigation Priority Matrix
| Issue | Impact | Urgency | Action Required |
|-------|--------|---------|-----------------|
| [List top 5 issues with ratings] |

Document content:
{text}`,
      maxTokens: 3000
    },
    ultra: {
      prompt: `You are a forensic tax compliance expert preparing a comprehensive audit defense package. Analyze this document with the depth required for board-level reporting and legal proceedings.

# 🏢 COMPREHENSIVE TAX COMPLIANCE AUDIT REPORT

## 📊 EXECUTIVE DASHBOARD

### Risk Overview
- **Overall Compliance Score**: [X/100]
- **Audit Risk Level**: [Critical/High/Medium/Low]
- **Financial Exposure**: $[total potential liability]
- **Criminal Risk Assessment**: [Yes/No with explanation]
- **Immediate Action Required**: [Yes/No]

### Key Metrics
| Metric | Value | Industry Benchmark | Status |
|--------|-------|-------------------|---------|
| Effective Tax Rate | X% | Y% | 🔴/🟡/🟢 |
| Deduction Ratio | X% | Y% | 🔴/🟡/🟢 |
| Cash Transaction % | X% | Y% | 🔴/🟡/🟢 |
| Documentation Score | X/10 | 8/10 | 🔴/🟡/🟢 |

## 🔍 FORENSIC TRANSACTION ANALYSIS

### Suspicious Transaction Patterns
For each pattern identified:
- **Pattern Type**: [Description]
- **Transactions Involved**: [List with dates/amounts]
- **Statistical Anomaly Score**: [Standard deviations from norm]
- **Fraud Indicators**: [Benford's Law violations, round number frequency, etc.]
- **Supporting Evidence**: [Direct quotes from document]

### High-Risk Transactions
| Date | Description | Amount | Risk Factors | Required Action |
|------|-------------|--------|--------------|-----------------|
| [Detailed table of problematic transactions] |

## ⚖️ LEGAL COMPLIANCE ASSESSMENT

### Tax Code Violations
1. **IRC Section [X]** - [Violation description]
   - Case Law: [Relevant precedent]
   - Penalty Range: $[min] - $[max]
   - Defense Strategy: [Approach]

2. **State Tax Code [X]** - [Violation description]
   - Enforcement History: [How often prosecuted]
   - Settlement Precedents: [Typical resolution]

### International Compliance
- **FATCA Requirements**: [Status]
- **Transfer Pricing Issues**: [Analysis]
- **Treaty Benefits**: [Applicable treaties and implications]
- **CRS Reporting**: [Compliance status]

## 📊 RISK ASSESSMENT MATRIX

### Risk Heat Map
| Impact/Urgency | Low | Medium | High | Critical |
|----------------|-----|--------|------|----------|
| Low Urgency    |  3  |   2    |   5  |    1     |
| Medium Urgency |  1  |   4    |   3  |    2     |
| High Urgency   |  0  |   2    |   6  |    4     |

### Top 10 Risks Ranked
1. [Risk]: Impact $[X], Probability [Y]%, Timeline [Z]
2. [Continue for top 10...]

## 💰 FINANCIAL IMPACT ANALYSIS

### Penalty Calculations
| Violation | Base Penalty | Interest | Total Exposure | Negotiation Range |
|-----------|--------------|----------|----------------|-------------------|
| [Detailed calculations with statutory references] |

### Cash Flow Impact
- **Immediate Liabilities**: $[amount]
- **12-Month Projection**: $[amount]
- **Worst Case Scenario**: $[amount]
- **Most Likely Outcome**: $[amount]

## 🛡️ COMPREHENSIVE REMEDIATION PLAN

### Phase 1: Crisis Management (0-7 days)
□ Engage tax attorney for privilege protection
□ Freeze problematic transactions
□ Secure all documentation
□ [Specific urgent actions based on findings]

### Phase 2: Compliance Restoration (8-30 days)
□ File amended returns for [years]
□ Prepare voluntary disclosure package
□ Implement internal controls
□ [Detailed action items with responsible parties]

### Phase 3: Long-term Optimization (31-90 days)
□ Restructure problematic entities
□ Implement compliance software
□ Staff training on [specific areas]
□ [Strategic improvements]

## 📋 AUDIT DEFENSE PLAYBOOK

### Documentation Package
1. **Primary Evidence**
   - [List of documents to compile]
2. **Supporting Documentation**
   - [Secondary evidence needed]
3. **Expert Opinions Required**
   - [Types of professionals to engage]

### Negotiation Strategy
- **Opening Position**: [Recommended stance]
- **Fallback Positions**: [Acceptable compromises]
- **Red Lines**: [Non-negotiable items]
- **Settlement Authority**: $[recommended range]

### Timeline & Milestones
- **Week 1**: [Actions]
- **Week 2-4**: [Actions]
- **Month 2-3**: [Actions]
- **Month 4-6**: [Actions]

## 👥 PROFESSIONAL SERVICES REQUIRED

### Immediate Needs
- Tax Attorney specializing in [specific area]
- Forensic Accountant for [specific analysis]
- [Other specialists based on findings]

### Estimated Professional Fees
- Legal: $[range]
- Accounting: $[range]
- Total Budget: $[range]

## 📝 BOARD REPORTING SUMMARY

**For Board/C-Suite Presentation:**
- Current tax position creates material risk to organization
- Immediate action required to minimize exposure
- Total financial impact range: $[min] - $[max]
- Recommended budget for resolution: $[amount]
- Timeline to resolution: [X] months

## ⚡ QUICK REFERENCE ACTION ITEMS

**DO IMMEDIATELY:**
1. [Top 3 critical actions]

**DO NOT:**
1. [Top 3 things to avoid]

**KEY CONTACTS:**
- IRS Voluntary Disclosure: [relevant program]
- State Tax Amnesty: [if applicable]
- Recommended Attorneys: [if appropriate to suggest]

---
*This report is generated based on the provided documentation. Actual tax liability should be confirmed with qualified tax professionals. This analysis does not constitute legal or tax advice.*

Document content:
{text}`,
      maxTokens: 5000
    }
  }

  try {
    const scanConfig = SCAN_PROMPTS[scanType]
    const prompt = scanConfig.prompt.replace('{text}', text)
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://micro-ai-compliance.vercel.app',
        'X-Title': 'Micro AI Compliance Scanner'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: scanConfig.maxTokens,
        temperature: 0.2
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenRouter API error:', error)
      throw new Error('Failed to analyze document')
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('Legacy OpenRouter analysis error:', error)
    throw new Error('Failed to analyze document')
  }
}