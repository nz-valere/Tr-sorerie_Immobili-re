import { prisma } from './prisma'

export type Property = {
  id: number
  user_id: number
  name: string
  address: string
}

export async function getPropertiesByUser(user_id: number) {
  return prisma.property.findMany({ where: { user_id } })
}

export async function getPropertyById(id: number) {
  return prisma.property.findUnique({ where: { id } })
}

export async function createProperty(user_id: number, name: string, address: string) {
  return prisma.property.create({ data: { user_id, name, address } })
}

export async function updateProperty(id: number, data: Partial<Pick<Property, 'name' | 'address'>>) {
  return prisma.property.update({ where: { id }, data })
}

export async function deleteProperty(id: number) {
  return prisma.property.delete({ where: { id } })
}
