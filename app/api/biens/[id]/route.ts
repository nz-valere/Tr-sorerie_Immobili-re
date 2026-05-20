import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { getPropertyById, updateProperty, deleteProperty } from '@/lib/propertyStore'

type Params = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  const user = getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const property = await getPropertyById(Number(id))

  if (!property) return NextResponse.json({ error: 'Bien introuvable' }, { status: 404 })
  if (property.user_id !== user.id) return NextResponse.json({ error: 'Interdit' }, { status: 403 })

  return NextResponse.json(property)
}

export async function PUT(req: NextRequest, { params }: Params) {
  const user = getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const property = await getPropertyById(Number(id))

  if (!property) return NextResponse.json({ error: 'Bien introuvable' }, { status: 404 })
  if (property.user_id !== user.id) return NextResponse.json({ error: 'Interdit' }, { status: 403 })

  const body = await req.json()
  const { name, address } = body

  if (!name || !address) {
    return NextResponse.json({ error: 'Nom et adresse requis' }, { status: 400 })
  }

  const updated = await updateProperty(Number(id), { name, address })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const user = getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const property = await getPropertyById(Number(id))

  if (!property) return NextResponse.json({ error: 'Bien introuvable' }, { status: 404 })
  if (property.user_id !== user.id) return NextResponse.json({ error: 'Interdit' }, { status: 403 })

  await deleteProperty(Number(id))
  return NextResponse.json({ ok: true })
}
