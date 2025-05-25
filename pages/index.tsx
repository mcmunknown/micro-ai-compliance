import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/components/AuthProvider'
import PayNowButton from '@/components/PayNowButton'
import DocumentUpload from '@/components/DocumentUpload'

export default function Home() {
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle, logout } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [authError, setAuthError] = useState('')
  const [hasPaid, setHasPaid] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (router.query.paid === 'true') {
      setHasPaid(true)
      localStorage.setItem('hasPaid', 'true')
    } else if (localStorage.getItem('hasPaid') === 'true') {
      setHasPaid(true)
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
        setAuthError('Email already registered. Try signing in instead.')
      } else if (error.code === 'auth/user-not-found') {
        setAuthError('No account found with this email. Try signing up.')
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
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            AI Compliance Scanner
          </h1>
          <p className="text-gray-600 mb-6">
            Scan documents for ATO/IRS compliance and audit risks.
          </p>
          
          <form onSubmit={handleEmailAuth} className="space-y-4 mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
          
          <button
            onClick={handleGoogleAuth}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors mb-4"
          >
            Sign in with Google
          </button>
          
          <p className="text-center text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-500 hover:underline ml-1"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
          
          {authError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{authError}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              AI Compliance Scanner
            </h1>
            <p className="text-sm text-gray-600">
              Welcome, {user.email}
            </p>
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Sign Out
          </button>
        </div>
        
        {router.query.cancelled === 'true' && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">Payment was cancelled. Please try again to unlock the scanner.</p>
          </div>
        )}
        
        {!hasPaid ? (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Unlock Document Analysis
            </h2>
            <p className="text-gray-600 mb-6">
              Pay $10 to unlock AI-powered compliance scanning for your documents.
            </p>
            <PayNowButton />
          </div>
        ) : (
          <div>
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">✅ Scanner Unlocked!</p>
              <p className="text-green-600 text-sm">Upload your documents for compliance analysis.</p>
            </div>
            <DocumentUpload />
          </div>
        )}
      </div>
    </div>
  )
}