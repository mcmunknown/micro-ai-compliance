import { doc, setDoc, getDoc, updateDoc, increment, serverTimestamp, arrayUnion } from 'firebase/firestore'
import { db } from './firebase'

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

export interface CreditPack {
  id: string
  credits: number
  price: number
  priceId: string // Stripe price ID
  popular?: boolean
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: 'starter',
    credits: 10,
    price: 10,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_10_CREDITS || 'price_1OExample10Credits',
  },
  {
    id: 'professional',
    credits: 50,
    price: 40,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_50_CREDITS || 'price_1OExample50Credits',
    popular: true,
  },
  {
    id: 'business',
    credits: 200,
    price: 120,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_200_CREDITS || 'price_1OExample200Credits',
  },
]

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

// Initialize user credits on first sign up
export async function initializeUserCredits(userId: string) {
  const userCreditsRef = doc(db, 'userCredits', userId)
  
  const creditsDoc = await getDoc(userCreditsRef)
  if (!creditsDoc.exists()) {
    await setDoc(userCreditsRef, {
      credits: 3, // 3 free credits for new users
      freeCreditsUsed: true,
      totalSpent: 0,
      scansToday: 0,
      scanHistory: [],
      createdAt: serverTimestamp(),
    })
  }
}

// Get user's current credits
export async function getUserCredits(userId: string): Promise<UserCredits | null> {
  try {
    const userCreditsRef = doc(db, 'userCredits', userId)
    const creditsDoc = await getDoc(userCreditsRef)
    
    if (!creditsDoc.exists()) {
      // Initialize credits if they don't exist
      await initializeUserCredits(userId)
      // Return default credits
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
    // Return default credits on error
    return {
      credits: 3,
      freeCreditsUsed: true,
      totalSpent: 0,
      scansToday: 0,
      scanHistory: []
    }
  }
}

// Check if user can perform scan
export async function canUserScan(userId: string, scanType: keyof typeof SCAN_TYPES): Promise<{ canScan: boolean; reason?: string }> {
  const credits = await getUserCredits(userId)
  
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

// Deduct credits for a scan
export async function deductCredits(
  userId: string, 
  scanType: keyof typeof SCAN_TYPES,
  documentName: string
): Promise<boolean> {
  const userCreditsRef = doc(db, 'userCredits', userId)
  const credits = await getUserCredits(userId)
  
  if (!credits) return false
  
  const requiredCredits = SCAN_TYPES[scanType].credits
  const today = new Date().toISOString().split('T')[0]
  
  // Update credits and scan count
  await updateDoc(userCreditsRef, {
    credits: increment(-requiredCredits),
    scansToday: credits.lastScanDate === today ? increment(1) : 1,
    lastScanDate: today,
    scanHistory: arrayUnion({
      timestamp: new Date(),
      type: scanType,
      creditsUsed: requiredCredits,
      documentName,
    }),
  })
  
  return true
}

// Add credits after purchase
export async function addCredits(userId: string, credits: number, amountPaid?: number) {
  const userCreditsRef = doc(db, 'userCredits', userId)
  
  const updates: any = {
    credits: increment(credits),
    lastPurchase: serverTimestamp(),
  }
  
  if (amountPaid !== undefined) {
    updates.totalSpent = increment(amountPaid)
  }
  
  await updateDoc(userCreditsRef, updates)
}