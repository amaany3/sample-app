import type { RouteHandler } from '@hono/zod-openapi'
import { createRoute, z } from '@hono/zod-openapi'
import { prisma } from '../infra/db.js'
import { errorDesc, errorSchema } from '../schema/error.js'
import { jsonResponse } from '../schema/json.js'
import { userSchema, type userType } from '../schema/user.js'

const route = createRoute({
  method: 'get',
  path: '/users',
  responses: {
    200: jsonResponse(z.array(userSchema), 'List Users'),
    500: jsonResponse(errorSchema, errorDesc.InternalServer),
  },
})

const handler: RouteHandler<typeof route> = async (c) => {
  const users = await prisma.users.findMany({
    orderBy: { createdAt: 'desc' },
  })
  const resp: userType[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }))
  return c.json(resp, 200)
}

export const listAPI = { route, handler }
