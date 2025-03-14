import { type RouteHandler, z } from '@hono/zod-openapi'
import { createRoute } from '@hono/zod-openapi'
import { isNotFoundError, prisma } from '../infra/db.js'
import { errorDesc, errorSchema } from '../schema/error.js'
import { jsonResponse } from '../schema/json.js'
import { userParamsSchema } from '../schema/user.js'

const route = createRoute({
  method: 'delete',
  path: '/users/{userId}',
  request: {
    params: userParamsSchema,
  },
  responses: {
    200: jsonResponse(z.object({}), 'Delete User'),
    400: jsonResponse(errorSchema, errorDesc.BadRequest),
    404: jsonResponse(errorSchema, errorDesc.NotFound),
    500: jsonResponse(errorSchema, errorDesc.InternalServer),
  },
})

const handler: RouteHandler<typeof route> = async (c) => {
  const { userId } = c.req.valid('param')

  try {
    await prisma.users.delete({ where: { id: userId } })
    return c.json({}, 200)
  } catch (e) {
    if (isNotFoundError(e)) {
      return c.json({ message: 'Not Found' }, 404)
    }
    throw e
  }
}

export const deleteAPI = { route, handler }
