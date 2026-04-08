// app/(site)/classes/page.tsx — 클래스 안내 (서버 컴포넌트)
import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity.client'
import { SITE_SETTINGS_QUERY } from '@/lib/queries'
import type { SiteSettings } from '@/types/sanity'
import PageHero from '@/components/ui/PageHero'
import ClassesTabs from './ClassesTabs'

export const metadata: Metadata = {
  title: '클래스 안내 | 인제 GT 마스터즈',
  description: '인제 GT 마스터즈 2026 시즌 참가 클래스별 차량 규정, 참가 자격, 참가비 안내.',
}

const CLASSES_PAGE_QUERY = /* groq */`
  *[_type == "classInfo" && !(_id in path("drafts.**"))] | order(order asc){
    _id, name, order, slug,
    entryFeePerRound, entryFeePerSeason,
    eligibility, tireSpec, minWeight, safetySpec, tuningRange, features,
    "imageUrl": cardImage.asset->url
  }
`

export interface ClassPageData {
  _id:               string
  name:              string
  order:             number
  slug:              { current: string }
  entryFeePerRound?: number
  entryFeePerSeason?: number
  eligibility?:      any
  tireSpec?:         string
  minWeight?:        string
  safetySpec?:       string
  tuningRange?:      string
  features?:         Array<{ icon?: string; label: string; value: string }>
  imageUrl?:         string
}

export default async function ClassesPage() {
  const [settings, classes] = await Promise.all([
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY }),
    sanityFetch<ClassPageData[]>({ query: CLASSES_PAGE_QUERY, revalidate: 3600 }),
  ]).catch(() => [null, []] as [SiteSettings | null, ClassPageData[]])

  return (
    <>
      <PageHero
        image={(settings as SiteSettings | null)?.heroSeason}
        badge="SEASON 2026"
        title="CLASS GUIDE"
        subtitle="참가 클래스별 차량 규정 및 참가비 안내"
      />
      <ClassesTabs classes={classes as ClassPageData[]} />
    </>
  )
}
