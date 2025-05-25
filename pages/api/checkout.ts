import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { getAuth } from 'firebase-admin/auth'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { withRateLimit, apiLimiter } from '@/middleware/rateLimiter'

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

async function checkoutHandler(req: NextApiRequest, res: NextApiResponse) {
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

  const { priceId, credits } = req.body

  if (!priceId || !credits) {
    return res.status(400).json({ error: 'Price ID and credits amount required' })
  }

  // Check if this is a fallback price ID (not a real Stripe price)
  if (priceId.startsWith('price_1OExample')) {
    return res.status(400).json({ 
      error: 'Stripe subscription price IDs not configured. Please contact support.',
      details: 'The payment system requires valid subscription price IDs. Please configure STRIPE_PRICE environment variables.'
    })
  }

  // 🛡️ SECURITY: Log checkout attempt
  const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress
  console.log(`Checkout attempt from user ${userId}, IP: ${clientIP}, credits: ${credits}, priceId: ${priceId}`)

  // Debug Stripe configuration
  console.log('Stripe configuration check:', {
    hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
    secretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 10) + '...',
    priceId,
    origin: req.headers.origin
  })

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/?success=true&credits=${credits}`,
      cancel_url: `${req.headers.origin}/?cancelled=true`,
      metadata: {
        userId: userId,
        credits: credits.toString(),
      },
    })

    res.status(200).json({ sessionId: session.id })
  } catch (error) {
    const stripeError = error as any
    console.error('Stripe checkout error details:', {
      error: stripeError.message || String(error),
      type: stripeError.type,
      code: stripeError.code,
      priceId,
      userId,
      credits
    })
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: stripeError.message || String(error)
    })
  }
}

// 🛡️ SECURITY: Apply API rate limiting (100 requests per 15 minutes per IP)
export default withRateLimit(apiLimiter, checkoutHandler)