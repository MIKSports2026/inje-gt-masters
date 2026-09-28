// app/api/admin/video-import-all/route.ts — 채널 미등록 영상 일괄 등록(신규만, 홈 메인/featured 미변경)
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import data from '@/data/video-import-all.json'

const PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const DS = 'production'
const V = '2024-01-01'

interface VDoc {
  _type: string; _id: string; videoId: string; mediaType: string; title: string
  slug: { _type: string; current: string }
  publishedAt: string; youtubeUrl: string
  relatedRound?: { _type: string; _ref: string }
  tags?: string[]; isFeatured: boolean; isPublished: boolean; sortOrder: number
}
const docs = data as VDoc[]

function makeToken(p: string) { return crypto.createHash('sha256').update(p + ':inje-gt-admin').digest('hex') }
function authed(): boolean {
  const t = cookies().get('admin_auth')?.value
  return !!t && t === makeToken(process.env.ADMIN_PASSWORD ?? 'admin1234')
}

export async function GET() {
  if (!authed()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const shorts = docs.filter(d => d.youtubeUrl.includes('/shorts/')).length
  return NextResponse.json({ ok: true, total: docs.length, shorts, long: docs.length - shorts })
}

export async function POST() {
  if (!authed()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) return NextResponse.json({ ok: false, error: 'SANITY_API_WRITE_TOKEN 미설정' }, { status: 500 })

  // 신규 영상만 createOrReplace (기존 문서·featured 미변경)
  const mutations = docs.map(({ videoId, ...doc }) => ({ createOrReplace: doc }))
  try {
    const r = await fetch(`https://${PID}.api.sanity.io/v${V}/data/mutate/${DS}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ mutations }) })
    if (!r.ok) {
      const t = await r.text()
      return NextResponse.json({ ok: false, error: `저장 실패 ${r.status}: ${t}` }, { status: 500 })
    }
    return NextResponse.json({ ok: true, count: docs.length })
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
}
