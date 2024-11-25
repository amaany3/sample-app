import { type ServerType, serve } from '@hono/node-server'
import { OpenAPIHono } from '@hono/zod-openapi'
import createClient from 'openapi-fetch'
import { initConfig } from '../src/infra/config'
import { initDatabase, prisma } from '../src/infra/db'
import { userRoute } from '../src/routes/users/route'
import type { paths } from './schema'

const port = 3001
export const client = createClient<paths>({ baseUrl: `http://localhost:${port}` })

let server: ServerType

export async function setup() {
  const config = initConfig()
  config.DATABASE_PORT = '5433'
  initDatabase(config)

  // delete test data
  await prisma.users.deleteMany({})

  const app = new OpenAPIHono()
  app.route('/users', userRoute)
  server = serve({ fetch: app.fetch, port })
}

export function teardown() {
  server.close()
}
