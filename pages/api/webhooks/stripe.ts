import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { serverAddCredits } from '@/utils/firebase-admin'
import { buffer } from 'micro'
import { withRateLimit, strictLimiter } from '@/middleware/rateLimiter'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})

// Disable body parsing so we can verify the signature
export const config = {
  api: {
    bodyParser: false,
  },
}

async function webhookHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const buf = await buffer(req)
  const sig = req.headers['stripe-signature']

  if (!sig) {
    return res.status(400).json({ error: 'Missing Stripe signature' })
  }

  let event: Stripe.Event

  try {
    // 🔒 SECURITY: Verify webhook signature
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return res.status(400).json({ error: 'Invalid signature' })
  }

  // 🛡️ SECURITY: Log webhook events
  const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress
  console.log(`Webhook ${event.type} from IP: ${clientIP}`)

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // 🔒 SECURITY: Only process if we have required metadata
    if (!session.metadata?.userId || !session.metadata?.credits) {
      console.error('Missing required metadata in webhook:', session.id)
      return res.status(400).json({ error: 'Missing metadata' })
    }

    const userId = session.metadata.userId
    const creditsToAdd = parseInt(session.metadata.credits)
    const amountPaid = session.amount_total ? session.amount_total / 100 : 0 // Convert from cents

    try {
      // 🔒 SECURITY: Add credits using server-side function only
      const success = await serverAddCredits(userId, creditsToAdd, amountPaid)
      
      if (success) {
        console.log(`Added ${creditsToAdd} credits to user ${userId}`)
      } else {
        console.error(`Failed to add credits to user ${userId}`)
        return res.status(500).json({ error: 'Failed to add credits' })
      }
    } catch (error) {
      console.error('Error processing payment webhook:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // Handle subscription created (for monthly plans)
  if (event.type === 'customer.subscription.created') {
    const subscription = event.data.object as Stripe.Subscription
    console.log('New subscription created:', subscription.id)
  }

  // Handle subscription cancelled
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    console.log('Subscription cancelled:', subscription.id)
    // Note: Don't remove existing credits, just stop adding new ones
  }

  res.status(200).json({ received: true })
}

// 🛡️ SECURITY: Apply strict rate limiting for webhooks (10 requests per minute per IP)
export default withRateLimit(strictLimiter, webhookHandler) 