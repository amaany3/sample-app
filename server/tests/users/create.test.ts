import { describe, expect, it } from 'vitest'
import { prisma } from '../../src/infra/db'
import { client } from '../globalSetup'

const user = {
  name: 'create test',
  email: 'create@test.com',
}

async function createUser(body: { name: string; email: string }) {
  return client.POST('/users', { body })
}

describe('Create User: POST /users', () => {
  it('200', async () => {
    const resp = await createUser(user)
    const dbUser = await prisma.users.findUnique({ where: user })

    expect(resp.response.status).toBe(200)
    expect(resp.data?.id).toBe(dbUser?.id)

    await prisma.users.delete({ where: user })
  })

  it('400: name max length 64', async () => {
    const body = { name: 'a'.repeat(65), email: user.email }
    const resp = await createUser(body)
    expect(resp.response.status).toBe(400)
  })

  it('400: email', async () => {
    const body = { name: user.name, email: user.name }
    const resp = await createUser(body)
    expect(resp.response.status).toBe(400)
  })

  it('409', async () => {
    const resp1 = await createUser(user)
    expect(resp1.response.status).toBe(200)

    const resp2 = await createUser(user)
    expect(resp2.response.status).toBe(409)
  })
})
