import type { ZodTypeAny } from 'zod'

export function jsonBody(schema: ZodTypeAny) {
  return {
    required: true,
    content: {
      'application/json': {
        schema,
      },
    },
  }
}

export function jsonResponse(schema: ZodTypeAny, description: string) {
  return {
    content: {
      'application/json': {
        schema,
      },
    },
    description,
  }
}
