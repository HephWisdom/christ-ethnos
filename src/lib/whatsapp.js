const rawNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || '').trim()
const rawMessage = 'Hello Christ Ethnos, please send me the Zoom link for the next online service.'

function normalizeNumber(value) {
  return value.replace(/\D/g, '')
}

export function getWhatsAppHref() {
  const digits = normalizeNumber(rawNumber)

  if (!digits) {
    return null
  }

  const query = rawMessage ? `?text=${encodeURIComponent(rawMessage)}` : ''
  return `https://wa.me/${digits}${query}`
}

export function isWhatsAppConfigured() {
  return Boolean(normalizeNumber(rawNumber))
}
