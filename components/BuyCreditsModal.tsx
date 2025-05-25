'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, TrendingUp, Building2, Check } from 'lucide-react'
import { CREDIT_PACKS } from '@/utils/credits'
import { loadStripe } from '@stripe/stripe-js'
import { useAuth } from '@/components/AuthProvider'

interface BuyCreditsModalProps {
  isOpen: boolean
  onClose: () => void
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function BuyCreditsModal({ isOpen, onClose }: BuyCreditsModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)

  const handlePurchase = async (packId: string) => {
    if (!user) return
    
    setLoading(packId)
    try {
      // Get the pack details
      const pack = CREDIT_PACKS.find(p => p.id === packId)
      if (!pack) throw new Error('Pack not found')
      
      // Get Firebase auth token
      const token = await user.getIdToken()
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          priceId: pack.priceId || `price_${packId}`, // Use pack's Stripe price ID
          credits: pack.credits,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const { sessionId } = await response.json()
      const stripe = await stripePromise
      
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error('Stripe error:', error)
          alert('Payment failed. Please try again.')
        }
      }
    } catch (error) {
      console.error('Purchase error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const packIcons: Record<string, React.ReactNode> = {
    starter: <Zap className="w-6 h-6" />,
    professional: <TrendingUp className="w-6 h-6" />,
    business: <Building2 className="w-6 h-6" />
  }

  const packColors: Record<string, string> = {
    starter: 'from-blue-500 to-cyan-500',
    professional: 'from-purple-500 to-pink-500',
    business: 'from-orange-500 to-red-500'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative p-6 border-b border-gray-200">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
                <h2 className="text-2xl font-bold text-gray-900">Buy Credits</h2>
                <p className="text-gray-600 mt-1">Choose the perfect credit pack for your compliance needs</p>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {CREDIT_PACKS.map((pack) => (
                    <motion.div
                      key={pack.id}
                      whileHover={{ y: -4 }}
                      className={`relative rounded-xl bg-gradient-to-br ${packColors[pack.id]} p-[1px]`}
                    >
                      {pack.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-semibold">
                          MOST POPULAR
                        </div>
                      )}
                      <div className="bg-white rounded-xl p-6 h-full flex flex-col border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${packColors[pack.id]} text-white`}>
                            {packIcons[pack.id]}
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold">${pack.price}</div>
                            <div className="text-sm text-gray-400">{pack.credits} credits/month</div>
                          </div>
                        </div>

                        <h3 className="text-xl font-semibold mb-2 capitalize text-gray-900">{pack.id} Pack</h3>
                        
                        <div className="flex-1 space-y-3 mb-6">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>{pack.credits} scans available monthly</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>All scan types included</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>Cancel anytime</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handlePurchase(pack.id)}
                          disabled={loading !== null}
                          className={`w-full py-3 rounded-lg font-semibold transition-all ${
                            loading === pack.id
                              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                              : `bg-gradient-to-r ${packColors[pack.id]} text-white hover:shadow-lg`
                          }`}
                        >
                          {loading === pack.id ? 'Processing...' : 'Buy Now'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 text-center">
                    <strong>🔒 Secure Payment:</strong> All transactions are processed securely through Stripe. 
                    Credits refresh monthly. Cancel anytime from your Stripe dashboard.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}