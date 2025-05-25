import { useState } from 'react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          AI Compliance Scanner
        </h1>
        <p className="text-gray-600 mb-6">
          Scan documents for ATO/IRS compliance and audit risks.
        </p>
        
        {/* Auth state will be added here */}
        <div className="text-center">
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    </div>
  )
}