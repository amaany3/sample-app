import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { initConfig } from './infra/config'
import { initDatabase } from './infra/db'
import { userRoute } from './routes/users/route'

const app = new OpenAPIHono()

const config = initConfig()

initDatabase(config)

app.route('/users', userRoute)

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
      title: 'My API',
    },
  })
  .get(
    '/doc',
    swaggerUI({
      url: '/spec',
    }),
  )

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({ fetch: app.fetch, port })
