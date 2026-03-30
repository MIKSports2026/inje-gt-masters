// app/layout.tsx — 루트 레이아웃 (최소화 — Studio 호환)
import type { Metadata, Viewport } from 'next'

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
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  themeColor:   '#e60023',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
      </head>
      <body>{children}</body>
    </html>
  )
}
