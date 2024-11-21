import type { RouteHandler } from '@hono/zod-openapi'
import { createRoute } from '@hono/zod-openapi'
import { prisma } from '../../infra/db.js'
import { errorDesc, errorSchema } from '../schema/error.js'
import { jsonResponse } from '../schema/json.js'
import { userListSchema } from '../schema/user.js'

const route = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: jsonResponse(userListSchema, 'List User'),
    500: jsonResponse(errorSchema, errorDesc.InternalServer),
  },
})

const handler: RouteHandler<typeof route> = async (c) => {
  const users = await prisma.users.findMany({})
  return c.json(users, 200)
}

export const listUser = { route, handler }
