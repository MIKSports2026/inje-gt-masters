// app/api/admin/youtube-import/route.ts — 유튜브 쇼츠 일괄 등록
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import { getYoutubeId } from '@/lib/youtube'
import shortsData from '@/data/youtube-shorts.json'

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const SANITY_DATASET = 'production'
const SANITY_API_VERSION = '2024-01-01'

interface ShortDoc {
  videoId: string
  _type: string
  mediaType: string
  title: string
  slug: { _type: string; current: string }
  publishedAt?: string
  duration?: string
  youtubeUrl: string
  relatedRound?: { _type: string; _ref: string }
  isFeatured: boolean
  isPublished: boolean
  sortOrder: number
}

function makeToken(password: string) {
  return crypto.createHash('sha256').update(password + ':inje-gt-admin').digest('hex')
}

function isAuthorized(): boolean {
  const token = cookies().get('admin_auth')?.value
  if (!token) return false
  return token === makeToken(process.env.ADMIN_PASSWORD ?? 'admin1234')
}

/** Sanity에 이미 등록된 영상의 videoId 집합 */
async function fetchExistingVideoIds(): Promise<Set<string>> {
  const url = new URL(
    `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`
  )
  url.searchParams.set('query', `*[_type=="media" && defined(youtubeUrl)]{ youtubeUrl }`)

  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (!res.ok) throw new Error(`기존 문서 조회 실패: ${res.status}`)

  const json = (await res.json()) as { result: { youtubeUrl: string }[] }
  const ids = new Set<string>()
  for (const r of json.result ?? []) {
    const id = getYoutubeId(r.youtubeUrl)
    if (id) ids.add(id)
  }
  return ids
}

/** 등록 대상 목록 — 이미 있는 항목은 skip 표시 */
async function buildPlan() {
  const existing = await fetchExistingVideoIds()
  const items = (shortsData as ShortDoc[]).map(d => ({
    videoId: d.videoId,
    title: d.title,
    slug: d.slug.current,
    publishedAt: d.publishedAt,
    duration: d.duration,
    round: d.relatedRound?._ref.replace('round-2026-', '').toUpperCase() ?? null,
    exists: existing.has(d.videoId),
  }))
  return { items, newCount: items.filter(i => !i.exists).length }
}

export async function GET() {
  if (!isAuthorized()) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  try {
    const plan = await buildPlan()
    return NextResponse.json({ ok: true, ...plan })
  } catch (err) {
    console.error('youtube-import preview error:', err)
    return NextResponse.json({ ok: false, error: '미리보기 실패' }, { status: 500 })
  }
}

export async function POST() {
  if (!isAuthorized()) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const sanityToken = process.env.SANITY_API_WRITE_TOKEN
  if (!sanityToken) {
    return NextResponse.json({ ok: false, error: 'SANITY_API_WRITE_TOKEN 미설정' }, { status: 500 })
  }

  let existing: Set<string>
  try {
    existing = await fetchExistingVideoIds()
  } catch (err) {
    console.error('youtube-import query error:', err)
    return NextResponse.json({ ok: false, error: '기존 문서 조회 실패' }, { status: 500 })
  }

  // 이미 등록된 영상은 건너뛴다 — 재실행해도 중복 생성되지 않음
  const toCreate = (shortsData as ShortDoc[]).filter(d => !existing.has(d.videoId))
  if (toCreate.length === 0) {
    return NextResponse.json({ ok: true, created: 0, skipped: shortsData.length, message: '새로 등록할 영상이 없습니다.' })
  }

  const mutations = toCreate.map(d => ({
    create: {
      _type: 'media',
      _id: `media-yt-${d.videoId}`,
      mediaType: d.mediaType,
      title: d.title,
      slug: d.slug,
      ...(d.publishedAt ? { publishedAt: d.publishedAt } : {}),
      ...(d.duration ? { duration: d.duration } : {}),
      youtubeUrl: d.youtubeUrl,
      ...(d.relatedRound ? { relatedRound: d.relatedRound } : {}),
      isFeatured: d.isFeatured,
      isPublished: d.isPublished,
      sortOrder: d.sortOrder,
    },
  }))

  try {
    const res = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sanityToken}`,
        },
        body: JSON.stringify({ mutations }),
      }
    )

    if (!res.ok) {
      const errText = await res.text()
      console.error('Sanity mutate error:', errText)
      return NextResponse.json({ ok: false, error: `Sanity 저장 실패: ${res.status}` }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      created: toCreate.length,
      skipped: shortsData.length - toCreate.length,
      titles: toCreate.map(d => d.title),
    })
  } catch (err) {
    console.error('youtube-import mutate error:', err)
    return NextResponse.json({ ok: false, error: '저장 중 오류' }, { status: 500 })
  }
}
