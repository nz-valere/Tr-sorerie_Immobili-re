import { describe, it, expect, vi, beforeEach } from 'vitest'
import { prisma } from '@/lib/prisma'
import {
  getTransactionsByProperty,
  getTotalsByProperty,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  deleteTransactionsByProperty,
} from '@/lib/transactionStore'
import {
  getPropertiesByUser,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from '@/lib/propertyStore'
import { findUserByEmail, createUser, getUserById } from '@/lib/userStore'

beforeEach(() => vi.clearAllMocks())

const mockTxEntree = { id: 1, property_id: 1, month: 1, year: 2026, type: 'entrée' as const, amount: 1000, label: 'Loyer', category: 'Loyer' }
const mockTxSortie = { id: 2, property_id: 1, month: 1, year: 2026, type: 'sortie' as const, amount: 300, label: 'Charges', category: 'Charges' }
const mockProperty = { id: 1, user_id: 1, name: 'Appart', address: '1 rue de Paris' }
const mockUser = { id: 1, name: 'Test', email: 'test@test.com', passwordHash: 'hash' }

describe('transactionStore', () => {
  it('getTransactionsByProperty filtre par property_id', async () => {
    vi.mocked(prisma.transaction.findMany).mockResolvedValue([mockTxEntree, mockTxSortie] as any)
    const txs = await getTransactionsByProperty(1)
    expect(prisma.transaction.findMany).toHaveBeenCalledWith({ where: { property_id: 1 } })
    expect(txs).toHaveLength(2)
  })

  it('getTotalsByProperty calcule correctement les totaux', async () => {
    vi.mocked(prisma.transaction.findMany).mockResolvedValue([mockTxEntree, mockTxSortie] as any)
    const totals = await getTotalsByProperty(1)
    expect(totals.totalEntrees).toBe(1000)
    expect(totals.totalSorties).toBe(300)
    expect(totals.solde).toBe(700)
  })

  it('getTotalsByProperty retourne 0 si aucune transaction', async () => {
    vi.mocked(prisma.transaction.findMany).mockResolvedValue([])
    const totals = await getTotalsByProperty(1)
    expect(totals.totalEntrees).toBe(0)
    expect(totals.totalSorties).toBe(0)
    expect(totals.solde).toBe(0)
  })

  it('createTransaction appelle prisma.transaction.create', async () => {
    vi.mocked(prisma.transaction.create).mockResolvedValue(mockTxEntree as any)
    const tx = await createTransaction({ property_id: 1, month: 1, year: 2026, type: 'entrée', amount: 1000, label: 'Loyer', category: 'Loyer' })
    expect(prisma.transaction.create).toHaveBeenCalledOnce()
    expect(tx.amount).toBe(1000)
  })

  it('updateTransaction appelle prisma.transaction.update avec le bon id', async () => {
    vi.mocked(prisma.transaction.update).mockResolvedValue({ ...mockTxEntree, amount: 1200 } as any)
    const tx = await updateTransaction(1, { amount: 1200 })
    expect(prisma.transaction.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { amount: 1200 } })
    expect(tx.amount).toBe(1200)
  })

  it('deleteTransaction appelle prisma.transaction.delete avec le bon id', async () => {
    vi.mocked(prisma.transaction.delete).mockResolvedValue(mockTxEntree as any)
    await deleteTransaction(1)
    expect(prisma.transaction.delete).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('deleteTransactionsByProperty supprime toutes les transactions du bien', async () => {
    vi.mocked(prisma.transaction.deleteMany).mockResolvedValue({ count: 2 })
    await deleteTransactionsByProperty(1)
    expect(prisma.transaction.deleteMany).toHaveBeenCalledWith({ where: { property_id: 1 } })
  })
})

describe('propertyStore', () => {
  it('getPropertiesByUser filtre par user_id', async () => {
    vi.mocked(prisma.property.findMany).mockResolvedValue([mockProperty])
    const props = await getPropertiesByUser(1)
    expect(prisma.property.findMany).toHaveBeenCalledWith({ where: { user_id: 1 } })
    expect(props).toHaveLength(1)
  })

  it('getPropertyById retourne null si inexistant', async () => {
    vi.mocked(prisma.property.findUnique).mockResolvedValue(null)
    const prop = await getPropertyById(99)
    expect(prop).toBeNull()
  })

  it('createProperty crée avec les bons champs', async () => {
    vi.mocked(prisma.property.create).mockResolvedValue(mockProperty)
    const prop = await createProperty(1, 'Appart', '1 rue de Paris')
    expect(prisma.property.create).toHaveBeenCalledWith({ data: { user_id: 1, name: 'Appart', address: '1 rue de Paris' } })
    expect(prop.name).toBe('Appart')
  })

  it('updateProperty met à jour les bons champs', async () => {
    vi.mocked(prisma.property.update).mockResolvedValue({ ...mockProperty, name: 'Nouveau' })
    await updateProperty(1, { name: 'Nouveau' })
    expect(prisma.property.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { name: 'Nouveau' } })
  })

  it('deleteProperty supprime le bon bien', async () => {
    vi.mocked(prisma.property.delete).mockResolvedValue(mockProperty)
    await deleteProperty(1)
    expect(prisma.property.delete).toHaveBeenCalledWith({ where: { id: 1 } })
  })
})

describe('userStore', () => {
  it('findUserByEmail retourne null si inexistant', async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null)
    const user = await findUserByEmail('nobody@test.com')
    expect(user).toBeNull()
  })

  it('createUser crée avec les bons champs', async () => {
    vi.mocked(prisma.user.create).mockResolvedValue(mockUser)
    const user = await createUser('Test', 'test@test.com', 'hash')
    expect(prisma.user.create).toHaveBeenCalledWith({ data: { name: 'Test', email: 'test@test.com', passwordHash: 'hash' } })
    expect(user.email).toBe('test@test.com')
  })

  it('getUserById retourne null si inexistant', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    const user = await getUserById(99)
    expect(user).toBeNull()
  })
})
