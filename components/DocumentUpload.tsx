import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import PDF.js to avoid SSR issues
const loadPdfjs = () => import('pdfjs-dist').then(pdfjs => {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
  return pdfjs
})

interface DocumentUploadProps {
  isDemo?: boolean
  onDemoUsed?: () => void
}

export default function DocumentUpload({ isDemo = false, onDemoUsed }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<string>('')
  const [error, setError] = useState<string>('')
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
        setAnalysis('')
      } else {
        setError('Please select a PDF, TXT, or CSV file.')
        setFile(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setError('')
    setAnalysis('')

    try {
      const text = await parseFileText(file)
      
      if (text.length < 10) {
        throw new Error('Document appears to be empty or too short to analyze.')
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed. Please try again.')
      }

      const { analysis } = await response.json()
      
      if (isDemo) {
        // For demo mode, show partial results
        const lines = analysis.split('\n')
        const demoAnalysis = lines.slice(0, 10).join('\n') + 
          '\n\n---\n\n**🔒 Demo Mode - Showing partial results**\n\n' +
          '✨ **Unlock full report for just $10:**\n' +
          '- See all compliance risks identified\n' +
          '- Get detailed recommendations\n' +
          '- Unlimited document scans\n' +
          '- Lifetime access\n\n' +
          '*[Upgrade Now to See Full Report]*'
        
        setAnalysis(demoAnalysis)
        
        // Mark demo as used
        if (onDemoUsed) {
          onDemoUsed()
        }
      } else {
        setAnalysis(analysis)
      }
      
      // Clear file from memory
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
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
              <div className="text-5xl">📄</div>
              <div>
                <p className="text-base font-medium text-gray-700">
                  Drop your document here or click to browse
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports PDF, TXT, or CSV files up to 10MB
                </p>
              </div>
              {isDemo && (
                <p className="text-xs text-blue-600 font-medium">
                  🎁 Free demo - 1 scan available
                </p>
              )}
            </div>
          </label>
        </div>
      </div>

      {file && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-blue-800">{file.name}</p>
              <p className="text-sm text-blue-600">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={handleUpload}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded transition-colors"
            >
              {loading ? 'Analyzing...' : 'Analyze Document'}
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

      {analysis && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📊</span>
            <h3 className="text-lg font-bold text-gray-900">Compliance Analysis Report</h3>
          </div>
          <div 
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ 
              __html: analysis
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900">$1</strong>')
                .replace(/##\s(.*?)(<br>|$)/g, '<h3 class="text-lg font-semibold mt-4 mb-2 text-gray-900">$1</h3>')
                .replace(/🚩/g, '<span class="text-red-500">🚩</span>')
                .replace(/✅/g, '<span class="text-green-500">✅</span>')
                .replace(/⚠️/g, '<span class="text-yellow-500">⚠️</span>')
                .replace(/💰/g, '<span class="text-green-500">💰</span>')
                .replace(/📄/g, '<span class="text-blue-500">📄</span>')
                .replace(/🔒/g, '<span class="text-gray-500">🔒</span>')
                .replace(/✨/g, '<span class="text-yellow-500">✨</span>')
                .replace(/\[Upgrade Now to See Full Report\]/g, '<button class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">Upgrade Now to See Full Report</button>')
            }}
          />
        </div>
      )}
    </div>
  )
}