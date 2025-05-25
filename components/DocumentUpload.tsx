import { useState, useRef } from 'react'
import * as pdfjs from 'pdfjs-dist'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export default function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<string>('')
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseFileText = async (file: File): Promise<string> => {
    const fileType = file.type

    if (fileType === 'application/pdf') {
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
      setAnalysis(analysis)
      
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
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
          <div className="space-y-2">
            <div className="text-4xl">📄</div>
            <div className="text-sm text-gray-600">
              Click to select a document
            </div>
            <div className="text-xs text-gray-500">
              PDF, TXT, or CSV files only
            </div>
          </div>
        </label>
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {analysis && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-bold text-green-800 mb-2">Analysis Results:</h3>
          <div 
            className="prose prose-sm text-green-700"
            dangerouslySetInnerHTML={{ 
              __html: analysis.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
            }}
          />
        </div>
      )}
    </div>
  )
}