// app/(site)/layout.tsx — 공개 사이트 레이아웃
// GNB + Footer 가 여기서 렌더됩니다.
import '@/app/globals.css'

import GNB    from '@/components/layout/GNB'
import Footer from '@/components/layout/Footer'
import { sanityFetch }         from '@/lib/sanity.client'
import { SITE_SETTINGS_QUERY } from '@/lib/queries'
import type { SiteSettings }   from '@/types/sanity'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await sanityFetch<SiteSettings>({
    query:      SITE_SETTINGS_QUERY,
    revalidate: 3600,
  }).catch(() => null)

  return (
    <>
      <GNB settings={settings} />
      <main id="top">{children}</main>
      <Footer settings={settings} />
    </>
  )
}
