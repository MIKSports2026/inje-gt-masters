// app/api/admin/media-kit-upload/route.ts — R4 미디어킷 파일 업로드 + 공개 처리
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const DS = 'production'
const V = '2024-01-01'

// 대상: 기존 R4 미디어킷 문서 + 올릴 파일(public)
const DOC_ID = 'e6358fc6-e3a3-4fb0-beca-612c3ef1bde7'
const FILE_PATH = '/media-kit/2026-inje-gt-r4-media-kit-fin.pdf'
const FILE_NAME = '2026 인제 GT 마스터즈 4라운드 미디어킷.pdf'
const DOCX_CT = 'application/pdf'

function makeToken(p: string) { return crypto.createHash('sha256').update(p + ':inje-gt-admin').digest('hex') }
function authed(): boolean {
  const t = cookies().get('admin_auth')?.value
  return !!t && t === makeToken(process.env.ADMIN_PASSWORD ?? 'admin1234')
}

export async function GET() {
  if (!authed()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  return NextResponse.json({ ok: true, docId: DOC_ID, file: FILE_PATH })
}

export async function POST(req: Request) {
  if (!authed()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) return NextResponse.json({ ok: false, error: 'SANITY_API_WRITE_TOKEN 미설정' }, { status: 500 })

  const origin = new URL(req.url).origin
  try {
    // 1) public docx 로드
    const f = await fetch(`${origin}${FILE_PATH}`, { cache: 'no-store' })
    if (!f.ok) return NextResponse.json({ ok: false, error: `파일 로드 실패 (${f.status})` }, { status: 500 })
    const buf = Buffer.from(await f.arrayBuffer())

    // 2) Sanity 파일 에셋 업로드
    const up = await fetch(
      `https://${PID}.api.sanity.io/v${V}/assets/files/${DS}?filename=${encodeURIComponent(FILE_NAME)}`,
      { method: 'POST', headers: { 'Content-Type': DOCX_CT, Authorization: `Bearer ${token}` }, body: buf })
    if (!up.ok) return NextResponse.json({ ok: false, error: `에셋 업로드 실패 (${up.status})` }, { status: 500 })
    const assetId = ((await up.json()) as { document: { _id: string } }).document._id

    // 3) R4 미디어킷 문서에 파일 연결 + 공개
    const mutations = [{
      patch: {
        id: DOC_ID,
        set: {
          mediaKitFile: { _type: 'file', asset: { _type: 'reference', _ref: assetId } },
          isReady: true,
        },
      },
    }]
    const r = await fetch(`https://${PID}.api.sanity.io/v${V}/data/mutate/${DS}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ mutations }) })
    if (!r.ok) {
      const t = await r.text()
      return NextResponse.json({ ok: false, error: `문서 저장 실패 ${r.status}: ${t}` }, { status: 500 })
    }
    return NextResponse.json({ ok: true, assetId, sizeKB: Math.round(buf.length / 1024) })
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
}
