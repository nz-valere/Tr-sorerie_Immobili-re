import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { findUserByEmail } from '../../../../lib/userStore'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body || {}
    if (!email || !password) {
      return NextResponse.json({ error: 'email and password are required' }, { status: 400 })
    }

    const user = await findUserByEmail(email)
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const ok = bcrypt.compareSync(password, user.passwordHash)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })

    return NextResponse.json({ ok: true, token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
