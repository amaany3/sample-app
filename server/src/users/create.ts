import { type RouteHandler, z } from '@hono/zod-openapi'
import { createRoute } from '@hono/zod-openapi'
import { isAlreadyExistError, prisma } from '../infra/db.js'
import { errorDesc, errorSchema } from '../schema/error.js'
import { jsonBody, jsonResponse } from '../schema/json.js'
import { userSchema } from '../schema/user.js'

const bodySchema = userSchema.pick({
  name: true,
  email: true,
})

const responseSchema = z.object({
  id: z.string().uuid().openapi({
    example: '778e7155-798c-4f06-ba52-e93535a60069',
  }),
})

const route = createRoute({
  method: 'post',
  path: '/users',
  request: {
    body: jsonBody(bodySchema),
  },
  responses: {
    200: jsonResponse(responseSchema, 'Create User'),
    400: jsonResponse(errorSchema, errorDesc.BadRequest),
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
    return c.json({ id: user.id }, 200)
  } catch (e) {
    if (isAlreadyExistError(e)) {
      return c.json({ message: 'Already Exist' }, 409)
    }
    throw e
  }
}

export const createAPI = { route, handler }
