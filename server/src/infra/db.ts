import { Prisma, PrismaClient } from '@prisma/client'
import type { Config } from './config.js'

export let prisma: PrismaClient

export function initDatabase(config: Config) {
  const dbHost = config.DATABASE_HOST
  const dbPort = config.DATABASE_PORT
  const dbUser = config.DATABASE_USER
  const dbPassword = config.DATABASE_PASSWORD
  const dbName = config.DATABASE_NAME

  const datasourceUrl = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`
  prisma = new PrismaClient({ datasourceUrl })
}

export function isNotFoundError(e: unknown): boolean {
  if (e instanceof Prisma.PrismaClientKnownRequestError) return e.code === 'P2025'
  return false
}

export function isAlreadyExistError(e: unknown): boolean {
  if (e instanceof Prisma.PrismaClientKnownRequestError) return e.code === 'P2002'
  return false
}
