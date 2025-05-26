import { useState, useEffect } from 'react'

interface DisclaimerModalProps {
  onAccept: () => void
}

export default function DisclaimerModal({ onAccept }: DisclaimerModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasAccepted, setHasAccepted] = useState(false)

  useEffect(() => {
    // Check if user has already accepted disclaimer
    const accepted = localStorage.getItem('disclaimerAccepted')
    if (!accepted) {
      setIsOpen(true)
    } else {
      setHasAccepted(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('disclaimerAccepted', 'true')
    setHasAccepted(true)
    setIsOpen(false)
    onAccept()
  }

  if (!isOpen || hasAccepted) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-3xl font-bold text-red-600 mb-2">IMPORTANT LEGAL DISCLAIMER</h2>
            <p className="text-xl text-gray-700">Please read carefully before proceeding</p>
          </div>

          <div className="space-y-4 text-gray-800 mb-8">
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="font-bold text-lg mb-2">This is NOT Tax or Legal Advice</p>
              <p>This tool provides educational analysis only. It does not constitute professional tax, legal, or financial advice.</p>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <p className="font-bold text-lg mb-2">For Educational Purposes Only</p>
              <p>All analysis, recommendations, and information provided are for educational and informational purposes only.</p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">By using this service, you acknowledge that:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You should consult qualified professionals for actual tax advice</li>
                <li>We are not responsible for any decisions made based on this analysis</li>
                <li>The ATO may have different interpretations of tax law</li>
                <li>Tax laws change frequently and our analysis may not reflect current law</li>
                <li>You use this service entirely at your own risk</li>
              </ul>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="font-bold text-lg mb-2">Always Seek Professional Help</p>
              <p>For any real tax compliance issues, always consult with a registered tax agent, accountant, or lawyer.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => window.location.href = 'https://www.ato.gov.au'}
              className="flex-1 py-4 px-6 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go to ATO Website Instead
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 py-4 px-6 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
            >
              I Understand - Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}