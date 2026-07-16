// app/api/admin/class-images/route.ts — 클래스 대표 이미지 일괄 등록
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const SANITY_DATASET = 'production'
const SANITY_API_VERSION = '2024-01-01'

// classInfo 문서 ↔ public 이미지 매핑
const MAP = [
  { id: 'class-masters-1',    slug: 'masters-1',     label: 'Masters 1' },
  { id: 'class-masters-2',    slug: 'masters-2',     label: 'Masters 2' },
  { id: 'class-masters-3',    slug: 'masters-3',     label: 'Masters 3' },
  { id: 'class-masters-n',    slug: 'masters-n',     label: 'Masters N' },
  { id: 'class-masters-nevo', slug: 'masters-n-evo', label: 'Masters N-evo' },
]

function makeToken(password: string) {
  return crypto.createHash('sha256').update(password + ':inje-gt-admin').digest('hex')
}
function isAuthorized(): boolean {
  const token = cookies().get('admin_auth')?.value
  if (!token) return false
  return token === makeToken(process.env.ADMIN_PASSWORD ?? 'admin1234')
}

/** 현재 클래스별 heroImage 설정 여부 */
async function fetchState() {
  const url = new URL(`https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`)
  url.searchParams.set('query', `*[_type=="classInfo"]{ _id, name, "hasHero": defined(heroImage) }`)
  const res = await fetch(url.toString(), { cache: 'no-store' })
  const json = (await res.json()) as { result: { _id: string; name: string; hasHero: boolean }[] }
  const byId = new Map(json.result.map(r => [r._id, r]))
  return MAP.map(m => ({ ...m, hasHero: byId.get(m.id)?.hasHero ?? false, exists: byId.has(m.id) }))
}

export async function GET() {
  if (!isAuthorized()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  try {
    return NextResponse.json({ ok: true, items: await fetchState() })
  } catch {
    return NextResponse.json({ ok: false, error: '상태 조회 실패' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!isAuthorized()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const sanityToken = process.env.SANITY_API_WRITE_TOKEN
  if (!sanityToken) return NextResponse.json({ ok: false, error: 'SANITY_API_WRITE_TOKEN 미설정' }, { status: 500 })

  const origin = new URL(req.url).origin
  const results: { label: string; ok: boolean; error?: string }[] = []
  const mutations: unknown[] = []

  for (const m of MAP) {
    try {
      // 1) public 이미지 바이너리 로드
      const imgRes = await fetch(`${origin}/class-images/${m.slug}.jpg`, { cache: 'no-store' })
      if (!imgRes.ok) throw new Error(`이미지 로드 실패(${imgRes.status})`)
      const buf = Buffer.from(await imgRes.arrayBuffer())

      // 2) Sanity 에셋 업로드
      const upRes = await fetch(
        `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/assets/images/${SANITY_DATASET}?filename=${m.slug}.jpg`,
        { method: 'POST', headers: { 'Content-Type': 'image/jpeg', Authorization: `Bearer ${sanityToken}` }, body: buf }
      )
      if (!upRes.ok) throw new Error(`에셋 업로드 실패(${upRes.status})`)
      const upJson = (await upRes.json()) as { document: { _id: string } }
      const assetId = upJson.document._id

      // 3) classInfo.heroImage 패치 예약
      mutations.push({
        patch: {
          id: m.id,
          set: { heroImage: { _type: 'image', asset: { _type: 'reference', _ref: assetId } } },
        },
      })
      results.push({ label: m.label, ok: true })
    } catch (err) {
      results.push({ label: m.label, ok: false, error: (err as Error).message })
    }
  }

  if (mutations.length === 0) {
    return NextResponse.json({ ok: false, error: '업로드된 이미지가 없습니다', results }, { status: 500 })
  }

  // 4) 패치 일괄 실행
  try {
    const mutRes = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sanityToken}` }, body: JSON.stringify({ mutations }) }
    )
    if (!mutRes.ok) {
      const t = await mutRes.text()
      return NextResponse.json({ ok: false, error: `heroImage 연결 실패: ${mutRes.status} ${t}`, results }, { status: 500 })
    }
  } catch (err) {
    return NextResponse.json({ ok: false, error: '연결 중 오류: ' + (err as Error).message, results }, { status: 500 })
  }

  return NextResponse.json({ ok: true, updated: mutations.length, results })
}
