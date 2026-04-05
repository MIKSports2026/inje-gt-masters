// app/(site)/layout.tsx — 공개 사이트 레이아웃
// GNB + Footer 가 여기서 렌더됩니다.
// GNB는 Step 3에서 완성합니다.

import GNB    from '@/components/layout/GNB'
import Footer from '@/components/layout/Footer'
import { sanityFetch }                          from '@/lib/sanity.client'
import { SITE_SETTINGS_QUERY, GALLERY_COUNT_QUERY } from '@/lib/queries'
import type { SiteSettings }                    from '@/types/sanity'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [settings, galleryCount] = await Promise.all([
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, revalidate: 3600 }),
    sanityFetch<number>({ query: GALLERY_COUNT_QUERY, revalidate: 3600 }),
  ]).catch(() => [null, 0] as [SiteSettings | null, number])

  const hasGallery = typeof galleryCount === 'number' && galleryCount > 0

  return (
    <>
      <GNB settings={settings} hasGallery={hasGallery} />
      <main id="top" style={{ paddingTop: 'var(--header-h)' }}>{children}</main>
      <Footer settings={settings} />
    </>
  )
}
