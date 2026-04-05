// components/layout/Footer.tsx — v3 dark footer
import Link from 'next/link'
import type { SiteSettings } from '@/types/sanity'

export default function Footer({ settings }: { settings: SiteSettings | null }) {
  const year = new Date().getFullYear()
  const season = settings?.currentSeason ?? 2026

  return (
    <footer style={{ background: '#050505', padding: '48px 0 32px', borderTop: '3px solid var(--red)', position: 'relative', zIndex: 1 }}>
      <div className="inner">

        {/* ── 메인 영역 ─────────────────────────────────── */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          marginBottom: '36px',
          paddingBottom: '32px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          {/* 로고 + 문구 */}
          <div>
            <div style={{ marginBottom: '14px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-white.png" alt="인제 GT 마스터즈" style={{ height: '48px', width: 'auto', objectFit: 'contain', display: 'block' }} />
            </div>
            <p style={{ fontSize: '15px', lineHeight: 1.9, color: 'rgba(255,255,255,0.32)', maxWidth: '320px', letterSpacing: '-0.01em', wordBreak: 'keep-all' }}>
              강원도 인제스피디움을 배경으로 펼쳐지는 아마추어 레이서들의 열정의 무대.<br />
              {season} 시즌도 더욱 뜨겁게 달립니다.
            </p>
          </div>

          {/* SNS 아이콘 */}
          <div style={{ display: 'flex', gap: '7px', paddingTop: '4px' }}>
            {settings?.youtube && (
              <a href={settings.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                style={{ width: '34px', height: '34px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
              ><i className="fab fa-youtube" /></a>
            )}
            {settings?.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                style={{ width: '34px', height: '34px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
              ><i className="fab fa-instagram" /></a>
            )}
            {settings?.facebook && (
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                style={{ width: '34px', height: '34px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
              ><i className="fab fa-facebook-f" /></a>
            )}
            {settings?.kakaoChannelUrl && (
              <a href={settings.kakaoChannelUrl} target="_blank" rel="noopener noreferrer" aria-label="KakaoTalk"
                style={{ width: '34px', height: '34px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
              ><i className="fas fa-comment" /></a>
            )}
          </div>
        </div>

        {/* ── 하단 copyright ───────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.2)', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--red)' }}>©</span>
            <span>{year} INJE GT MASTERS. All rights reserved.</span>
            <span>|</span>
            <span>운영 주체 : {settings?.circuitName ?? '인제스피디움'} / 인제군</span>
          </p>
          <div style={{ display: 'flex', gap: '18px' }}>
            {[{ label: '이용약관', href: '#' }, { label: '개인정보처리방침', href: '#' }].map((l) => (
              <Link key={l.label} href={l.href}
                style={{ fontSize: '15px', color: 'rgba(255,255,255,0.25)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.8)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.25)'; }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
