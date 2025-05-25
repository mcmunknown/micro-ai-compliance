import { SCAN_TYPES } from './credits'

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

export async function analyzeDocument(text: string, scanType: keyof typeof SCAN_TYPES = 'basic'): Promise<string> {
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
    console.error('OpenRouter analysis error:', error)
    throw new Error('Failed to analyze document')
  }
}