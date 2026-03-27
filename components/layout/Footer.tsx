'use client'
// components/layout/Footer.tsx — v3 dark footer
import Link from 'next/link'
import type { SiteSettings } from '@/types/sanity'

export default function Footer({ settings }: { settings: SiteSettings | null }) {
  const year = new Date().getFullYear()

  const cols = [
    { title: 'MASTERS', links: [{ label: '대회 소개', href: '/#about' }, { label: '클래스 소개', href: '/season#classes' }, { label: '후원사 소개', href: '/#partners' }, { label: '조직 안내', href: '/#about' }] },
    { title: 'SEASON',  links: [{ label: '경기 일정', href: '/season' }, { label: '관람 안내', href: '/season#info' }, { label: '경기 규정', href: '/season#regulations' }, { label: '오시는 길', href: '/#speedium' }] },
    { title: 'ENTRY',   links: [{ label: '참가 자격', href: '/entry#eligibility' }, { label: '온라인 신청', href: '/entry' }, { label: '팀·드라이버 등록', href: '/entry#registration' }, { label: 'FAQ', href: '/entry#faq' }] },
    { title: 'RESULTS', links: [{ label: '경기 결과', href: '/results' }, { label: '포인트 순위', href: '/results#standings' }, { label: '드라이버 기록', href: '/results#records' }] },
    { title: 'MEDIA',   links: [{ label: '공지사항', href: '/news' }, { label: '포토 갤러리', href: '/media' }, { label: '영상 하이라이트', href: '/media?type=video' }, { label: '보도자료', href: '/news?category=press' }] },
  ]

  const season = settings?.currentSeason ?? 2026

  return (
    <footer style={{ background: '#050505', padding: '60px 0 36px', borderTop: '3px solid var(--red)', position: 'relative', zIndex: 1 }}>
      <div className="inner">

        {/* ── 링크 그리드 ──────────────────────────────────── */}
        <div className="ft-grid" style={{
          display: 'grid',
          gridTemplateColumns: '2fr repeat(5, 1fr)',
          gap: '28px',
          marginBottom: '44px',
          paddingBottom: '40px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          {/* 브랜드 열 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '44px', height: '44px', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
                <div style={{ flex: 1.7, background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue',sans-serif", fontSize: '19px', letterSpacing: '1.5px', color: 'white' }}>GTM</div>
                <div style={{ flex: 1, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '15.5px', fontWeight: 800, letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const }}>{season}</div>
              </div>
              <div>
                <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '21px', letterSpacing: '4px', color: 'white', display: 'block', lineHeight: 1.05 }}>GT MASTERS</span>
                <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' as const, display: 'block', marginTop: '1px' }}>{settings?.siteName ?? '인제 GT 마스터즈'}</span>
              </div>
            </div>
            <p style={{ fontSize: '15px', lineHeight: 1.9, color: 'rgba(255,255,255,0.32)', maxWidth: '260px', marginBottom: '20px', letterSpacing: '-0.01em', wordBreak: 'keep-all' }}>
              강원도 인제스피디움을 배경으로 펼쳐지는 아마추어 레이서들의 열정의 무대. {season} 시즌도 더욱 뜨겁게 달립니다.
            </p>
            <div style={{ display: 'flex', gap: '7px' }}>
              {settings?.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" style={{ width: '34px', height: '34px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                ><i className="fab fa-youtube" /></a>
              )}
              {settings?.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ width: '34px', height: '34px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                ><i className="fab fa-instagram" /></a>
              )}
              {settings?.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ width: '34px', height: '34px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                ><i className="fab fa-facebook-f" /></a>
              )}
              {settings?.kakaoChannelUrl && (
                <a href={settings.kakaoChannelUrl} target="_blank" rel="noopener noreferrer" aria-label="KakaoTalk" style={{ width: '34px', height: '34px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                ><i className="fas fa-comment" /></a>
              )}
            </div>
          </div>

          {/* 링크 열들 */}
          {cols.map((col) => (
            <div key={col.title}>
              <div style={{
                fontFamily: "'Barlow Condensed',sans-serif",
                fontSize: '16.5px', fontWeight: 800, letterSpacing: '3px',
                textTransform: 'uppercase' as const,
                color: 'rgba(255,255,255,0.85)',
                marginBottom: '16px', paddingBottom: '12px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}>
                {col.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {col.links.map((link) => (
                  <Link key={link.label} href={link.href} style={{
                    fontSize: '15px', color: 'rgba(255,255,255,0.32)', textDecoration: 'none', transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.85)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.32)'; }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── 하단 ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.2)', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--red)' }}>©</span>
            <span>{year} INJE GT MASTERS. All rights reserved.</span>
            <span>|</span>
            <span>운영 주체 : {settings?.circuitName ?? '인제스피디움'} / 인제군</span>
          </p>
          <div style={{ display: 'flex', gap: '18px' }}>
            {[{ label: '이용약관', href: '#' }, { label: '개인정보처리방침', href: '#' }].map((l) => (
              <Link key={l.label} href={l.href} style={{ fontSize: '15px', color: 'rgba(255,255,255,0.25)', textDecoration: 'none', transition: 'color 0.2s' }}
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
