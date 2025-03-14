import { type RouteHandler, z } from '@hono/zod-openapi'
import { createRoute } from '@hono/zod-openapi'
import { isNotFoundError, prisma } from '../infra/db.js'
import { errorDesc, errorSchema } from '../schema/error.js'
import { jsonResponse } from '../schema/json.js'
import { userParamsSchema, userSchema, type userType } from '../schema/user.js'

const route = createRoute({
  method: 'get',
  path: 'users/{userId}',
  request: {
    params: userParamsSchema,
  },
  responses: {
    200: jsonResponse(userSchema, 'Get User'),
    400: jsonResponse(errorSchema, errorDesc.BadRequest),
    404: jsonResponse(errorSchema, errorDesc.NotFound),
    500: jsonResponse(errorSchema, errorDesc.InternalServer),
  },
})

const handler: RouteHandler<typeof route> = async (c) => {
  const { userId } = c.req.valid('param')

  try {
    const user = await prisma.users.findUniqueOrThrow({
      where: { id: userId },
    })
    const resp: userType = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
    return c.json(resp, 200)
  } catch (e) {
    if (isNotFoundError(e)) {
      return c.json({ message: 'Not Found' }, 404)
    }
    throw e
  }
}

export const getAPI = { route, handler }
