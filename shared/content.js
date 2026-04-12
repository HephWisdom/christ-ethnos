const sermonDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
})

const eventDayFormatter = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  timeZone: 'UTC',
})

const eventMonthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  timeZone: 'UTC',
})

const eventTimeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZone: 'UTC',
})

export const sermonSeed = [
  {
    title: 'The Church of Small Things',
    speaker: 'Pastor Ruth Adebayo',
    series: 'Near To Grace',
    summary: 'A message about how ordinary faithfulness becomes a holy witness over time.',
    publishedAt: '2026-04-28T00:00:00.000Z',
    duration: '38:14',
    videoId: 'dQw4w9WgXcQ',
  },
  {
    title: 'When Grace Is the First Word',
    speaker: 'Rev. Samuel Hart',
    series: 'Mercy In Motion',
    summary: 'Starting with grace changes how a church speaks, leads, and heals.',
    publishedAt: '2026-04-21T00:00:00.000Z',
    duration: '41:02',
    videoId: 'jNQXAC9IVRw',
  },
  {
    title: 'Listening Before Leading',
    speaker: 'Minister Grace Ofori',
    series: 'Shepherding Well',
    summary: 'Pastoral leadership begins with listening long before it speaks loudly.',
    publishedAt: '2026-04-14T00:00:00.000Z',
    duration: '36:55',
    videoId: '9bZkp7q19f0',
  },
  {
    title: 'A People Who Stay',
    speaker: 'Dean Nkem Okafor',
    series: 'The Steady Church',
    summary: 'What covenant presence looks like in a hurried and fragmented world.',
    publishedAt: '2026-04-07T00:00:00.000Z',
    duration: '29:37',
    videoId: '3JZ_D3ELwOQ',
  },
]

export const eventSeed = [
  {
    startsAt: '2026-05-08T18:00:00.000Z',
    title: 'Community Communion',
    location: 'West End Sanctuary',
    description: 'A quiet evening of worship, table fellowship, and prayer for the city.',
    registrationUrl: '',
  },
  {
    startsAt: '2026-05-14T15:30:00.000Z',
    title: 'Women of Grace Gathering',
    location: 'Rivers Hall',
    description: 'An afternoon gathering for prayer, encouragement, and shared stories.',
    registrationUrl: '',
  },
  {
    startsAt: '2026-05-21T19:00:00.000Z',
    title: 'Open Night & Prayer',
    location: 'North Terrace',
    description: 'Bring friends and neighbors for music, testimony, and guided prayer.',
    registrationUrl: '',
  },
  {
    startsAt: '2026-05-28T16:00:00.000Z',
    title: "Children's Choir Rehearsal",
    location: 'Choir Studio',
    description: 'A rehearsal evening for children preparing music for the next family service.',
    registrationUrl: '',
  },
  {
    startsAt: '2026-06-02T10:00:00.000Z',
    title: 'Neighborhood Food Basket Drive',
    location: 'South Garden',
    description: 'Volunteer with the outreach team as baskets are prepared and distributed.',
    registrationUrl: '',
  },
  {
    startsAt: '2026-06-09T20:00:00.000Z',
    title: 'Evening of Prayerful Silence',
    location: 'Main Nave',
    description: 'A guided contemplative gathering for rest, reflection, and intercession.',
    registrationUrl: '',
  },
]

export const dailyWordSeed = [
  {
    reference: 'Isaiah 41:10',
    quote: 'Do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.',
    meditation: 'In stillness you discover that you were never alone. The fear you carry has no claim on a heart surrendered to grace.',
    sortOrder: 1,
  },
  {
    reference: 'Psalm 46:10',
    quote: 'Be still, and know that I am God.',
    meditation: 'Silence is not emptiness; it is fullness waiting to be recognized. When you stop striving, you begin to receive.',
    sortOrder: 2,
  },
  {
    reference: 'Romans 8:38-39',
    quote: 'Neither death nor life, neither angels nor demons, can separate us from the love of God.',
    meditation: 'Love this complete asks nothing more of you than to rest in it. You are held not by what you do, but by who He is.',
    sortOrder: 3,
  },
]

function formatEventTimeLabel(startsAt) {
  return eventTimeFormatter.format(new Date(startsAt)).replace(' ', '').toLowerCase()
}

function serializeId(record) {
  if (record.id) return String(record.id)
  if (record._id) return String(record._id)
  return null
}

export function serializeSermon(record) {
  return {
    id: serializeId(record),
    title: record.title,
    speaker: record.speaker,
    series: record.series || '',
    summary: record.summary || '',
    date: sermonDateFormatter.format(new Date(record.publishedAt)),
    publishedAt: new Date(record.publishedAt).toISOString(),
    duration: record.duration,
    videoId: record.videoId,
  }
}

export function serializeEvent(record) {
  return {
    id: serializeId(record),
    date: eventDayFormatter.format(new Date(record.startsAt)),
    month: eventMonthFormatter.format(new Date(record.startsAt)),
    title: record.title,
    startsAt: new Date(record.startsAt).toISOString(),
    venue: record.location,
    description: record.description || '',
    registrationUrl: record.registrationUrl || '',
    location: `${record.location} — ${formatEventTimeLabel(record.startsAt)}`,
  }
}

export function serializeDailyWord(record) {
  return {
    id: serializeId(record),
    ref: record.reference,
    quote: record.quote,
    meditation: record.meditation,
  }
}

export const sermonFallback = sermonSeed.map(serializeSermon)
export const eventFallback = eventSeed.map(serializeEvent)
export const dailyWordFallback = dailyWordSeed.map(serializeDailyWord)
