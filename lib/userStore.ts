import { promises as fs } from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data', 'users.json')

export type User = {
  id: number
  name: string
  email: string
  passwordHash: string
}

async function readUsers(): Promise<User[]> {
  try {
    const raw = await fs.readFile(dataPath, 'utf-8')
    return JSON.parse(raw) as User[]
  } catch (err) {
    return []
  }
}

async function writeUsers(users: User[]) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true })
  await fs.writeFile(dataPath, JSON.stringify(users, null, 2), 'utf-8')
}

export async function findUserByEmail(email: string) {
  const users = await readUsers()
  return users.find(u => u.email.toLowerCase() === email.toLowerCase())
}

export async function createUser(name: string, email: string, passwordHash: string) {
  const users = await readUsers()
  const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1
  const user: User = { id, name, email, passwordHash }
  users.push(user)
  await writeUsers(users)
  return user
}

export async function verifyCredentials(email: string, passwordHash: string) {
  const user = await findUserByEmail(email)
  if (!user) return null
  if (user.passwordHash !== passwordHash) return null
  return user
}

export async function getUserById(id: number) {
  const users = await readUsers()
  return users.find(u => u.id === id) || null
}

export default {
  readUsers,
  writeUsers,
  findUserByEmail,
  createUser,
  verifyCredentials,
  getUserById,
}
