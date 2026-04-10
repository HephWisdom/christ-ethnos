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
    publishedAt: '2026-04-28T00:00:00.000Z',
    duration: '38:14',
    videoId: 'dQw4w9WgXcQ',
  },
  {
    title: 'When Grace Is the First Word',
    speaker: 'Rev. Samuel Hart',
    publishedAt: '2026-04-21T00:00:00.000Z',
    duration: '41:02',
    videoId: 'jNQXAC9IVRw',
  },
  {
    title: 'Listening Before Leading',
    speaker: 'Minister Grace Ofori',
    publishedAt: '2026-04-14T00:00:00.000Z',
    duration: '36:55',
    videoId: '9bZkp7q19f0',
  },
  {
    title: 'A People Who Stay',
    speaker: 'Dean Nkem Okafor',
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
  },
  {
    startsAt: '2026-05-14T15:30:00.000Z',
    title: 'Women of Grace Gathering',
    location: 'Rivers Hall',
  },
  {
    startsAt: '2026-05-21T19:00:00.000Z',
    title: 'Open Night & Prayer',
    location: 'North Terrace',
  },
  {
    startsAt: '2026-05-28T16:00:00.000Z',
    title: "Children's Choir Rehearsal",
    location: 'Choir Studio',
  },
  {
    startsAt: '2026-06-02T10:00:00.000Z',
    title: 'Neighborhood Food Basket Drive',
    location: 'South Garden',
  },
  {
    startsAt: '2026-06-09T20:00:00.000Z',
    title: 'Evening of Prayerful Silence',
    location: 'Main Nave',
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

export function serializeSermon(record) {
  return {
    title: record.title,
    speaker: record.speaker,
    date: sermonDateFormatter.format(new Date(record.publishedAt)),
    duration: record.duration,
    videoId: record.videoId,
  }
}

export function serializeEvent(record) {
  return {
    date: eventDayFormatter.format(new Date(record.startsAt)),
    month: eventMonthFormatter.format(new Date(record.startsAt)),
    title: record.title,
    location: `${record.location} — ${formatEventTimeLabel(record.startsAt)}`,
  }
}

export function serializeDailyWord(record) {
  return {
    ref: record.reference,
    quote: record.quote,
    meditation: record.meditation,
  }
}

export const sermonFallback = sermonSeed.map(serializeSermon)
export const eventFallback = eventSeed.map(serializeEvent)
export const dailyWordFallback = dailyWordSeed.map(serializeDailyWord)
