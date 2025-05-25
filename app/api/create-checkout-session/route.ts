import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { CREDIT_PACKS } from '@/utils/credits'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})

export async function POST(request: NextRequest) {
  try {
    const { packId, userId, userEmail } = await request.json()
    
    const pack = CREDIT_PACKS.find(p => p.id === packId)
    if (!pack) {
      return NextResponse.json({ error: 'Invalid pack' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: pack.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?payment=success&credits=${pack.credits}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?payment=cancelled`,
      metadata: {
        userId,
        packId,
        credits: pack.credits.toString(),
      },
      customer_email: userEmail,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Stripe session error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}