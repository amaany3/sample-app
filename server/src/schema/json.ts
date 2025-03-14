export function jsonBody<T>(schema: T) {
  return {
    required: true,
    content: {
      'application/json': {
        schema,
      },
    },
  }
}

export function jsonResponse<T>(schema: T, description: string) {
  return {
    content: {
      'application/json': {
        schema,
      },
    },
    description,
  }
}
