import { NextApiRequest, NextApiResponse } from 'next'
import { analyzeDocument } from '@/utils/openrouter'
import { serverCanUserScan, serverDeductCredits, SCAN_TYPES } from '@/utils/firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import { initializeApp, getApps, cert } from 'firebase-admin/app'

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // 🔒 SECURITY: Verify Firebase authentication token
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' })
  }

  const token = authHeader.split('Bearer ')[1]
  let userId: string

  try {
    const decodedToken = await getAuth().verifyIdToken(token)
    userId = decodedToken.uid
  } catch (error) {
    console.error('Token verification failed:', error)
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  const { text, scanType = 'basic', documentName = 'document' } = req.body

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Document text is required' })
  }

  if (!SCAN_TYPES[scanType as keyof typeof SCAN_TYPES]) {
    return res.status(400).json({ error: 'Invalid scan type' })
  }

  try {
    // 🔒 SECURITY: Check if user has enough credits and hasn't exceeded limits (SERVER-SIDE)
    const { canScan, reason } = await serverCanUserScan(userId, scanType as keyof typeof SCAN_TYPES)
    if (!canScan) {
      return res.status(403).json({ error: reason })
    }

    // Process the document analysis
    const analysis = await analyzeDocument(text, scanType as keyof typeof SCAN_TYPES)
    
    // 🔒 SECURITY: Deduct credits ONLY after successful processing (SERVER-SIDE)
    const success = await serverDeductCredits(userId, scanType as keyof typeof SCAN_TYPES, documentName)
    if (!success) {
      return res.status(500).json({ error: 'Failed to deduct credits' })
    }
    
    res.status(200).json({ analysis })
  } catch (error) {
    console.error('Analysis error:', error)
    res.status(500).json({ error: 'Failed to analyze document' })
  }
}