import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { testPrisma, } from './prisma'
import { cleanDb, teardown } from './setup'

process.env.DATABASE_URL = process.env.DATABASE_URL_TEST!

// Import stores après avoir changé DATABASE_URL
const { createUser, findUserByEmail, getUserById } = await import('@/lib/userStore')
const { createProperty, getPropertiesByUser, getPropertyById, updateProperty, deleteProperty } = await import('@/lib/propertyStore')
const { createTransaction, getTransactionsByProperty, getTotalsByProperty, updateTransaction, deleteTransaction, deleteTransactionsByProperty } = await import('@/lib/transactionStore')

beforeEach(async () => { await cleanDb() })
afterAll(async () => { await teardown() })

describe('userStore — intégration', () => {
  it('createUser puis findUserByEmail', async () => {
    await createUser('Valere', 'valere@test.com', 'hash123')
    const user = await findUserByEmail('valere@test.com')
    expect(user).not.toBeNull()
    expect(user?.name).toBe('Valere')
  })

  it('findUserByEmail est insensible à la casse', async () => {
    await createUser('Valere', 'valere@test.com', 'hash123')
    const user = await findUserByEmail('VALERE@TEST.COM')
    expect(user).not.toBeNull()
  })

  it('findUserByEmail retourne null si inexistant', async () => {
    const user = await findUserByEmail('nobody@test.com')
    expect(user).toBeNull()
  })

  it('getUserById retourne le bon utilisateur', async () => {
    const created = await createUser('Valere', 'valere@test.com', 'hash123')
    const user = await getUserById(created.id)
    expect(user?.email).toBe('valere@test.com')
  })
})

describe('propertyStore — intégration', () => {
  it('createProperty puis getPropertyById', async () => {
    const user = await createUser('Valere', 'v@test.com', 'hash')
    const prop = await createProperty(user.id, 'Appart', '1 rue de Paris')
    const found = await getPropertyById(prop.id)
    expect(found?.name).toBe('Appart')
  })

  it('getPropertiesByUser ne retourne que les biens du bon user', async () => {
    const u1 = await createUser('User1', 'u1@test.com', 'hash')
    const u2 = await createUser('User2', 'u2@test.com', 'hash')
    await createProperty(u1.id, 'Bien U1', 'Adresse 1')
    await createProperty(u2.id, 'Bien U2', 'Adresse 2')

    const biens = await getPropertiesByUser(u1.id)
    expect(biens).toHaveLength(1)
    expect(biens[0].name).toBe('Bien U1')
  })

  it('updateProperty modifie le bien', async () => {
    const user = await createUser('Valere', 'v@test.com', 'hash')
    const prop = await createProperty(user.id, 'Ancien nom', 'Adresse')
    await updateProperty(prop.id, { name: 'Nouveau nom' })
    const updated = await getPropertyById(prop.id)
    expect(updated?.name).toBe('Nouveau nom')
  })

  it('deleteProperty supprime le bien', async () => {
    const user = await createUser('Valere', 'v@test.com', 'hash')
    const prop = await createProperty(user.id, 'Appart', 'Adresse')
    await deleteProperty(prop.id)
    const found = await getPropertyById(prop.id)
    expect(found).toBeNull()
  })
})

describe('transactionStore — intégration', () => {
  it('createTransaction puis getTransactionsByProperty', async () => {
    const user = await createUser('Valere', 'v@test.com', 'hash')
    const prop = await createProperty(user.id, 'Appart', 'Adresse')
    await createTransaction({ property_id: prop.id, month: 1, year: 2026, type: 'entrée', amount: 1000, label: 'Loyer', category: 'Loyer' })
    const txs = await getTransactionsByProperty(prop.id)
    expect(txs).toHaveLength(1)
    expect(txs[0].amount).toBe(1000)
  })

  it('getTotalsByProperty calcule correctement', async () => {
    const user = await createUser('Valere', 'v@test.com', 'hash')
    const prop = await createProperty(user.id, 'Appart', 'Adresse')
    await createTransaction({ property_id: prop.id, month: 1, year: 2026, type: 'entrée', amount: 2000, label: 'Loyer', category: 'Loyer' })
    await createTransaction({ property_id: prop.id, month: 1, year: 2026, type: 'sortie', amount: 500, label: 'Charges', category: 'Charges' })

    const totals = await getTotalsByProperty(prop.id)
    expect(totals.totalEntrees).toBe(2000)
    expect(totals.totalSorties).toBe(500)
    expect(totals.solde).toBe(1500)
  })

  it('updateTransaction modifie le montant', async () => {
    const user = await createUser('Valere', 'v@test.com', 'hash')
    const prop = await createProperty(user.id, 'Appart', 'Adresse')
    const tx = await createTransaction({ property_id: prop.id, month: 1, year: 2026, type: 'entrée', amount: 1000, label: 'Loyer', category: 'Loyer' })
    await updateTransaction(tx.id, { amount: 1200 })
    const txs = await getTransactionsByProperty(prop.id)
    expect(txs[0].amount).toBe(1200)
  })

  it('deleteTransaction supprime la transaction', async () => {
    const user = await createUser('Valere', 'v@test.com', 'hash')
    const prop = await createProperty(user.id, 'Appart', 'Adresse')
    const tx = await createTransaction({ property_id: prop.id, month: 1, year: 2026, type: 'entrée', amount: 1000, label: 'Loyer', category: 'Loyer' })
    await deleteTransaction(tx.id)
    const txs = await getTransactionsByProperty(prop.id)
    expect(txs).toHaveLength(0)
  })

  it('deleteTransactionsByProperty supprime toutes les transactions du bien', async () => {
    const user = await createUser('Valere', 'v@test.com', 'hash')
    const prop = await createProperty(user.id, 'Appart', 'Adresse')
    await createTransaction({ property_id: prop.id, month: 1, year: 2026, type: 'entrée', amount: 1000, label: 'Loyer', category: 'Loyer' })
    await createTransaction({ property_id: prop.id, month: 2, year: 2026, type: 'sortie', amount: 200, label: 'Charges', category: 'Charges' })
    await deleteTransactionsByProperty(prop.id)
    const txs = await getTransactionsByProperty(prop.id)
    expect(txs).toHaveLength(0)
  })
})
