import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/dashboard/route'
import { prisma } from '@/lib/prisma'
import { makeRequest, makeToken } from '../helpers'

const token = makeToken()

const mockProperties = [
  { id: 1, user_id: 1, name: 'Appart', address: '1 rue de Paris' },
  { id: 2, user_id: 1, name: 'Studio', address: '2 rue de Lyon' },
]

const mockTransactions = [
  { id: 1, property_id: 1, month: 1, year: 2026, type: 'entrée', amount: 1000, label: 'Loyer', category: 'Loyer' },
  { id: 2, property_id: 1, month: 1, year: 2026, type: 'sortie', amount: 200, label: 'Charges', category: 'Charges' },
  { id: 3, property_id: 2, month: 3, year: 2026, type: 'entrée', amount: 800, label: 'Loyer', category: 'Loyer' },
  { id: 4, property_id: 1, month: 6, year: 2025, type: 'entrée', amount: 500, label: 'Loyer', category: 'Loyer' },
]

beforeEach(() => vi.clearAllMocks())

describe('GET /api/dashboard', () => {
  it('refuse sans token', async () => {
    const req = makeRequest('/api/dashboard')
    const res = await GET(req)
    expect(res.status).toBe(401)
  })

  it('retourne les totaux corrects pour l\'année', async () => {
    vi.mocked(prisma.property.findMany).mockResolvedValue(mockProperties)
    vi.mocked(prisma.transaction.findMany)
      .mockResolvedValueOnce(mockTransactions.filter(t => t.property_id === 1) as any)
      .mockResolvedValueOnce(mockTransactions.filter(t => t.property_id === 2) as any)
      .mockResolvedValueOnce(mockTransactions.filter(t => t.property_id === 1) as any)
      .mockResolvedValueOnce(mockTransactions.filter(t => t.property_id === 2) as any)

    const req = makeRequest('/api/dashboard?year=2026', { token })
    const res = await GET(req)
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.totalBiens).toBe(2)
    expect(data.totalEntrees).toBe(1800) // 1000 + 800
    expect(data.totalSorties).toBe(200)
    expect(data.solde).toBe(1600)
  })

  it('exclut les transactions des autres années', async () => {
    vi.mocked(prisma.property.findMany).mockResolvedValue([mockProperties[0]])
    vi.mocked(prisma.transaction.findMany)
      .mockResolvedValue(mockTransactions.filter(t => t.property_id === 1) as any)

    const req = makeRequest('/api/dashboard?year=2025', { token })
    const res = await GET(req)
    const data = await res.json()

    expect(data.totalEntrees).toBe(500)
    expect(data.totalSorties).toBe(0)
  })

  it('retourne les données mensuelles sur 12 mois', async () => {
    vi.mocked(prisma.property.findMany).mockResolvedValue([mockProperties[0]])
    vi.mocked(prisma.transaction.findMany).mockResolvedValue(mockTransactions as any)

    const req = makeRequest('/api/dashboard?year=2026', { token })
    const res = await GET(req)
    const data = await res.json()

    expect(data.monthlyData).toHaveLength(12)
  })

  it('retourne les catégories de dépenses', async () => {
    vi.mocked(prisma.property.findMany).mockResolvedValue([mockProperties[0]])
    vi.mocked(prisma.transaction.findMany).mockResolvedValue(mockTransactions as any)

    const req = makeRequest('/api/dashboard?year=2026', { token })
    const res = await GET(req)
    const data = await res.json()

    expect(data.categoriesSorties.length).toBeGreaterThan(0)
    expect(data.categoriesEntrees.length).toBeGreaterThan(0)
  })
})
