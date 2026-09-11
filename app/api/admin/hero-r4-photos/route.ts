// app/api/admin/hero-r4-photos/route.ts — 홈 히어로 배경을 R4 경기 사진으로 교체
// R4 키비쥬얼(r4-keyvisual) 슬라이드는 1번으로 유지하고, 그 뒤 슬라이드를 R4 사진으로 교체
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import photos from '@/data/r4-hero-photos.json'

const PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const DS = 'production'
const V = '2024-01-01'
const FOLDER = 'r4-gallery'
const KEEP_KEY = 'r4-keyvisual'

interface P { file: string; alt: string }
const items = photos as P[]

function makeToken(p: string) { return crypto.createHash('sha256').update(p + ':inje-gt-admin').digest('hex') }
function authed(): boolean {
  const t = cookies().get('admin_auth')?.value
  return !!t && t === makeToken(process.env.ADMIN_PASSWORD ?? 'admin1234')
}

async function currentSlides(): Promise<Array<{ _key?: string }>> {
  const url = new URL(`https://${PID}.api.sanity.io/v${V}/data/query/${DS}`)
  url.searchParams.set('query', `*[_id=="siteSettings"][0].heroSlides`)
  const r = await fetch(url.toString(), { cache: 'no-store' })
  return ((await r.json()) as { result: Array<{ _key?: string }> | null }).result ?? []
}

export async function GET() {
  if (!authed()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  return NextResponse.json({ ok: true, photos: items.length })
}

export async function POST(req: Request) {
  if (!authed()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) return NextResponse.json({ ok: false, error: 'SANITY_API_WRITE_TOKEN 미설정' }, { status: 500 })

  const origin = new URL(req.url).origin
  try {
    // 1) 기존 슬라이드 중 R4 키비쥬얼만 보존
    const existing = await currentSlides()
    const keyvisual = existing.find(s => s._key === KEEP_KEY)

    // 2) R4 사진 업로드 → heroSlide 생성
    const slides: unknown[] = []
    if (keyvisual) slides.push(keyvisual)
    let n = 0
    for (const p of items) {
      const img = await fetch(`${origin}/${FOLDER}/${p.file}`, { cache: 'no-store' })
      if (!img.ok) return NextResponse.json({ ok: false, error: `이미지 로드 실패 ${p.file} (${img.status})` }, { status: 500 })
      const buf = Buffer.from(await img.arrayBuffer())
      const up = await fetch(`https://${PID}.api.sanity.io/v${V}/assets/images/${DS}?filename=hero-${p.file}`,
        { method: 'POST', headers: { 'Content-Type': 'image/jpeg', Authorization: `Bearer ${token}` }, body: buf })
      if (!up.ok) return NextResponse.json({ ok: false, error: `에셋 업로드 실패 ${p.file} (${up.status})` }, { status: 500 })
      const assetId = ((await up.json()) as { document: { _id: string } }).document._id
      n += 1
      const ref = { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
      slides.push({
        _key: `r4-hero-${String(n).padStart(2, '0')}`, _type: 'heroSlide',
        image: ref, mobileImage: ref, alt: p.alt, isActive: true,
      })
    }

    // 3) heroSlides 전체 교체
    const mutations = [{ patch: { id: 'siteSettings', set: { heroSlides: slides } } }]
    const r = await fetch(`https://${PID}.api.sanity.io/v${V}/data/mutate/${DS}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ mutations }) })
    if (!r.ok) {
      const t = await r.text()
      return NextResponse.json({ ok: false, error: `저장 실패 ${r.status}: ${t}` }, { status: 500 })
    }
    return NextResponse.json({ ok: true, slides: slides.length, keptKeyvisual: !!keyvisual, photos: n })
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
}
