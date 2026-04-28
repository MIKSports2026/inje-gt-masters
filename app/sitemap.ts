// app/sitemap.ts — 자동 생성 sitemap.xml (정적 + 동적)
import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/siteUrl'
import { sanityFetch } from '@/lib/sanity.client'

const BASE = getSiteUrl()

// GROQ 쿼리 (lib/queries.ts 수정 금지 — 이 파일 내에서만 정의)
const POSTS_FOR_SITEMAP = `*[_type == "post" && !(_id in path("drafts.**"))]{
  "slug": slug.current,
  publishedAt,
  _updatedAt
}`

const ROUNDS_FOR_SITEMAP = `*[_type == "round" && !(_id in path("drafts.**"))]{
  "slug": slug.current,
  dateStart,
  _updatedAt
}`

type SitemapPost = { slug: string; publishedAt?: string; _updatedAt?: string }
type SitemapRound = { slug: string; dateStart?: string; _updatedAt?: string }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // ── 1) 핵심 정적 페이지 ──
  const corePages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/entry`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/season`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/results`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/news`, lastModified: now, changeFrequency: 'daily', priority: 0.75 },
    { url: `${BASE}/media`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ]

  // ── 2) 추가 정적 페이지 ──
  const extraStaticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/history`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/circuit`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/classes`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/masters/organization`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  // ── 3) 동적: 뉴스 ──
  const posts = await sanityFetch<SitemapPost[]>({
    query: POSTS_FOR_SITEMAP,
    revalidate: 3600,
    useCdn: false,
  }).catch(() => [] as SitemapPost[])

  const newsPages: MetadataRoute.Sitemap = (posts ?? [])
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${BASE}/news/${p.slug}`,
      lastModified: p._updatedAt ? new Date(p._updatedAt) : (p.publishedAt ? new Date(p.publishedAt) : now),
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    }))

  // ── 4) 동적: 라운드 ──
  const rounds = await sanityFetch<SitemapRound[]>({
    query: ROUNDS_FOR_SITEMAP,
    revalidate: 3600,
    useCdn: false,
  }).catch(() => [] as SitemapRound[])

  const roundPages: MetadataRoute.Sitemap = (rounds ?? [])
    .filter((r) => r.slug)
    .map((r) => ({
      url: `${BASE}/season/${r.slug}`,
      lastModified: r._updatedAt ? new Date(r._updatedAt) : (r.dateStart ? new Date(r.dateStart) : now),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }))

  return [...corePages, ...extraStaticPages, ...newsPages, ...roundPages]
}
