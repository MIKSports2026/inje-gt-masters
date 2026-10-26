// app/api/admin/hero-r5-photos/route.ts — 홈 히어로 정리: R5 키비쥬얼 → 2027 캘린더, R4 경기 사진 → R5 포디움·질주 사진
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

export const maxDuration = 60

const PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const DS = 'production'
const V = '2024-01-01'
const FOLDER = 'r5-gallery'
const MAX_SLIDES = 10 // siteSettings.heroSlides 스키마 상한

// 포디움 ↔ 질주 교차 배치
const R5_HERO = [
  { file: 'g026.jpg', alt: '2026 인제 GT 마스터즈 5라운드 시상대' },
  { file: 'g081.jpg', alt: '2026 인제 GT 마스터즈 5라운드 — 질주하는 #3 BOBRACING X 아주자동차대학교' },
  { file: 'g016.jpg', alt: '2026 인제 GT 마스터즈 5라운드 — 시상식 뒤 물세례 세리머니' },
  { file: 'g082.jpg', alt: '2026 인제 GT 마스터즈 5라운드 — 질주하는 #5 오버리미트' },
]

interface Slide { _key: string; isActive?: boolean; [k: string]: unknown }

function makeToken(p: string) { return crypto.createHash('sha256').update(p + ':inje-gt-admin').digest('hex') }
function authed(): boolean {
  const t = cookies().get('admin_auth')?.value
  return !!t && t === makeToken(process.env.ADMIN_PASSWORD ?? 'admin1234')
}

export async function GET() {
  if (!authed()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  return NextResponse.json({ ok: true, photos: R5_HERO.map(p => p.file) })
}

export async function POST(req: Request) {
  if (!authed()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) return NextResponse.json({ ok: false, error: 'SANITY_API_WRITE_TOKEN 미설정' }, { status: 500 })

  const origin = new URL(req.url).origin
  try {
    const upload = async (path: string, name: string) => {
      const img = await fetch(`${origin}/${path}`, { cache: 'no-store' })
      if (!img.ok) throw new Error(`이미지 로드 실패 ${path} (${img.status})`)
      const up = await fetch(`https://${PID}.api.sanity.io/v${V}/assets/images/${DS}?filename=${name}`,
        { method: 'POST', headers: { 'Content-Type': 'image/jpeg', Authorization: `Bearer ${token}` }, body: Buffer.from(await img.arrayBuffer()) })
      if (!up.ok) throw new Error(`에셋 업로드 실패 ${path} (${up.status})`)
      const assetId = ((await up.json()) as { document: { _id: string } }).document._id
      return { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
    }

    // 2027 캘린더 (데스크톱 16:9 + 모바일 3:4)
    const calendar: Slide = {
      _key: 'calendar-2027', _type: 'heroSlide',
      image: await upload('hero-2027/desktop.jpg', 'hero-2027-calendar-desktop.jpg'),
      mobileImage: await upload('hero-2027/mobile.jpg', 'hero-2027-calendar-mobile.jpg'),
      alt: '2027 인제 GT 마스터즈 캘린더 — 4월 개막전부터 10월 최종전까지 5라운드', isActive: true,
    }
    const fresh: Slide[] = []
    for (let i = 0; i < R5_HERO.length; i++) {
      const p = R5_HERO[i]
      const ref = await upload(`${FOLDER}/${p.file}`, `hero-r5-${p.file}`)
      fresh.push({ _key: `r5-hero-${String(i + 1).padStart(2, '0')}`, _type: 'heroSlide', image: ref, mobileImage: ref, alt: p.alt, isActive: true })
    }

    // 기존 슬라이드에서 R5 키비쥬얼·R4/R5 경기 사진·2027 캘린더·비노출 슬라이드를 빼고(=챔피언 카드만 남음) 순서대로 재구성
    const q = encodeURIComponent(`*[_id=="siteSettings"][0].heroSlides`)
    const cur = await fetch(`https://${PID}.api.sanity.io/v${V}/data/query/${DS}?query=${q}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
    const existing: Slide[] = ((await cur.json()) as { result: Slide[] | null }).result ?? []
    const keep = existing.filter(s => !/^(r[45]-hero-|r[45]-keyvisual|calendar-2027)/.test(String(s._key)) && s.isActive !== false)
    const slides = [...keep, calendar, ...fresh].slice(0, MAX_SLIDES)
    const r = await fetch(`https://${PID}.api.sanity.io/v${V}/data/mutate/${DS}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ mutations: [{ patch: { id: 'siteSettings', set: { heroSlides: slides } } }] }) })
    if (!r.ok) {
      const t = await r.text()
      return NextResponse.json({ ok: false, error: `저장 실패 ${r.status}: ${t}` }, { status: 500 })
    }
    return NextResponse.json({ ok: true, total: slides.length, order: slides.map(s => s._key) })
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
}
