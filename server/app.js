import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import adminRouter from './routes/admin.js'
import analyticsRouter from './routes/analytics.js'
import contentRouter from './routes/content.js'
import formsRouter from './routes/forms.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const indexFile = path.join(distDir, 'index.html')

function getAllowedOrigins() {
  return String(process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

function applyCors(req, res, next) {
  const origin = req.get('origin')
  const allowedOrigins = getAllowedOrigins()
  const allowsOrigin = origin && (
    allowedOrigins.includes('*') || allowedOrigins.includes(origin)
  )

  if (allowsOrigin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }

  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-api-key')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  next()
}

function mountApiRoutes(app, prefix = '/api') {
  app.use(prefix, contentRouter)
  app.use(prefix, formsRouter)
  app.use(`${prefix}/analytics`, analyticsRouter)
  app.use(`${prefix}/admin`, adminRouter)
}

export function createApp({ rootApiRoutes = false, serveStatic = false } = {}) {
  const app = express()

  app.use(applyCors)
  app.use(express.json())
  mountApiRoutes(app)

  if (rootApiRoutes) {
    mountApiRoutes(app, '')
  }

  if (serveStatic && existsSync(distDir)) {
    app.use(express.static(distDir))
    app.use((req, res, next) => {
      if (req.path === '/api' || req.path.startsWith('/api/')) {
        next()
        return
      }

      res.sendFile(indexFile)
    })
  }

  return app
}
