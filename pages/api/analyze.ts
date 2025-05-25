import { NextApiRequest, NextApiResponse } from 'next'
import { analyzeDocument } from '@/utils/openrouter'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text } = req.body

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Document text is required' })
  }

  try {
    const analysis = await analyzeDocument(text)
    res.status(200).json({ analysis })
  } catch (error) {
    console.error('Analysis error:', error)
    res.status(500).json({ error: 'Failed to analyze document' })
  }
}