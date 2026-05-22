import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { getPropertiesByUser, type Property } from '@/lib/propertyStore'
import { getTransactionsByProperty } from '@/lib/transactionStore'

const MOIS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc']

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const year = Number(req.nextUrl.searchParams.get('year') || new Date().getFullYear())

  const properties = await getPropertiesByUser(user.id)

  const allTransactions = (
    await Promise.all(properties.map((p: Property) => getTransactionsByProperty(p.id)))
  ).flat().filter(t => t.year === year)

  // Totaux globaux
  const totalEntrees = allTransactions.filter(t => t.type === 'entrée').reduce((s, t) => s + t.amount, 0)
  const totalSorties = allTransactions.filter(t => t.type === 'sortie').reduce((s, t) => s + t.amount, 0)

  // Données mensuelles
  const monthlyData = MOIS.map((mois, i) => {
    const month = i + 1
    const entrees = allTransactions.filter(t => t.month === month && t.type === 'entrée').reduce((s, t) => s + t.amount, 0)
    const sorties = allTransactions.filter(t => t.month === month && t.type === 'sortie').reduce((s, t) => s + t.amount, 0)
    return { mois, entrees, sorties }
  })

  // Répartition sorties par catégorie
  const sortiesMap: Record<string, number> = {}
  allTransactions.filter(t => t.type === 'sortie').forEach(t => {
    sortiesMap[t.category] = (sortiesMap[t.category] || 0) + t.amount
  })
  const COLORS = ['#10b981', '#f97316', '#3b82f6', '#a855f7', '#f59e0b']
  const categoriesSorties = Object.entries(sortiesMap).map(([name, value], i) => ({
    name, value, color: COLORS[i % COLORS.length]
  }))

  // Répartition entrées par catégorie
  const entreesMap: Record<string, number> = {}
  allTransactions.filter(t => t.type === 'entrée').forEach(t => {
    entreesMap[t.category] = (entreesMap[t.category] || 0) + t.amount
  })
  const categoriesEntrees = Object.entries(entreesMap).map(([name, value], i) => ({
    name, value, color: COLORS[i % COLORS.length]
  }))

  // Liste des biens avec totaux pour l'année
  const biens = await Promise.all(properties.map(async (p: Property) => {
    const tx = (await getTransactionsByProperty(p.id)).filter(t => t.year === year)
    const totalEntrees = tx.filter(t => t.type === 'entrée').reduce((s, t) => s + t.amount, 0)
    const totalSorties = tx.filter(t => t.type === 'sortie').reduce((s, t) => s + t.amount, 0)
    return { id: p.id, name: p.name, totalEntrees, totalSorties, solde: totalEntrees - totalSorties }
  }))

  return NextResponse.json({
    totalBiens: properties.length,
    totalEntrees,
    totalSorties,
    solde: totalEntrees - totalSorties,
    monthlyData,
    categoriesSorties,
    categoriesEntrees,
    biens,
  })
}
