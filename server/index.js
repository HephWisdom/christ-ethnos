import 'dotenv/config'
import { createApp } from './app.js'
import { isDatabaseConfigured } from './lib/database.js'

const port = Number(process.env.PORT) || 4000
const app = createApp({ serveStatic: true })

app.listen(port, () => {
  const databaseMode = isDatabaseConfigured() ? 'MongoDB enabled' : 'seed content mode'
  console.log(`API server listening on http://localhost:${port} (${databaseMode})`)
})
