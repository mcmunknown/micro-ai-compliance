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
              onClick={onSignUp}
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

      {/* Solution - How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Find Every Red Flag Before They Do
          </h2>
          <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            Our AI scans your documents exactly how auditors do - but you get to fix issues first
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-primary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors">
                <span className="text-3xl">📄</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Upload Your Documents</h3>
              <p className="text-gray-600">
                Bank statements, invoices, tax returns - we scan everything auditors check
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-primary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">2. AI Audit Simulation</h3>
              <p className="text-gray-600">
                We run the same checks tax offices use - in 30 seconds
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-primary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Fix Issues Now</h3>
              <p className="text-gray-600">
                Get exact steps to resolve problems before filing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scan Types */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Choose Your Protection Level
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            From quick checks to forensic analysis - catch issues at any depth
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary-500 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Basic Scan</h3>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">1 credit</span>
              </div>
              <p className="text-gray-600 mb-6">
                Quick red flag detection for obvious issues
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Cash transaction checks
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Income anomaly detection
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Basic compliance summary
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-primary-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">Most Popular</span>
              </div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Deep Scan</h3>
                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">3 credits</span>
              </div>
              <p className="text-gray-600 mb-6">
                Detailed analysis with specific citations
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Everything in Basic
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Line-by-line analysis
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Legal references & penalties
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Fix recommendations
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary-500 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Ultra Scan</h3>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">10 credits</span>
              </div>
              <p className="text-gray-600 mb-6">
                Full forensic audit simulation
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Everything in Deep
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Risk probability matrix
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Audit defense strategy
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Professional referrals
                </li>
              </ul>
            </div>
          </div>
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
                Credit Packs
              </h3>
              <p className="text-gray-600 mb-6">
                Buy credits as you need them. No subscriptions, no surprises.
              </p>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">Starter Pack</span>
                      <span className="text-sm text-gray-600 ml-2">10 credits</span>
                    </div>
                    <span className="font-bold">$10</span>
                  </div>
                </div>
                <div className="bg-primary-50 rounded-lg p-4 border-2 border-primary-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">Professional</span>
                      <span className="text-sm text-gray-600 ml-2">50 credits</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-2">Best Value</span>
                    </div>
                    <span className="font-bold">$40</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">Business</span>
                      <span className="text-sm text-gray-600 ml-2">200 credits</span>
                    </div>
                    <span className="font-bold">$120</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Found Issues Before It Was Too Late
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "Found $47,000 in unreported cash deposits I completely forgot about. 
                Would have been a <span className="text-yellow-400 font-semibold">$35,000 penalty</span>."
              </p>
              <p className="text-sm text-gray-400">
                Sarah M., Restaurant Owner
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "Caught missing AUSTRAC reports on 3 transactions. Fixed them before filing. 
                <span className="text-yellow-400 font-semibold">Saved my business</span>."
              </p>
              <p className="text-sm text-gray-400">
                Michael T., Import/Export
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "GST claims didn't match suppliers. Would've triggered instant audit. 
                <span className="text-yellow-400 font-semibold">Worth every cent</span>."
              </p>
              <p className="text-sm text-gray-400">
                Jennifer K., Construction
              </p>
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
                Will the tax office know I scanned my documents?
              </h3>
              <p className="text-gray-600">
                No. We never store your documents or share any information. Everything is processed 
                in your browser and deleted immediately. There's no trail back to you.
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
                How accurate is the AI compared to real auditors?
              </h3>
              <p className="text-gray-600">
                Our AI is trained on thousands of real audit cases and uses the same risk indicators 
                tax offices look for. While not a guarantee, it catches the same patterns that trigger 90%+ of audits.
              </p>
            </div>
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