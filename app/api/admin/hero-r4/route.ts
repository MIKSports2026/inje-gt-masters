// app/api/admin/hero-r4/route.ts — R4 키비쥬얼을 홈 히어로 1번 슬라이드로 등록
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const DS = 'production'
const V = '2024-01-01'
const KEY = 'r4-keyvisual'

function makeToken(p: string) { return crypto.createHash('sha256').update(p + ':inje-gt-admin').digest('hex') }
function authed(): boolean {
  const t = cookies().get('admin_auth')?.value
  return !!t && t === makeToken(process.env.ADMIN_PASSWORD ?? 'admin1234')
}

async function uploadAsset(origin: string, file: string, token: string): Promise<string> {
  const img = await fetch(`${origin}/r4-hero/${file}`, { cache: 'no-store' })
  if (!img.ok) throw new Error(`이미지 로드 실패 ${file} (${img.status})`)
  const buf = Buffer.from(await img.arrayBuffer())
  const up = await fetch(`https://${PID}.api.sanity.io/v${V}/assets/images/${DS}?filename=r4-${file}`,
    { method: 'POST', headers: { 'Content-Type': 'image/jpeg', Authorization: `Bearer ${token}` }, body: buf })
  if (!up.ok) throw new Error(`에셋 업로드 실패 (${up.status})`)
  return ((await up.json()) as { document: { _id: string } }).document._id
}

export async function GET() {
  if (!authed()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  return NextResponse.json({ ok: true })
}

export async function POST(req: Request) {
  if (!authed()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) return NextResponse.json({ ok: false, error: 'SANITY_API_WRITE_TOKEN 미설정' }, { status: 500 })

  const origin = new URL(req.url).origin
  let desktopId = '', mobileId = ''
  try {
    desktopId = await uploadAsset(origin, 'desktop.jpg', token)
    mobileId = await uploadAsset(origin, 'mobile.jpg', token)
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }

  const slide = {
    _key: KEY, _type: 'heroSlide',
    image: { _type: 'image', asset: { _type: 'reference', _ref: desktopId } },
    mobileImage: { _type: 'image', asset: { _type: 'reference', _ref: mobileId } },
    alt: '4라운드 키비쥬얼', isActive: true,
  }
  // 기존 R4 슬라이드 제거 후 맨 앞에 삽입 (재실행 안전)
  const mutations = [
    { patch: { id: 'siteSettings', unset: [`heroSlides[_key=="${KEY}"]`] } },
    { patch: { id: 'siteSettings', setIfMissing: { heroSlides: [] }, insert: { before: 'heroSlides[0]', items: [slide] } } },
  ]

  try {
    const r = await fetch(`https://${PID}.api.sanity.io/v${V}/data/mutate/${DS}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ mutations }) })
    if (!r.ok) {
      const t = await r.text()
      return NextResponse.json({ ok: false, error: `저장 실패 ${r.status}: ${t}` }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: '저장 중 오류: ' + (err as Error).message }, { status: 500 })
  }
}
