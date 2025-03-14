import { type RouteHandler, z } from '@hono/zod-openapi'
import { createRoute } from '@hono/zod-openapi'
import { isAlreadyExistError, isNotFoundError, prisma } from '../infra/db.js'
import { errorDesc, errorSchema } from '../schema/error.js'
import { jsonBody, jsonResponse } from '../schema/json.js'
import { userParamsSchema, userSchema } from '../schema/user.js'

const bodySchema = userSchema
  .pick({
    name: true,
    email: true,
  })
  .partial({
    name: true,
    email: true,
  })

const route = createRoute({
  method: 'put',
  path: '/users/{userId}',
  request: {
    params: userParamsSchema,
    body: jsonBody(bodySchema),
  },
  responses: {
    200: jsonResponse(z.object({}), 'Update Users'),
    400: jsonResponse(errorSchema, errorDesc.BadRequest),
    404: jsonResponse(errorSchema, errorDesc.NotFound),
    409: jsonResponse(errorSchema, errorDesc.AlreadyExist),
    500: jsonResponse(errorSchema, errorDesc.InternalServer),
  },
})

const handler: RouteHandler<typeof route> = async (c) => {
  const { userId } = c.req.valid('param')
  const body = c.req.valid('json')

  try {
    await prisma.users.update({
      where: { id: userId },
      data: {
        name: body.name,
        email: body.email,
      },
    })
    return c.json({}, 200)
  } catch (e) {
    if (isNotFoundError(e)) {
      return c.json({ message: 'Not Found' }, 404)
    }
    if (isAlreadyExistError(e)) {
      return c.json({ message: 'Already Exist' }, 409)
    }
    throw e
  }
}

export const updateAPI = { route, handler }
