const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export function buildApiUrl(pathname) {
  return `${apiBaseUrl}${pathname}`
}

export async function apiRequest(pathname, options = {}) {
  const response = await fetch(buildApiUrl(pathname), {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  })

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    if (typeof payload === 'string') {
      throw new Error(payload || 'Request failed.')
    }

    const message = payload?.message || 'Request failed.'
    const details = payload?.details ? ` ${payload.details}` : ''
    throw new Error(`${message}${details}`)
  }

  return payload
}
