import { NextApiRequest, NextApiResponse } from 'next'
import { analyzeDocumentStructured } from '@/utils/openrouter'
import { serverCanUserScan, serverDeductCredits, SCAN_TYPES, storeAnalysisMetadata } from '@/utils/firebase-admin'
import { isValidAnalysisResult, generateScanId, AuditAnalysisResult } from '@/utils/types/analysis'
import { getAuth } from 'firebase-admin/auth'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { withRateLimit, scanLimiter } from '@/middleware/rateLimiter'

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

// 🛡️ SECURITY: File size and content limits
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_TEXT_LENGTH = 100000 // 100k characters
const ALLOWED_FILE_TYPES = ['application/pdf', 'text/plain', 'text/csv', 'application/vnd.ms-excel']

async function analyzeHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // 🔒 SECURITY: Verify Firebase authentication token
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' })
  }

  const token = authHeader.split('Bearer ')[1]
  let userId: string

  try {
    const decodedToken = await getAuth().verifyIdToken(token)
    userId = decodedToken.uid
  } catch (error) {
    console.error('Token verification failed:', error)
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  const { text, scanType = 'basic', documentName = 'document', fileType } = req.body

  // 🛡️ SECURITY: Validate input data
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Document text is required' })
  }

  // 🛡️ SECURITY: Check file size limit
  const textSizeBytes = Buffer.byteLength(text, 'utf8')
  if (textSizeBytes > MAX_FILE_SIZE) {
    return res.status(413).json({ 
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
    })
  }

  // 🛡️ SECURITY: Check text length limit
  if (text.length > MAX_TEXT_LENGTH) {
    return res.status(413).json({ 
      error: `Document too long. Maximum ${MAX_TEXT_LENGTH} characters allowed` 
    })
  }

  // 🛡️ SECURITY: Validate file type if provided
  if (fileType && !ALLOWED_FILE_TYPES.includes(fileType)) {
    return res.status(400).json({ 
      error: 'Invalid file type. Only PDF, TXT, and CSV files are allowed' 
    })
  }

  // 🛡️ SECURITY: Basic content sanitization
  const sanitizedText = text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .trim()

  if (!sanitizedText || sanitizedText.length < 10) {
    return res.status(400).json({ error: 'Document content is too short or invalid' })
  }

  if (!SCAN_TYPES[scanType as keyof typeof SCAN_TYPES]) {
    return res.status(400).json({ error: 'Invalid scan type' })
  }

  // 🛡️ SECURITY: Rate limiting check (user-specific)
  const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress
  console.log(`Scan request from user ${userId}, IP: ${clientIP}`)

  try {
    // 🔒 SECURITY: Check if user has enough credits and hasn't exceeded limits (SERVER-SIDE)
    const { canScan, reason } = await serverCanUserScan(userId, scanType as keyof typeof SCAN_TYPES)
    if (!canScan) {
      return res.status(403).json({ error: reason })
    }

    // Process the document analysis with structured format
    console.log(`Starting structured analysis for user ${userId}, scan type: ${scanType}`)
    const structuredAnalysis = await analyzeDocumentStructured(
      sanitizedText, 
      scanType as keyof typeof SCAN_TYPES
    )
    
    // 🔒 VALIDATION: Validate the structured response
    if (!isValidAnalysisResult(structuredAnalysis)) {
      console.error('Invalid analysis result structure received from AI')
      return res.status(500).json({ 
        error: 'Analysis failed - invalid response format. Please try again.' 
      })
    }

    // 🔒 SECURITY: Additional validation of critical fields
    if (structuredAnalysis.summary.auditRiskScore < 0 || structuredAnalysis.summary.auditRiskScore > 100) {
      console.error('Invalid audit risk score:', structuredAnalysis.summary.auditRiskScore)
      return res.status(500).json({ 
        error: 'Analysis failed - invalid risk assessment. Please try again.' 
      })
    }

    // 🔒 VALIDATION: Ensure red flags have valid data
    for (const flag of structuredAnalysis.redFlags) {
      if (!flag.id || !flag.issue || !flag.penalty || typeof flag.penalty.amount !== 'number') {
        console.error('Invalid red flag structure:', flag)
        return res.status(500).json({ 
          error: 'Analysis failed - invalid red flag data. Please try again.' 
        })
      }
    }

    // 🔒 SECURITY: Deduct credits ONLY after successful processing (SERVER-SIDE)
    const success = await serverDeductCredits(userId, scanType as keyof typeof SCAN_TYPES, documentName)
    if (!success) {
      return res.status(500).json({ error: 'Failed to deduct credits' })
    }

    // Generate a unique scan ID for this analysis
    const scanId = generateScanId()
    
    // Store scan metadata for history
    try {
      await storeAnalysisMetadata(userId, {
        scanId,
        documentName,
        scanType,
        timestamp: new Date(),
        riskScore: structuredAnalysis.summary.auditRiskScore,
        redFlagsCount: structuredAnalysis.redFlags.length,
        complianceScore: structuredAnalysis.summary.complianceScore,
        estimatedPenalties: structuredAnalysis.summary.estimatedPenalties.likely
      })
    } catch (historyError) {
      // Don't fail the analysis if history storage fails
      console.error('Failed to store scan history:', historyError)
    }
    
    console.log(`Analysis completed successfully for user ${userId}, scan ID: ${scanId}`)
    
    // Return structured analysis result
    res.status(200).json({ 
      analysis: structuredAnalysis,
      scanId,
      scanType,
      timestamp: new Date().toISOString(),
      success: true
    })
  } catch (error: any) {
    console.error('Analysis error:', error)
    
    // Provide different error messages based on error type
    if (error.message?.includes('JSON')) {
      return res.status(500).json({ 
        error: 'Analysis service returned invalid data. Please try again with a simpler document or different scan type.',
        retryable: true
      })
    } else if (error.message?.includes('timeout')) {
      return res.status(504).json({ 
        error: 'Analysis timed out. Please try again with a shorter document.',
        retryable: true
      })
    } else if (error.message?.includes('rate limit')) {
      return res.status(429).json({ 
        error: 'Too many requests. Please wait a moment before trying again.',
        retryable: true
      })
    } else {
      return res.status(500).json({ 
        error: 'Failed to analyze document. Please try again.',
        retryable: true
      })
    }
  }
}

// 🛡️ SECURITY: Apply IP-based rate limiting (50 scans per hour per IP)
export default withRateLimit(scanLimiter, analyzeHandler)