import React, { useState } from 'react'
import { Phone, MessageCircle, Clock, DollarSign, Shield, X } from 'lucide-react'

export default function PanicButton() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      {/* Floating Panic Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 z-40 group animate-pulse"
        aria-label="Get Expert Help Now"
      >
        <div className="flex items-center gap-2">
          <Phone className="w-6 h-6" />
          <span className="hidden group-hover:inline font-bold">HELP!</span>
        </div>
      </button>

      {/* Expert Help Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                LEARN ABOUT TAX COMPLIANCE
              </h2>
              <p className="text-gray-600">
                Educational resources to understand Australian tax requirements.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold">ATO Contact Hours: Mon-Fri 8am-6pm AEST</p>
                  <p className="text-sm text-gray-600">Official ATO resources and guides available</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold">Free ATO Resources</p>
                  <p className="text-sm text-gray-600">Educational guides and compliance tools</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-semibold">Educational Purpose Only</p>
                  <p className="text-sm text-gray-600">Not a substitute for professional advice</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Learn about:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ ATO compliance requirements</li>
                <li>✓ How to use myGov/ATO portal</li>
                <li>✓ Understanding penalties & notices</li>
                <li>✓ AUSTRAC reporting requirements</li>
              </ul>
            </div>

            <div className="space-y-3">
              <a
                href="https://www.ato.gov.au/about-ato/contact-us"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-bold text-center transition-colors"
              >
                📚 ATO RESOURCES & GUIDES
              </a>

              <button
                onClick={() => {
                  window.open('https://www.ato.gov.au/calculators-and-tools', '_blank')
                }}
                className="block w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 font-bold text-center transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                ATO CALCULATORS & TOOLS
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              For professional advice, consult a registered tax agent
            </p>
          </div>
        </div>
      )}
    </>
  )
}