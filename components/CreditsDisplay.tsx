import { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { getUserCredits, UserCredits } from '@/utils/credits'

interface CreditsDisplayProps {
  onBuyCredits: () => void
}

export default function CreditsDisplay({ onBuyCredits }: CreditsDisplayProps) {
  const { user } = useAuth()
  const [credits, setCredits] = useState<UserCredits | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadCredits()
    }
  }, [user])

  const loadCredits = async () => {
    if (!user) return
    
    try {
      const userCredits = await getUserCredits(user.uid)
      setCredits(userCredits)
    } catch (error) {
      console.error('Error loading credits:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 w-24 bg-gray-200 rounded"></div>
      </div>
    )
  }

  const creditBalance = credits?.credits || 0
  const isLow = creditBalance < 5

  return (
    <div className="flex items-center gap-4">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
        isLow ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'
      }`}>
        <span className="text-2xl">🪙</span>
        <div>
          <p className="text-sm font-medium text-gray-700">
            {creditBalance} {creditBalance === 1 ? 'Credit' : 'Credits'}
          </p>
          {isLow && creditBalance > 0 && (
            <p className="text-xs text-yellow-600">Running low</p>
          )}
          {creditBalance === 0 && (
            <p className="text-xs text-red-600">No credits left</p>
          )}
        </div>
      </div>
      
      <button
        onClick={onBuyCredits}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          creditBalance === 0
            ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
            : isLow
            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`}
      >
        {creditBalance === 0 ? 'Buy Credits Now' : 'Buy More'}
      </button>
    </div>
  )
}