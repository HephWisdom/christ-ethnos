import { Router } from 'express'
import { requireAdminApiKey } from '../lib/admin.js'
import { getErrorStatus, sendError } from '../lib/http.js'
import { createRateLimiter, getClientIp } from '../lib/security.js'
import {
  cleanEnum,
  cleanString,
  cleanUrl,
  isValidObjectId,
  isValidYoutubeVideoId,
  parseOptionalDate,
  parseOptionalNumber,
} from '../lib/validation.js'
import { connectToDatabase } from '../lib/database.js'
import AnalyticsEvent from '../models/AnalyticsEvent.js'
import ContactMessage from '../models/ContactMessage.js'
import DailyWord from '../models/DailyWord.js'
import Event from '../models/Event.js'
import EventRegistration from '../models/EventRegistration.js'
import GivingIntent from '../models/GivingIntent.js'
import PrayerRequest from '../models/PrayerRequest.js'
import Sermon from '../models/Sermon.js'

const router = Router()

const adminLimiter = createRateLimiter({
  name: 'admin',
  windowMs: 10 * 60 * 1000,
  max: 100,
  keyGenerator: (req) => getClientIp(req),
  message: 'Too many admin requests. Please wait a few minutes and try again.',
})

function toRecord(doc) {
  return {
    ...doc,
    id: String(doc._id),
  }
}

function startOfDaysAgo(days) {
  const date = new Date()
  date.setUTCHours(0, 0, 0, 0)
  date.setUTCDate(date.getUTCDate() - days)
  return date
}

async function getAnalyticsSummary() {
  const sevenDaysAgo = startOfDaysAgo(6)
  const thirtyDaysAgo = startOfDaysAgo(29)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const [
    totalPageViews,
    pageViews7d,
    pageViews24h,
    totalVisitors,
    visitors7d,
    visitors24h,
    totalCtaClicks,
    ctaClicks7d,
    consentGranted,
    topPages,
    topReferrers,
    topCtas,
    deviceBreakdown,
    browserBreakdown,
    recentEvents,
    dailyPageViews,
    dailyVisitors,
  ] = await Promise.all([
    AnalyticsEvent.countDocuments({ eventType: 'page_view' }),
    AnalyticsEvent.countDocuments({ eventType: 'page_view', occurredAt: { $gte: sevenDaysAgo } }),
    AnalyticsEvent.countDocuments({ eventType: 'page_view', occurredAt: { $gte: oneDayAgo } }),
    AnalyticsEvent.distinct('visitorId', { eventType: 'page_view' }).then((items) => items.length),
    AnalyticsEvent.distinct('visitorId', { eventType: 'page_view', occurredAt: { $gte: sevenDaysAgo } }).then((items) => items.length),
    AnalyticsEvent.distinct('visitorId', { eventType: 'page_view', occurredAt: { $gte: oneDayAgo } }).then((items) => items.length),
    AnalyticsEvent.countDocuments({ eventType: 'cta_click' }),
    AnalyticsEvent.countDocuments({ eventType: 'cta_click', occurredAt: { $gte: sevenDaysAgo } }),
    AnalyticsEvent.countDocuments({ eventType: 'consent_granted' }),
    AnalyticsEvent.aggregate([
      { $match: { eventType: 'page_view' } },
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
    AnalyticsEvent.aggregate([
      { $match: { eventType: 'page_view', referrerHost: { $ne: '' } } },
      { $group: { _id: '$referrerHost', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
    AnalyticsEvent.aggregate([
      { $match: { eventType: 'cta_click', ctaName: { $ne: '' } } },
      { $group: { _id: { name: '$ctaName', location: '$ctaLocation' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
    AnalyticsEvent.aggregate([
      { $match: { eventType: 'page_view' } },
      { $group: { _id: '$deviceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    AnalyticsEvent.aggregate([
      { $match: { eventType: 'page_view' } },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
    AnalyticsEvent.find().sort({ occurredAt: -1 }).limit(15).lean(),
    AnalyticsEvent.aggregate([
      { $match: { eventType: 'page_view', occurredAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$occurredAt' },
          },
          pageViews: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    AnalyticsEvent.aggregate([
      { $match: { eventType: 'page_view', occurredAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$occurredAt' } },
            visitorId: '$visitorId',
          },
        },
      },
      {
        $group: {
          _id: '$_id.date',
          visitors: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ])

  const visitorMap = new Map(dailyVisitors.map((item) => [item._id, item.visitors]))

  return {
    summary: {
      totalPageViews,
      pageViews7d,
      pageViews24h,
      totalVisitors,
      visitors7d,
      visitors24h,
      totalCtaClicks,
      ctaClicks7d,
      consentGranted,
    },
    topPages: topPages.map((item) => ({ path: item._id, count: item.count })),
    topReferrers: topReferrers.map((item) => ({ referrerHost: item._id, count: item.count })),
    topCtas: topCtas.map((item) => ({
      name: item._id.name,
      location: item._id.location,
      count: item.count,
    })),
    deviceBreakdown: deviceBreakdown.map((item) => ({ label: item._id || 'unknown', count: item.count })),
    browserBreakdown: browserBreakdown.map((item) => ({ label: item._id || 'Unknown', count: item.count })),
    dailyTraffic: dailyPageViews.map((item) => ({
      date: item._id,
      pageViews: item.pageViews,
      visitors: visitorMap.get(item._id) || 0,
    })),
    recentEvents: recentEvents.map(toRecord),
  }
}

function getEmptyAnalyticsSummary() {
  return {
    summary: {
      totalPageViews: 0,
      pageViews7d: 0,
      pageViews24h: 0,
      totalVisitors: 0,
      visitors7d: 0,
      visitors24h: 0,
      totalCtaClicks: 0,
      ctaClicks7d: 0,
      consentGranted: 0,
    },
    topPages: [],
    topReferrers: [],
    topCtas: [],
    deviceBreakdown: [],
    browserBreakdown: [],
    dailyTraffic: [],
    recentEvents: [],
  }
}

router.use(adminLimiter, requireAdminApiKey)

router.get('/dashboard', async (req, res) => {
  try {
    await connectToDatabase()

    const [
      prayerCount,
      contactCount,
      registrationCount,
      givingCount,
      sermonCount,
      eventCount,
      dailyWordCount,
      prayers,
      contacts,
      registrations,
      giving,
    ] = await Promise.all([
      PrayerRequest.countDocuments(),
      ContactMessage.countDocuments(),
      EventRegistration.countDocuments(),
      GivingIntent.countDocuments(),
      Sermon.countDocuments(),
      Event.countDocuments(),
      DailyWord.countDocuments(),
      PrayerRequest.find().sort({ createdAt: -1 }).limit(5).lean(),
      ContactMessage.find().sort({ createdAt: -1 }).limit(5).lean(),
      EventRegistration.find().sort({ createdAt: -1 }).limit(5).lean(),
      GivingIntent.find().sort({ createdAt: -1 }).limit(5).lean(),
    ])

    let analytics = getEmptyAnalyticsSummary()
    let analyticsError = null

    try {
      analytics = await getAnalyticsSummary()
    } catch (error) {
      analyticsError = 'Analytics are temporarily unavailable.'
    }

    res.json({
      counts: {
        prayerRequests: prayerCount,
        contactMessages: contactCount,
        eventRegistrations: registrationCount,
        givingIntents: givingCount,
        sermons: sermonCount,
        events: eventCount,
        dailyWords: dailyWordCount,
      },
      recent: {
        prayerRequests: prayers.map(toRecord),
        contactMessages: contacts.map(toRecord),
        eventRegistrations: registrations.map(toRecord),
        givingIntents: giving.map(toRecord),
      },
      analytics,
      ...(analyticsError ? { analyticsError } : {}),
    })
  } catch (error) {
    sendError(res, 500, 'Failed to load admin dashboard.', error)
  }
})

router.get('/analytics', async (req, res) => {
  try {
    await connectToDatabase()
    res.json(await getAnalyticsSummary())
  } catch (error) {
    sendError(res, 500, 'Failed to load analytics.', error)
  }
})

router.get('/submissions', async (req, res) => {
  try {
    await connectToDatabase()

    const [prayerRequests, contactMessages, eventRegistrations, givingIntents] = await Promise.all([
      PrayerRequest.find().sort({ createdAt: -1 }).limit(50).lean(),
      ContactMessage.find().sort({ createdAt: -1 }).limit(50).lean(),
      EventRegistration.find().sort({ createdAt: -1 }).limit(50).lean(),
      GivingIntent.find().sort({ createdAt: -1 }).limit(50).lean(),
    ])

    res.json({
      prayerRequests: prayerRequests.map(toRecord),
      contactMessages: contactMessages.map(toRecord),
      eventRegistrations: eventRegistrations.map(toRecord),
      givingIntents: givingIntents.map(toRecord),
    })
  } catch (error) {
    sendError(res, 500, 'Failed to load submissions.', error)
  }
})

router.patch('/submissions/:collection/:id/status', async (req, res) => {
  try {
    await connectToDatabase()

    const collectionMap = {
      'prayer-requests': {
        model: PrayerRequest,
        statuses: ['new', 'praying', 'closed'],
      },
      'contact-messages': {
        model: ContactMessage,
        statuses: ['new', 'follow_up', 'closed'],
      },
      'event-registrations': {
        model: EventRegistration,
        statuses: ['new', 'confirmed', 'cancelled'],
      },
      'giving-intents': {
        model: GivingIntent,
        statuses: ['new', 'contacted', 'closed'],
      },
    }

    const config = collectionMap[req.params.collection]

    if (!config) {
      res.status(404).json({ message: 'Submission collection not found.' })
      return
    }

    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ message: 'Submission record is invalid.' })
      return
    }

    const status = cleanEnum(req.body.status, config.statuses)

    if (!status) {
      res.status(400).json({ message: 'Submission status is invalid.' })
      return
    }

    const record = await config.model.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: 'after', runValidators: true }
    ).lean()

    if (!record) {
      res.status(404).json({ message: 'Submission record not found.' })
      return
    }

    res.json(toRecord(record))
  } catch (error) {
    sendError(res, getErrorStatus(error), 'Failed to update submission status.', error)
  }
})

function contentCrudRoutes(path, model, transformPayload) {
  const singularLabel = transformPayload.singularLabel || path

  router.get(`/${path}`, async (req, res) => {
    try {
      await connectToDatabase()
      const records = await model.find().sort(transformPayload.sort || {}).lean()
      res.json(records.map(toRecord))
    } catch (error) {
      sendError(res, 500, `Failed to load ${path}.`, error)
    }
  })

  router.post(`/${path}`, async (req, res) => {
    try {
      await connectToDatabase()
      const payload = transformPayload.create(req.body)
      const record = await model.create(payload)
      res.status(201).json(toRecord(record.toObject()))
    } catch (error) {
      const status = error.name === 'Error' ? 400 : getErrorStatus(error)
      sendError(
        res,
        status,
        status === 400 ? error.message : `Failed to create ${singularLabel}.`,
        error
      )
    }
  })

  router.put(`/${path}/:id`, async (req, res) => {
    try {
      await connectToDatabase()

      if (!isValidObjectId(req.params.id)) {
        res.status(400).json({ message: 'Record is invalid.' })
        return
      }

      const payload = transformPayload.create(req.body)
      const record = await model.findByIdAndUpdate(req.params.id, payload, {
        returnDocument: 'after',
        runValidators: true,
      }).lean()

      if (!record) {
        res.status(404).json({ message: 'Record not found.' })
        return
      }

      res.json(toRecord(record))
    } catch (error) {
      const status = error.name === 'Error' ? 400 : getErrorStatus(error)
      sendError(
        res,
        status,
        status === 400 ? error.message : `Failed to update ${singularLabel}.`,
        error
      )
    }
  })

  router.delete(`/${path}/:id`, async (req, res) => {
    try {
      await connectToDatabase()

      if (!isValidObjectId(req.params.id)) {
        res.status(400).json({ message: 'Record is invalid.' })
        return
      }

      const deleted = await model.findByIdAndDelete(req.params.id).lean()

      if (!deleted) {
        res.status(404).json({ message: 'Record not found.' })
        return
      }

      res.json({ message: 'Deleted successfully.' })
    } catch (error) {
      sendError(res, 500, `Failed to delete ${singularLabel}.`, error)
    }
  })
}

contentCrudRoutes('sermons', Sermon, {
  singularLabel: 'sermon',
  sort: { publishedAt: -1 },
  create(body) {
    const publishedAt = parseOptionalDate(body.publishedAt)

    const videoId = cleanString(body.videoId, 120)

    if (
      !cleanString(body.title, 160) ||
      !cleanString(body.speaker, 120) ||
      !publishedAt ||
      !cleanString(body.duration, 20) ||
      !videoId
    ) {
      throw new Error('All sermon fields are required.')
    }

    if (!isValidYoutubeVideoId(videoId)) {
      throw new Error('Enter a valid YouTube video ID.')
    }

    return {
      title: cleanString(body.title, 160),
      speaker: cleanString(body.speaker, 120),
      series: cleanString(body.series, 120),
      summary: cleanString(body.summary, 1000),
      publishedAt,
      duration: cleanString(body.duration, 20),
      videoId,
    }
  },
})

contentCrudRoutes('events', Event, {
  singularLabel: 'event',
  sort: { startsAt: 1 },
  create(body) {
    const startsAt = parseOptionalDate(body.startsAt)

    if (!cleanString(body.title, 160) || !cleanString(body.location, 160) || !startsAt) {
      throw new Error('All event fields are required.')
    }

    return {
      title: cleanString(body.title, 160),
      location: cleanString(body.location, 160),
      description: cleanString(body.description, 1200),
      registrationUrl: cleanUrl(body.registrationUrl),
      startsAt,
    }
  },
})

contentCrudRoutes('daily-word', DailyWord, {
  singularLabel: 'daily word entry',
  sort: { sortOrder: 1 },
  create(body) {
    const sortOrder = parseOptionalNumber(body.sortOrder)

    if (
      !cleanString(body.reference, 120) ||
      !cleanString(body.quote, 1000) ||
      !cleanString(body.meditation, 2000) ||
      sortOrder === null
    ) {
      throw new Error('All daily word fields are required.')
    }

    return {
      reference: cleanString(body.reference, 120),
      quote: cleanString(body.quote, 1000),
      meditation: cleanString(body.meditation, 2000),
      sortOrder,
    }
  },
})

export default router
