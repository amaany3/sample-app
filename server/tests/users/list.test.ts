import { describe, expect, it } from 'vitest'
import { prisma } from '../../src/infra/db'
import { client } from '../globalSetup'

const user = {
  name: 'list test',
  email: 'list@test.com',
}

async function listUser() {
  return client.GET('/users')
}

describe('List User: GET /users', () => {
  it('200', async () => {
    const dbUser = await prisma.users.create({ data: user })

    const resp = await listUser()
    const respUser = resp.data?.find((u) => u.id === dbUser.id)

    expect(resp.response.status).toBe(200)
    expect(respUser?.id).toBe(dbUser.id)
    expect(respUser?.email).toBe(dbUser.email)
    expect(respUser?.name).toBe(dbUser.name)
    expect(respUser?.createdAt).toBe(dbUser.createdAt.toISOString())
    expect(respUser?.updatedAt).toBe(dbUser.updatedAt.toISOString())

    await prisma.users.delete({ where: user })
  })
})
