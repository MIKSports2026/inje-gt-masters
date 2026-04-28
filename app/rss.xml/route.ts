// app/rss.xml/route.ts — RSS 2.0 피드
import { sanityFetch } from '@/lib/sanity.client'
import { POSTS_QUERY } from '@/lib/queries'
import type { Post } from '@/types/sanity'
import { getSiteUrl } from '@/lib/siteUrl'

const BASE = getSiteUrl()

const CATEGORY_LABEL: Record<string, string> = {
  notice: '공지사항',
  news:   '대회소식',
  entry:  '참가안내',
  press:  '보도자료',
}

function escapeXml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const posts = await sanityFetch<Post[]>({
    query:      POSTS_QUERY,
    params:     { category: '', start: 0, end: 50 },
    revalidate: 3600,
  }).catch(() => [] as Post[])

  const items = posts.map(post => {
    const url     = `${BASE}/news/${post.slug.current}`
    const pubDate = new Date(post.publishedAt).toUTCString()
    const desc    = post.excerpt ? escapeXml(post.excerpt) : ''
    const cat     = CATEGORY_LABEL[post.category] ?? post.category

    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(cat)}</category>
      ${desc ? `<description>${desc}</description>` : ''}
    </item>`
  }).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>인제 GT 마스터즈 | 공식 홈페이지</title>
    <link>${BASE}</link>
    <description>대한민국 정통 GT 내구레이스. 인제스피디움 3.9km 서킷, 2026 시즌 5라운드. Masters 1·2·N·3·N-evo 클래스 참가 신청 접수 중.</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
