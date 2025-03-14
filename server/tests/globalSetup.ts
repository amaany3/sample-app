import { type ServerType, serve } from '@hono/node-server'
import { OpenAPIHono } from '@hono/zod-openapi'
import createClient from 'openapi-fetch'
import { initConfig } from '../src/infra/config.js'
import { initDatabase, prisma } from '../src/infra/db.js'
import { userRoute } from '../src/users/route.js'
import type { paths } from './schema.js'

const port = 3001
export const client = createClient<paths>({ baseUrl: `http://localhost:${port}` })

let server: ServerType

export async function setup() {
  const config = initConfig()
  config.DATABASE_HOST = 'test.postgres.hono.local'
  initDatabase(config)

  // delete test data
  await prisma.users.deleteMany({})

  // init admin server
  const app = new OpenAPIHono()
  const api = new OpenAPIHono().route('/', userRoute)
  app.route('/api/v1', api)
  server = serve({ fetch: app.fetch, port })
}

export function teardown() {
  server.close()
}
