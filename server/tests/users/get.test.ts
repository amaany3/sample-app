import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { prisma } from '../../src/infra/db'
import { client } from '../globalSetup'

const user = {
  name: 'get test',
  email: 'get@test.com',
}

async function getUser(id: string) {
  return client.GET('/users/{id}', { params: { path: { id } } })
}

describe('Get User: GET /users/:id', () => {
  it('200', async () => {
    const dbUser = await prisma.users.create({ data: user })
    const resp = await getUser(dbUser.id)

    expect(resp.response.status).toBe(200)
    expect(resp.data?.id).toBe(dbUser.id)
    expect(resp.data?.email).toBe(dbUser.email)
    expect(resp.data?.name).toBe(dbUser.name)
    expect(resp.data?.createdAt).toBe(dbUser.createdAt.toISOString())
    expect(resp.data?.updatedAt).toBe(dbUser.updatedAt.toISOString())

    await prisma.users.delete({ where: user })
  })

  it('400: id uuid', async () => {
    const resp = await getUser('id')
    expect(resp.response.status).toBe(400)
  })

  it('404', async () => {
    const resp = await getUser(randomUUID())
    expect(resp.response.status).toBe(404)
  })
})
