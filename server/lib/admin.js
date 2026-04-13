import crypto from 'node:crypto'

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_API_KEY)
}

function secureCompare(providedKey, expectedKey) {
  const provided = crypto.createHash('sha256').update(String(providedKey || '')).digest()
  const expected = crypto.createHash('sha256').update(String(expectedKey || '')).digest()

  return crypto.timingSafeEqual(provided, expected)
}

export function requireAdminApiKey(req, res, next) {
  if (!isAdminConfigured()) {
    res.status(503).json({
      message: 'Admin API is disabled until ADMIN_API_KEY is configured.',
    })
    return
  }

  const providedKey = req.get('x-admin-api-key')

  if (!providedKey || !secureCompare(providedKey, process.env.ADMIN_API_KEY)) {
    res.status(401).json({
      message: 'Invalid admin API key.',
    })
    return
  }

  res.setHeader('Cache-Control', 'no-store')
  next()
}
