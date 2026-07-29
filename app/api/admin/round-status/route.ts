// app/api/admin/round-status/route.ts — 라운드 상태(접수중/마감 등) 변경
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const SANITY_DATASET = 'production'
const SANITY_API_VERSION = '2024-01-01'

const STATUSES = ['upcoming', 'entry_open', 'entry_closed', 'ongoing', 'finished'] as const
type Status = (typeof STATUSES)[number]

function makeToken(password: string) {
  return crypto.createHash('sha256').update(password + ':inje-gt-admin').digest('hex')
}
function isAuthorized(): boolean {
  const token = cookies().get('admin_auth')?.value
  if (!token) return false
  return token === makeToken(process.env.ADMIN_PASSWORD ?? 'admin1234')
}

async function fetchRounds() {
  const url = new URL(`https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`)
  url.searchParams.set('query', `*[_type=="round"]|order(roundNumber asc){ _id, roundNumber, title, "dateStart": dateStart, status }`)
  const res = await fetch(url.toString(), { cache: 'no-store' })
  const json = (await res.json()) as { result: unknown[] }
  return json.result ?? []
}

export async function GET() {
  if (!isAuthorized()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  try {
    return NextResponse.json({ ok: true, rounds: await fetchRounds() })
  } catch {
    return NextResponse.json({ ok: false, error: '라운드 조회 실패' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!isAuthorized()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const sanityToken = process.env.SANITY_API_WRITE_TOKEN
  if (!sanityToken) return NextResponse.json({ ok: false, error: 'SANITY_API_WRITE_TOKEN 미설정' }, { status: 500 })

  let roundId = '', status = ''
  try {
    const body = (await req.json()) as { roundId?: string; status?: string }
    roundId = body.roundId ?? ''
    status = body.status ?? ''
  } catch {}

  if (!roundId) return NextResponse.json({ ok: false, error: 'roundId 필수' }, { status: 400 })
  if (!(STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ ok: false, error: `status는 ${STATUSES.join(', ')} 중 하나` }, { status: 400 })
  }

  try {
    const res = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sanityToken}` },
        body: JSON.stringify({ mutations: [{ patch: { id: roundId, set: { status } } }] }),
      }
    )
    if (!res.ok) {
      const t = await res.text()
      return NextResponse.json({ ok: false, error: `저장 실패: ${res.status} ${t}` }, { status: 500 })
    }
    return NextResponse.json({ ok: true, rounds: await fetchRounds() })
  } catch (err) {
    return NextResponse.json({ ok: false, error: '저장 중 오류: ' + (err as Error).message }, { status: 500 })
  }
}
