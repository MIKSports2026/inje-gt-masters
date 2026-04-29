// app/layout.tsx — 루트 레이아웃
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { sanityFetch }       from '@/lib/sanity.client'
import { SITE_SETTINGS_QUERY } from '@/lib/queries'
import type { SiteSettings }   from '@/types/sanity'
import { getSiteUrl }          from '@/lib/siteUrl'

// ── 기본 메타데이터 (Sanity 값으로 덮어씌워짐) ────────────────
export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default:  '인제 GT 마스터즈 | 공식 홈페이지',
    template: '%s | 인제 GT 마스터즈',
  },
  description:
    '인제스피디움에서 열리는 대한민국 정통 GT 내구레이스. 2026 시즌 일정·참가신청·결과를 확인하세요.',
  openGraph: {
    type:        'website',
    locale:      'ko_KR',
    url:         'https://www.injegtmasters.com',
    siteName:    '인제 GT 마스터즈',
    title:       '인제 GT 마스터즈 2026 | Inje GT Masters',
    description: '인제스피디움에서 열리는 대한민국 정통 GT 내구레이스. 2026 시즌 일정·참가신청·결과를 확인하세요.',
  },
  twitter: {
    card:        'summary_large_image',
    title:       '인제 GT 마스터즈 2026 | Inje GT Masters',
    description: '인제스피디움에서 열리는 대한민국 정통 GT 내구레이스. 2026 시즌 일정·참가신청·결과를 확인하세요.',
  },
  robots: {
    index:  true,
    follow: true,
  },
  verification: {
    other: {
      'naver-site-verification': 'cbb0fdca3a36e434bba6770e826efcc2a7657ed6',
    },
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
