import { randomUUID } from 'node:crypto'
import { expect } from 'vitest'
import { client } from '../globalSetup.js'
import type { paths } from '../schema.js'

export async function createUserApi(
  body: paths['/api/v1/users']['post']['requestBody']['content']['application/json'],
) {
  return client.POST('/api/v1/users', { body })
}

export async function deleteUserApi(userId: string) {
  return client.DELETE('/api/v1/users/{userId}', { params: { path: { userId } } })
}

export async function getUserApi(userId: string) {
  return client.GET('/api/v1/users/{userId}', { params: { path: { userId } } })
}

export async function listUserApi() {
  return client.GET('/api/v1/users')
}

export async function updateUserApi(
  userId: string,
  body: paths['/api/v1/users/{userId}']['put']['requestBody']['content']['application/json'],
) {
  return client.PUT('/api/v1/users/{userId}', { params: { path: { userId } }, body })
}

export function testUser(): paths['/api/v1/users']['post']['requestBody']['content']['application/json'] {
  return {
    name: randomUUID(),
    email: `${randomUUID()}@example.com`,
  }
}

export async function equalUser(
  createReq?: paths['/api/v1/users']['post']['requestBody']['content']['application/json'],
  createResp?: paths['/api/v1/users']['post']['responses']['200']['content']['application/json'],
  getResp?: paths['/api/v1/users/{userId}']['get']['responses']['200']['content']['application/json'],
) {
  expect(createReq).toBeDefined()
  expect(createResp).toBeDefined()
  expect(getResp).toBeDefined()
  if (createReq == null || createResp == null || getResp == null) return

  expect(getResp.id).toBe(createResp.id)
  expect(getResp.name).toBe(createReq.name)
  expect(getResp.email).toBe(createReq.email)
}
