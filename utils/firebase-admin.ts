import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

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
        scanHistory: []
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