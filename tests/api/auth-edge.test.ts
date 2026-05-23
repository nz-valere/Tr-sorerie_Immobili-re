import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST as login } from '@/app/api/auth/login/route'
import { prisma } from '@/lib/prisma'
import { makeRequest } from '../helpers'

beforeEach(() => vi.clearAllMocks())

describe('POST /api/auth/login — body vide / malformé', () => {
  it('rejette si email manquant', async () => {
    const req = makeRequest('/api/auth/login', {
      method: 'POST',
      body: { password: 'password123' },
    })
    const res = await login(req)
    expect(res.status).toBe(400)
  })

  it('rejette si password manquant', async () => {
    const req = makeRequest('/api/auth/login', {
      method: 'POST',
      body: { email: 'test@test.com' },
    })
    const res = await login(req)
    expect(res.status).toBe(400)
  })

  it('rejette si body complètement vide', async () => {
    const req = makeRequest('/api/auth/login', {
      method: 'POST',
      body: {},
    })
    const res = await login(req)
    expect(res.status).toBe(400)
  })

  it('retourne 500 si body non-JSON', async () => {
    const req = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'pas du json{{{',
    })
    const res = await login(req)
    expect(res.status).toBe(500)
  })
})
