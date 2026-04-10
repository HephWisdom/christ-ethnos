import { Router } from 'express'
import {
  dailyWordFallback,
  eventFallback,
  sermonFallback,
  serializeDailyWord,
  serializeEvent,
  serializeSermon,
} from '../../shared/content.js'
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
    res.status(500).json({
      ok: false,
      database: 'error',
      message: error.message,
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
    res.status(500).json({
      message: 'Failed to load sermons.',
      details: error.message,
    })
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
    res.status(500).json({
      message: 'Failed to load events.',
      details: error.message,
    })
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
    res.status(500).json({
      message: 'Failed to load daily words.',
      details: error.message,
    })
  }
})

export default router
