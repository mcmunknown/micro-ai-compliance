export async function analyzeDocument(text: string): Promise<string> {
  try {
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
          content: `Scan this document for compliance or audit risks for ATO/IRS. List any red flags and a one-line summary. Format as Markdown.

Document content:
${text}`
        }],
        max_tokens: 1000,
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