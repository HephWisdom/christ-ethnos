const isDevelopment = process.env.NODE_ENV === 'development'

export function sendError(res, status, message, error) {
  if (error && status >= 500 && process.env.NODE_ENV !== 'test') {
    console.error(message, error)
  }

  res.status(status).json({
    message,
    ...(isDevelopment && error?.message ? { details: error.message } : {}),
  })
}

export function getErrorStatus(error, fallback = 500) {
  if (error?.type === 'entity.too.large') return 413
  if (error?.type === 'entity.parse.failed') return 400
  if (error?.name === 'ValidationError') return 400
  if (error?.name === 'CastError') return 400
  return fallback
}
