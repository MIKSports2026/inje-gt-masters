// app/sitemap.ts — 자동 생성 sitemap.xml
import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.masters-series.kr'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,               lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/entry`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/season`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/results`,  lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/news`,     lastModified: now, changeFrequency: 'daily',   priority: 0.75 },
    { url: `${BASE}/media`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
  ]

  return staticPages
}
