const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH'])
const HONEYPOT_FIELDS = ['website', 'company', 'url', 'homepage']
const MAX_RATE_LIMIT_KEYS = 5000

export function getClientIp(req) {
  if (req.ip) {
    return req.ip
  }

  const forwardedFor = req.get('x-forwarded-for')

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  return req.ip || req.socket?.remoteAddress || 'unknown'
}

export function applySecurityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('X-DNS-Prefetch-Control', 'off')
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob:",
      "media-src 'self'",
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
      "connect-src 'self' https:",
      "form-action 'self'",
    ].join('; ')
  )

  next()
}

export function requireJsonBody(req, res, next) {
  if (!WRITE_METHODS.has(req.method)) {
    next()
    return
  }

  if (!req.is('application/json')) {
    res.status(415).json({ message: 'Requests with a body must use application/json.' })
    return
  }

  next()
}

export function createRateLimiter({
  name,
  windowMs,
  max,
  keyGenerator = (req) => `${getClientIp(req)}:${req.method}:${req.originalUrl}`,
  message = 'Too many requests. Please try again soon.',
}) {
  const hits = new Map()

  function pruneExpired(now) {
    for (const [key, record] of hits.entries()) {
      if (record.resetAt <= now) {
        hits.delete(key)
      }
    }
  }

  return function rateLimiter(req, res, next) {
    const now = Date.now()

    if (hits.size > MAX_RATE_LIMIT_KEYS) {
      pruneExpired(now)
    }

    const key = `${name}:${keyGenerator(req)}`
    const current = hits.get(key)
    const record = current && current.resetAt > now
      ? current
      : { count: 0, resetAt: now + windowMs }

    record.count += 1
    hits.set(key, record)

    const retryAfterSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000))
    const remaining = Math.max(0, max - record.count)

    res.setHeader('RateLimit-Limit', String(max))
    res.setHeader('RateLimit-Remaining', String(remaining))
    res.setHeader('RateLimit-Reset', String(Math.ceil(record.resetAt / 1000)))

    if (record.count > max) {
      res.setHeader('Retry-After', String(retryAfterSeconds))
      res.status(429).json({ message })
      return
    }

    next()
  }
}

export function rejectHoneypotSubmissions(req, res, next) {
  const body = req.body && typeof req.body === 'object' ? req.body : {}
  const isSpam = HONEYPOT_FIELDS.some((field) => String(body[field] || '').trim())

  if (isSpam) {
    res.status(202).json({ message: 'Request received.' })
    return
  }

  next()
}

export function sanitizeMetadata(value, depth = 0) {
  if (depth > 2) return null
  if (value === null) return null

  if (typeof value === 'string') return value.trim().slice(0, 240)
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value === 'boolean') return value

  if (Array.isArray(value)) {
    return value.slice(0, 10).map((item) => sanitizeMetadata(item, depth + 1))
  }

  if (typeof value !== 'object') return null

  return Object.entries(value)
    .slice(0, 20)
    .reduce((safe, [key, item]) => {
      const cleanKey = String(key).trim().slice(0, 80)

      if (
        !cleanKey ||
        cleanKey.startsWith('$') ||
        cleanKey.includes('.') ||
        ['__proto__', 'constructor', 'prototype'].includes(cleanKey)
      ) {
        return safe
      }

      safe[cleanKey] = sanitizeMetadata(item, depth + 1)
      return safe
    }, {})
}
