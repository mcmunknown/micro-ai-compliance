import { useState } from 'react'

interface LandingPageProps {
  onSignIn: () => void
  onSignUp: () => void
}

export default function LandingPage({ onSignIn, onSignUp }: LandingPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [authError, setAuthError] = useState('')
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI Tax Compliance Scanner
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Scan your tax documents, invoices, or CSVs for compliance risks before the ATO/IRS does.
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center">
              ✅ No documents stored
            </span>
            <span className="flex items-center">
              🔒 Privacy-first
            </span>
            <span className="flex items-center">
              ⚡ Instant results
            </span>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="font-semibold mb-2">1. Upload Document</h3>
              <p className="text-gray-600">Upload your PDF, CSV, or TXT tax documents</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="font-semibold mb-2">2. AI Analysis</h3>
              <p className="text-gray-600">Claude AI scans for ATO/IRS compliance risks</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-semibold mb-2">3. Get Report</h3>
              <p className="text-gray-600">Receive detailed risk analysis instantly</p>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500 mb-4">Trusted by accountants and small business owners</p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Firebase" className="h-6" />
              <span className="text-sm text-gray-600">Secured by Firebase</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-bold">Stripe</span>
              <span className="text-sm text-gray-600">Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-600 font-bold">Claude AI</span>
              <span className="text-sm text-gray-600">Analysis</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h3 className="font-semibold mb-2">🔒 Is my data private?</h3>
              <p className="text-gray-600">
                Yes! We never store your documents. All processing happens in your browser, 
                and only the text is sent to our AI for analysis. After analysis, everything is deleted.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🤖 How does the AI work?</h3>
              <p className="text-gray-600">
                We use Claude 3.5 Sonnet, an advanced AI model trained to identify tax compliance risks. 
                It scans for red flags like large cash transactions, offshore payments, and documentation gaps.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">💰 What do I get for $10?</h3>
              <p className="text-gray-600">
                You get unlimited document scans forever! The first scan is free (demo mode shows partial results), 
                then pay once for lifetime access to full reports.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">📊 Is this tax advice?</h3>
              <p className="text-gray-600">
                No, this tool identifies potential compliance risks for your review. 
                Always consult a qualified tax professional for specific advice.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Placeholder */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">What Users Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-yellow-400 mb-2">★★★★★</div>
              <p className="text-gray-600 italic mb-2">
                "Found issues I completely missed. Worth every penny!"
              </p>
              <p className="text-sm text-gray-500">- Small Business Owner</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-yellow-400 mb-2">★★★★★</div>
              <p className="text-gray-600 italic mb-2">
                "Saved me from a potential audit nightmare. Amazing tool!"
              </p>
              <p className="text-sm text-gray-500">- Freelancer</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-yellow-400 mb-2">★★★★★</div>
              <p className="text-gray-600 italic mb-2">
                "Simple, fast, and actually useful. Highly recommend!"
              </p>
              <p className="text-sm text-gray-500">- E-commerce Seller</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={onSignUp}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
          >
            Try Free Demo - No Credit Card Required
          </button>
          <p className="mt-4 text-sm text-gray-500">
            Already have an account? 
            <button onClick={onSignIn} className="text-blue-600 hover:underline ml-1">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}