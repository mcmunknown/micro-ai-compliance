import { generateText } from 'ai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function analyzeDocument(text: string): Promise<string> {
  try {
    const { text: result } = await generateText({
      model: openrouter('anthropic/claude-3.5-sonnet'),
      prompt: `Scan this document for compliance or audit risks for ATO/IRS. List any red flags and a one-line summary. Format as Markdown.

Document content:
${text}`,
      maxTokens: 1000,
    })

    return result
  } catch (error) {
    console.error('OpenRouter analysis error:', error)
    throw new Error('Failed to analyze document')
  }
}