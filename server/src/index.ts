import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { initConfig } from './infra/config.js'
import { initDatabase } from './infra/db.js'
import { userRoute } from './users/route.js'

const app = new OpenAPIHono()
const config = initConfig()
initDatabase(config)

app.use(cors({ origin: '*' }), logger())

const api = new OpenAPIHono().route('/', userRoute)
app.route('/api/v1', api)

app.onError((err, c) => {
  console.error(err)
  return c.json({ message: 'Internal Server Error' }, 500)
})

app.notFound((c) => {
  return c.json({ message: ' Not Found' }, 404)
})

app
  .doc('/spec', {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Admin API',
    },
  })
  .get(
    '/doc',
    swaggerUI({
      url: '/spec',
    }),
  )

console.log(`Server is running on http://localhost:${config.PORT}`)

serve({ fetch: app.fetch, port: config.PORT })
