import 'dotenv/config'
import mongoose from 'mongoose'
import { dailyWordSeed, eventSeed, sermonSeed } from '../shared/content.js'
import { connectToDatabase, isDatabaseConfigured } from '../server/lib/database.js'
import DailyWord from '../server/models/DailyWord.js'
import Event from '../server/models/Event.js'
import Sermon from '../server/models/Sermon.js'

async function seedDatabase() {
  if (!isDatabaseConfigured()) {
    throw new Error('MONGODB_URI is missing. Add it to your .env file before seeding.')
  }

  await connectToDatabase()

  await Promise.all([
    Sermon.deleteMany({}),
    Event.deleteMany({}),
    DailyWord.deleteMany({}),
  ])

  await Promise.all([
    Sermon.insertMany(sermonSeed),
    Event.insertMany(eventSeed),
    DailyWord.insertMany(dailyWordSeed),
  ])

  console.log('Seeded sermons, events, and daily word collections.')
}

seedDatabase()
  .catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
