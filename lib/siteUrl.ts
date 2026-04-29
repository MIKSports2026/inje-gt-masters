// lib/siteUrl.ts — 사이트 URL 정규화 헬퍼
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://injegtmasters.com'
  return raw.trim().replace(/\/+$/, '')
}
