// app/api/revalidate/route.ts — Sanity Webhook → ISR 재검증
/**
 * Sanity Studio에서 콘텐츠 publish 시 자동으로 호출됩니다.
 * Sanity 대시보드 → API → Webhooks에서 이 URL을 등록하세요.
 * URL: https://www.masters-series.kr/api/revalidate
 * Secret: SANITY_REVALIDATE_SECRET 환경변수와 동일하게 설정
 */
import { revalidatePath, revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse }  from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  // 시크릿 검증
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { _type } = body

    // 문서 타입별 재검증 경로 매핑
    const revalidateMap: Record<string, string[]> = {
      siteSettings: ['/'],
      round:        ['/', '/season', '/entry'],
      classInfo:    ['/', '/classes'],
      result:       ['/', '/results'],
      post:         ['/', '/media/news'],
      media:        ['/', '/media'],
      partner:      ['/'],
      history:      ['/', '/about'],
    }

    const paths = revalidateMap[_type] ?? ['/']

    await Promise.all(paths.map(path => revalidatePath(path)))

    return NextResponse.json({
      revalidated: true,
      paths,
      type: _type,
      now: Date.now(),
    })
  } catch (err) {
    return NextResponse.json(
      { message: 'Error revalidating', error: String(err) },
      { status: 500 }
    )
  }
}
