// app/(site)/page.tsx — 메인 페이지 (v3)
import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity.client'
import {
  SITE_SETTINGS_QUERY, ROUNDS_QUERY,
  RECENT_POSTS_QUERY, PARTNERS_QUERY, NEXT_ROUND_QUERY, CLASSES_QUERY,
} from '@/lib/queries'
import type { SiteSettings, Round, Post, Partner, ClassInfo, HeroSlide } from '@/types/sanity'

function filterActiveSlides(slides: HeroSlide[] | undefined): HeroSlide[] {
  if (!slides || slides.length === 0) return []
  const now = new Date()
  const active = slides.filter((slide) => {
    if (!slide.imageUrl) return false
    if (slide.isActive === false) return false
    if (slide.startAt && new Date(slide.startAt) > now) return false
    if (slide.endAt && new Date(slide.endAt) < now) return false
    return true
  })
  if (active.length === 0 && slides[0]?.imageUrl) {
    console.warn('[SectionHero] 모든 슬라이드가 비노출 상태 — 첫 슬라이드 강제 노출')
    return [slides[0]]
  }
  return active
}

import SectionHero       from '@/components/sections/SectionHero'
import SectionRound      from '@/components/sections/SectionRound'
import SectionClass      from '@/components/sections/SectionClass'
import SectionNews       from '@/components/sections/SectionNews'
import SectionPartners   from '@/components/sections/SectionPartners'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SiteSettings>({
    query: SITE_SETTINGS_QUERY, revalidate: 60, useCdn: false,
  }).catch(() => null)
  if (!settings) return {}
  return {
    title:       { absolute: settings.metaTitle ?? '인제 GT 마스터즈 | 공식 홈페이지' },
    description: settings.metaDescription,
    openGraph: {
      title:       settings.metaTitle,
      description: settings.metaDescription,
      url:         settings.canonicalUrl,
      images: settings.ogImage?.asset?.url
        ? [{ url: settings.ogImage.asset.url, width: 1200, height: 630 }] : [],
    },
    alternates: { canonical: settings.canonicalUrl },
  }
}

export default async function HomePage() {
  const today = new Date().toISOString().slice(0, 10)

  const [settings, rounds, nextRound, posts, partners, classes] = await Promise.all([
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY,  revalidate: 60, useCdn: false }).catch(() => null),
    sanityFetch<Round[]>      ({ query: ROUNDS_QUERY,         params: { season: 2026 }, revalidate: 300 }).catch(() => [] as Round[]),
    sanityFetch<Round | null> ({ query: NEXT_ROUND_QUERY,     params: { today },        revalidate: 300 }).catch(() => null),
    sanityFetch<Post[]>       ({ query: RECENT_POSTS_QUERY,   params: { limit: 3 },     revalidate: 60, useCdn: false }).catch(() => [] as Post[]),
    sanityFetch<Partner[]>    ({ query: PARTNERS_QUERY,       params: { currentSeason: 2026 }, revalidate: 3600, useCdn: false }).catch(() => [] as Partner[]),
    sanityFetch<ClassInfo[]>  ({ query: CLASSES_QUERY, useCdn: false, revalidate: 3600 }).catch(() => [] as ClassInfo[]),
  ])

  const s  = settings  as SiteSettings | null
  const rs = (rounds   ?? []) as Round[]
  const nr = nextRound as Round | null
  const ps = (posts    ?? []) as Post[]
  const pt = (partners ?? []) as Partner[]
  const cs = (classes  ?? []) as ClassInfo[]

  const activeSlides = filterActiveSlides(s?.heroSlides)

  return (
    <>
      {/* SEO: 구조화 데이터 — SportsOrganization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SportsOrganization',
            name: '인제 GT 마스터즈',
            alternateName: 'Inje GT Masters',
            url: 'https://injegtmasters.com',
            logo: 'https://injegtmasters.com/logo-white.png',
            sport: '모터스포츠 / 내구레이스',
            description: '대한민국 정통 GT 내구레이스. 인제스피디움 3.9km 서킷, 2026 시즌 5라운드.',
            location: {
              '@type': 'Place',
              name: '인제스피디움',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '강원특별자치도 인제군 기린면 상하답로 130',
                addressLocality: '인제군',
                addressRegion: '강원특별자치도',
                addressCountry: 'KR',
              },
            },
          }),
        }}
      />

      {/* SEO: 다음 라운드가 있을 때 SportsEvent 추가 */}
      {nr && nr.dateStart && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SportsEvent',
              name: `2026 인제 GT 마스터즈 R${nr.roundNumber} ${nr.title ?? ''}`.trim(),
              startDate: nr.dateStart,
              endDate: nr.dateEnd ?? nr.dateStart,
              eventStatus: 'https://schema.org/EventScheduled',
              eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
              location: {
                '@type': 'Place',
                name: '인제스피디움',
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: '강원특별자치도 인제군 기린면 상하답로 130',
                  addressLocality: '인제군',
                  addressRegion: '강원특별자치도',
                  addressCountry: 'KR',
                },
              },
              organizer: {
                '@type': 'Organization',
                name: '인제 GT 마스터즈',
                url: 'https://injegtmasters.com',
              },
              url: `https://injegtmasters.com/season/${nr.slug?.current ?? ''}`,
            }),
          }}
        />
      )}

      {/* SEO: 화면에 노출되지 않는 sr-only h1 (키비주얼 디자인 보존) */}
      <h1
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        인제 GT 마스터즈 2026 — 대한민국 정통 GT 내구레이스
      </h1>

      <SectionHero slides={activeSlides} />
      <SectionRound    rounds={rs} />
      <SectionClass classes={cs} />
      <SectionNews     posts={ps} />
      <SectionPartners partners={pt} />
    </>
  )
}
