// app/api/admin/press-import/route.ts — 언론보도(press) 게시물 일괄 등록
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import pressData from '@/data/press-posts.json'

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const SANITY_DATASET = 'production'
const SANITY_API_VERSION = '2024-01-01'

interface PressDoc {
  id: string; slug: string; title: string; category: string; author: string
  publishedAt: string; excerpt: string; relatedRound?: string
  body: unknown[]; sourceUrl?: string; media?: string
}

function makeToken(password: string) {
  return crypto.createHash('sha256').update(password + ':inje-gt-admin').digest('hex')
}
function isAuthorized(): boolean {
  const token = cookies().get('admin_auth')?.value
  if (!token) return false
  return token === makeToken(process.env.ADMIN_PASSWORD ?? 'admin1234')
}

const posts = pressData as PressDoc[]

/** 이미 등록된 slug 집합 */
async function existingSlugs(): Promise<Set<string>> {
  const url = new URL(`https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`)
  url.searchParams.set('query', `*[_type=="post"].slug.current`)
  const res = await fetch(url.toString(), { cache: 'no-store' })
  const json = (await res.json()) as { result: string[] }
  return new Set(json.result ?? [])
}

export async function GET() {
  if (!isAuthorized()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  try {
    const ex = await existingSlugs()
    return NextResponse.json({
      ok: true,
      posts: posts.map(p => ({ title: p.title, media: p.media, publishedAt: p.publishedAt, slug: p.slug, exists: ex.has(p.slug) })),
    })
  } catch {
    return NextResponse.json({ ok: false, error: '조회 실패' }, { status: 500 })
  }
}

export async function POST() {
  if (!isAuthorized()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const sanityToken = process.env.SANITY_API_WRITE_TOKEN
  if (!sanityToken) return NextResponse.json({ ok: false, error: 'SANITY_API_WRITE_TOKEN 미설정' }, { status: 500 })

  const mutations = posts.map(p => ({
    createOrReplace: {
      _type: 'post',
      _id: p.id,
      category: p.category,
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      publishedAt: p.publishedAt,
      author: p.author,
      excerpt: p.excerpt,
      ...(p.relatedRound ? { relatedRound: { _type: 'reference', _ref: p.relatedRound } } : {}),
      body: p.body,
      isPinned: false,
      isHidden: false,
    },
  }))

  try {
    const res = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sanityToken}` },
        body: JSON.stringify({ mutations }),
      }
    )
    if (!res.ok) {
      const t = await res.text()
      return NextResponse.json({ ok: false, error: `저장 실패: ${res.status} ${t}` }, { status: 500 })
    }
    return NextResponse.json({ ok: true, created: mutations.length, titles: posts.map(p => p.title) })
  } catch (err) {
    return NextResponse.json({ ok: false, error: '저장 중 오류: ' + (err as Error).message }, { status: 500 })
  }
}
