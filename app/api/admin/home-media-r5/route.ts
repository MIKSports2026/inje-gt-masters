// app/api/admin/home-media-r5/route.ts — 홈 MEDIA 섹션 교체: R3 → 2026 시즌 챔피언 소감 영상 5 + R5 갤러리
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const DS = 'production'
const V = '2024-01-01'

// 홈에서 내릴 기존 featured (R3 갤러리·R3 영상)
const UNFEATURE = ['media-r3-gallery', 'media-yt-gWiuRq8suwM', 'media-yt-MGHeL_H0LMg']

// 클래스 순서대로 배치 (sortOrder 음수 = 영상 목록에서도 맨 앞)
const CHAMPION_VOICES = [
  { id: 'media-yt-U-FLPpYSLtc', title: '시즌 챔피언 소감 | Masters 1 BOBRACING X 아주자동차대학교 최근환·권도윤' },
  { id: 'media-yt-qjd9qV5mTi8', title: '시즌 챔피언 소감 | Masters N TEAM05X 김태일·장성훈' },
  { id: 'media-yt-dR3kUP7VqNc', title: '시즌 챔피언 소감 | Masters N-evo PITSTOP MOTORSPORT 정정재·신형주·최윤민' },
  { id: 'media-yt-lqy6-ZqtPEg', title: '시즌 챔피언 소감 | Masters 2 아우토모빌 박민제·정연섭·신동민' },
  { id: 'media-yt-gyB8f7WPN9M', title: '시즌 챔피언 소감 | Masters 3 봉좌레이싱 정시현·이재용' },
]
const R5_GALLERY = 'media-r5-gallery'
// 갤러리 #26(g026) 시상대 사진 — 이미 업로드된 에셋 재사용
const R5_COVER = { _type: 'image', asset: { _type: 'reference', _ref: 'image-a89bfc552b6fc913e670b93d439452ff6d9ef055-1920x1280-jpg' } }

function makeToken(p: string) { return crypto.createHash('sha256').update(p + ':inje-gt-admin').digest('hex') }
function authed(): boolean {
  const t = cookies().get('admin_auth')?.value
  return !!t && t === makeToken(process.env.ADMIN_PASSWORD ?? 'admin1234')
}

export async function POST() {
  if (!authed()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) return NextResponse.json({ ok: false, error: 'SANITY_API_WRITE_TOKEN 미설정' }, { status: 500 })

  const mutations = [
    ...UNFEATURE.map(id => ({ patch: { id, set: { isFeatured: false } } })),
    ...CHAMPION_VOICES.map((v, i) => ({
      patch: { id: v.id, set: { isFeatured: true, isPublished: true, title: v.title, sortOrder: -10 + i } },
    })),
    // R5 갤러리: 홈 마지막 칸 + 갤러리 페이지 맨 앞, 대표사진 = 시상대(g026)
    { patch: { id: R5_GALLERY, set: { isFeatured: true, sortOrder: -1, coverImage: R5_COVER } } },
  ]
  try {
    const r = await fetch(`https://${PID}.api.sanity.io/v${V}/data/mutate/${DS}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ mutations }) })
    if (!r.ok) {
      const t = await r.text()
      return NextResponse.json({ ok: false, error: `저장 실패 ${r.status}: ${t}` }, { status: 500 })
    }
    return NextResponse.json({ ok: true, featured: CHAMPION_VOICES.length + 1 })
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
}
