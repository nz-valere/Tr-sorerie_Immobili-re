import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { getPropertiesByUser, createProperty } from '@/lib/propertyStore'

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const properties = await getPropertiesByUser(user.id)
  return NextResponse.json(properties)
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await req.json()
  const { name, address } = body

  if (!name || !address) {
    return NextResponse.json({ error: 'Nom et adresse requis' }, { status: 400 })
  }

  const property = await createProperty(user.id, name, address)
  return NextResponse.json(property, { status: 201 })
}
