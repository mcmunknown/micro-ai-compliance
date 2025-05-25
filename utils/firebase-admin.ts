import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { ScanMetadata } from './types/analysis'

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

export const adminDb = getFirestore()

export interface UserCredits {
  credits: number
  freeCreditsUsed: boolean
  lastPurchase?: Date
  totalSpent: number
  scansToday: number
  lastScanDate?: string
  scanHistory: ScanRecord[]
  totalScans?: number // Add total scans counter
}

export interface ScanRecord {
  timestamp: Date
  type: 'basic' | 'deep' | 'ultra'
  creditsUsed: number
  documentName: string
}

export const SCAN_TYPES = {
  basic: {
    credits: 1,
    name: 'Basic Scan',
    description: 'Red flags and summary',
    features: ['Key compliance risks', 'Executive summary', 'Risk score'],
  },
  deep: {
    credits: 3,
    name: 'Deep Scan',
    description: 'Detailed analysis with citations',
    features: ['Transaction-level analysis', 'Legal citations', 'Region-specific compliance'],
  },
  ultra: {
    credits: 10,
    name: 'Ultra Scan',
    description: 'Full report with recommendations',
    features: ['PDF report download', 'CSV audit log', 'Remediation roadmap', 'Priority action items'],
  },
}

// 🔒 SERVER-SIDE ONLY: Initialize user credits
export async function serverInitializeUserCredits(userId: string) {
  const userCreditsRef = adminDb.collection('userCredits').doc(userId)
  
  const creditsDoc = await userCreditsRef.get()
  if (!creditsDoc.exists) {
    await userCreditsRef.set({
      credits: 3, // 3 free credits for new users
      freeCreditsUsed: true,
      totalSpent: 0,
      scansToday: 0,
      scanHistory: [],
      totalScans: 0,
      createdAt: FieldValue.serverTimestamp(),
    })
  }
}

// 🔒 SERVER-SIDE ONLY: Get user's current credits
export async function serverGetUserCredits(userId: string): Promise<UserCredits | null> {
  try {
    const userCreditsRef = adminDb.collection('userCredits').doc(userId)
    const creditsDoc = await userCreditsRef.get()
    
    if (!creditsDoc.exists) {
      // Initialize credits if they don't exist
      await serverInitializeUserCredits(userId)
      return {
        credits: 3,
        freeCreditsUsed: true,
        totalSpent: 0,
        scansToday: 0,
        scanHistory: [],
        totalScans: 0
      }
    }
    
    return creditsDoc.data() as UserCredits
  } catch (error) {
    console.error('Error getting user credits:', error)
    return null
  }
}

// 🔒 SERVER-SIDE ONLY: Check if user can perform scan
export async function serverCanUserScan(userId: string, scanType: keyof typeof SCAN_TYPES): Promise<{ canScan: boolean; reason?: string }> {
  const credits = await serverGetUserCredits(userId)
  
  if (!credits) {
    return { canScan: false, reason: 'User credits not initialized' }
  }
  
  // Check credit balance
  const requiredCredits = SCAN_TYPES[scanType].credits
  if (credits.credits < requiredCredits) {
    return { canScan: false, reason: 'Insufficient credits' }
  }
  
  // Check daily rate limit
  const today = new Date().toISOString().split('T')[0]
  if (credits.lastScanDate === today && credits.scansToday >= 10) {
    return { canScan: false, reason: 'Daily scan limit reached (10 per day)' }
  }
  
  return { canScan: true }
}

// 🔒 SERVER-SIDE ONLY: Deduct credits for a scan
export async function serverDeductCredits(
  userId: string, 
  scanType: keyof typeof SCAN_TYPES,
  documentName: string
): Promise<boolean> {
  try {
    const userCreditsRef = adminDb.collection('userCredits').doc(userId)
    const credits = await serverGetUserCredits(userId)
    
    if (!credits) return false
    
    const requiredCredits = SCAN_TYPES[scanType].credits
    const today = new Date().toISOString().split('T')[0]
    
    // Update credits and scan count atomically
    await userCreditsRef.update({
      credits: FieldValue.increment(-requiredCredits),
      scansToday: credits.lastScanDate === today ? FieldValue.increment(1) : 1,
      lastScanDate: today,
      totalScans: FieldValue.increment(1),
      scanHistory: FieldValue.arrayUnion({
        timestamp: new Date(),
        type: scanType,
        creditsUsed: requiredCredits,
        documentName,
      }),
    })
    
    return true
  } catch (error) {
    console.error('Error deducting credits:', error)
    return false
  }
}

// 🔒 SERVER-SIDE ONLY: Add credits after purchase
export async function serverAddCredits(userId: string, credits: number, amountPaid?: number) {
  try {
    const userCreditsRef = adminDb.collection('userCredits').doc(userId)
    
    const updates: any = {
      credits: FieldValue.increment(credits),
      lastPurchase: FieldValue.serverTimestamp(),
    }
    
    if (amountPaid !== undefined) {
      updates.totalSpent = FieldValue.increment(amountPaid)
    }
    
    await userCreditsRef.update(updates)
    return true
  } catch (error) {
    console.error('Error adding credits:', error)
    return false
  }
}

// 🔒 SERVER-SIDE ONLY: Store detailed analysis metadata
export async function storeAnalysisMetadata(
  userId: string, 
  metadata: Omit<ScanMetadata, 'id' | 'userId'>
): Promise<string | null> {
  try {
    const scanRef = adminDb.collection('scanHistory').doc()
    const scanId = scanRef.id
    
    await scanRef.set({
      id: scanId,
      userId,
      ...metadata,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    })
    
    console.log(`Stored analysis metadata for user ${userId}, scan ID: ${scanId}`)
    return scanId
  } catch (error) {
    console.error('Error storing analysis metadata:', error)
    return null
  }
}

// 🔒 SERVER-SIDE ONLY: Get user's scan history
export async function getUserScanHistory(
  userId: string, 
  limit: number = 10
): Promise<ScanMetadata[]> {
  try {
    const scans = await adminDb
      .collection('scanHistory')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get()
      
    return scans.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        userId: data.userId,
        documentName: data.documentName,
        scanType: data.scanType,
        timestamp: data.timestamp?.toDate() || new Date(),
        riskScore: data.riskScore,
        redFlagsCount: data.redFlagsCount,
        complianceScore: data.complianceScore,
        estimatedPenalties: data.estimatedPenalties
      } as ScanMetadata
    })
  } catch (error) {
    console.error('Error getting scan history:', error)
    return []
  }
}

// 🔒 SERVER-SIDE ONLY: Get specific scan metadata
export async function getScanMetadata(
  userId: string, 
  scanId: string
): Promise<ScanMetadata | null> {
  try {
    const scanDoc = await adminDb.collection('scanHistory').doc(scanId).get()
    
    if (!scanDoc.exists) {
      return null
    }
    
    const data = scanDoc.data()
    
    // Verify the scan belongs to the user
    if (data?.userId !== userId) {
      console.warn(`Unauthorized access attempt: user ${userId} tried to access scan ${scanId}`)
      return null
    }
    
    return {
      id: scanDoc.id,
      userId: data.userId,
      documentName: data.documentName,
      scanType: data.scanType,
      timestamp: data.timestamp?.toDate() || new Date(),
      riskScore: data.riskScore,
      redFlagsCount: data.redFlagsCount,
      complianceScore: data.complianceScore,
      estimatedPenalties: data.estimatedPenalties
    } as ScanMetadata
  } catch (error) {
    console.error('Error getting scan metadata:', error)
    return null
  }
}

// 🔒 SERVER-SIDE ONLY: Delete scan metadata (for data privacy)
export async function deleteScanMetadata(
  userId: string, 
  scanId: string
): Promise<boolean> {
  try {
    const scanDoc = await adminDb.collection('scanHistory').doc(scanId).get()
    
    if (!scanDoc.exists) {
      return false
    }
    
    const data = scanDoc.data()
    
    // Verify the scan belongs to the user
    if (data?.userId !== userId) {
      console.warn(`Unauthorized deletion attempt: user ${userId} tried to delete scan ${scanId}`)
      return false
    }
    
    await adminDb.collection('scanHistory').doc(scanId).delete()
    console.log(`Deleted scan metadata: ${scanId} for user ${userId}`)
    return true
  } catch (error) {
    console.error('Error deleting scan metadata:', error)
    return false
  }
}

// 🔒 SERVER-SIDE ONLY: Get user's compliance trends
export async function getUserComplianceTrends(
  userId: string, 
  days: number = 30
): Promise<{
  averageRiskScore: number
  riskTrend: 'IMPROVING' | 'STABLE' | 'DECLINING'
  totalScans: number
  avgRedFlags: number
  avgComplianceScore: number
}> {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    const scans = await adminDb
      .collection('scanHistory')
      .where('userId', '==', userId)
      .where('timestamp', '>=', cutoffDate)
      .orderBy('timestamp', 'asc')
      .get()
      
    if (scans.empty) {
      return {
        averageRiskScore: 0,
        riskTrend: 'STABLE',
        totalScans: 0,
        avgRedFlags: 0,
        avgComplianceScore: 0
      }
    }
    
    const scanData = scans.docs.map(doc => doc.data())
    const totalScans = scanData.length
    
    const averageRiskScore = scanData.reduce((sum, scan) => sum + scan.riskScore, 0) / totalScans
    const avgRedFlags = scanData.reduce((sum, scan) => sum + scan.redFlagsCount, 0) / totalScans
    const avgComplianceScore = scanData.reduce((sum, scan) => sum + scan.complianceScore, 0) / totalScans
    
    // Calculate trend
    let riskTrend: 'IMPROVING' | 'STABLE' | 'DECLINING' = 'STABLE'
    if (totalScans >= 3) {
      const firstHalf = scanData.slice(0, Math.floor(totalScans / 2))
      const secondHalf = scanData.slice(Math.floor(totalScans / 2))
      
      const firstHalfAvg = firstHalf.reduce((sum, scan) => sum + scan.riskScore, 0) / firstHalf.length
      const secondHalfAvg = secondHalf.reduce((sum, scan) => sum + scan.riskScore, 0) / secondHalf.length
      
      const difference = secondHalfAvg - firstHalfAvg
      if (difference < -5) riskTrend = 'IMPROVING'
      else if (difference > 5) riskTrend = 'DECLINING'
    }
    
    return {
      averageRiskScore: Math.round(averageRiskScore),
      riskTrend,
      totalScans,
      avgRedFlags: Math.round(avgRedFlags * 10) / 10,
      avgComplianceScore: Math.round(avgComplianceScore)
    }
  } catch (error) {
    console.error('Error getting compliance trends:', error)
    return {
      averageRiskScore: 0,
      riskTrend: 'STABLE',
      totalScans: 0,
      avgRedFlags: 0,
      avgComplianceScore: 0
    }
  }
} 