// app/api/admin/gallery-import/route.ts — R3 갤러리 사진 배치 업로드
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import manifest from '@/data/r3-gallery.json'

const PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const DS = 'production'
const V = '2024-01-01'
const DOC_ID = 'media-r3-gallery'
const ROUND = 'round-2026-r3'
const BATCH = 10

interface Item { file: string; src: string }
const items = manifest as Item[]

function makeToken(p: string) { return crypto.createHash('sha256').update(p + ':inje-gt-admin').digest('hex') }
function authed(): boolean {
  const t = cookies().get('admin_auth')?.value
  return !!t && t === makeToken(process.env.ADMIN_PASSWORD ?? 'admin1234')
}

async function uploadedCount(): Promise<number> {
  const url = new URL(`https://${PID}.api.sanity.io/v${V}/data/query/${DS}`)
  url.searchParams.set('query', `count(*[_id=="${DOC_ID}"][0].photos)`)
  const r = await fetch(url.toString(), { cache: 'no-store' })
  const j = (await r.json()) as { result: number | null }
  return j.result ?? 0
}

export async function GET() {
  if (!authed()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  return NextResponse.json({ ok: true, total: items.length, uploaded: await uploadedCount() })
}

export async function POST(req: Request) {
  if (!authed()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) return NextResponse.json({ ok: false, error: 'SANITY_API_WRITE_TOKEN 미설정' }, { status: 500 })

  let offset = 0
  try { offset = Number((await req.json())?.offset) || 0 } catch {}
  const origin = new URL(req.url).origin
  const batch = items.slice(offset, offset + BATCH)
  if (batch.length === 0) return NextResponse.json({ ok: true, done: true, uploaded: items.length, total: items.length })

  // 1) 배치 사진을 Sanity 에셋으로 업로드
  const photoObjs: unknown[] = []
  let firstAssetId = ''
  for (let i = 0; i < batch.length; i++) {
    const idx = offset + i
    const imgRes = await fetch(`${origin}/r3-gallery/${batch[i].file}`, { cache: 'no-store' })
    if (!imgRes.ok) return NextResponse.json({ ok: false, error: `이미지 로드 실패 ${batch[i].file} (${imgRes.status})`, offset }, { status: 500 })
    const buf = Buffer.from(await imgRes.arrayBuffer())
    const up = await fetch(`https://${PID}.api.sanity.io/v${V}/assets/images/${DS}?filename=${batch[i].file}`,
      { method: 'POST', headers: { 'Content-Type': 'image/jpeg', Authorization: `Bearer ${token}` }, body: buf })
    if (!up.ok) return NextResponse.json({ ok: false, error: `에셋 업로드 실패 (${up.status})`, offset }, { status: 500 })
    const assetId = ((await up.json()) as { document: { _id: string } }).document._id
    if (i === 0 && offset === 0) firstAssetId = assetId
    photoObjs.push({
      _key: `photo-${String(idx + 1).padStart(3, '0')}`, _type: 'object',
      image: { _type: 'image', asset: { _type: 'reference', _ref: assetId } },
      alt: `2026 인제 GT 마스터즈 3라운드 오피셜 포토 #${idx + 1}`,
      caption: '', credit: '',
    })
  }

  // 2) 문서 생성(첫 배치) 또는 append(이후 배치)
  const mutations: unknown[] = []
  if (offset === 0) {
    mutations.push({
      createOrReplace: {
        _type: 'media', _id: DOC_ID, mediaType: 'photoAlbum',
        title: '2026 R3 갤러리', slug: { _type: 'slug', current: '2026-r3-gallery' },
        publishedAt: new Date().toISOString(),
        relatedRound: { _type: 'reference', _ref: ROUND },
        ...(firstAssetId ? { coverImage: { _type: 'image', asset: { _type: 'reference', _ref: firstAssetId } } } : {}),
        photos: photoObjs, isPublished: true, sortOrder: 5,
      },
    })
  } else {
    mutations.push({ patch: { id: DOC_ID, setIfMissing: { photos: [] }, insert: { after: 'photos[-1]', items: photoObjs } } })
  }

  const mr = await fetch(`https://${PID}.api.sanity.io/v${V}/data/mutate/${DS}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ mutations }) })
  if (!mr.ok) {
    const t = await mr.text()
    return NextResponse.json({ ok: false, error: `저장 실패 ${mr.status}: ${t}`, offset }, { status: 500 })
  }

  const next = offset + batch.length
  return NextResponse.json({ ok: true, done: next >= items.length, uploaded: next, total: items.length, next })
}
