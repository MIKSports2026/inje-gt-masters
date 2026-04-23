// app/api/admin/results-import/preview/route.ts — 라운드/클래스 목록 + 기존 결과 조회
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const SANITY_DATASET = 'production'
const SANITY_API_VERSION = '2024-01-01'

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

async function sanityQuery<T>(query: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(
    `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`
  )
  url.searchParams.set('query', query)
  for (const [key, val] of Object.entries(params)) {
    url.searchParams.set(`$${key}`, JSON.stringify(val))
  }
  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`)
  const json = await res.json()
  return json.result as T
}

// GET — 라운드 + 클래스 목록
export async function GET() {
  if (!isAuthorized()) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  try {
    const [rounds, classes] = await Promise.all([
      sanityQuery<{ _id: string; title: string; roundNumber: number; date: string }[]>(
        `*[_type=="round"] | order(roundNumber asc) { _id, title, roundNumber, date }`
      ),
      sanityQuery<{ _id: string; name: string; code: string }[]>(
        `*[_type=="classInfo"] | order(code asc) { _id, name, code }`
      ),
    ])
    return NextResponse.json({ ok: true, rounds, classes })
  } catch (err) {
    console.error('Preview GET error:', err)
    return NextResponse.json({ ok: false, error: 'sanity_error' }, { status: 500 })
  }
}

// POST — 기존 result 문서 존재 여부 조회
export async function POST(req: Request) {
  if (!isAuthorized()) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  try {
    const { roundRef, classRef, raceType } = await req.json()

    if (!roundRef || !classRef || !raceType) {
      return NextResponse.json({ ok: false, error: 'roundRef, classRef, raceType 필수' }, { status: 400 })
    }

    const url = new URL(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`
    )
    const query = `*[_type=="result" && round._ref==$roundRef && classInfo._ref==$classRef && raceType==$raceType][0]{ _id, standings }`
    url.searchParams.set('query', query)
    url.searchParams.set('$roundRef', JSON.stringify(roundRef))
    url.searchParams.set('$classRef', JSON.stringify(classRef))
    url.searchParams.set('$raceType', JSON.stringify(raceType))

    const res = await fetch(url.toString(), { cache: 'no-store' })
    if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`)
    const json = await res.json()
    const existing = json.result as { _id: string; standings?: unknown[] } | null

    return NextResponse.json({
      ok: true,
      exists: !!existing,
      existingId: existing?._id ?? null,
      existingStandingsCount: existing?.standings?.length ?? 0,
    })
  } catch (err) {
    console.error('Preview POST error:', err)
    return NextResponse.json({ ok: false, error: 'sanity_error' }, { status: 500 })
  }
}
