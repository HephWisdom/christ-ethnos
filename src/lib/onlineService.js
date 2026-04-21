const onlineServiceUrl = ''
const platform = 'Zoom'
const serviceTime = 'Saturdays and Sundays • 11:00 PM GMT'
const host = 'Online Welcome Team'

export function getOnlineServiceConfig() {
  return {
    url: onlineServiceUrl || null,
    platform,
    serviceTime,
    host,
  }
}

export function isOnlineServiceConfigured() {
  return Boolean(onlineServiceUrl)
}
