// app/api/admin/press-articles/route.ts — 공식 보도자료(R1~R4) 본문+사진 일괄 게시
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import articles from '@/data/press-articles.json'

const PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const DS = 'production'
const V = '2024-01-01'

interface ImgIn { file: string; caption: string; alt: string; cover: boolean }
interface PostIn {
  _id: string; slug: string; title: string; category: string; author: string
  publishedAt: string; relatedRoundId: string; excerpt: string
  bodyBlocks: unknown[]; images: ImgIn[]
}
const POSTS = articles as PostIn[]

function makeToken(p: string) { return crypto.createHash('sha256').update(p + ':inje-gt-admin').digest('hex') }
function authed(): boolean {
  const t = cookies().get('admin_auth')?.value
  return !!t && t === makeToken(process.env.ADMIN_PASSWORD ?? 'admin1234')
}

async function uploadAsset(origin: string, file: string, token: string): Promise<string> {
  const img = await fetch(`${origin}${file}`, { cache: 'no-store' })
  if (!img.ok) throw new Error(`이미지 로드 실패 ${file} (${img.status})`)
  const buf = Buffer.from(await img.arrayBuffer())
  const fn = file.split('/').pop() ?? 'photo.jpg'
  const up = await fetch(`https://${PID}.api.sanity.io/v${V}/assets/images/${DS}?filename=${encodeURIComponent(fn)}`,
    { method: 'POST', headers: { 'Content-Type': 'image/jpeg', Authorization: `Bearer ${token}` }, body: buf })
  if (!up.ok) throw new Error(`에셋 업로드 실패 ${file} (${up.status})`)
  return ((await up.json()) as { document: { _id: string } }).document._id
}

export async function GET() {
  if (!authed()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  return NextResponse.json({
    ok: true,
    posts: POSTS.map(p => ({
      _id: p._id, title: p.title, publishedAt: p.publishedAt,
      round: p.relatedRoundId, blocks: p.bodyBlocks.length, images: p.images.length,
    })),
  })
}

export async function POST(req: Request) {
  if (!authed()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) return NextResponse.json({ ok: false, error: 'SANITY_API_WRITE_TOKEN 미설정' }, { status: 500 })

  const origin = new URL(req.url).origin
  const assetCache = new Map<string, string>()
  const upload = async (file: string) => {
    if (assetCache.has(file)) return assetCache.get(file)!
    const id = await uploadAsset(origin, file, token)
    assetCache.set(file, id)
    return id
  }

  const mutations: unknown[] = []
  try {
    for (const p of POSTS) {
      let coverRef = ''
      const imageBlocks: unknown[] = []
      let n = 0
      for (const im of p.images) {
        const assetId = await upload(im.file)
        if (im.cover) coverRef = assetId
        n += 1
        imageBlocks.push({
          _type: 'image', _key: `img${n}`,
          asset: { _type: 'reference', _ref: assetId },
          caption: im.caption, alt: im.alt,
        })
      }
      if (!coverRef && p.images[0]) coverRef = await upload(p.images[0].file)

      const doc: Record<string, unknown> = {
        _type: 'post', _id: p._id,
        title: p.title,
        slug: { _type: 'slug', current: p.slug },
        category: p.category,
        author: p.author,
        publishedAt: p.publishedAt,
        excerpt: p.excerpt,
        body: [...p.bodyBlocks, ...imageBlocks],
        relatedRound: { _type: 'reference', _ref: p.relatedRoundId },
        isPinned: false,
        isHidden: false,
      }
      if (coverRef) doc.coverImage = { _type: 'image', asset: { _type: 'reference', _ref: coverRef } }
      mutations.push({ createOrReplace: doc })
    }

    const r = await fetch(`https://${PID}.api.sanity.io/v${V}/data/mutate/${DS}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ mutations }) })
    if (!r.ok) {
      const t = await r.text()
      return NextResponse.json({ ok: false, error: `저장 실패 ${r.status}: ${t}` }, { status: 500 })
    }
    return NextResponse.json({ ok: true, count: POSTS.length, uploaded: assetCache.size })
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
}
