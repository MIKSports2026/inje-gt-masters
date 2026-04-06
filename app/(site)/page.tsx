// app/(site)/page.tsx — 메인 페이지 (v3)
import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity.client'
import {
  SITE_SETTINGS_QUERY, ROUNDS_QUERY,
  RECENT_POSTS_QUERY, PARTNERS_QUERY, NEXT_ROUND_QUERY, CLASSES_QUERY,
} from '@/lib/queries'
import type { SiteSettings, Round, Post, Partner, ClassInfo } from '@/types/sanity'

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

  return (
    <>
      <SectionHero settings={s} nextRound={nr} rounds={rs} />
      <SectionRound    rounds={rs} />
      <SectionClass classes={cs} />
      <SectionNews     posts={ps} />
      <SectionPartners partners={pt} />
    </>
  )
}
