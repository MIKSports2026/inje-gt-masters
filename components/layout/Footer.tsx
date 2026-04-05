// components/layout/Footer.tsx — v3 dark footer
import Link from 'next/link'
import type { SiteSettings } from '@/types/sanity'

export default function Footer({ settings }: { settings: SiteSettings | null }) {
  const year = new Date().getFullYear()
  const season = settings?.currentSeason ?? 2026

  return (
    <footer style={{ background: '#050505', padding: '48px 0 36px', borderTop: '3px solid var(--red)', position: 'relative', zIndex: 1 }}>
      <div className="inner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

        {/* 전체 덩어리 — 가운데 정렬 */}
        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>

          {/* 로고 */}
          <div style={{ flexShrink: 0, paddingTop: '4px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-white.png"
              alt="인제 GT 마스터즈"
              style={{ height: '44px', width: 'auto', objectFit: 'contain', opacity: 0.55, display: 'block' }}
            />
          </div>

          {/* 세로 구분선 */}
          <div style={{ width: '1px', alignSelf: 'stretch', minHeight: '56px', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

          {/* 홍보문구 + 카피라이트 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontSize: '14px', lineHeight: 1.9, color: 'rgba(255,255,255,0.28)', letterSpacing: '-0.01em', wordBreak: 'keep-all' }}>
              강원도 인제스피디움을 배경으로 펼쳐지는 아마추어 레이서들의 열정의 무대.<br />
              {season} 시즌도 더욱 뜨겁게 달립니다.
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.18)', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--red)' }}>©</span>
              <span>{year} INJE GT MASTERS. All rights reserved.</span>
              <span style={{ opacity: 0.4 }}>|</span>
              <span>운영 주체 : {settings?.circuitName ?? '인제스피디움'} / 인제군</span>
            </p>
          </div>

        </div>
      </div>
    </footer>
  )
}
