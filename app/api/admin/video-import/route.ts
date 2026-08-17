// app/api/admin/video-import/route.ts — 유튜브 롱폼 영상 등록 + 홈 메인(featured) 설정
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import videoData from '@/data/video-import.json'
import featuredIds from '@/data/video-featured.json'

const PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const DS = 'production'
const V = '2024-01-01'

interface VDoc {
  videoId: string; mediaType: string; title: string
  slug: { _type: string; current: string }
  publishedAt: string; duration: string; youtubeUrl: string
  relatedRound?: { _type: string; _ref: string }
  isFeatured: boolean; isPublished: boolean; sortOrder: number
}
const vids = videoData as VDoc[]
const featured = new Set(featuredIds as string[])

function makeToken(p: string) { return crypto.createHash('sha256').update(p + ':inje-gt-admin').digest('hex') }
function authed(): boolean {
  const t = cookies().get('admin_auth')?.value
  return !!t && t === makeToken(process.env.ADMIN_PASSWORD ?? 'admin1234')
}

async function allVideoIds(): Promise<string[]> {
  const url = new URL(`https://${PID}.api.sanity.io/v${V}/data/query/${DS}`)
  url.searchParams.set('query', `*[_type=="media" && mediaType=="video"]._id`)
  const r = await fetch(url.toString(), { cache: 'no-store' })
  return ((await r.json()) as { result: string[] }).result ?? []
}

export async function GET() {
  if (!authed()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  return NextResponse.json({
    ok: true,
    videos: vids.map(v => ({ title: v.title, featured: v.isFeatured, duration: v.duration })),
    featuredCount: featured.size,
  })
}

export async function POST() {
  if (!authed()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) return NextResponse.json({ ok: false, error: 'SANITY_API_WRITE_TOKEN 미설정' }, { status: 500 })

  // 1) 신규 영상 createOrReplace
  const mutations: unknown[] = vids.map(v => ({
    createOrReplace: {
      _type: 'media', _id: `media-yt-${v.videoId}`, mediaType: v.mediaType,
      title: v.title, slug: v.slug, publishedAt: v.publishedAt, duration: v.duration,
      youtubeUrl: v.youtubeUrl, ...(v.relatedRound ? { relatedRound: v.relatedRound } : {}),
      isFeatured: v.isFeatured, isPublished: v.isPublished, sortOrder: v.sortOrder,
    },
  }))

  // 2) 홈 메인(featured) 정리 — 지정된 2개만 featured, 나머지 전부 해제
  let ids: string[] = []
  try { ids = await allVideoIds() } catch { return NextResponse.json({ ok: false, error: '영상 목록 조회 실패' }, { status: 500 }) }
  const newIds = new Set(vids.map(v => `media-yt-${v.videoId}`))
  const universe = new Set([...ids, ...newIds])
  for (const id of universe) {
    mutations.push({ patch: { id, set: { isFeatured: featured.has(id) } } })
  }

  try {
    const r = await fetch(`https://${PID}.api.sanity.io/v${V}/data/mutate/${DS}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ mutations }) })
    if (!r.ok) {
      const t = await r.text()
      return NextResponse.json({ ok: false, error: `저장 실패 ${r.status}: ${t}` }, { status: 500 })
    }
    return NextResponse.json({ ok: true, created: vids.length, featured: [...featured] })
  } catch (err) {
    return NextResponse.json({ ok: false, error: '저장 중 오류: ' + (err as Error).message }, { status: 500 })
  }
}
