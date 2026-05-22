import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { getPropertyById } from '@/lib/propertyStore'
import { updateTransaction, deleteTransaction, getTransactionsByProperty } from '@/lib/transactionStore'

type Params = { params: Promise<{ id: string; txId: string }> }

async function getAuthorizedProperty(req: NextRequest, id: string) {
  const user = getUserFromRequest(req)
  if (!user) return null
  const property = await getPropertyById(Number(id))
  if (!property || property.user_id !== user.id) return null
  return property
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id, txId } = await params
  const property = await getAuthorizedProperty(req, id)
  if (!property) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const transactions = await getTransactionsByProperty(Number(id))
  const tx = transactions.find(t => t.id === Number(txId))
  if (!tx) return NextResponse.json({ error: 'Transaction introuvable' }, { status: 404 })

  const body = await req.json()
  const updated = await updateTransaction(Number(txId), body)
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id, txId } = await params
  const property = await getAuthorizedProperty(req, id)
  if (!property) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const transactions = await getTransactionsByProperty(Number(id))
  const tx = transactions.find(t => t.id === Number(txId))
  if (!tx) return NextResponse.json({ error: 'Transaction introuvable' }, { status: 404 })

  await deleteTransaction(Number(txId))
  return NextResponse.json({ ok: true })
}
