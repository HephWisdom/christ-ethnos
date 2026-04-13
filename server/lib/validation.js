import mongoose from 'mongoose'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{6,32}$/

export function cleanString(value, maxLength = 1000) {
  if (typeof value !== 'string' && typeof value !== 'number') return ''
  return String(value).replace(/\0/g, '').trim().slice(0, maxLength)
}

export function cleanEnum(value, allowedValues, fallback = '') {
  const cleaned = cleanString(value, 80)
  return allowedValues.includes(cleaned) ? cleaned : fallback
}

export function parsePositiveNumber(value, { min = 1, max = Number.MAX_SAFE_INTEGER } = {}) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    return null
  }

  return parsed
}

export function parseOptionalNumber(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export function parseOptionalDate(value) {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(value)
}

export function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(cleanString(value, 80))
}

export function cleanUrl(value) {
  const rawValue = cleanString(value, 1000)

  if (!rawValue) return ''

  try {
    const url = new URL(rawValue)
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : ''
  } catch {
    return ''
  }
}

export function isValidYoutubeVideoId(value) {
  return YOUTUBE_VIDEO_ID_PATTERN.test(cleanString(value, 120))
}
