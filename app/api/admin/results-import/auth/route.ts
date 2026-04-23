// app/api/admin/results-import/auth/route.ts — 결과 입력 어드민 인증
import { NextResponse } from 'next/server'
import crypto from 'crypto'

function makeToken(password: string) {
  return crypto.createHash('sha256').update(password + ':inje-gt-admin').digest('hex')
}

export async function POST(req: Request) {
  try {
    const { password } = await req.json()
    const expected = process.env.ADMIN_PASSWORD ?? 'admin1234'

    if (password !== expected) {
      return NextResponse.json({ ok: false }, { status: 401 })
    }

    const token = makeToken(password)
    const response = NextResponse.json({ ok: true })
    response.cookies.set('admin_auth', token, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 8, // 8시간
    })
    return response
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
