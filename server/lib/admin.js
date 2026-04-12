export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_API_KEY)
}

export function requireAdminApiKey(req, res, next) {
  if (!isAdminConfigured()) {
    res.status(503).json({
      message: 'Admin API is disabled until ADMIN_API_KEY is configured.',
    })
    return
  }

  const providedKey = req.get('x-admin-api-key')

  if (!providedKey || providedKey !== process.env.ADMIN_API_KEY) {
    res.status(401).json({
      message: 'Invalid admin API key.',
    })
    return
  }

  next()
}
