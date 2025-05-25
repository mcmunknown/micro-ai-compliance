interface LandingPageProps {
  onSignIn: () => void
  onSignUp: () => void
}

export default function LandingPage({ onSignIn, onSignUp }: LandingPageProps) {
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
              onClick={onSignIn}
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
              Tax Compliance
              <span className="block text-primary-600">Made Simple</span>
            </h1>
            <p className="mt-6 text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto">
              AI-powered document scanning for ATO/IRS compliance risks. 
              Catch issues before they catch you.
            </p>
          </div>
          
          <div className="mt-10 animate-slide-up">
            <button
              onClick={onSignUp}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              Start Free Demo →
            </button>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required • 1 free scan
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

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-primary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors">
                <span className="text-3xl">📄</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Upload Document</h3>
              <p className="text-gray-600">
                Drop your PDF, CSV, or TXT tax documents securely
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-primary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">2. AI Analysis</h3>
              <p className="text-gray-600">
                Claude AI scans for compliance risks instantly
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-primary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Get Report</h3>
              <p className="text-gray-600">
                Receive detailed risk analysis with actionable insights
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Privacy First
              </h3>
              <p className="text-gray-600 mb-6">
                Your documents are never stored. All processing happens in your browser, 
                and only the text is sent for analysis. After processing, everything is deleted.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Zero data retention</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Browser-side processing</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Encrypted transmission</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Simple Pricing
              </h3>
              <p className="text-gray-600 mb-6">
                Start with a free demo scan to see how it works. 
                Then unlock unlimited access forever with a one-time payment.
              </p>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-gray-900">$10</span>
                  <span className="ml-2 text-gray-600">one-time</span>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Unlimited document scans</li>
                  <li>✓ Full compliance reports</li>
                  <li>✓ Lifetime access</li>
                  <li>✓ No subscriptions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">
                How does the AI identify compliance risks?
              </h3>
              <p className="text-gray-600">
                We use Claude 3.5 Sonnet to analyze your documents for common red flags like 
                large cash transactions, offshore payments, missing documentation, and unusual patterns 
                that might trigger ATO/IRS audits.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">
                Is this a replacement for professional tax advice?
              </h3>
              <p className="text-gray-600">
                No. This tool helps identify potential risks for your review, but always 
                consult a qualified tax professional for specific advice about your situation.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">
                What file types are supported?
              </h3>
              <p className="text-gray-600">
                We support PDF, TXT, and CSV files up to 10MB. Most tax documents, 
                invoices, and financial statements work perfectly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to scan your first document?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands who've already found compliance issues before the tax office did.
          </p>
          <button
            onClick={onSignUp}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            Get Started Free →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-lg font-bold text-gray-900">TaxScanner AI</span>
              <p className="text-sm text-gray-500 mt-1">
                Compliance made simple
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>Powered by Claude AI</span>
              <span>•</span>
              <span>Secured by Firebase</span>
              <span>•</span>
              <span>Payments by Stripe</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}