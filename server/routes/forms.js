import { Router } from 'express'
import { connectToDatabase } from '../lib/database.js'
import ContactMessage from '../models/ContactMessage.js'
import DailyWord from '../models/DailyWord.js'
import Event from '../models/Event.js'
import EventRegistration from '../models/EventRegistration.js'
import GivingIntent from '../models/GivingIntent.js'
import PrayerRequest from '../models/PrayerRequest.js'
import Sermon from '../models/Sermon.js'

const router = Router()

function cleanString(value, maxLength = 1000) {
  return String(value || '').trim().slice(0, maxLength)
}

function parsePositiveNumber(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

router.post('/prayer-requests', async (req, res) => {
  try {
    await connectToDatabase()

    const name = cleanString(req.body.name, 120)
    const email = cleanString(req.body.email, 160).toLowerCase()
    const request = cleanString(req.body.request, 4000)
    const isPrivate = Boolean(req.body.isPrivate)

    if (!name || !request) {
      res.status(400).json({ message: 'Name and prayer request are required.' })
      return
    }

    if (email && !isValidEmail(email)) {
      res.status(400).json({ message: 'Enter a valid email address.' })
      return
    }

    const created = await PrayerRequest.create({
      name,
      email,
      request,
      isPrivate,
    })

    res.status(201).json({
      message: 'Prayer request received.',
      id: String(created._id),
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to save prayer request.', details: error.message })
  }
})

router.post('/contact-messages', async (req, res) => {
  try {
    await connectToDatabase()

    const name = cleanString(req.body.name, 120)
    const email = cleanString(req.body.email, 160).toLowerCase()
    const phone = cleanString(req.body.phone, 40)
    const visitType = cleanString(req.body.visitType, 40) || 'general'
    const preferredFollowUp = cleanString(req.body.preferredFollowUp, 40) || 'email'
    const message = cleanString(req.body.message, 4000)

    if (!name || !email || !message) {
      res.status(400).json({ message: 'Name, email, and message are required.' })
      return
    }

    if (!isValidEmail(email)) {
      res.status(400).json({ message: 'Enter a valid email address.' })
      return
    }

    const created = await ContactMessage.create({
      name,
      email,
      phone,
      visitType,
      preferredFollowUp,
      message,
    })

    res.status(201).json({
      message: 'Message received.',
      id: String(created._id),
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to save message.', details: error.message })
  }
})

router.post('/event-registrations', async (req, res) => {
  try {
    await connectToDatabase()

    const eventId = cleanString(req.body.eventId, 64)
    const name = cleanString(req.body.name, 120)
    const email = cleanString(req.body.email, 160).toLowerCase()
    const phone = cleanString(req.body.phone, 40)
    const attendees = parsePositiveNumber(req.body.attendees) || 1
    const notes = cleanString(req.body.notes, 2000)

    if (!eventId || !name || !email) {
      res.status(400).json({ message: 'Event, name, and email are required.' })
      return
    }

    if (!isValidEmail(email)) {
      res.status(400).json({ message: 'Enter a valid email address.' })
      return
    }

    const event = await Event.findById(eventId).lean()

    if (!event) {
      res.status(404).json({ message: 'Event not found.' })
      return
    }

    const created = await EventRegistration.create({
      event: event._id,
      eventTitle: event.title,
      eventStartsAt: event.startsAt,
      name,
      email,
      phone,
      attendees,
      notes,
    })

    res.status(201).json({
      message: 'Event registration received.',
      id: String(created._id),
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to save event registration.', details: error.message })
  }
})

router.post('/giving-intents', async (req, res) => {
  try {
    await connectToDatabase()

    const name = cleanString(req.body.name, 120)
    const email = cleanString(req.body.email, 160).toLowerCase()
    const phone = cleanString(req.body.phone, 40)
    const note = cleanString(req.body.note, 2000)
    const frequency = cleanString(req.body.frequency, 40) || 'one-time'
    const amount = parsePositiveNumber(req.body.amount)

    if (!name || !email || !amount) {
      res.status(400).json({ message: 'Name, email, and amount are required.' })
      return
    }

    if (!isValidEmail(email)) {
      res.status(400).json({ message: 'Enter a valid email address.' })
      return
    }

    const created = await GivingIntent.create({
      name,
      email,
      phone,
      amount,
      frequency,
      note,
    })

    res.status(201).json({
      message: 'Giving intent received.',
      id: String(created._id),
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to save giving intent.', details: error.message })
  }
})

router.get('/admin-preview', async (req, res) => {
  try {
    await connectToDatabase()

    const [sermons, events, dailyWords] = await Promise.all([
      Sermon.countDocuments(),
      Event.countDocuments(),
      DailyWord.countDocuments(),
    ])

    res.json({
      sermons,
      events,
      dailyWords,
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to load preview.', details: error.message })
  }
})

export default router
