const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export function buildApiUrl(pathname) {
  return `${apiBaseUrl}${pathname}`
}
