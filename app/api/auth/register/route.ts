import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createUser, findUserByEmail } from '../../../../lib/userStore'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = body || {}
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'name, email and password are required' }, { status: 400 })
    }

    const existing = await findUserByEmail(email)
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    const user = await createUser(name, email, hash)

    return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } })
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
