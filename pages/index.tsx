import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/components/AuthProvider'
import PayNowButton from '@/components/PayNowButton'
import DocumentUpload from '@/components/DocumentUpload'
import LandingPage from '@/components/LandingPage'
import AuthForm from '@/components/AuthForm'
import CreditsDisplay from '@/components/CreditsDisplay'
import BuyCreditsModal from '@/components/BuyCreditsModal'
import { getUserCredits, addCredits, UserCredits } from '@/utils/credits'

export default function Home() {
  const { user, logout } = useAuth()
  const [hasPaid, setHasPaid] = useState(false)
  const [hasUsedDemo, setHasUsedDemo] = useState(false)
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null)
  const [showBuyCredits, setShowBuyCredits] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (router.query.paid === 'true') {
      setHasPaid(true)
      localStorage.setItem('hasPaid', 'true')
    } else if (localStorage.getItem('hasPaid') === 'true') {
      setHasPaid(true)
    }
    
    // Check if user has used their free demo
    if (localStorage.getItem('hasUsedDemo') === 'true') {
      setHasUsedDemo(true)
    }
    
    // Handle successful payment redirect
    if (router.query.payment === 'success' && router.query.credits) {
      const creditsAdded = parseInt(router.query.credits as string)
      // Show success message
      alert(`Success! ${creditsAdded} credits have been added to your account.`)
      // Clean up URL
      router.replace('/', undefined, { shallow: true })
    }
  }, [router.query])
  
  // Fetch user credits
  useEffect(() => {
    async function fetchCredits() {
      if (user) {
        const credits = await getUserCredits(user.uid)
        setUserCredits(credits)
      }
    }
    fetchCredits()
  }, [user])


  if (!user) {
    if (!showAuthForm) {
      return (
        <LandingPage 
          onSignIn={() => {
            setShowAuthForm(true)
            setAuthMode('signin')
          }}
          onSignUp={() => {
            setShowAuthForm(true)
            setAuthMode('signup')
          }}
        />
      )
    }

    return (
      <AuthForm 
        initialMode={authMode}
        onBack={() => setShowAuthForm(false)}
      />
    )
  }

  const isDemoMode = false // Removed demo mode - now using credit system

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                AI Tax Compliance Scanner
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <CreditsDisplay 
                onBuyCredits={() => setShowBuyCredits(true)}
              />
              <div className="w-px h-6 bg-gray-300" />
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Welcome back, {user.email?.split('@')[0]}!
          </h2>
          <p className="text-gray-600">
            Upload your tax documents, invoices, or financial CSVs to scan for ATO/IRS compliance risks.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex justify-center items-center gap-6 mb-8 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <span className="text-green-500">🔒</span> No documents stored
          </span>
          <span className="flex items-center gap-2">
            <span className="text-blue-500">⚡</span> Instant analysis
          </span>
          <span className="flex items-center gap-2">
            <span className="text-purple-500">🤖</span> Powered by Claude AI
          </span>
        </div>
        
        {router.query.payment === 'cancelled' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              Payment was cancelled. You can try again when you're ready.
            </p>
          </div>
        )}
        
        {/* Credit System Notice */}
        {userCredits && userCredits.credits === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">💳</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Credits Available
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Purchase credits to continue scanning documents for compliance risks.
            </p>
            <button
              onClick={() => setShowBuyCredits(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Buy Credits
            </button>
            <p className="mt-4 text-sm text-gray-500">
              Starting at just $10 for 10 credits • Secure payment via Stripe
            </p>
          </div>
        )}
        
        {/* Main Document Upload */}
        {userCredits && userCredits.credits > 0 && (
          <div>
            {userCredits.freeCreditsUsed && userCredits.credits <= 3 && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-amber-800 font-medium">⚠️ Low Credits</p>
                  <p className="text-amber-600 text-sm">You have {userCredits.credits} credit{userCredits.credits !== 1 ? 's' : ''} remaining.</p>
                </div>
                <button
                  onClick={() => setShowBuyCredits(true)}
                  className="text-amber-700 text-sm font-medium hover:text-amber-800"
                >
                  Buy More →
                </button>
              </div>
            )}
            <DocumentUpload 
              userCredits={userCredits}
              onCreditsUpdated={async () => {
                const credits = await getUserCredits(user!.uid)
                setUserCredits(credits)
              }}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 pb-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p className="mb-2">
            Built with ❤️ by indie makers • Powered by Claude AI, Stripe & Firebase
          </p>
          <p>
            This tool identifies potential risks - always consult a tax professional for advice
          </p>
        </div>
      </footer>
      
      {/* Buy Credits Modal */}
      <BuyCreditsModal 
        isOpen={showBuyCredits}
        onClose={() => setShowBuyCredits(false)}
      />
    </div>
  )
}