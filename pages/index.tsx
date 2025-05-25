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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
          {/* Navigation */}
          <nav className="absolute top-0 w-full z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900">TaxScanner</span>
                  <span className="ml-2 text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">AI</span>
                </div>
                <button
                  onClick={() => {
                    setShowAuthForm(true)
                    setAuthMode('signin')
                  }}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="animate-fade-in">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight">
                  Worried About an
                  <span className="block text-red-600">ATO Audit?</span>
                </h1>
                <p className="mt-6 text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto">
                  <span className="font-semibold">One small mistake</span> in your tax documents could trigger months of investigations, 
                  <span className="text-red-600 font-semibold">$10,000s in penalties</span>, and sleepless nights wondering if you missed something.
                </p>
              </div>
              
              <div className="mt-10 animate-slide-up">
                <button
                  onClick={() => {
                    setShowAuthForm(true)
                    setAuthMode('signup')
                  }}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Start Free Demo →
                </button>
                <p className="mt-4 text-sm text-gray-500">
                  No credit card required • 3 free scans
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm font-medium">No data stored</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">🔒</span>
                  <span className="text-sm font-medium">Bank-level security</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-500">👥</span>
                  <span className="text-sm font-medium">1000+ users</span>
                </div>
              </div>
            </div>
          </section>

          {/* Pain Agitation Section */}
          <section className="py-20 bg-red-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                The Hidden Triggers Tax Offices Look For
              </h2>
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
                  <div className="flex items-start mb-4">
                    <span className="text-2xl mr-3">⚠️</span>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Cash Transactions Over $10,000</h3>
                      <p className="text-gray-600">
                        Missing AUSTRAC reports? That's an automatic red flag and potential 
                        <span className="font-semibold text-red-600"> $222,000 fine per transaction</span>.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
                  <div className="flex items-start mb-4">
                    <span className="text-2xl mr-3">🚨</span>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Unexplained Income Spikes</h3>
                      <p className="text-gray-600">
                        Revenue jumped 300%? Without proper documentation, expect a 
                        <span className="font-semibold text-red-600"> full lifestyle audit</span>.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
                  <div className="flex items-start mb-4">
                    <span className="text-2xl mr-3">💸</span>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Offshore Transfers</h3>
                      <p className="text-gray-600">
                        Every international payment is tracked. One missing declaration means 
                        <span className="font-semibold text-red-600"> 75% penalty on unpaid tax</span>.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
                  <div className="flex items-start mb-4">
                    <span className="text-2xl mr-3">📊</span>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Mismatched GST Claims</h3>
                      <p className="text-gray-600">
                        Your claims don't match suppliers' reports? That's 
                        <span className="font-semibold text-red-600"> instant audit territory</span>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center bg-gray-900 text-white rounded-2xl p-8">
                <p className="text-xl mb-2">
                  <span className="font-bold">87% of businesses</span> have at least one of these red flags
                </p>
                <p className="text-gray-300">
                  Most don't know until the audit letter arrives
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Sleep Better Tonight
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Don't wait for that audit letter. Know exactly where you stand in 30 seconds.
              </p>
              <button
                onClick={() => {
                  setShowAuthForm(true)
                  setAuthMode('signup')
                }}
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Get Started Free →
              </button>
            </div>
          </section>
        </div>
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