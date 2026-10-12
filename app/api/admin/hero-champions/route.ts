// app/api/admin/hero-champions/route.ts — 2026 시즌 챔피언 카드 5장을 홈 히어로 앞부분에 배치
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const DS = 'production'
const V = '2024-01-01'
const FOLDER = 'hero-champions'
const MAX_SLIDES = 10 // siteSettings.heroSlides 스키마 상한

// 클래스 표기 순서: Masters 1 → N → N-evo → 2 → 3
const CARDS = [
  { key: 'm1',    alt: '2026 시즌 챔피언 — MASTERS 1 BOBRACING X 아주자동차대학교 최근환·권도윤' },
  { key: 'mn',    alt: '2026 시즌 챔피언 — MASTERS N TEAM05X 김태일·장성훈' },
  { key: 'mnevo', alt: '2026 시즌 챔피언 — MASTERS N-evo PITSTOP MOTORSPORT 정정재·신형주·최윤민' },
  { key: 'm2',    alt: '2026 시즌 챔피언 — MASTERS 2 아우토모빌 박민제·정연섭·신동민' },
  { key: 'm3',    alt: '2026 시즌 챔피언 — MASTERS 3 봉좌레이싱 정시현·이재용' },
]

interface Slide { _key: string; isActive?: boolean; [k: string]: unknown }

function makeToken(p: string) { return crypto.createHash('sha256').update(p + ':inje-gt-admin').digest('hex') }
function authed(): boolean {
  const t = cookies().get('admin_auth')?.value
  return !!t && t === makeToken(process.env.ADMIN_PASSWORD ?? 'admin1234')
}

async function uploadAsset(origin: string, file: string, token: string): Promise<string> {
  const img = await fetch(`${origin}/${FOLDER}/${file}`, { cache: 'no-store' })
  if (!img.ok) throw new Error(`이미지 로드 실패 ${file} (${img.status})`)
  const buf = Buffer.from(await img.arrayBuffer())
  const up = await fetch(`https://${PID}.api.sanity.io/v${V}/assets/images/${DS}?filename=champ-${file}`,
    { method: 'POST', headers: { 'Content-Type': 'image/jpeg', Authorization: `Bearer ${token}` }, body: buf })
  if (!up.ok) throw new Error(`에셋 업로드 실패 ${file} (${up.status})`)
  return ((await up.json()) as { document: { _id: string } }).document._id
}

export async function GET() {
  if (!authed()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  return NextResponse.json({ ok: true, cards: CARDS.map(c => c.key) })
}

export async function POST(req: Request) {
  if (!authed()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) return NextResponse.json({ ok: false, error: 'SANITY_API_WRITE_TOKEN 미설정' }, { status: 500 })

  const origin = new URL(req.url).origin
  try {
    // 1) 챔피언 카드 업로드 (데스크톱 16:9 + 모바일 4:5)
    const champs: Slide[] = []
    for (const c of CARDS) {
      const d = await uploadAsset(origin, `${c.key}-desktop.jpg`, token)
      const m = await uploadAsset(origin, `${c.key}-mobile.jpg`, token)
      champs.push({
        _key: `champ-2026-${c.key}`, _type: 'heroSlide',
        image: { _type: 'image', asset: { _type: 'reference', _ref: d } },
        mobileImage: { _type: 'image', asset: { _type: 'reference', _ref: m } },
        alt: c.alt, isActive: true,
      })
    }

    // 2) 기존 슬라이드 조회 → 챔피언 카드 제외·비노출 슬라이드 제외 후 뒤에 붙이고 상한(10장)까지만 유지
    const q = encodeURIComponent(`*[_id=="siteSettings"][0].heroSlides`)
    const cur = await fetch(`https://${PID}.api.sanity.io/v${V}/data/query/${DS}?query=${q}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
    const existing: Slide[] = ((await cur.json()) as { result: Slide[] | null }).result ?? []
    const rest = existing.filter(s => !String(s._key).startsWith('champ-2026-') && s.isActive !== false)
    const slides = [...champs, ...rest].slice(0, MAX_SLIDES)

    const mutations = [{ patch: { id: 'siteSettings', set: { heroSlides: slides } } }]
    const r = await fetch(`https://${PID}.api.sanity.io/v${V}/data/mutate/${DS}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ mutations }) })
    if (!r.ok) {
      const t = await r.text()
      return NextResponse.json({ ok: false, error: `저장 실패 ${r.status}: ${t}` }, { status: 500 })
    }
    return NextResponse.json({
      ok: true, champions: champs.length, total: slides.length,
      kept: rest.slice(0, MAX_SLIDES - champs.length).map(s => s._key),
      dropped: [...existing.filter(s => s.isActive === false).map(s => s._key), ...rest.slice(MAX_SLIDES - champs.length).map(s => s._key)],
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
}
