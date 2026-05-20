import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

export function getUserFromRequest(req: NextRequest): { id: number; email: string } | null {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return null
  try {
    const token = auth.slice(7)
    return jwt.verify(token, JWT_SECRET) as { id: number; email: string }
  } catch {
    return null
  }
}
