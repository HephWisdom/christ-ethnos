import { Router } from 'express'
import {
  dailyWordFallback,
  eventFallback,
  sermonFallback,
  serializeDailyWord,
  serializeEvent,
  serializeSermon,
} from '../../shared/content.js'
import { sendError } from '../lib/http.js'
import { connectToDatabase, isDatabaseConfigured } from '../lib/database.js'
import DailyWord from '../models/DailyWord.js'
import Event from '../models/Event.js'
import Sermon from '../models/Sermon.js'

const router = Router()

async function loadCollection({ model, sort, serializer, fallback }) {
  if (!isDatabaseConfigured()) {
    return { items: fallback, source: 'seed' }
  }

  await connectToDatabase()
  const records = await model.find().sort(sort).lean()

  if (!records.length) {
    return { items: fallback, source: 'seed' }
  }

  return {
    items: records.map(serializer),
    source: 'database',
  }
}

router.get('/health', async (req, res) => {
  if (!isDatabaseConfigured()) {
    res.json({
      ok: true,
      database: 'not-configured',
    })
    return
  }

  try {
    await connectToDatabase()
    res.json({
      ok: true,
      database: 'connected',
    })
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Health check failed.', error)
    }

    res.status(500).json({
      ok: false,
      database: 'error',
      message: 'Health check failed.',
    })
  }
})

router.get('/sermons', async (req, res) => {
  try {
    res.json(
      await loadCollection({
        model: Sermon,
        sort: { publishedAt: -1 },
        serializer: serializeSermon,
        fallback: sermonFallback,
      })
    )
  } catch (error) {
    sendError(res, 500, 'Failed to load sermons.', error)
  }
})

router.get('/events', async (req, res) => {
  try {
    res.json(
      await loadCollection({
        model: Event,
        sort: { startsAt: 1 },
        serializer: serializeEvent,
        fallback: eventFallback,
      })
    )
  } catch (error) {
    sendError(res, 500, 'Failed to load events.', error)
  }
})

router.get('/daily-word', async (req, res) => {
  try {
    res.json(
      await loadCollection({
        model: DailyWord,
        sort: { sortOrder: 1 },
        serializer: serializeDailyWord,
        fallback: dailyWordFallback,
      })
    )
  } catch (error) {
    sendError(res, 500, 'Failed to load daily words.', error)
  }
})

export default router
