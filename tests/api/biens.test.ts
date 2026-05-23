import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/biens/route'
import { GET as getById, PUT, DELETE } from '@/app/api/biens/[id]/route'
import { prisma } from '@/lib/prisma'
import { makeRequest, makeToken } from '../helpers'

const token = makeToken()
const mockProperty = { id: 1, user_id: 1, name: 'Appart', address: '1 rue de Paris' }

beforeEach(() => vi.clearAllMocks())

describe('GET /api/biens', () => {
  it('retourne les biens de l\'utilisateur', async () => {
    vi.mocked(prisma.property.findMany).mockResolvedValue([mockProperty])
    vi.mocked(prisma.transaction.findMany).mockResolvedValue([])

    const req = makeRequest('/api/biens', { token })
    const res = await GET(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveLength(1)
  })

  it('refuse sans token', async () => {
    const req = makeRequest('/api/biens')
    const res = await GET(req)
    expect(res.status).toBe(401)
  })
})

describe('POST /api/biens', () => {
  it('crée un bien', async () => {
    vi.mocked(prisma.property.create).mockResolvedValue(mockProperty)

    const req = makeRequest('/api/biens', {
      method: 'POST',
      token,
      body: { name: 'Appart', address: '1 rue de Paris' },
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
  })

  it('rejette si champs manquants', async () => {
    const req = makeRequest('/api/biens', {
      method: 'POST',
      token,
      body: { name: 'Appart' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})

describe('GET /api/biens/[id]', () => {
  it('retourne un bien', async () => {
    vi.mocked(prisma.property.findUnique).mockResolvedValue(mockProperty)

    const req = makeRequest('/api/biens/1', { token })
    const res = await getById(req, { params: Promise.resolve({ id: '1' }) })
    expect(res.status).toBe(200)
  })

  it('retourne 404 si inexistant', async () => {
    vi.mocked(prisma.property.findUnique).mockResolvedValue(null)

    const req = makeRequest('/api/biens/99', { token })
    const res = await getById(req, { params: Promise.resolve({ id: '99' }) })
    expect(res.status).toBe(404)
  })

  it('retourne 403 si appartient à un autre user', async () => {
    vi.mocked(prisma.property.findUnique).mockResolvedValue({ ...mockProperty, user_id: 99 })

    const req = makeRequest('/api/biens/1', { token })
    const res = await getById(req, { params: Promise.resolve({ id: '1' }) })
    expect(res.status).toBe(403)
  })
})

describe('PUT /api/biens/[id]', () => {
  it('modifie un bien', async () => {
    vi.mocked(prisma.property.findUnique).mockResolvedValue(mockProperty)
    vi.mocked(prisma.property.update).mockResolvedValue({ ...mockProperty, name: 'Nouveau nom' })

    const req = makeRequest('/api/biens/1', {
      method: 'PUT',
      token,
      body: { name: 'Nouveau nom', address: '1 rue de Paris' },
    })
    const res = await PUT(req, { params: Promise.resolve({ id: '1' }) })
    expect(res.status).toBe(200)
  })
})

describe('DELETE /api/biens/[id]', () => {
  it('supprime un bien', async () => {
    vi.mocked(prisma.property.findUnique).mockResolvedValue(mockProperty)
    vi.mocked(prisma.transaction.deleteMany).mockResolvedValue({ count: 0 })
    vi.mocked(prisma.property.delete).mockResolvedValue(mockProperty)

    const req = makeRequest('/api/biens/1', { method: 'DELETE', token })
    const res = await DELETE(req, { params: Promise.resolve({ id: '1' }) })
    expect(res.status).toBe(200)
  })
})
