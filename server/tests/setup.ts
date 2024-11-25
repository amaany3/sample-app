import { beforeAll } from 'vitest'
import { initConfig } from '../src/infra/config'
import { initDatabase } from '../src/infra/db'

beforeAll(async () => {
  const config = initConfig()
  initDatabase(config)
})
