import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PayNowButton() {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const { sessionId } = await response.json()
      const stripe = await stripePromise
      
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <span className="animate-spin">⏳</span>
          Processing...
        </>
      ) : (
        <>
          💳 Unlock Full Access - Just $10
        </>
      )}
    </button>
  )
}