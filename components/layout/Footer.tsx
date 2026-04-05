'use client'
// components/layout/Footer.tsx — v3 dark footer
import Link from 'next/link'
import type { SiteSettings } from '@/types/sanity'

export default function Footer({ settings }: { settings: SiteSettings | null }) {
  const year = new Date().getFullYear()
  const season = settings?.currentSeason ?? 2026

  return (
    <footer style={{ background: '#050505', padding: '48px 0 32px', borderTop: '3px solid var(--red)', position: 'relative', zIndex: 1 }}>
      <div className="inner">

        {/* ── 메인 영역: 로고 | 문구+카피라이트 ── */}
        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>

          {/* 로고 */}
          <div style={{ flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-white.png" alt="인제 GT 마스터즈"
              style={{ height: '48px', width: 'auto', objectFit: 'contain', display: 'block' }} />
          </div>

          {/* 세로 구분선 */}
          <div style={{ width: '1px', alignSelf: 'stretch', minHeight: '60px', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

          {/* 우측: 문구 + 카피라이트 + 링크 */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '15px', lineHeight: 1.9, color: 'rgba(255,255,255,0.32)', marginBottom: '16px', letterSpacing: '-0.01em', wordBreak: 'keep-all' }}>
              강원도 인제스피디움을 배경으로 펼쳐지는 아마추어 레이서들의 열정의 무대.<br />
              {season} 시즌도 더욱 뜨겁게 달립니다.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.2)', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--red)' }}>©</span>
                <span>{year} INJE GT MASTERS. All rights reserved.</span>
                <span>|</span>
                <span>운영 주체 : {settings?.circuitName ?? '인제스피디움'} / 인제군</span>
              </p>
              <div style={{ display: 'flex', gap: '18px' }}>
                {[{ label: '이용약관', href: '#' }, { label: '개인정보처리방침', href: '#' }].map((l) => (
                  <Link key={l.label} href={l.href}
                    style={{ fontSize: '14px', color: 'rgba(255,255,255,0.25)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.8)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.25)'; }}
                  >{l.label}</Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}
