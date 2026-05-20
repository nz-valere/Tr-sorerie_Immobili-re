import { promises as fs } from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data', 'properties.json')

export type Property = {
  id: number
  user_id: number
  name: string
  address: string
}

async function readProperties(): Promise<Property[]> {
  try {
    const raw = await fs.readFile(dataPath, 'utf-8')
    return JSON.parse(raw) as Property[]
  } catch {
    return []
  }
}

async function writeProperties(properties: Property[]) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true })
  await fs.writeFile(dataPath, JSON.stringify(properties, null, 2), 'utf-8')
}

export async function getPropertiesByUser(user_id: number) {
  const properties = await readProperties()
  return properties.filter(p => p.user_id === user_id)
}

export async function getPropertyById(id: number) {
  const properties = await readProperties()
  return properties.find(p => p.id === id) || null
}

export async function createProperty(user_id: number, name: string, address: string) {
  const properties = await readProperties()
  const id = properties.length ? Math.max(...properties.map(p => p.id)) + 1 : 1
  const property: Property = { id, user_id, name, address }
  properties.push(property)
  await writeProperties(properties)
  return property
}

export async function updateProperty(id: number, data: Partial<Pick<Property, 'name' | 'address'>>) {
  const properties = await readProperties()
  const index = properties.findIndex(p => p.id === id)
  if (index === -1) return null
  properties[index] = { ...properties[index], ...data }
  await writeProperties(properties)
  return properties[index]
}

export async function deleteProperty(id: number) {
  const properties = await readProperties()
  const index = properties.findIndex(p => p.id === id)
  if (index === -1) return false
  properties.splice(index, 1)
  await writeProperties(properties)
  return true
}
