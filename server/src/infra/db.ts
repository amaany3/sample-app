import { Prisma, PrismaClient } from '@prisma/client'
import { env } from './env.js'

const dbHost = env.DATABASE_HOST
const dbPort = env.DATABASE_PORT
const dbUser = env.DATABASE_USER
const dbPassword = env.DATABASE_PASSWORD
const dbName = env.DATABASE_NAME

const datasourceUrl = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`
export const prisma = new PrismaClient({ datasourceUrl })

export function isNotFoundError(e: unknown) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) return e.code === 'P2025'
}

export function isAlreadyExistError(e: unknown) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) return e.code === 'P2002'
}
