import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/components/AuthProvider'
import PayNowButton from '@/components/PayNowButton'
import DocumentUpload from '@/components/DocumentUpload'
import LandingPage from '@/components/LandingPage'
import AuthForm from '@/components/AuthForm'

export default function Home() {
  const { user, logout } = useAuth()
  const [hasPaid, setHasPaid] = useState(false)
  const [hasUsedDemo, setHasUsedDemo] = useState(false)
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
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
  }, [router.query])


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

  const isDemoMode = !hasPaid && !hasUsedDemo

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
              {hasPaid && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  PRO
                </span>
              )}
              {isDemoMode && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  DEMO MODE
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
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
        
        {router.query.cancelled === 'true' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              Payment was cancelled. Complete your purchase to unlock unlimited scans.
            </p>
          </div>
        )}
        
        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-1">🎁 Free Demo Mode</h3>
            <p className="text-blue-700 text-sm">
              You can scan one document for free! After your demo scan, upgrade for just $10 to unlock:
            </p>
            <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
              <li>Unlimited document scans</li>
              <li>Full detailed compliance reports</li>
              <li>Lifetime access - no subscriptions</li>
            </ul>
          </div>
        )}

        {/* After Demo Used */}
        {hasUsedDemo && !hasPaid && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Demo Scan Complete!
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You've used your free demo scan. Unlock unlimited scans and full reports for just $10 - one time payment, lifetime access.
            </p>
            <PayNowButton />
            <p className="mt-4 text-sm text-gray-500">
              No subscriptions • Instant access • 100% secure payment via Stripe
            </p>
          </div>
        )}
        
        {/* Paid User View */}
        {hasPaid && (
          <div>
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-green-800 font-medium">✅ Full Access Unlocked!</p>
                <p className="text-green-600 text-sm">Scan unlimited documents with detailed compliance reports.</p>
              </div>
              <div className="text-green-700 text-sm font-medium">
                Lifetime Access
              </div>
            </div>
            <DocumentUpload isDemo={false} onDemoUsed={() => {}} />
          </div>
        )}

        {/* Demo Mode Document Upload */}
        {isDemoMode && (
          <DocumentUpload 
            isDemo={true} 
            onDemoUsed={() => {
              setHasUsedDemo(true)
              localStorage.setItem('hasUsedDemo', 'true')
            }}
          />
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
    </div>
  )
}