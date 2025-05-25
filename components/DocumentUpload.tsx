import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useAuth } from '@/components/AuthProvider'
import { SCAN_TYPES, canUserScan, deductCredits, UserCredits } from '@/utils/credits'
import { AuditAnalysisResult } from '@/utils/types/analysis'
import { FileText, Zap, TrendingUp, Building2, Upload, AlertCircle } from 'lucide-react'
import AnalysisResults from './AnalysisResults'

// Dynamically import PDF.js to avoid SSR issues
const loadPdfjs = () => import('pdfjs-dist').then(pdfjs => {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
  return pdfjs
})

interface DocumentUploadProps {
  userCredits: UserCredits
  onCreditsUpdated: () => void
}

interface AnalysisResponse {
  analysis: AuditAnalysisResult
  scanId: string
  scanType: string
  timestamp: string
  success: boolean
}

export default function DocumentUpload({ userCredits, onCreditsUpdated }: DocumentUploadProps) {
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null)
  const [error, setError] = useState<string>('')
  const [scanType, setScanType] = useState<keyof typeof SCAN_TYPES>('basic')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseFileText = async (file: File): Promise<string> => {
    const fileType = file.type

    if (fileType === 'application/pdf') {
      const pdfjs = await loadPdfjs()
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
      let text = ''
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
        text += pageText + ' '
      }
      
      return text.trim()
    } else if (fileType === 'text/plain' || fileType === 'text/csv') {
      return await file.text()
    } else {
      throw new Error('Unsupported file type. Please upload PDF, TXT, or CSV files.')
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      const validTypes = ['application/pdf', 'text/plain', 'text/csv']
      if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile)
        setError('')
        setAnalysisResult(null) // Clear previous analysis
      } else {
        setError('Please select a PDF, TXT, or CSV file.')
        setFile(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file || !user) return

    setLoading(true)
    setError('')
    setAnalysisResult(null)

    try {
      // Check if user can perform scan
      const canScan = await canUserScan(user.uid, scanType)
      if (!canScan.canScan) {
        throw new Error(canScan.reason || 'Cannot perform scan')
      }

      const text = await parseFileText(file)
      
      if (text.length < 10) {
        throw new Error('Document appears to be empty or too short to analyze.')
      }

      // Get the ID token for authentication
      const idToken = await user.getIdToken()

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ 
          text, 
          scanType,
          documentName: file.name,
          fileType: file.type
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Analysis failed. Please try again.')
      }

      const analysisData: AnalysisResponse = await response.json()
      
      // Validate the response structure
      if (!analysisData.analysis || !analysisData.scanId) {
        throw new Error('Invalid analysis response. Please try again.')
      }
      
      setAnalysisResult(analysisData)
      
      // Update credits display
      onCreditsUpdated()
      
      // Clear file from memory
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err: any) {
      console.error('Analysis error:', err)
      setError(err.message || 'An error occurred during analysis.')
    } finally {
      setLoading(false)
    }
  }

  const handleNewScan = () => {
    setAnalysisResult(null)
    setError('')
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const scanTypeIcons = {
    basic: <Zap className="w-5 h-5" />,
    deep: <TrendingUp className="w-5 h-5" />,
    ultra: <Building2 className="w-5 h-5" />
  }

  const scanTypeColors = {
    basic: 'border-blue-200 bg-blue-50',
    deep: 'border-purple-200 bg-purple-50',
    ultra: 'border-orange-200 bg-orange-50'
  }

  const scanTypeActiveColors = {
    basic: 'border-blue-500 bg-blue-100',
    deep: 'border-purple-500 bg-purple-100',
    ultra: 'border-orange-500 bg-orange-100'
  }

  // If we have analysis results, show them
  if (analysisResult) {
    return (
      <div className="space-y-6">
        {/* New Scan Button */}
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <button
            onClick={handleNewScan}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            ← Start New Analysis
          </button>
        </div>

        {/* Analysis Results */}
        <AnalysisResults 
          result={analysisResult.analysis}
          scanType={analysisResult.scanType}
          scanId={analysisResult.scanId}
          timestamp={analysisResult.timestamp}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Scan Type Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Choose Scan Depth</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {(Object.entries(SCAN_TYPES) as [keyof typeof SCAN_TYPES, typeof SCAN_TYPES[keyof typeof SCAN_TYPES]][]).map(([type, config]) => (
            <button
              key={type}
              onClick={() => setScanType(type)}
              disabled={userCredits.credits < config.credits}
              className={`relative p-4 rounded-lg border-2 transition-all ${
                scanType === type 
                  ? scanTypeActiveColors[type] 
                  : userCredits.credits < config.credits 
                    ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                    : `${scanTypeColors[type]} hover:${scanTypeActiveColors[type]} cursor-pointer`
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  scanType === type ? 'bg-white' : 'bg-white/70'
                }`}>
                  {scanTypeIcons[type]}
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-gray-900">{config.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700 bg-gray-200 px-2 py-1 rounded">
                      {config.credits} credit{config.credits !== 1 ? 's' : ''}
                    </span>
                    {userCredits.credits < config.credits && (
                      <span className="text-xs text-red-600">
                        Insufficient credits
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {scanType === type && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
        
        {/* Features List */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            {SCAN_TYPES[scanType].name} includes:
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {SCAN_TYPES[scanType].features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* New Features Highlight */}
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-800 mb-2">🎉 New! Visual Risk Dashboard</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Interactive risk assessment gauge</li>
            <li>• Detailed red flags with penalty calculations</li>
            <li>• Actionable timeline with deadlines</li>
            <li>• Required forms with pre-fill data</li>
            <li>• Professional recommendations</li>
          </ul>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h3 className="text-lg font-semibold mb-4">Upload Document for Analysis</h3>
        
        <div className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg p-8 text-center transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.csv"
            onChange={handleFileSelect}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer block w-full"
          >
            <div className="space-y-3">
              <Upload className="w-12 h-12 mx-auto text-gray-400" />
              <div>
                <p className="text-base font-medium text-gray-700">
                  Drop your document here or click to browse
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports PDF, TXT, or CSV files up to 10MB
                </p>
              </div>
            </div>
          </label>
        </div>
        
        {/* Rate Limit Warning */}
        {userCredits.scansToday >= 8 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-amber-800 font-medium">Approaching daily limit</p>
              <p className="text-amber-700">You've used {userCredits.scansToday} of 10 scans today.</p>
            </div>
          </div>
        )}
      </div>

      {file && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">{file.name}</p>
                <p className="text-sm text-blue-600">
                  {(file.size / 1024).toFixed(1)} KB • {SCAN_TYPES[scanType].name} ({SCAN_TYPES[scanType].credits} credit{SCAN_TYPES[scanType].credits !== 1 ? 's' : ''})
                </p>
              </div>
            </div>
            <button
              onClick={handleUpload}
              disabled={loading || userCredits.credits < SCAN_TYPES[scanType].credits}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </div>
              ) : 'Analyze Document'}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <span className="text-red-500 text-xl">⚠️</span>
          <div>
            <p className="text-red-800 font-medium">Analysis Error</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}