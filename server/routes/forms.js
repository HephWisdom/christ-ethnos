import { Router } from 'express'
import { sendError } from '../lib/http.js'
import { createRateLimiter, getClientIp, rejectHoneypotSubmissions } from '../lib/security.js'
import {
  cleanEnum,
  cleanString,
  isValidEmail,
  isValidObjectId,
  parsePositiveNumber,
} from '../lib/validation.js'
import { connectToDatabase } from '../lib/database.js'
import {
  sendPrayerAcknowledgementEmail,
  sendZoomAcknowledgementEmail,
} from '../lib/email.js'
import ContactMessage from '../models/ContactMessage.js'
import DailyWord from '../models/DailyWord.js'
import Event from '../models/Event.js'
import EventRegistration from '../models/EventRegistration.js'
import GivingIntent from '../models/GivingIntent.js'
import PrayerRequest from '../models/PrayerRequest.js'
import Sermon from '../models/Sermon.js'

const router = Router()

const publicFormLimiter = createRateLimiter({
  name: 'public-form',
  windowMs: 10 * 60 * 1000,
  max: 8,
  keyGenerator: (req) => `${getClientIp(req)}:${req.path}`,
  message: 'Too many submissions. Please wait a few minutes and try again.',
})

async function trySendAcknowledgement(label, sendEmail) {
  try {
    return await sendEmail()
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error(`Failed to send ${label}.`, error)
    }

    return { sent: false, error: true }
  }
}

router.post('/prayer-requests', publicFormLimiter, rejectHoneypotSubmissions, async (req, res) => {
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

    const acknowledgement = email
      ? await trySendAcknowledgement('prayer acknowledgement email', () => (
        sendPrayerAcknowledgementEmail({
          to: email,
          name,
          requestId: String(created._id),
        })
      ))
      : { sent: false, skipped: true, reason: 'email_not_provided' }

    res.status(201).json({
      message: acknowledgement.sent
        ? 'Prayer request received. We sent an acknowledgement email to your inbox.'
        : 'Prayer request received. Our pastoral care team will review it.',
      id: String(created._id),
      emailAcknowledgement: { sent: acknowledgement.sent },
    })
  } catch (error) {
    sendError(res, 500, 'Failed to save prayer request.', error)
  }
})

router.post('/contact-messages', publicFormLimiter, rejectHoneypotSubmissions, async (req, res) => {
  try {
    await connectToDatabase()

    const name = cleanString(req.body.name, 120)
    const email = cleanString(req.body.email, 160).toLowerCase()
    const phone = cleanString(req.body.phone, 40)
    const visitType = cleanEnum(
      req.body.visitType,
      ['first-visit', 'online-service', 'pastoral-care', 'serve-team', 'general'],
      'general'
    )
    const preferredFollowUp = cleanEnum(req.body.preferredFollowUp, ['email', 'phone', 'whatsapp'], 'email')
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

    const acknowledgement = await trySendAcknowledgement('Zoom acknowledgement email', () => (
      sendZoomAcknowledgementEmail({
        to: email,
        name,
        messageId: String(created._id),
      })
    ))

    res.status(201).json({
      message: acknowledgement.sent
        ? 'Message received. We sent an acknowledgement email to your inbox.'
        : 'Message received. Our welcome team will get back to you soon.',
      id: String(created._id),
      emailAcknowledgement: { sent: acknowledgement.sent },
    })
  } catch (error) {
    sendError(res, 500, 'Failed to save message.', error)
  }
})

router.post('/event-registrations', publicFormLimiter, rejectHoneypotSubmissions, async (req, res) => {
  try {
    await connectToDatabase()

    const eventId = cleanString(req.body.eventId, 64)
    const name = cleanString(req.body.name, 120)
    const email = cleanString(req.body.email, 160).toLowerCase()
    const phone = cleanString(req.body.phone, 40)
    const attendees = parsePositiveNumber(req.body.attendees, { min: 1, max: 20 }) || 1
    const notes = cleanString(req.body.notes, 2000)

    if (!eventId || !name || !email) {
      res.status(400).json({ message: 'Event, name, and email are required.' })
      return
    }

    if (!isValidObjectId(eventId)) {
      res.status(400).json({ message: 'Event is invalid.' })
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
    sendError(res, 500, 'Failed to save event registration.', error)
  }
})

router.post('/giving-intents', publicFormLimiter, rejectHoneypotSubmissions, async (req, res) => {
  try {
    await connectToDatabase()

    const name = cleanString(req.body.name, 120)
    const email = cleanString(req.body.email, 160).toLowerCase()
    const phone = cleanString(req.body.phone, 40)
    const note = cleanString(req.body.note, 2000)
    const frequency = cleanEnum(req.body.frequency, ['one-time', 'monthly'], 'one-time')
    const amount = parsePositiveNumber(req.body.amount, { min: 1, max: 1000000 })

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
    sendError(res, 500, 'Failed to save giving intent.', error)
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
    sendError(res, 500, 'Failed to load preview.', error)
  }
})

export default router
