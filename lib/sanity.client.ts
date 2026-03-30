// lib/sanity.client.ts — Next.js 14 App Router용 Sanity 클라이언트
import { createClient } from 'next-sanity'
import imageUrlBuilder  from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const projectId  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
export const dataset    = process.env.NEXT_PUBLIC_SANITY_DATASET    ?? 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01'

// ── Sanity 프로젝트 ID가 설정됐는지 여부 ─────────────────────
const isSanityConfigured = /^[a-z0-9-]+$/.test(projectId)

// ── 읽기 전용 (CDN · ISR용) ───────────────────────────────────
export const client = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : createClient({ projectId: 'placeholder', dataset, apiVersion, useCdn: false })

// ── 드래프트 미리보기용 (CDN 비활성) ─────────────────────────
export const previewClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn:      false,
      token:       process.env.SANITY_API_READ_TOKEN,
      perspective: 'previewDrafts',
    })
  : client

// ── 이미지 URL 빌더 ───────────────────────────────────────────
const builder = imageUrlBuilder(client)
export const urlFor = (source: SanityImageSource) => builder.image(source)

// ── CDN 비활성 클라이언트 (설정 데이터용 — 즉시 반영) ─────────
const noCdnClient = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: false })
  : client

// ── 범용 fetch 래퍼 (ISR 캐시 지원) ─────────────────────────
export async function sanityFetch<T>({
  query,
  params       = {},
  revalidate   = 60,   // 기본 60초 ISR
  useCdn       = true, // false로 하면 Sanity CDN 우회
}: {
  query:       string
  params?:     Record<string, unknown>
  revalidate?: number | false
  useCdn?:     boolean
}): Promise<T> {
  if (!isSanityConfigured) {
    // Sanity 미설정 시 빈 결과 반환 (fallback 데이터가 각 컴포넌트에 있음)
    return (Array.isArray([] as unknown as T) ? [] : null) as T
  }
  const c = useCdn ? client : noCdnClient
  return c.fetch<T>(query, params, {
    next: { revalidate },
  })
}

// ── 정적 생성 전용 (빌드 타임 고정) ─────────────────────────
export async function sanityStaticFetch<T>(
  query:   string,
  params?: Record<string, unknown>,
): Promise<T> {
  return client.fetch<T>(query, params ?? {}, { cache: 'force-cache' })
}
