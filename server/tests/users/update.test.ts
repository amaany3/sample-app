import { afterEach, describe, expect, it } from 'vitest'
import { prisma } from '../../src/infra/db'
import { client } from '../globalSetup'

const user = {
  name: 'update test1',
  email: 'update1@test.com',
}
const updatedUser = {
  name: 'update test2',
  email: 'update2@test.com',
}

async function updateUser(id: string, body: { name?: string; email?: string }) {
  return client.PUT('/users/{id}', { params: { path: { id } }, body })
}

describe('Update User: PUT /users/:id', () => {
  afterEach(async () => {})

  it('200: all fields', async () => {
    const preDBUser = await prisma.users.create({ data: user })
    const resp = await updateUser(preDBUser.id, updatedUser)
    const postDBUser = await prisma.users.findFirst({ where: { id: preDBUser.id } })

    expect(resp.response.status).toBe(200)
    expect(postDBUser?.email).toBe(updatedUser.email)
    expect(postDBUser?.name).toBe(updatedUser.name)

    await prisma.users.delete({ where: { id: preDBUser.id } })
  })

  it('200: only name fields', async () => {
    const preDBUser = await prisma.users.create({ data: user })
    const resp = await updateUser(preDBUser.id, { name: updatedUser.name })
    const postDBUser = await prisma.users.findFirst({ where: { id: preDBUser.id } })

    expect(resp.response.status).toBe(200)
    expect(postDBUser?.email).toBe(preDBUser.email)
    expect(postDBUser?.name).toBe(updatedUser.name)

    await prisma.users.delete({ where: { id: preDBUser.id } })
  })

  it('200: only email fields', async () => {
    const preDBUser = await prisma.users.create({ data: user })
    const resp = await updateUser(preDBUser.id, { email: updatedUser.email })
    const postDBUser = await prisma.users.findFirst({ where: { id: preDBUser.id } })

    expect(resp.response.status).toBe(200)
    expect(postDBUser?.email).toBe(updatedUser.email)
    expect(postDBUser?.name).toBe(preDBUser.name)

    await prisma.users.delete({ where: { id: preDBUser.id } })
  })

  it('400: name max length 64', async () => {
    const dbUser = await prisma.users.create({ data: user })
    const resp = await updateUser(dbUser.id, { name: 'a'.repeat(65) })

    expect(resp.response.status).toBe(400)

    await prisma.users.delete({ where: { id: dbUser.id } })
  })

  it('400: email', async () => {
    const dbUser = await prisma.users.create({ data: user })
    const resp = await updateUser(dbUser.id, { email: user.name })

    expect(resp.response.status).toBe(400)

    await prisma.users.delete({ where: { id: dbUser.id } })
  })

  it('409: duplicate email', async () => {
    const dbUser1 = await prisma.users.create({ data: user })
    const dbUser2 = await prisma.users.create({ data: updatedUser })

    const resp = await updateUser(dbUser1.id, { email: dbUser2.email })
    expect(resp.response.status).toBe(409)

    await prisma.users.delete({ where: { id: dbUser1.id } })
    await prisma.users.delete({ where: { id: dbUser2.id } })
  })
})
