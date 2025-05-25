import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from './AuthProvider'

interface AuthFormProps {
  initialMode: 'signin' | 'signup'
  onBack: () => void
}

export default function AuthForm({ initialMode, onBack }: AuthFormProps) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState(initialMode)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password)
      } else {
        await signInWithEmail(email, password)
      }
      // Success - user will be redirected by auth state change
    } catch (err: any) {
      setLoading(false)
      
      // Handle specific Firebase errors
      switch (err.code) {
        case 'auth/email-already-in-use':
          setMode('signin')
          setError('This email is already registered. Please sign in.')
          setPassword('') // Clear password for security
          break
        
        case 'auth/user-not-found':
        case 'auth/invalid-credential':
          if (mode === 'signin') {
            setMode('signup')
            setError('No account found. Please create a new account.')
            setPassword('')
          } else {
            setError('Invalid credentials. Please try again.')
          }
          break
        
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.')
          break
        
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.')
          break
        
        case 'auth/invalid-email':
          setError('Please enter a valid email address.')
          break
        
        default:
          setError('An error occurred. Please try again.')
      }
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    
    try {
      await signInWithGoogle()
    } catch (err: any) {
      setLoading(false)
      setError('Google sign-in failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-gray-800 flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </button>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600 mb-8">
            {mode === 'signup' 
              ? 'Start with a free demo scan' 
              : 'Sign in to your account'}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.01]"
            >
              {loading ? 'Please wait...' : (mode === 'signup' ? 'Create Account' : 'Sign In')}
            </button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google" 
                className="w-5 h-5" 
              />
              <span className="text-gray-700 font-medium">Continue with Google</span>
            </button>
          </div>
          
          <p className="mt-8 text-center text-sm text-gray-600">
            {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => {
                setMode(mode === 'signup' ? 'signin' : 'signup')
                setError('')
                setPassword('')
              }}
              className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
            >
              {mode === 'signup' ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}