import { Router } from 'express'
import { getErrorStatus, sendError } from '../lib/http.js'
import { createRateLimiter, getClientIp, sanitizeMetadata } from '../lib/security.js'
import { cleanEnum, cleanString, parsePositiveNumber } from '../lib/validation.js'
import { connectToDatabase } from '../lib/database.js'
import AnalyticsEvent from '../models/AnalyticsEvent.js'

const router = Router()

const analyticsLimiter = createRateLimiter({
  name: 'analytics',
  windowMs: 60 * 1000,
  max: 120,
  keyGenerator: (req) => getClientIp(req),
})

function normalizeReferrerHost(value) {
  const rawValue = cleanString(value, 2000)

  if (!rawValue) return ''

  try {
    return new URL(rawValue).host
  } catch {
    return rawValue
  }
}

router.post('/track', analyticsLimiter, async (req, res) => {
  try {
    await connectToDatabase()

    const eventType = cleanEnum(req.body.eventType, ['page_view', 'cta_click', 'consent_granted'])
    const visitorId = cleanString(req.body.visitorId, 120)
    const sessionId = cleanString(req.body.sessionId, 120)
    const path = cleanString(req.body.path, 240) || '#home'

    if (!eventType || !visitorId || !sessionId) {
      res.status(400).json({ message: 'Analytics event is missing required fields.' })
      return
    }

    await AnalyticsEvent.create({
      eventType,
      visitorId,
      sessionId,
      path,
      route: cleanString(req.body.route, 240),
      title: cleanString(req.body.title, 240),
      ctaName: cleanString(req.body.ctaName, 160),
      ctaLocation: cleanString(req.body.ctaLocation, 160),
      referrer: cleanString(req.body.referrer, 2000),
      referrerHost: normalizeReferrerHost(req.body.referrer),
      browser: cleanString(req.body.browser, 80) || 'Unknown',
      os: cleanString(req.body.os, 80) || 'Unknown',
      deviceType: cleanString(req.body.deviceType, 40) || 'unknown',
      language: cleanString(req.body.language, 40),
      screenWidth: parsePositiveNumber(req.body.screenWidth, { min: 1, max: 10000 }) || 0,
      screenHeight: parsePositiveNumber(req.body.screenHeight, { min: 1, max: 10000 }) || 0,
      timezone: cleanString(req.body.timezone, 120),
      metadata: sanitizeMetadata(req.body.metadata) || {},
    })

    res.status(201).json({ ok: true })
  } catch (error) {
    sendError(res, getErrorStatus(error), 'Failed to track analytics event.', error)
  }
})

export default router
