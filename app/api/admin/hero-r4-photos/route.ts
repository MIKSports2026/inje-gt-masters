// app/api/admin/hero-r4-photos/route.ts — 홈 히어로를 R4 경기 사진으로 교체 + 히어로 영상 제거
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import photos from '@/data/r4-hero-photos.json'

const PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const DS = 'production'
const V = '2024-01-01'
const FOLDER = 'r4-gallery'

interface P { file: string; alt: string }
const items = photos as P[]

function makeToken(p: string) { return crypto.createHash('sha256').update(p + ':inje-gt-admin').digest('hex') }
function authed(): boolean {
  const t = cookies().get('admin_auth')?.value
  return !!t && t === makeToken(process.env.ADMIN_PASSWORD ?? 'admin1234')
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
    // 히어로는 R4 사진만 사용 (영상·기존 슬라이드 제거)
    const slides: unknown[] = []
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

    // heroSlides 전체 교체 + 히어로 영상 제거(unset)
    const mutations = [{ patch: { id: 'siteSettings', set: { heroSlides: slides }, unset: ['heroVideo'] } }]
    const r = await fetch(`https://${PID}.api.sanity.io/v${V}/data/mutate/${DS}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ mutations }) })
    if (!r.ok) {
      const t = await r.text()
      return NextResponse.json({ ok: false, error: `저장 실패 ${r.status}: ${t}` }, { status: 500 })
    }
    return NextResponse.json({ ok: true, slides: slides.length, photos: n, videoRemoved: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
}
