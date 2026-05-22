import { prisma } from './prisma'

export type TransactionType = 'entrée' | 'sortie'

export type Transaction = {
  id: number
  property_id: number
  month: number
  year: number
  type: TransactionType
  amount: number
  label: string
  category: string
}

export async function getTransactionsByProperty(property_id: number) {
  return prisma.transaction.findMany({ where: { property_id } }) as Promise<Transaction[]>
}

export async function createTransaction(data: Omit<Transaction, 'id'>) {
  return prisma.transaction.create({ data }) as Promise<Transaction>
}

export async function updateTransaction(id: number, data: Partial<Omit<Transaction, 'id' | 'property_id'>>) {
  return prisma.transaction.update({ where: { id }, data }) as Promise<Transaction>
}

export async function deleteTransaction(id: number) {
  return prisma.transaction.delete({ where: { id } })
}

export async function deleteTransactionsByProperty(property_id: number) {
  await prisma.transaction.deleteMany({ where: { property_id } })
}

export async function getTotalsByProperty(property_id: number) {
  const transactions = await getTransactionsByProperty(property_id)
  const totalEntrees = transactions.filter(t => t.type === 'entrée').reduce((s, t) => s + t.amount, 0)
  const totalSorties = transactions.filter(t => t.type === 'sortie').reduce((s, t) => s + t.amount, 0)
  return { totalEntrees, totalSorties, solde: totalEntrees - totalSorties }
}
