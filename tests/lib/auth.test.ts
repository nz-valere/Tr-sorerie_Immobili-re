import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { getUserFromRequest } from '@/lib/auth'

const JWT_SECRET = 'dev-secret'

function makeReq(authHeader?: string) {
  return new NextRequest('http://localhost/api/test', {
    headers: authHeader ? { authorization: authHeader } : {},
  })
}

describe('getUserFromRequest', () => {
  it('retourne l\'utilisateur avec un token valide', () => {
    const token = jwt.sign({ id: 1, email: 'test@test.com' }, JWT_SECRET)
    const user = getUserFromRequest(makeReq(`Bearer ${token}`))
    expect(user).not.toBeNull()
    expect(user?.id).toBe(1)
    expect(user?.email).toBe('test@test.com')
  })

  it('retourne null si header absent', () => {
    const user = getUserFromRequest(makeReq())
    expect(user).toBeNull()
  })

  it('retourne null si header sans "Bearer "', () => {
    const token = jwt.sign({ id: 1, email: 'test@test.com' }, JWT_SECRET)
    const user = getUserFromRequest(makeReq(token))
    expect(user).toBeNull()
  })

  it('retourne null si token malformé', () => {
    const user = getUserFromRequest(makeReq('Bearer token.invalide.ici'))
    expect(user).toBeNull()
  })

  it('retourne null si token signé avec mauvais secret', () => {
    const token = jwt.sign({ id: 1, email: 'test@test.com' }, 'mauvais-secret')
    const user = getUserFromRequest(makeReq(`Bearer ${token}`))
    expect(user).toBeNull()
  })

  it('retourne null si token expiré', () => {
    const token = jwt.sign({ id: 1, email: 'test@test.com' }, JWT_SECRET, { expiresIn: '0s' })
    const user = getUserFromRequest(makeReq(`Bearer ${token}`))
    expect(user).toBeNull()
  })
})
