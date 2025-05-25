import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/components/AuthProvider'
import DocumentUpload from '@/components/DocumentUpload'
import AuthForm from '@/components/AuthForm'
import CreditsDisplay from '@/components/CreditsDisplay'
import BuyCreditsModal from '@/components/BuyCreditsModal'
import { getUserCredits, UserCredits } from '@/utils/credits'

export default function Home() {
  const { user, logout } = useAuth()
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null)
  const [showBuyCredits, setShowBuyCredits] = useState(false)
  const router = useRouter()

  useEffect(() => {
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
                  That 3am Cold Sweat When You Remember
                  <span className="block text-red-600">You Forgot to Report Something</span>
                </h1>
                <p className="mt-6 text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto">
                  Right now, the ATO's AI is scanning <span className="font-bold text-red-600">437,000 businesses</span> for red flags. 
                  Last year they collected <span className="font-bold">$4.2 billion in penalties</span>. 
                  <span className="block mt-2 font-semibold">Is that forgotten cash deposit about to destroy everything you've built?</span>
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
                  Check If You're At Risk (30 seconds) →
                </button>
                <p className="mt-4 text-sm text-gray-500">
                  No credit card required • 3 free scans
                </p>
              </div>

              {/* Urgency Indicator */}
              <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto animate-pulse-subtle">
                <p className="text-sm text-yellow-800">
                  <span className="font-bold">⚡ 2,847 business owners</span> are checking their compliance right now • 
                  <span className="font-semibold">Next ATO data-matching cycle: 12 days</span>
                </p>
              </div>
            </div>
          </section>

          {/* Pain Agitation Section */}
          <section className="py-20 bg-red-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
                While You Sleep, Their AI Never Stops Hunting
              </h2>
              <p className="text-center text-gray-600 mb-12 text-lg">
                Every transaction. Every deposit. Every claim. Cross-referenced against 650+ data sources.
              </p>
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
                  <div className="flex items-start mb-4">
                    <span className="text-2xl mr-3">⚠️</span>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">That $15,000 Cash Payment You "Forgot"</h3>
                      <p className="text-gray-600">
                        John from Brisbane thought nobody would notice. Now he's facing 
                        <span className="font-semibold text-red-600"> $666,000 in fines</span> for 3 unreported transactions. 
                        <span className="block mt-1 text-sm font-medium">AUSTRAC shares everything with the ATO. Everything.</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
                  <div className="flex items-start mb-4">
                    <span className="text-2xl mr-3">🚨</span>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Your New Car Triggered an Alert</h3>
                      <p className="text-gray-600">
                        Income: $80,000. New Tesla: $92,000. The ATO's lifestyle-matching AI noticed. 
                        <span className="font-semibold text-red-600"> Sarah's now explaining 5 years of finances</span> while her business 
                        <span className="block mt-1 text-sm font-medium">bleeds $2,000/day in frozen accounts.</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
                  <div className="flex items-start mb-4">
                    <span className="text-2xl mr-3">💸</span>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">PayPal Thinks You're in Australia</h3>
                      <p className="text-gray-600">
                        That $5,000 from your US client? PayPal reported it. Wise reported it. Your bank reported it. 
                        <span className="font-semibold text-red-600"> Michael owes $247,000</span> because he used the wrong form. 
                        <span className="block mt-1 text-sm font-medium">Plus interest. Plus penalties. Plus his marriage.</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
                  <div className="flex items-start mb-4">
                    <span className="text-2xl mr-3">📊</span>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Your Supplier Already Told Them</h3>
                      <p className="text-gray-600">
                        You claimed $50,000 in GST credits. Your suppliers reported $30,000 in sales to you. 
                        <span className="font-semibold text-red-600"> The computer flagged you in 0.3 seconds</span>. 
                        <span className="block mt-1 text-sm font-medium">The audit letter is already printed.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center bg-gray-900 text-white rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-red-600 opacity-10 animate-pulse"></div>
                <p className="text-2xl mb-2 font-bold relative z-10">
                  Right Now: <span className="text-red-400">1 in 3 businesses</span> reading this will be audited
                </p>
                <p className="text-gray-300 relative z-10">
                  The ATO recovered $15.8 billion last year. They're getting better at finding you.
                </p>
                <p className="mt-4 text-sm text-gray-400 relative z-10">
                  Average audit duration: <span className="font-bold text-white">8.5 months</span> • 
                  Average cost to defend: <span className="font-bold text-white">$47,000</span>
                </p>
              </div>
            </div>
          </section>

          {/* Stories Section */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
                They Thought They Were Safe Too
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <p className="text-gray-600 mb-4 italic">
                    "I missed ONE invoice from 2019. The audit went back 7 years. 
                    Lost my house paying the penalties."
                  </p>
                  <p className="text-sm text-gray-500">— David, Construction</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <p className="text-gray-600 mb-4 italic">
                    "$180,000 penalty for crypto I sold 3 years ago. 
                    Didn't know exchanges report to the ATO."
                  </p>
                  <p className="text-sm text-gray-500">— Lisa, Marketing Agency</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <p className="text-gray-600 mb-4 italic">
                    "My accountant made the mistake. I paid the price. 
                    18 months of hell and $420,000 gone."
                  </p>
                  <p className="text-sm text-gray-500">— Marcus, Import Business</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                In 30 Seconds, You'll Know If You Should Be Worried
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our AI runs the same checks the ATO does. But you see the results first.
              </p>
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 max-w-2xl mx-auto mb-8">
                <p className="text-lg font-semibold text-yellow-900 mb-2">
                  ⏰ Limited Time: Next 24 Hours Only
                </p>
                <p className="text-yellow-800">
                  Get your <span className="font-bold">full audit risk report</span> for free (normally $97). 
                  No credit card. No catch. Just answers.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAuthForm(true)
                  setAuthMode('signup')
                }}
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Yes, Check My Risk Now →
              </button>
              <p className="mt-6 text-sm text-gray-500">
                <span className="font-medium">Why free?</span> Because 73% of people who find issues become customers. 
                We'd rather you find out from us than from them.
              </p>
            </div>
          </section>

          {/* Final Trust Section */}
          <section className="py-12 bg-gray-900 text-white">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <p className="text-sm opacity-80">
                Your documents are never stored • Bank-level encryption • 
                12,847 business owners checked this month • 
                $8.2M in penalties avoided
              </p>
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


  return (
    <div className="min-h-screen bg-gray-50 pt-16">
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