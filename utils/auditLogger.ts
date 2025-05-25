import { NextApiRequest } from 'next'

interface AuditLogEntry {
  timestamp: string
  event: string
  userId?: string
  ip: string
  userAgent?: string
  details?: any
  level: 'info' | 'warning' | 'error' | 'critical'
}

// 🛡️ SECURITY: Extract client information for audit logs
export function getClientInfo(req: NextApiRequest) {
  const forwarded = req.headers['x-forwarded-for']
  const realIP = req.headers['x-real-ip']
  const remoteAddress = req.socket.remoteAddress
  
  let ip = 'unknown'
  if (forwarded) {
    ip = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0].trim()
  } else {
    ip = (realIP as string) || remoteAddress || 'unknown'
  }

  return {
    ip,
    userAgent: req.headers['user-agent'] || 'unknown',
    origin: req.headers.origin,
    referer: req.headers.referer,
  }
}

// 🛡️ SECURITY: Audit logger function
export function logSecurityEvent(
  event: string,
  level: AuditLogEntry['level'],
  req: NextApiRequest,
  details: {
    userId?: string
    action?: string
    resource?: string
    success?: boolean
    error?: string
    metadata?: any
  } = {}
) {
  const clientInfo = getClientInfo(req)
  
  const logEntry: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    event,
    level,
    ip: clientInfo.ip,
    userAgent: clientInfo.userAgent,
    userId: details.userId,
    details: {
      action: details.action,
      resource: details.resource,
      success: details.success,
      error: details.error,
      origin: clientInfo.origin,
      referer: clientInfo.referer,
      metadata: details.metadata,
    }
  }

  // 🛡️ SECURITY: Different log levels for different severity
  switch (level) {
    case 'critical':
      console.error('🚨 CRITICAL SECURITY EVENT:', JSON.stringify(logEntry, null, 2))
      // In production, send to security monitoring system
      break
    case 'error':
      console.error('🔴 SECURITY ERROR:', JSON.stringify(logEntry, null, 2))
      break
    case 'warning':
      console.warn('🟡 SECURITY WARNING:', JSON.stringify(logEntry, null, 2))
      break
    case 'info':
      console.log('🔵 SECURITY INFO:', JSON.stringify(logEntry, null, 2))
      break
  }

  // TODO: In production, send to external logging service like:
  // - Datadog
  // - Splunk  
  // - ELK Stack
  // - CloudWatch
  // - Sentry

  return logEntry
}

// 🛡️ SECURITY: Predefined security event types
export const SecurityEvents = {
  // Authentication events
  AUTH_SUCCESS: 'auth_success',
  AUTH_FAILURE: 'auth_failure',
  AUTH_TOKEN_INVALID: 'auth_token_invalid',
  AUTH_TOKEN_EXPIRED: 'auth_token_expired',
  
  // Rate limiting events
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  
  // API access events
  API_ACCESS_DENIED: 'api_access_denied',
  API_INVALID_REQUEST: 'api_invalid_request',
  API_FILE_TOO_LARGE: 'api_file_too_large',
  API_INVALID_FILE_TYPE: 'api_invalid_file_type',
  
  // Credit system events
  CREDITS_INSUFFICIENT: 'credits_insufficient',
  CREDITS_DEDUCTED: 'credits_deducted',
  CREDITS_ADDED: 'credits_added',
  CREDITS_MANIPULATION_ATTEMPT: 'credits_manipulation_attempt',
  
  // Payment events
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILURE: 'payment_failure',
  WEBHOOK_INVALID_SIGNATURE: 'webhook_invalid_signature',
  
  // Content security events
  MALICIOUS_CONTENT_DETECTED: 'malicious_content_detected',
  XSS_ATTEMPT: 'xss_attempt',
  INJECTION_ATTEMPT: 'injection_attempt',
} as const

// 🛡️ SECURITY: Helper functions for common security events
export function logAuthFailure(req: NextApiRequest, reason: string, userId?: string) {
  return logSecurityEvent(SecurityEvents.AUTH_FAILURE, 'warning', req, {
    userId,
    action: 'authentication',
    success: false,
    error: reason,
  })
}

export function logRateLimitExceeded(req: NextApiRequest, limit: number, attempts: number) {
  return logSecurityEvent(SecurityEvents.RATE_LIMIT_EXCEEDED, 'warning', req, {
    action: 'rate_limit',
    success: false,
    metadata: { limit, attempts },
  })
}

export function logSuspiciousActivity(req: NextApiRequest, description: string, userId?: string) {
  return logSecurityEvent(SecurityEvents.SUSPICIOUS_ACTIVITY, 'critical', req, {
    userId,
    action: 'suspicious_activity',
    error: description,
  })
}

export function logAPIAccess(req: NextApiRequest, endpoint: string, userId?: string, success: boolean = true) {
  return logSecurityEvent('api_access', success ? 'info' : 'warning', req, {
    userId,
    action: 'api_access',
    resource: endpoint,
    success,
  })
}

export function logCreditOperation(req: NextApiRequest, operation: string, userId: string, amount: number, success: boolean) {
  return logSecurityEvent(operation, success ? 'info' : 'error', req, {
    userId,
    action: 'credit_operation',
    success,
    metadata: { operation, amount },
  })
} 