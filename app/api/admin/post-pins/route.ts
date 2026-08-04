// app/api/admin/post-pins/route.ts — 뉴스 게시물 고정(isPinned) 관리
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const SANITY_DATASET = 'production'
const SANITY_API_VERSION = '2024-01-01'

function makeToken(password: string) {
  return crypto.createHash('sha256').update(password + ':inje-gt-admin').digest('hex')
}
function isAuthorized(): boolean {
  const token = cookies().get('admin_auth')?.value
  if (!token) return false
  return token === makeToken(process.env.ADMIN_PASSWORD ?? 'admin1234')
}

async function fetchPosts() {
  const url = new URL(`https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`)
  url.searchParams.set('query',
    `*[_type=="post" && isHidden != true] | order(publishedAt desc)[0...30]{ _id, title, category, publishedAt, isPinned }`)
  const res = await fetch(url.toString(), { cache: 'no-store' })
  const json = (await res.json()) as { result: unknown[] }
  return json.result ?? []
}

export async function GET() {
  if (!isAuthorized()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  try {
    return NextResponse.json({ ok: true, posts: await fetchPosts() })
  } catch {
    return NextResponse.json({ ok: false, error: '조회 실패' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!isAuthorized()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const sanityToken = process.env.SANITY_API_WRITE_TOKEN
  if (!sanityToken) return NextResponse.json({ ok: false, error: 'SANITY_API_WRITE_TOKEN 미설정' }, { status: 500 })

  let body: { postId?: string; isPinned?: boolean; unpinAll?: boolean }
  try { body = await req.json() } catch { return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 }) }

  let mutations: unknown[] = []
  if (body.unpinAll) {
    const posts = (await fetchPosts()) as { _id: string; isPinned?: boolean }[]
    mutations = posts.filter(p => p.isPinned).map(p => ({ patch: { id: p._id, set: { isPinned: false } } }))
  } else {
    if (!body.postId) return NextResponse.json({ ok: false, error: 'postId 필수' }, { status: 400 })
    mutations = [{ patch: { id: body.postId, set: { isPinned: !!body.isPinned } } }]
  }
  if (mutations.length === 0) return NextResponse.json({ ok: true, posts: await fetchPosts() })

  try {
    const res = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sanityToken}` }, body: JSON.stringify({ mutations }) }
    )
    if (!res.ok) {
      const t = await res.text()
      return NextResponse.json({ ok: false, error: `저장 실패: ${res.status} ${t}` }, { status: 500 })
    }
    return NextResponse.json({ ok: true, posts: await fetchPosts() })
  } catch (err) {
    return NextResponse.json({ ok: false, error: '저장 중 오류: ' + (err as Error).message }, { status: 500 })
  }
}
