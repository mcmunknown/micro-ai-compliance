import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/components/AuthProvider'
import PayNowButton from '@/components/PayNowButton'
import DocumentUpload from '@/components/DocumentUpload'
import LandingPage from '@/components/LandingPage'

export default function Home() {
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle, logout } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [authError, setAuthError] = useState('')
  const [hasPaid, setHasPaid] = useState(false)
  const [hasUsedDemo, setHasUsedDemo] = useState(false)
  const [showAuthForm, setShowAuthForm] = useState(false)
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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password)
      } else {
        await signInWithEmail(email, password)
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      if (error.code === 'auth/operation-not-allowed') {
        setAuthError('Email/password sign in is not enabled. Please enable it in Firebase Console.')
      } else if (error.code === 'auth/invalid-email') {
        setAuthError('Invalid email address')
      } else if (error.code === 'auth/weak-password') {
        setAuthError('Password should be at least 6 characters')
      } else if (error.code === 'auth/email-already-in-use') {
        setAuthError('This email is already registered. Switching to sign in...')
        setIsSignUp(false)
        // Try to sign in automatically
        setTimeout(async () => {
          try {
            await signInWithEmail(email, password)
          } catch (signInError: any) {
            if (signInError.code === 'auth/wrong-password') {
              setAuthError('Account exists. Please enter your password to sign in.')
            } else if (signInError.code === 'auth/invalid-credential') {
              setAuthError('Account exists but password is incorrect.')
            } else {
              setAuthError('Account exists. Please sign in with your password.')
            }
          }
        }, 500)
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        if (!isSignUp) {
          setAuthError('No account found. Creating a new account...')
          setIsSignUp(true)
          // Try to sign up automatically
          setTimeout(async () => {
            try {
              await signUpWithEmail(email, password)
            } catch (signUpError: any) {
              if (signUpError.code === 'auth/weak-password') {
                setAuthError('Please use a stronger password (at least 6 characters)')
              } else {
                setAuthError('Ready to create your account. Click Sign Up.')
              }
            }
          }, 500)
        } else {
          setAuthError('No account found with this email.')
        }
      } else if (error.code === 'auth/wrong-password') {
        setAuthError('Incorrect password')
      } else {
        setAuthError(error.message || 'Authentication failed')
      }
    }
  }

  const handleGoogleAuth = async () => {
    setAuthError('')
    try {
      await signInWithGoogle()
    } catch (error: any) {
      console.error('Google auth error:', error)
      if (error.code === 'auth/operation-not-allowed') {
        setAuthError('Google sign in is not enabled. Please enable it in Firebase Console.')
      } else if (error.code === 'auth/popup-blocked') {
        setAuthError('Popup blocked. Please allow popups for this site.')
      } else {
        setAuthError(error.message || 'Google sign-in failed')
      }
    }
  }

  if (!user) {
    if (!showAuthForm) {
      return (
        <LandingPage 
          onSignIn={() => {
            setShowAuthForm(true)
            setIsSignUp(false)
          }}
          onSignUp={() => {
            setShowAuthForm(true)
            setIsSignUp(true)
          }}
        />
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setShowAuthForm(false)}
            className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            ← Back to home
          </button>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {isSignUp ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600 mb-6">
              {isSignUp 
                ? 'Start with a free demo scan, then unlock unlimited access for just $10' 
                : 'Sign in to access your compliance scanner'}
            </p>
            
            <form onSubmit={handleEmailAuth} className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {isSignUp ? 'Sign Up for Free Demo' : 'Sign In'}
              </button>
            </form>
            
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <button
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors mb-4"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
            
            <p className="text-center text-sm text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:underline ml-1 font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
            
            {authError && (
              <div className={`mt-4 p-4 rounded-lg border ${
                authError.includes('Switching') 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className={`text-sm font-medium ${
                  authError.includes('Switching') 
                    ? 'text-blue-700' 
                    : 'text-red-700'
                }`}>
                  {authError}
                </p>
                {authError.includes('Account exists') && (
                  <p className="text-xs mt-2 text-gray-600">
                    Tip: Use the same password you created when you first signed up.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
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