import mongoose from 'mongoose'

const databaseCache = globalThis.__churchSiteDatabaseCache ?? {
  connection: null,
  promise: null,
}

globalThis.__churchSiteDatabaseCache = databaseCache

export function isDatabaseConfigured() {
  return Boolean(process.env.MONGODB_URI)
}

export async function connectToDatabase() {
  if (!isDatabaseConfigured()) {
    return null
  }

  if (databaseCache.connection) {
    return databaseCache.connection
  }

  if (!databaseCache.promise) {
    databaseCache.promise = mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB || undefined,
    })
  }

  try {
    databaseCache.connection = await databaseCache.promise
    return databaseCache.connection
  } catch (error) {
    databaseCache.promise = null
    throw error
  }
}
