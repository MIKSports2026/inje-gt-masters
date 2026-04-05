// components/layout/Footer.tsx — v3 dark footer
import Link from 'next/link'
import type { SiteSettings } from '@/types/sanity'

export default function Footer({ settings }: { settings: SiteSettings | null }) {
  const year = new Date().getFullYear()
  const season = settings?.currentSeason ?? 2026

  return (
    <footer style={{ background: '#050505', padding: '48px 0 36px', borderTop: '3px solid var(--red)', position: 'relative', zIndex: 1 }}>
      <div className="inner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px' }}>

        {/* 로고 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-white.png"
          alt="인제 GT 마스터즈"
          style={{ height: '44px', width: 'auto', objectFit: 'contain', opacity: 0.55 }}
        />

        {/* 소개 문구 */}
        <p style={{ fontSize: '14px', lineHeight: 1.9, color: 'rgba(255,255,255,0.28)', letterSpacing: '-0.01em', wordBreak: 'keep-all', maxWidth: '480px' }}>
          강원도 인제스피디움을 배경으로 펼쳐지는 아마추어 레이서들의 열정의 무대.<br />
          {season} 시즌도 더욱 뜨겁게 달립니다.
        </p>

        {/* 구분선 */}
        <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.1)' }} />

        {/* 카피라이트 */}
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.18)', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ color: 'var(--red)' }}>©</span>
          <span>{year} INJE GT MASTERS. All rights reserved.</span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span>운영 주체 : {settings?.circuitName ?? '인제스피디움'} / 인제군</span>
        </p>

      </div>
    </footer>
  )
}
