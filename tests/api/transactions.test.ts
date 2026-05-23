import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/biens/[id]/transactions/route'
import { PUT, DELETE } from '@/app/api/biens/[id]/transactions/[txId]/route'
import { prisma } from '@/lib/prisma'
import { makeRequest, makeToken } from '../helpers'

const token = makeToken()
const mockProperty = { id: 1, user_id: 1, name: 'Appart', address: '1 rue de Paris' }
const mockTx = {
  id: 1, property_id: 1, month: 1, year: 2026,
  type: 'entrée', amount: 1000, label: 'Loyer', category: 'Loyer',
}

beforeEach(() => vi.clearAllMocks())

describe('GET /api/biens/[id]/transactions', () => {
  it('retourne les transactions filtrées par année', async () => {
    vi.mocked(prisma.property.findUnique).mockResolvedValue(mockProperty)
    vi.mocked(prisma.transaction.findMany).mockResolvedValue([mockTx as any])

    const req = makeRequest('/api/biens/1/transactions?year=2026', { token })
    const res = await GET(req, { params: Promise.resolve({ id: '1' }) })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveLength(1)
  })

  it('refuse sans token', async () => {
    const req = makeRequest('/api/biens/1/transactions')
    const res = await GET(req, { params: Promise.resolve({ id: '1' }) })
    expect(res.status).toBe(401)
  })
})

describe('POST /api/biens/[id]/transactions', () => {
  it('crée une transaction', async () => {
    vi.mocked(prisma.property.findUnique).mockResolvedValue(mockProperty)
    vi.mocked(prisma.transaction.create).mockResolvedValue(mockTx as any)

    const req = makeRequest('/api/biens/1/transactions', {
      method: 'POST',
      token,
      body: { month: 1, year: 2026, type: 'entrée', amount: 1000, label: 'Loyer', category: 'Loyer' },
    })
    const res = await POST(req, { params: Promise.resolve({ id: '1' }) })
    expect(res.status).toBe(201)
  })

  it('rejette si champs manquants', async () => {
    vi.mocked(prisma.property.findUnique).mockResolvedValue(mockProperty)

    const req = makeRequest('/api/biens/1/transactions', {
      method: 'POST',
      token,
      body: { month: 1, year: 2026 },
    })
    const res = await POST(req, { params: Promise.resolve({ id: '1' }) })
    expect(res.status).toBe(400)
  })
})

describe('PUT /api/biens/[id]/transactions/[txId]', () => {
  it('modifie une transaction', async () => {
    vi.mocked(prisma.property.findUnique).mockResolvedValue(mockProperty)
    vi.mocked(prisma.transaction.findMany).mockResolvedValue([mockTx as any])
    vi.mocked(prisma.transaction.update).mockResolvedValue({ ...mockTx, amount: 1200 } as any)

    const req = makeRequest('/api/biens/1/transactions/1', {
      method: 'PUT',
      token,
      body: { amount: 1200, label: 'Loyer', category: 'Loyer' },
    })
    const res = await PUT(req, { params: Promise.resolve({ id: '1', txId: '1' }) })
    expect(res.status).toBe(200)
  })
})

describe('DELETE /api/biens/[id]/transactions/[txId]', () => {
  it('supprime une transaction', async () => {
    vi.mocked(prisma.property.findUnique).mockResolvedValue(mockProperty)
    vi.mocked(prisma.transaction.findMany).mockResolvedValue([mockTx as any])
    vi.mocked(prisma.transaction.delete).mockResolvedValue(mockTx as any)

    const req = makeRequest('/api/biens/1/transactions/1', { method: 'DELETE', token })
    const res = await DELETE(req, { params: Promise.resolve({ id: '1', txId: '1' }) })
    expect(res.status).toBe(200)
  })
})
