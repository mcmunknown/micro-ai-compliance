import { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from 'firebase-admin/auth'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { serverAddCredits, serverGetUserCredits } from '@/utils/firebase-admin'
import Stripe from 'stripe'

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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})

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

  try {
    console.log(`🔍 Syncing Stripe credits for user ${userId}`)

    // Get recent checkout sessions for this user
    const sessions = await stripe.checkout.sessions.list({
      limit: 10,
      expand: ['data.subscription']
    })

    // Find sessions with this user's metadata
    const userSessions = sessions.data.filter(session => 
      session.metadata?.userId === userId && 
      session.payment_status === 'paid' &&
      session.mode === 'subscription'
    )

    console.log(`Found ${userSessions.length} paid sessions for user ${userId}`)

    let creditsAdded = 0
    let totalAmount = 0

    for (const session of userSessions) {
      const credits = parseInt(session.metadata?.credits || '0')
      const amount = session.amount_total ? session.amount_total / 100 : 0

      if (credits > 0) {
        console.log(`Adding ${credits} credits from session ${session.id}`)
        const success = await serverAddCredits(userId, credits, amount)
        
        if (success) {
          creditsAdded += credits
          totalAmount += amount
        }
      }
    }

    // Get updated credit balance
    const updatedCredits = await serverGetUserCredits(userId)

    console.log(`✅ Sync complete for user ${userId}:`, {
      sessionsProcessed: userSessions.length,
      creditsAdded,
      totalAmount: `$${totalAmount}`,
      finalBalance: updatedCredits?.credits || 0
    })

    res.status(200).json({
      success: true,
      message: `Synced credits from ${userSessions.length} Stripe sessions`,
      creditsAdded,
      totalAmount,
      currentBalance: updatedCredits?.credits || 0,
      sessionsProcessed: userSessions.map(s => ({
        id: s.id,
        credits: s.metadata?.credits,
        amount: s.amount_total ? `$${s.amount_total / 100}` : '$0',
        created: new Date(s.created * 1000).toISOString()
      }))
    })

  } catch (error) {
    console.error('Error syncing Stripe credits:', error)
    res.status(500).json({ 
      error: 'Failed to sync credits', 
      details: error instanceof Error ? error.message : String(error)
    })
  }
} 