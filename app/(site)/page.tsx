// app/(site)/page.tsx — 메인 페이지 (v3)
import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity.client'
import {
  SITE_SETTINGS_QUERY, ROUNDS_QUERY, CLASSES_QUERY,
  RECENT_POSTS_QUERY, FEATURED_MEDIA_QUERY, PARTNERS_QUERY, NEXT_ROUND_QUERY,
} from '@/lib/queries'
import type { SiteSettings, Round, ClassInfo, Post, Media, Partner } from '@/types/sanity'

import SectionHero       from '@/components/sections/SectionHero'
import SectionRound      from '@/components/sections/SectionRound'
import SectionClass      from '@/components/sections/SectionClass'
import SectionEntry      from '@/components/sections/SectionEntry'
import SectionNews       from '@/components/sections/SectionNews'
import SectionResults    from '@/components/sections/SectionResults'
import SectionMedia      from '@/components/sections/SectionMedia'
import SectionPartners   from '@/components/sections/SectionPartners'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SiteSettings>({
    query: SITE_SETTINGS_QUERY, revalidate: 60, useCdn: false,
  }).catch(() => null)
  if (!settings) return {}
  return {
    title:       settings.metaTitle,
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

  const [settings, rounds, nextRound, classes, posts, media, partners] =
    await Promise.all([
      sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY,  revalidate: 60, useCdn: false }),
      sanityFetch<Round[]>      ({ query: ROUNDS_QUERY,         params: { season: 2026 }, revalidate: 300 }),
      sanityFetch<Round | null> ({ query: NEXT_ROUND_QUERY,     params: { today },        revalidate: 300 }),
      sanityFetch<ClassInfo[]>  ({ query: CLASSES_QUERY,        revalidate: 3600 }),
      sanityFetch<Post[]>       ({ query: RECENT_POSTS_QUERY,   params: { limit: 5 },     revalidate: 300 }),
      sanityFetch<Media[]>      ({ query: FEATURED_MEDIA_QUERY, params: { limit: 5 },     revalidate: 300 }),
      sanityFetch<Partner[]>    ({ query: PARTNERS_QUERY,       params: { currentSeason: 2026 }, revalidate: 3600 }),
    ]).catch(() => [null, [], null, [], [], [], []] as const)

  const s  = settings as SiteSettings | null
  const rs = rounds   as Round[]
  const nr = nextRound as Round | null
  const cl = classes  as ClassInfo[]
  const ps = posts    as Post[]
  const md = media    as Media[]
  const pt = partners as Partner[]

  return (
    <>
      <SectionHero settings={s} nextRound={nr} rounds={rs} />
      <SectionRound    rounds={rs} />
      <SectionClass />
      <SectionEntry    settings={s} classes={cl} />
      <SectionNews     posts={ps} />
      <SectionResults  rounds={rs} posts={ps} />
      <SectionMedia    media={md} />
      <SectionPartners partners={pt} />
    </>
  )
}
