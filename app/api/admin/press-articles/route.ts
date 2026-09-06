// app/api/admin/press-articles/route.ts — 공식 보도자료(R1~R4) 본문+사진 일괄 게시
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import articles from '@/data/press-articles.json'

const PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const DS = 'production'
const V = '2024-01-01'

interface ImgIn { file: string; caption: string; alt: string; cover: boolean; after?: number; bodyExclude?: boolean }
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
      // 이미지 업로드 + 블록 생성 (파일별 asset 캐시)
      const mkImg = async (im: ImgIn, idx: number) => {
        const assetId = await upload(im.file)
        return {
          _type: 'image', _key: `img${idx}`,
          asset: { _type: 'reference', _ref: assetId },
          caption: im.caption, alt: im.alt,
        }
      }
      // 커버 ref 확보 (모든 이미지 업로드는 아래에서 수행되지만 커버는 먼저)
      for (const im of p.images) {
        const assetId = await upload(im.file)
        if (im.cover) coverRef = assetId
      }
      if (!coverRef && p.images[0]) coverRef = await upload(p.images[0].file)

      // 본문 조립: after가 지정된 이미지가 하나라도 있으면 위치 삽입, 아니면 끝에 일괄 첨부
      const positioned = p.images.some(im => typeof im.after === 'number')
      let body: unknown[]
      if (positioned) {
        body = []
        for (let bi = 0; bi < p.bodyBlocks.length; bi++) {
          body.push(p.bodyBlocks[bi])
          for (let ii = 0; ii < p.images.length; ii++) {
            const im = p.images[ii]
            if (!im.bodyExclude && im.after === bi) body.push(await mkImg(im, ii + 1))
          }
        }
        // 범위를 벗어난 after 또는 after 미지정(비제외) 이미지는 끝에 첨부
        for (let ii = 0; ii < p.images.length; ii++) {
          const im = p.images[ii]
          if (im.bodyExclude) continue
          const hasPos = typeof im.after === 'number'
          if ((hasPos && (im.after as number) >= p.bodyBlocks.length) || !hasPos) {
            body.push(await mkImg(im, ii + 1))
          }
        }
      } else {
        const imageBlocks: unknown[] = []
        for (let ii = 0; ii < p.images.length; ii++) imageBlocks.push(await mkImg(p.images[ii], ii + 1))
        body = [...p.bodyBlocks, ...imageBlocks]
      }

      const doc: Record<string, unknown> = {
        _type: 'post', _id: p._id,
        title: p.title,
        slug: { _type: 'slug', current: p.slug },
        category: p.category,
        author: p.author,
        publishedAt: p.publishedAt,
        excerpt: p.excerpt,
        body,
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
