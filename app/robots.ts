// app/robots.ts — robots.txt 자동 생성
import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/siteUrl'

const BASE = getSiteUrl()

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio', '/api/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host:    BASE,
  }
}
