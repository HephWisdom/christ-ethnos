import 'dotenv/config'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import contentRouter from './routes/content.js'
import { isDatabaseConfigured } from './lib/database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const indexFile = path.join(distDir, 'index.html')
const port = Number(process.env.PORT) || 4000

const app = express()

app.use(express.json())
app.use('/api', contentRouter)

if (existsSync(distDir)) {
  app.use(express.static(distDir))
  app.use((req, res, next) => {
    if (req.path === '/api' || req.path.startsWith('/api/')) {
      next()
      return
    }

    res.sendFile(indexFile)
  })
}

app.listen(port, () => {
  const databaseMode = isDatabaseConfigured() ? 'MongoDB enabled' : 'seed content mode'
  console.log(`API server listening on http://localhost:${port} (${databaseMode})`)
})
