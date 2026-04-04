// app/api/admin/applications/route.ts — Google Sheets 신청자 목록 조회
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import { google } from 'googleapis'

function makeToken(password: string) {
  return crypto.createHash('sha256').update(password + ':inje-gt-admin').digest('hex')
}

function isAuthorized(): boolean {
  const cookieStore = cookies()
  const token = cookieStore.get('admin_auth')?.value
  if (!token) return false
  const expected = makeToken(process.env.ADMIN_PASSWORD ?? 'admin1234')
  return token === expected
}

export async function GET() {
  if (!isAuthorized()) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey   = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const sheetId      = process.env.GOOGLE_SHEET_ID

  if (!serviceEmail || !privateKey || !sheetId) {
    return NextResponse.json({ ok: false, error: 'sheets_not_configured' }, { status: 500 })
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: serviceEmail, private_key: privateKey },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })
    const sheets = google.sheets({ version: 'v4', auth })
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:T',
    })

    const rows = (res.data.values ?? []).filter((r) => r.some((c) => c))
    return NextResponse.json({ ok: true, rows })
  } catch (err) {
    console.error('Sheets read error:', err)
    return NextResponse.json({ ok: false, error: 'sheets_error' }, { status: 500 })
  }
}
