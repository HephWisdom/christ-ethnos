export function getCookie(name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function setCookie(name, value, maxAgeDays) {
  const maxAge = Math.max(1, Math.floor(maxAgeDays * 24 * 60 * 60))
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

export function deleteCookie(name) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
}
