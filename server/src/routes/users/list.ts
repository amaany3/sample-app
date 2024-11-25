import type { RouteHandler } from '@hono/zod-openapi'
import { createRoute } from '@hono/zod-openapi'
import { prisma } from '../../infra/db'
import { errorDesc, errorSchema } from '../schema/error'
import { jsonResponse } from '../schema/json'
import { userListSchema } from '../schema/user'

const route = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: jsonResponse(userListSchema, 'List User'),
    500: jsonResponse(errorSchema, errorDesc.InternalServer),
  },
})

const handler: RouteHandler<typeof route> = async (c) => {
  const users = await prisma.users.findMany({ orderBy: { createdAt: 'desc' } })
  return c.json(users, 200)
}

export const listUser = { route, handler }
