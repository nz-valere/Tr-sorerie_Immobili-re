import { prisma } from './prisma'

export type User = {
  id: number
  name: string
  email: string
  passwordHash: string
}

export async function findUserByEmail(email: string) {
  return prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } })
}

export async function createUser(name: string, email: string, passwordHash: string) {
  return prisma.user.create({ data: { name, email, passwordHash } })
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({ where: { id } })
}
