import { type RouteHandler, z } from '@hono/zod-openapi'
import { createRoute } from '@hono/zod-openapi'
import { isAlreadyExistError, prisma } from '../../infra/db.js'
import { errorDesc, errorSchema } from '../schema/error.js'
import { jsonBody, jsonResponse } from '../schema/json.js'
import { userSchema } from '../schema/user.js'

const bodySchema = z.object({
  name: z.string().max(64).openapi({
    example: 'John Doe',
  }),
  email: z.string().email().openapi({
    example: 'john_doe@example.com',
  }),
})

const route = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: jsonBody(bodySchema),
  },
  responses: {
    200: jsonResponse(userSchema, 'Create User'),
    409: jsonResponse(errorSchema, errorDesc.AlreadyExist),
    500: jsonResponse(errorSchema, errorDesc.InternalServer),
  },
})

const handler: RouteHandler<typeof route> = async (c) => {
  const { name, email } = c.req.valid('json')

  try {
    const user = await prisma.users.create({
      data: { name, email },
    })
    return c.json(user, 200)
  } catch (e) {
    if (isAlreadyExistError(e)) {
      return c.json({ message: 'Already Exist' }, 409)
    }
    throw e
  }
}

export const createUser = { route, handler }
