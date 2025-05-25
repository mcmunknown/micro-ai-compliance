import { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from 'firebase-admin/auth'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { serverAddCredits, serverGetUserCredits } from '@/utils/firebase-admin'

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
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' })
  }

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

  const { credits = 10 } = req.body

  try {
    // Get current credits
    const currentCredits = await serverGetUserCredits(userId)
    console.log('Current credits before:', currentCredits?.credits || 0)

    // Add test credits
    const success = await serverAddCredits(userId, credits, 0)
    
    if (success) {
      // Get updated credits
      const updatedCredits = await serverGetUserCredits(userId)
      console.log('Current credits after:', updatedCredits?.credits || 0)
      
      res.status(200).json({ 
        success: true, 
        message: `Added ${credits} test credits`,
        before: currentCredits?.credits || 0,
        after: updatedCredits?.credits || 0
      })
    } else {
      res.status(500).json({ error: 'Failed to add credits' })
    }
  } catch (error) {
    console.error('Error adding test credits:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
} 