import 'dotenv/config'
import { createApp } from '../server/app.js'

const app = createApp({ rootApiRoutes: true })

export const config = {
  api: {
    bodyParser: false,
  },
}

export default app
