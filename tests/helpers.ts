import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'dev-secret'

export function makeToken(user = { id: 1, email: 'test@test.com' }) {
  return jwt.sign(user, JWT_SECRET)
}

export function makeRequest(
  url: string,
  options: { method?: string; body?: unknown; token?: string } = {}
) {
  const { method = 'GET', body, token } = options
  const headers: Record<string, string> = {}
  if (token) headers['authorization'] = `Bearer ${token}`
  if (body) headers['content-type'] = 'application/json'
  return new NextRequest(`http://localhost${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
}
