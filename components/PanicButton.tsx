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
                TALK TO TAX EXPERT NOW
              </h2>
              <p className="text-gray-600">
                Stop panicking. Get answers. Fix it together.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold">Available 24/7</p>
                  <p className="text-sm text-gray-600">Experts standing by right now</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold">$49 for 30 minutes</p>
                  <p className="text-sm text-gray-600">Most issues resolved in one call</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-semibold">100% Confidential</p>
                  <p className="text-sm text-gray-600">Licensed tax professionals</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                They'll help you with:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Understanding what went wrong</li>
                <li>✓ Filing corrections immediately</li>
                <li>✓ Dealing with penalties & notices</li>
                <li>✓ Preventing future problems</li>
              </ul>
            </div>

            <div className="space-y-3">
              <a
                href="tel:1-800-TAX-HELP"
                className="block w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 font-bold text-center transition-colors"
              >
                📞 CALL NOW: 1-800-TAX-HELP
              </a>

              <button
                onClick={() => {
                  // In a real app, this would open a chat widget
                  alert('Chat feature coming soon! Please call 1-800-TAX-HELP for immediate assistance.')
                }}
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-bold text-center transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                START LIVE CHAT
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Average wait time: Under 2 minutes
            </p>
          </div>
        </div>
      )}
    </>
  )
}