// app/api/admin/press-hide/route.ts — 외부 연결 보도자료 숨김/복구 (isHidden 토글)
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import ids from '@/data/press-hide-ids.json'

const PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const DS = 'production'
const V = '2024-01-01'
const TARGETS = ids as string[]

function makeToken(p: string) { return crypto.createHash('sha256').update(p + ':inje-gt-admin').digest('hex') }
function authed(): boolean {
  const t = cookies().get('admin_auth')?.value
  return !!t && t === makeToken(process.env.ADMIN_PASSWORD ?? 'admin1234')
}

async function current(): Promise<{ _id: string; title: string; isHidden: boolean }[]> {
  const q = `*[_type=="post" && _id in $ids]{_id,title,isHidden}`
  const url = new URL(`https://${PID}.api.sanity.io/v${V}/data/query/${DS}`)
  url.searchParams.set('query', q)
  url.searchParams.set('$ids', JSON.stringify(TARGETS))
  const r = await fetch(url.toString(), { cache: 'no-store' })
  return ((await r.json()) as { result: { _id: string; title: string; isHidden: boolean }[] }).result ?? []
}

export async function GET() {
  if (!authed()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  try {
    return NextResponse.json({ ok: true, posts: await current() })
  } catch {
    return NextResponse.json({ ok: false, error: '조회 실패' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!authed()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) return NextResponse.json({ ok: false, error: 'SANITY_API_WRITE_TOKEN 미설정' }, { status: 500 })

  // action=show 면 복구(숨김 해제), 기본은 숨김
  const action = new URL(req.url).searchParams.get('action')
  const hide = action !== 'show'

  const mutations = TARGETS.map(id => ({ patch: { id, set: { isHidden: hide } } }))
  try {
    const r = await fetch(`https://${PID}.api.sanity.io/v${V}/data/mutate/${DS}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ mutations }) })
    if (!r.ok) {
      const t = await r.text()
      return NextResponse.json({ ok: false, error: `저장 실패 ${r.status}: ${t}` }, { status: 500 })
    }
    return NextResponse.json({ ok: true, hidden: hide, count: TARGETS.length })
  } catch (err) {
    return NextResponse.json({ ok: false, error: '저장 중 오류: ' + (err as Error).message }, { status: 500 })
  }
}
