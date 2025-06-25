import createClient from 'openapi-fetch'
import { initConfig } from '../src/infra/config.js'
import { initDatabase, prisma } from '../src/infra/db.js'
import type { paths } from './schema.js'

export const client = createClient<paths>({ baseUrl: `http://api.sampleapp.local` })

export async function setup() {
  const config = initConfig()
  initDatabase(config)

  // delete test data
  await prisma.users.deleteMany({})
}
