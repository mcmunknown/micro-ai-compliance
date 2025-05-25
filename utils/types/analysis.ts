export interface AuditAnalysisResult {
  summary: {
    auditRiskScore: number // 0-100
    auditProbability: string // "12% chance"
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    estimatedPenalties: {
      minimum: number
      maximum: number
      likely: number
    }
    complianceScore: number // 0-100
  }
  
  redFlags: RedFlag[]
  recommendations: Recommendation[]
  timeline: ComplianceTimeline[]
  requiredForms: RequiredForm[]
}

export interface RedFlag {
  id: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  type: string // 'CASH_THRESHOLD' | 'MISSING_REPORT' | 'GST_MISMATCH' etc
  documentLine?: number
  originalText: string
  issue: string
  taxCodeViolation: string
  penalty: {
    amount: number
    calculation: string
    statutory: string // "26 USC § 6050I"
  }
  fix: {
    action: string
    deadline: Date | string
    form?: string
    template?: string
  }
}

export interface Recommendation {
  priority: 'IMMEDIATE' | 'URGENT' | 'MEDIUM' | 'LOW'
  action: string
  reason: string
  deadline?: Date | string
  estimatedTime: string // "15 minutes"
  difficulty: 'EASY' | 'MODERATE' | 'COMPLEX'
  professionalRequired: boolean
}

export interface ComplianceTimeline {
  id: string
  title: string
  description: string
  deadline: Date | string
  priority: 'IMMEDIATE' | 'URGENT' | 'MEDIUM' | 'LOW'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE'
  estimatedTime: string
  relatedRedFlag?: string // Reference to RedFlag.id
}

export interface RequiredForm {
  formNumber: string // "Form 8300"
  name: string
  deadline: Date | string
  penalty: number
  downloadUrl?: string
  prefillData?: Record<string, any>
  description: string
  filingMethod: 'ONLINE' | 'PAPER' | 'BOTH'
}

export interface ScanMetadata {
  id: string
  userId: string
  documentName: string
  scanType: string
  timestamp: Date | string
  riskScore: number
  redFlagsCount: number
  complianceScore: number
  estimatedPenalties: number
}

// Validation functions
export function isValidAnalysisResult(data: any): data is AuditAnalysisResult {
  return (
    data &&
    typeof data.summary === 'object' &&
    typeof data.summary.auditRiskScore === 'number' &&
    data.summary.auditRiskScore >= 0 &&
    data.summary.auditRiskScore <= 100 &&
    typeof data.summary.auditProbability === 'string' &&
    ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(data.summary.riskLevel) &&
    typeof data.summary.estimatedPenalties === 'object' &&
    typeof data.summary.complianceScore === 'number' &&
    Array.isArray(data.redFlags) &&
    Array.isArray(data.recommendations) &&
    data.redFlags.every(isValidRedFlag) &&
    data.recommendations.every(isValidRecommendation)
  )
}

export function isValidRedFlag(flag: any): flag is RedFlag {
  return (
    flag &&
    typeof flag.id === 'string' &&
    ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(flag.severity) &&
    typeof flag.type === 'string' &&
    typeof flag.originalText === 'string' &&
    typeof flag.issue === 'string' &&
    typeof flag.taxCodeViolation === 'string' &&
    typeof flag.penalty === 'object' &&
    typeof flag.penalty.amount === 'number' &&
    typeof flag.fix === 'object' &&
    typeof flag.fix.action === 'string'
  )
}

export function isValidRecommendation(rec: any): rec is Recommendation {
  return (
    rec &&
    ['IMMEDIATE', 'URGENT', 'MEDIUM', 'LOW'].includes(rec.priority) &&
    typeof rec.action === 'string' &&
    typeof rec.reason === 'string' &&
    typeof rec.estimatedTime === 'string' &&
    ['EASY', 'MODERATE', 'COMPLEX'].includes(rec.difficulty) &&
    typeof rec.professionalRequired === 'boolean'
  )
}

// Helper functions
export function generateRedFlagId(): string {
  return `flag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function generateScanId(): string {
  return `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Safe date conversion utility
export function ensureDate(date: Date | string): Date {
  return date instanceof Date ? date : new Date(date)
}

export function calculateDaysUntilDeadline(deadline: Date | string): number {
  const deadlineDate = ensureDate(deadline)
  return Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

export function getRiskColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'LOW': return '#10B981' // green
    case 'MEDIUM': return '#F59E0B' // yellow
    case 'HIGH': return '#F97316' // orange
    case 'CRITICAL': return '#EF4444' // red
    default: return '#6B7280' // gray
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'LOW': return '#F59E0B' // yellow
    case 'MEDIUM': return '#F97316' // orange
    case 'HIGH': return '#EF4444' // red
    case 'CRITICAL': return '#DC2626' // dark red
    default: return '#6B7280' // gray
  }
} 