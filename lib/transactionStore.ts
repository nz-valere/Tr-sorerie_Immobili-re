import { promises as fs } from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data', 'transactions.json')

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

async function readTransactions(): Promise<Transaction[]> {
  try {
    const raw = await fs.readFile(dataPath, 'utf-8')
    return JSON.parse(raw) as Transaction[]
  } catch {
    return []
  }
}

async function writeTransactions(transactions: Transaction[]) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true })
  await fs.writeFile(dataPath, JSON.stringify(transactions, null, 2), 'utf-8')
}

export async function getTransactionsByProperty(property_id: number) {
  const transactions = await readTransactions()
  return transactions.filter(t => t.property_id === property_id)
}

export async function getTotalsByProperty(property_id: number) {
  const transactions = await getTransactionsByProperty(property_id)
  const totalEntrees = transactions.filter(t => t.type === 'entrée').reduce((s, t) => s + t.amount, 0)
  const totalSorties = transactions.filter(t => t.type === 'sortie').reduce((s, t) => s + t.amount, 0)
  return { totalEntrees, totalSorties, solde: totalEntrees - totalSorties }
}

export async function createTransaction(data: Omit<Transaction, 'id'>) {
  const transactions = await readTransactions()
  const id = transactions.length ? Math.max(...transactions.map(t => t.id)) + 1 : 1
  const transaction: Transaction = { id, ...data }
  transactions.push(transaction)
  await writeTransactions(transactions)
  return transaction
}

export async function updateTransaction(id: number, data: Partial<Omit<Transaction, 'id' | 'property_id'>>) {
  const transactions = await readTransactions()
  const index = transactions.findIndex(t => t.id === id)
  if (index === -1) return null
  transactions[index] = { ...transactions[index], ...data }
  await writeTransactions(transactions)
  return transactions[index]
}

export async function deleteTransaction(id: number) {
  const transactions = await readTransactions()
  const index = transactions.findIndex(t => t.id === id)
  if (index === -1) return false
  transactions.splice(index, 1)
  await writeTransactions(transactions)
  return true
}

export async function deleteTransactionsByProperty(property_id: number) {
  const transactions = await readTransactions()
  const filtered = transactions.filter(t => t.property_id !== property_id)
  await writeTransactions(filtered)
}
