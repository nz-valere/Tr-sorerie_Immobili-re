import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { getPropertyById } from '@/lib/propertyStore'
import { getTransactionsByProperty, createTransaction } from '@/lib/transactionStore'

type Params = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  const user = getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const property = await getPropertyById(Number(id))
  if (!property) return NextResponse.json({ error: 'Bien introuvable' }, { status: 404 })
  if (property.user_id !== user.id) return NextResponse.json({ error: 'Interdit' }, { status: 403 })

  const year = req.nextUrl.searchParams.get('year')
  let transactions = await getTransactionsByProperty(Number(id))
  if (year) transactions = transactions.filter(t => t.year === Number(year))

  return NextResponse.json(transactions)
}

export async function POST(req: NextRequest, { params }: Params) {
  const user = getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const property = await getPropertyById(Number(id))
  if (!property) return NextResponse.json({ error: 'Bien introuvable' }, { status: 404 })
  if (property.user_id !== user.id) return NextResponse.json({ error: 'Interdit' }, { status: 403 })

  const body = await req.json()
  const { month, year, type, amount, label, category } = body

  if (!month || !year || !type || !amount || !label || !category) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

  const transaction = await createTransaction({
    property_id: Number(id),
    month: Number(month),
    year: Number(year),
    type,
    amount: Number(amount),
    label,
    category,
  })

  return NextResponse.json(transaction, { status: 201 })
}
