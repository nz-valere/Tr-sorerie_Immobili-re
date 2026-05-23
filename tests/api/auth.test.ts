import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST as register } from '@/app/api/auth/register/route'
import { POST as login } from '@/app/api/auth/login/route'
import { prisma } from '@/lib/prisma'
import { makeRequest } from '../helpers'

const mockUser = { id: 1, name: 'Test', email: 'test@test.com', passwordHash: '' }

beforeEach(() => vi.clearAllMocks())

describe('POST /api/auth/register', () => {
  it('crée un utilisateur', async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null)
    vi.mocked(prisma.user.create).mockResolvedValue(mockUser)

    const req = makeRequest('/api/auth/register', {
      method: 'POST',
      body: { name: 'Test', email: 'test@test.com', password: 'password123' },
    })
    const res = await register(req)
    expect(res.status).toBe(200)
  })

  it('rejette si email déjà pris', async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUser)

    const req = makeRequest('/api/auth/register', {
      method: 'POST',
      body: { name: 'Test', email: 'test@test.com', password: 'password123' },
    })
    const res = await register(req)
    expect(res.status).toBe(400)
  })

  it('rejette si champs manquants', async () => {
    const req = makeRequest('/api/auth/register', {
      method: 'POST',
      body: { email: 'test@test.com' },
    })
    const res = await register(req)
    expect(res.status).toBe(400)
  })
})

describe('POST /api/auth/login', () => {
  it('connecte avec bon mot de passe', async () => {
    const bcrypt = await import('bcryptjs')
    const hash = bcrypt.hashSync('password123', 10)
    vi.mocked(prisma.user.findFirst).mockResolvedValue({ ...mockUser, passwordHash: hash })

    const req = makeRequest('/api/auth/login', {
      method: 'POST',
      body: { email: 'test@test.com', password: 'password123' },
    })
    const res = await login(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.token).toBeDefined()
  })

  it('rejette avec mauvais mot de passe', async () => {
    const bcrypt = await import('bcryptjs')
    const hash = bcrypt.hashSync('correct', 10)
    vi.mocked(prisma.user.findFirst).mockResolvedValue({ ...mockUser, passwordHash: hash })

    const req = makeRequest('/api/auth/login', {
      method: 'POST',
      body: { email: 'test@test.com', password: 'wrong' },
    })
    const res = await login(req)
    expect(res.status).toBe(401)
  })

  it('rejette si utilisateur inexistant', async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null)

    const req = makeRequest('/api/auth/login', {
      method: 'POST',
      body: { email: 'nobody@test.com', password: 'password123' },
    })
    const res = await login(req)
    expect(res.status).toBe(401)
  })
})
