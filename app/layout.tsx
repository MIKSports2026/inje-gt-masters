// app/layout.tsx — 루트 레이아웃
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { sanityFetch }       from '@/lib/sanity.client'
import { SITE_SETTINGS_QUERY } from '@/lib/queries'
import type { SiteSettings }   from '@/types/sanity'

// ── 기본 메타데이터 (Sanity 값으로 덮어씌워짐) ────────────────
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.masters-series.kr'
  ),
  title: {
    default:  '인제 GT 마스터즈 2026 — 공식 홈페이지 | Inje GT Masters',
    template: '%s | 인제 GT 마스터즈',
  },
  description:
    '대한민국 정통 GT 내구레이스, 인제 GT 마스터즈. 강원도 인제스피디움 3.9km 서킷, 2026 시즌 연간 4라운드.',
  openGraph: {
    type:   'website',
    locale: 'ko_KR',
    url:    'https://www.masters-series.kr',
    siteName: '인제 GT 마스터즈',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index:  true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  themeColor:   '#e60023',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Sanity에서 사이트 설정 로드 (1시간 캐시)
  const settings = await sanityFetch<SiteSettings>({
    query:      SITE_SETTINGS_QUERY,
    revalidate: 3600,
  }).catch(() => null)

  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
