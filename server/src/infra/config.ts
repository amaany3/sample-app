import { z } from 'zod'

const config = z.object({
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.string(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  PORT: z.coerce.number(),
})
export type Config = z.infer<typeof config>

export function initConfig(): Config {
  return config.parse(process.env)
}
