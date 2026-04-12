import { buildApiUrl } from './api.js'
import { getCookie, setCookie } from './cookies.js'

const CONSENT_COOKIE = 'ce_cookie_consent'
const VISITOR_COOKIE = 'ce_visitor_id'
const SESSION_STORAGE_KEY = 'ce_session_id'

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `id_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`
}

function detectDeviceType() {
  const userAgent = navigator.userAgent.toLowerCase()

  if (/ipad|tablet/.test(userAgent)) return 'tablet'
  if (/mobi|android|iphone/.test(userAgent)) return 'mobile'
  return 'desktop'
}

function detectBrowser() {
  const userAgent = navigator.userAgent

  if (/Edg\//.test(userAgent)) return 'Edge'
  if (/Chrome\//.test(userAgent) && !/Edg\//.test(userAgent)) return 'Chrome'
  if (/Safari\//.test(userAgent) && !/Chrome\//.test(userAgent)) return 'Safari'
  if (/Firefox\//.test(userAgent)) return 'Firefox'
  return 'Unknown'
}

function detectOs() {
  const userAgent = navigator.userAgent

  if (/Windows/.test(userAgent)) return 'Windows'
  if (/Mac OS X/.test(userAgent)) return 'macOS'
  if (/Android/.test(userAgent)) return 'Android'
  if (/iPhone|iPad|iPod/.test(userAgent)) return 'iOS'
  if (/Linux/.test(userAgent)) return 'Linux'
  return 'Unknown'
}

function getCurrentPath() {
  return window.location.hash || '#home'
}

function getSessionId() {
  let sessionId = window.sessionStorage.getItem(SESSION_STORAGE_KEY)

  if (!sessionId) {
    sessionId = generateId()
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId)
  }

  return sessionId
}

export function getAnalyticsConsent() {
  return getCookie(CONSENT_COOKIE)
}

export function hasAnalyticsConsent() {
  return getAnalyticsConsent() === 'accepted'
}

export function setAnalyticsConsent(status) {
  setCookie(CONSENT_COOKIE, status, 180)

  if (status === 'accepted') {
    ensureVisitorId()
  }
}

export function ensureVisitorId() {
  let visitorId = getCookie(VISITOR_COOKIE)

  if (!visitorId) {
    visitorId = generateId()
    setCookie(VISITOR_COOKIE, visitorId, 365)
  }

  return visitorId
}

async function sendAnalyticsEvent(payload) {
  try {
    await fetch(buildApiUrl('/api/analytics/track'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      keepalive: true,
    })
  } catch {
    // Analytics should never break the UI.
  }
}

function getBasePayload() {
  return {
    visitorId: ensureVisitorId(),
    sessionId: getSessionId(),
    path: getCurrentPath(),
    route: getCurrentPath(),
    title: document.title,
    referrer: document.referrer,
    browser: detectBrowser(),
    os: detectOs(),
    deviceType: detectDeviceType(),
    language: navigator.language || '',
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
  }
}

export function trackConsentGranted() {
  if (!hasAnalyticsConsent()) return

  sendAnalyticsEvent({
    ...getBasePayload(),
    eventType: 'consent_granted',
  })
}

export function trackPageView(pathname = getCurrentPath()) {
  if (!hasAnalyticsConsent()) return

  sendAnalyticsEvent({
    ...getBasePayload(),
    path: pathname,
    route: pathname,
    eventType: 'page_view',
  })
}

export function trackCtaClick({ name, location, href = '', path = getCurrentPath() }) {
  if (!hasAnalyticsConsent()) return

  sendAnalyticsEvent({
    ...getBasePayload(),
    path,
    route: path,
    eventType: 'cta_click',
    ctaName: name,
    ctaLocation: location,
    metadata: {
      href,
    },
  })
}
