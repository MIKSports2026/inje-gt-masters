// app/(site)/page.tsx — 메인 페이지 (서버 컴포넌트)
import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity.client'
import {
  SITE_SETTINGS_QUERY,
  ROUNDS_QUERY,
  CLASSES_QUERY,
  RECENT_POSTS_QUERY,
  FEATURED_MEDIA_QUERY,
  PARTNERS_QUERY,
  HISTORY_QUERY,
  NEXT_ROUND_QUERY,
} from '@/lib/queries'
import type {
  SiteSettings, Round, ClassInfo,
  Post, Media, Partner, History,
} from '@/types/sanity'

// ── 섹션 컴포넌트 (Step 4에서 구현) ──────────────────────────
import SectionHero       from '@/components/sections/SectionHero'
import SectionQuickAccess from '@/components/sections/SectionQuickAccess'
import SectionAbout      from '@/components/sections/SectionAbout'
import SectionHistory    from '@/components/sections/SectionHistory'
import SectionSeason     from '@/components/sections/SectionSeason'
import SectionClasses    from '@/components/sections/SectionClasses'
import SectionEntry      from '@/components/sections/SectionEntry'
import SectionResults    from '@/components/sections/SectionResults'
import SectionMedia      from '@/components/sections/SectionMedia'
import SectionPartners   from '@/components/sections/SectionPartners'
import SectionSpeedium   from '@/components/sections/SectionSpeedium'

// ── 동적 메타데이터 ────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SiteSettings>({
    query:      SITE_SETTINGS_QUERY,
    revalidate: 3600,
  }).catch(() => null)

  if (!settings) return {}

  return {
    title:       settings.metaTitle,
    description: settings.metaDescription,
    openGraph: {
      title:       settings.metaTitle,
      description: settings.metaDescription,
      url:         settings.canonicalUrl,
      images:      settings.ogImage?.asset?.url
        ? [{ url: settings.ogImage.asset.url, width: 1200, height: 630 }]
        : [],
    },
    alternates: {
      canonical: settings.canonicalUrl,
    },
  }
}

// ── 메인 페이지 ────────────────────────────────────────────────
export default async function HomePage() {
  const today = new Date().toISOString().slice(0, 10)

  // 병렬 데이터 페치
  const [settings, rounds, nextRound, classes, posts, media, partners, history] =
    await Promise.all([
      sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY,   revalidate: 3600 }),
      sanityFetch<Round[]>      ({ query: ROUNDS_QUERY,          params: { season: 2026 }, revalidate: 300 }),
      sanityFetch<Round | null> ({ query: NEXT_ROUND_QUERY,      params: { today },        revalidate: 300 }),
      sanityFetch<ClassInfo[]>  ({ query: CLASSES_QUERY,         revalidate: 3600 }),
      sanityFetch<Post[]>       ({ query: RECENT_POSTS_QUERY,    params: { limit: 4 },     revalidate: 300 }),
      sanityFetch<Media[]>      ({ query: FEATURED_MEDIA_QUERY,  params: { limit: 3 },     revalidate: 300 }),
      sanityFetch<Partner[]>    ({ query: PARTNERS_QUERY,        params: { currentSeason: 2026 }, revalidate: 3600 }),
      sanityFetch<History[]>    ({ query: HISTORY_QUERY,         revalidate: 3600 }),
    ]).catch(() => [null, [], null, [], [], [], [], []] as const)

  return (
    <>
      {/* 1. Hero */}
      <SectionHero
        settings={settings as SiteSettings}
        nextRound={nextRound as Round | null}
        rounds={rounds as Round[]}
      />

      {/* 2. Quick Access */}
      <SectionQuickAccess settings={settings as SiteSettings} />

      {/* 3. About */}
      <SectionAbout />

      {/* 4. History */}
      <SectionHistory history={history as History[]} />

      {/* 5. Season */}
      <SectionSeason rounds={rounds as Round[]} />

      {/* 6. Classes */}
      <SectionClasses classes={classes as ClassInfo[]} />

      {/* 7. Entry */}
      <SectionEntry
        settings={settings as SiteSettings}
        classes={classes as ClassInfo[]}
      />

      {/* 8. Results */}
      <SectionResults rounds={rounds as Round[]} />

      {/* 9. Media */}
      <SectionMedia media={media as Media[]} posts={posts as Post[]} />

      {/* 10. Partners */}
      <SectionPartners partners={partners as Partner[]} />

      {/* 11. Speedium */}
      <SectionSpeedium settings={settings as SiteSettings} />
    </>
  )
}
