import { Router } from 'express'
import { connectToDatabase } from '../lib/database.js'
import AnalyticsEvent from '../models/AnalyticsEvent.js'

const router = Router()

function cleanString(value, maxLength = 1000) {
  return String(value || '').trim().slice(0, maxLength)
}

function normalizeReferrerHost(value) {
  const rawValue = cleanString(value, 2000)

  if (!rawValue) return ''

  try {
    return new URL(rawValue).host
  } catch {
    return rawValue
  }
}

function normalizeNumber(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

router.post('/track', async (req, res) => {
  try {
    await connectToDatabase()

    const eventType = cleanString(req.body.eventType, 40)
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
      screenWidth: normalizeNumber(req.body.screenWidth),
      screenHeight: normalizeNumber(req.body.screenHeight),
      timezone: cleanString(req.body.timezone, 120),
      metadata: typeof req.body.metadata === 'object' && req.body.metadata !== null ? req.body.metadata : {},
    })

    res.status(201).json({ ok: true })
  } catch (error) {
    res.status(500).json({ message: 'Failed to track analytics event.', details: error.message })
  }
})

export default router
