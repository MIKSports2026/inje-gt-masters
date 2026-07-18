// app/api/admin/hero-video/route.ts — 홈 히어로 배경 영상 URL 설정
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import { getYoutubeId } from '@/lib/youtube'

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const SANITY_DATASET = 'production'
const SANITY_API_VERSION = '2024-01-01'
const DOC_ID = 'siteSettings'

function makeToken(password: string) {
  return crypto.createHash('sha256').update(password + ':inje-gt-admin').digest('hex')
}
function isAuthorized(): boolean {
  const token = cookies().get('admin_auth')?.value
  if (!token) return false
  return token === makeToken(process.env.ADMIN_PASSWORD ?? 'admin1234')
}

async function fetchCurrent(): Promise<string> {
  const url = new URL(`https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`)
  url.searchParams.set('query', `*[_id=="${DOC_ID}"][0].heroVideo`)
  const res = await fetch(url.toString(), { cache: 'no-store' })
  const json = (await res.json()) as { result: string | null }
  return (json.result ?? '').trim()
}

export async function GET() {
  if (!isAuthorized()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  try {
    const current = await fetchCurrent()
    return NextResponse.json({ ok: true, current, videoId: getYoutubeId(current) })
  } catch {
    return NextResponse.json({ ok: false, error: '조회 실패' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!isAuthorized()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const sanityToken = process.env.SANITY_API_WRITE_TOKEN
  if (!sanityToken) return NextResponse.json({ ok: false, error: 'SANITY_API_WRITE_TOKEN 미설정' }, { status: 500 })

  let url = ''
  try { url = ((await req.json()) as { url?: string }).url?.trim() ?? '' } catch {}

  // 값이 있으면 유효한 유튜브 URL인지 검증
  if (url && !getYoutubeId(url)) {
    return NextResponse.json({ ok: false, error: '유효한 YouTube URL이 아닙니다.' }, { status: 400 })
  }

  const mutation = url
    ? { patch: { id: DOC_ID, set: { heroVideo: url } } }
    : { patch: { id: DOC_ID, unset: ['heroVideo'] } }

  try {
    const res = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sanityToken}` }, body: JSON.stringify({ mutations: [mutation] }) }
    )
    if (!res.ok) {
      const t = await res.text()
      return NextResponse.json({ ok: false, error: `저장 실패: ${res.status} ${t}` }, { status: 500 })
    }
    return NextResponse.json({ ok: true, current: url, videoId: getYoutubeId(url) })
  } catch (err) {
    return NextResponse.json({ ok: false, error: '저장 중 오류: ' + (err as Error).message }, { status: 500 })
  }
}
