import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Plus, RefreshCw } from 'lucide-react'
import { getUserCredits, UserCredits } from '@/utils/credits'
import { useAuth } from './AuthProvider'

interface CreditsDisplayProps {
  onBuyCredits: () => void
}

export default function CreditsDisplay({ onBuyCredits }: CreditsDisplayProps) {
  const { user } = useAuth()
  const [credits, setCredits] = useState<UserCredits | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    if (user) {
      loadCredits()
    } else {
      setLoading(false)
    }
  }, [user])

  const loadCredits = async () => {
    if (!user) return
    
    try {
      const userCredits = await getUserCredits(user.uid)
      setCredits(userCredits)
    } catch (error) {
      console.error('Error loading credits:', error)
      // Set default credits on error
      setCredits({
        credits: 0,
        freeCreditsUsed: true,
        totalSpent: 0,
        scansToday: 0,
        scanHistory: []
      })
    } finally {
      setLoading(false)
    }
  }

  const syncStripeCredits = async () => {
    if (!user || syncing) return
    
    setSyncing(true)
    try {
      const token = await user.getIdToken()
      const response = await fetch('/api/sync-stripe-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      const result = await response.json()
      
      if (result.success) {
        // Reload credits to get updated balance
        await loadCredits()
        
        if (result.creditsAdded > 0) {
          alert(`✅ Added ${result.creditsAdded} credits from your subscription!`)
        } else {
          alert('✅ Credits are already synced')
        }
      } else {
        throw new Error(result.error || 'Failed to sync credits')
      }
    } catch (error) {
      console.error('Error syncing credits:', error)
      alert('❌ Failed to sync credits. Please try again.')
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-600">Loading credits...</span>
      </div>
    )
  }

  const creditBalance = credits?.credits || 0
  const isLow = creditBalance < 5

  return (
    <div className="flex items-center gap-3">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          creditBalance > 0 
            ? isLow 
              ? 'bg-yellow-50 border border-yellow-200' 
              : 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        <Zap className="w-4 h-4" />
        <div>
          <p className="text-sm font-medium">
            {creditBalance} Credit{creditBalance !== 1 ? 's' : ''}
          </p>
          {isLow && creditBalance > 0 && (
            <p className="text-xs opacity-75">Running low</p>
          )}
          {creditBalance === 0 && (
            <p className="text-xs opacity-75">No credits left</p>
          )}
        </div>
      </motion.div>

      {creditBalance === 0 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={syncStripeCredits}
          disabled={syncing}
          className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Credits'}
        </motion.button>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBuyCredits}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          creditBalance === 0
            ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
            : isLow
            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
        }`}
      >
        <Plus className="w-4 h-4" />
        {creditBalance === 0 ? 'Buy Credits Now' : 'Buy More'}
      </motion.button>
    </div>
  )
}