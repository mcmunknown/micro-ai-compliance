import { NextApiRequest, NextApiResponse } from 'next'
import { analyzeDocument } from '@/utils/openrouter'
import { SCAN_TYPES } from '@/utils/credits'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text, scanType = 'basic' } = req.body

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Document text is required' })
  }

  if (!SCAN_TYPES[scanType as keyof typeof SCAN_TYPES]) {
    return res.status(400).json({ error: 'Invalid scan type' })
  }

  try {
    const analysis = await analyzeDocument(text, scanType as keyof typeof SCAN_TYPES)
    res.status(200).json({ analysis })
  } catch (error) {
    console.error('Analysis error:', error)
    res.status(500).json({ error: 'Failed to analyze document' })
  }
}