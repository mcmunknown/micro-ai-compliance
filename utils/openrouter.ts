import { SCAN_TYPES } from './credits'

const SCAN_PROMPTS = {
  basic: {
    prompt: `Scan this document for compliance or audit risks for ATO/IRS. List any red flags and a one-line summary. Format as Markdown.

Document content:
{text}`,
    maxTokens: 1000
  },
  deep: {
    prompt: `Perform a detailed compliance analysis of this document for ATO/IRS regulations. Include:
1. **Executive Summary** - Key findings and risk score (1-10)
2. **Red Flags** - Specific compliance issues with transaction-level details
3. **Legal Citations** - Reference relevant tax codes and regulations
4. **Region-Specific Issues** - Country/state-specific compliance concerns
5. **Recommendations** - Next steps to address identified issues

Format as detailed Markdown with clear sections.

Document content:
{text}`,
    maxTokens: 3000
  },
  ultra: {
    prompt: `Conduct a comprehensive forensic compliance audit of this document for ATO/IRS and international tax regulations. Provide:

1. **Executive Summary**
   - Overall risk assessment (1-10 scale with justification)
   - Key compliance violations found
   - Financial impact estimation

2. **Detailed Transaction Analysis**
   - Line-by-line review of concerning transactions
   - Pattern recognition of potential fraud/evasion
   - Cross-reference with standard compliance practices

3. **Legal and Regulatory Framework**
   - Specific tax code violations with citations
   - Relevant case law precedents
   - International treaty implications

4. **Risk Matrix**
   - Categorize risks by severity (Critical/High/Medium/Low)
   - Likelihood of audit trigger
   - Potential penalties and interest calculations

5. **Remediation Roadmap**
   - Priority action items with deadlines
   - Required documentation to gather
   - Professional services needed (CPA, tax attorney, etc.)
   - Voluntary disclosure program eligibility

6. **Audit Defense Strategy**
   - Proactive steps to strengthen position
   - Documentation requirements
   - Timeline for compliance

Format as a professional audit report in Markdown with clear sections, tables where appropriate, and actionable insights.

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