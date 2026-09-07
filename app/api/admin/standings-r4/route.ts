// app/api/admin/standings-r4/route.ts — R4 반영 스탠딩(팀·드라이버) 일괄 업데이트
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import standings from '@/data/standings-r4-full.json'

const PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const DS = 'production'
const V = '2024-01-01'

interface Doc { _id: string; _type: string; [k: string]: unknown }
const DATA = standings as { team: Doc[]; driver: Doc[] }

function makeToken(p: string) { return crypto.createHash('sha256').update(p + ':inje-gt-admin').digest('hex') }
function authed(): boolean {
  const t = cookies().get('admin_auth')?.value
  return !!t && t === makeToken(process.env.ADMIN_PASSWORD ?? 'admin1234')
}

export async function GET() {
  if (!authed()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const summ = (arr: Doc[]) => arr.map(d => ({ id: d._id, entries: (d.entries as unknown[]).length }))
  return NextResponse.json({ ok: true, team: summ(DATA.team), driver: summ(DATA.driver) })
}

export async function POST() {
  if (!authed()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) return NextResponse.json({ ok: false, error: 'SANITY_API_WRITE_TOKEN 미설정' }, { status: 500 })

  const docs = [...DATA.team, ...DATA.driver]
  const mutations = docs.map(d => ({ createOrReplace: d }))
  try {
    const r = await fetch(`https://${PID}.api.sanity.io/v${V}/data/mutate/${DS}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ mutations }) })
    if (!r.ok) {
      const t = await r.text()
      return NextResponse.json({ ok: false, error: `저장 실패 ${r.status}: ${t}` }, { status: 500 })
    }
    return NextResponse.json({ ok: true, team: DATA.team.length, driver: DATA.driver.length })
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
}
