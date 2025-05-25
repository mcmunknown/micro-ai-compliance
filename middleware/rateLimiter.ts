import { NextApiRequest, NextApiResponse } from 'next'

// 🛡️ SECURITY: In-memory store for rate limiting (use Redis in production)
const requests = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  max: number // Maximum requests per window
  message?: string // Error message
  keyGenerator?: (req: NextApiRequest) => string // Function to generate rate limit key
}

export function createRateLimiter(config: RateLimitConfig) {
  const { windowMs, max, message = 'Too many requests', keyGenerator } = config

  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    // Generate rate limit key (IP + endpoint)
    const key = keyGenerator 
      ? keyGenerator(req)
      : `${getClientIP(req)}:${req.url}`

    const now = Date.now()
    const resetTime = now + windowMs

    // Clean up old entries
    cleanupExpiredEntries(now)

    // Get current request count
    const current = requests.get(key)

    if (!current) {
      // First request from this key
      requests.set(key, { count: 1, resetTime })
      return next()
    }

    if (now > current.resetTime) {
      // Window has expired, reset
      requests.set(key, { count: 1, resetTime })
      return next()
    }

    if (current.count >= max) {
      // Rate limit exceeded
      const timeUntilReset = Math.ceil((current.resetTime - now) / 1000)
      
      // 🛡️ SECURITY: Log suspicious activity
      console.warn(`Rate limit exceeded for ${key}. Attempts: ${current.count}`)
      
      res.setHeader('X-RateLimit-Limit', max)
      res.setHeader('X-RateLimit-Remaining', 0)
      res.setHeader('X-RateLimit-Reset', Math.ceil(current.resetTime / 1000))
      res.setHeader('Retry-After', timeUntilReset)
      
      return res.status(429).json({ 
        error: message,
        retryAfter: timeUntilReset
      })
    }

    // Increment counter
    current.count++
    requests.set(key, current)

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', max)
    res.setHeader('X-RateLimit-Remaining', max - current.count)
    res.setHeader('X-RateLimit-Reset', Math.ceil(current.resetTime / 1000))

    next()
  }
}

// 🛡️ SECURITY: Extract real client IP
function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  const realIP = req.headers['x-real-ip']
  const remoteAddress = req.socket.remoteAddress

  if (forwarded) {
    // Handle comma-separated list of IPs
    return Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0].trim()
  }
  
  return (realIP as string) || remoteAddress || 'unknown'
}

// Clean up expired entries to prevent memory leaks
function cleanupExpiredEntries(now: number) {
  // Convert Map entries to array for compatible iteration
  const entries = Array.from(requests.entries())
  for (const [key, data] of entries) {
    if (now > data.resetTime) {
      requests.delete(key)
    }
  }
}

// 🛡️ SECURITY: Predefined rate limiters for different use cases
export const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: 'Too many API requests from this IP, please try again later.'
})

export const strictLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Rate limit exceeded. Please wait before making more requests.'
})

export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 auth attempts per 15 minutes
  message: 'Too many authentication attempts, please try again later.',
  keyGenerator: (req) => `auth:${getClientIP(req)}`
})

export const scanLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 scans per hour per IP (in addition to user credit limits)
  message: 'Too many document scans from this IP, please try again later.',
  keyGenerator: (req) => `scan:${getClientIP(req)}`
})

// 🛡️ SECURITY: Utility to apply rate limiter as middleware
export function withRateLimit(
  rateLimiter: ReturnType<typeof createRateLimiter>,
  handler: (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    return new Promise<void>((resolve, reject) => {
      rateLimiter(req, res, () => {
        try {
          const result = handler(req, res)
          if (result instanceof Promise) {
            result.then(() => resolve()).catch(reject)
          } else {
            resolve()
          }
        } catch (error) {
          reject(error)
        }
      })
    })
  }
} 