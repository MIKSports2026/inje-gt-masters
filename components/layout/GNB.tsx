// components/layout/GNB.tsx — v3 Light Theme
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { SiteSettings } from '@/types/sanity'

const NAV_ITEMS = [
  {
    label: 'MASTERS',
    href: '/#about',
    drop: [
      { label: '대회 소개', href: '/#about' },
      { label: '클래스 소개', href: '/season#classes' },
      { label: '후원사 소개', href: '/#partners' },
    ],
  },
  {
    label: 'SEASON',
    href: '/season',
    drop: [
      { label: '경기 일정', href: '/season' },
      { label: 'R1 개막전', href: '/season/2026-r1' },
      { label: 'R2 서머', href: '/season/2026-r2' },
      { label: 'R3 나이트레이스', href: '/season/2026-r3' },
      { label: 'R4 파이널', href: '/season/2026-r4' },
    ],
  },
  {
    label: 'ENTRY',
    href: '/entry',
    drop: [
      { label: '참가 자격·규정', href: '/entry#eligibility' },
      { label: '온라인 신청', href: '/entry' },
      { label: '팀·드라이버 등록', href: '/entry#registration' },
    ],
  },
  {
    label: 'RESULTS',
    href: '/results',
    drop: [
      { label: '경기 결과', href: '/results' },
      { label: '포인트 순위', href: '/results#standings' },
      { label: '드라이버 기록', href: '/results#records' },
    ],
  },
  {
    label: 'MEDIA',
    href: '/media',
    drop: [
      { label: '공지사항', href: '/news' },
      { label: '포토 갤러리', href: '/media' },
      { label: '영상 하이라이트', href: '/media?type=video' },
    ],
  },
] as const

export default function GNB({ settings }: { settings: SiteSettings | null }) {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [openDrop,    setOpenDrop]    = useState<number | null>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const siteName = settings?.siteName ?? '인제 GT 마스터즈'
  const season   = settings?.currentSeason ?? 2026

  return (
    <>
      {/* ── TOP BAR ─────────────────────────────────────────── */}
      <div style={{
        background: 'rgba(5,5,5,0.96)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        height: '36px',
        position: 'relative',
        zIndex: 200,
      }}>
        <div className="inner" style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '16.5px',
            fontWeight: 600,
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{ color: 'var(--red)' }}>INJE GT MASTERS</span>
            <span>|</span>
            <span>강원도 인제스피디움 · 3.9KM</span>
            <span>|</span>
            <span>{season} 시즌 참가 접수 중</span>
          </div>
          <div style={{ display: 'flex' }}>
            {[
              { label: '공지사항', href: '/news' },
              { label: '참가문의', href: '/entry' },
            ].map((item) => (
              <Link key={item.label} href={item.href} style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '16.5px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase' as const,
                color: 'rgba(255,255,255,0.35)',
                padding: '0 14px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                borderLeft: '1px solid rgba(255,255,255,0.06)',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── GNB ─────────────────────────────────────────────── */}
      <div
        id="gnav"
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 500,
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--pad)',
          background: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.92)',
          borderBottom: '1px solid var(--line)',
          backdropFilter: 'blur(16px)',
          boxShadow: scrolled ? 'var(--sh-md)' : 'none',
          transition: 'background 0.3s, box-shadow 0.3s',
        }}
      >
        {/* 로고 */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} aria-label="인제 GT 마스터즈 홈">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="인제 GT 마스터즈" style={{ height: '48px', width: 'auto', objectFit: 'contain', display: 'block' }} />
        </Link>

        {/* 데스크톱 GNB */}
        <nav style={{ display: 'flex', alignItems: 'center' }} aria-label="주 메뉴" className="gnb-desktop">
          {NAV_ITEMS.map((item, i) => (
            <div
              key={i}
              style={{ position: 'relative', height: '68px', display: 'flex', alignItems: 'center' }}
              onMouseEnter={() => setOpenDrop(i)}
              onMouseLeave={() => setOpenDrop(null)}
            >
              <Link href={item.href} style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '19px',
                fontWeight: 700,
                letterSpacing: '2.5px',
                textTransform: 'uppercase' as const,
                textDecoration: 'none',
                color: 'var(--text-sub)',
                padding: '0 18px',
                height: '68px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                borderBottom: openDrop === i ? '2px solid var(--red)' : '2px solid transparent',
                marginBottom: '-1px',
                transition: 'color 0.2s, border-color 0.2s',
              }}>
                {item.label}
                <span style={{ fontSize: '11px', opacity: 0.4 }}>▼</span>
              </Link>

              {/* 드롭다운 */}
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 1px)',
                left: '50%',
                transform: openDrop === i ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-6px)',
                background: '#ffffff',
                border: '1px solid var(--line)',
                borderTop: '2px solid var(--red)',
                boxShadow: 'var(--sh-lg)',
                minWidth: '172px',
                padding: '6px 0',
                opacity: openDrop === i ? 1 : 0,
                visibility: openDrop === i ? 'visible' : 'hidden',
                pointerEvents: openDrop === i ? 'auto' : 'none',
                transition: 'opacity 0.2s, transform 0.2s, visibility 0.2s',
                zIndex: 600,
              }}>
                {item.drop.map((d, j) => (
                  <Link key={j} href={d.href} style={{
                    display: 'block',
                    fontSize: '16.5px',
                    fontWeight: 500,
                    color: 'var(--text-mid)',
                    textDecoration: 'none',
                    padding: '11px 20px',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-pale)'; e.currentTarget.style.color = 'var(--red)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-mid)'; }}
                  >
                    {d.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* 우측 액션 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/results" style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '18px', fontWeight: 800, letterSpacing: '2.5px',
            textTransform: 'uppercase' as const,
            textDecoration: 'none',
            color: 'var(--navy)',
            border: '1.5px solid var(--navy)',
            padding: '9px 22px',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--navy)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--navy)'; }}
            className="hidden-mobile"
          >
            경기 결과
          </Link>
          <Link href="/entry" style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '18px', fontWeight: 800, letterSpacing: '2.5px',
            textTransform: 'uppercase' as const,
            textDecoration: 'none',
            color: 'white',
            background: 'var(--red)',
            border: '1.5px solid var(--red)',
            padding: '9px 22px',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-dark)'; e.currentTarget.style.borderColor = 'var(--red-dark)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--red)'; e.currentTarget.style.borderColor = 'var(--red)'; }}
            className="hidden-mobile"
          >
            <i className="fa fa-flag-checkered" style={{ fontSize: '15px' }} />
            참가 신청
          </Link>

          {/* 햄버거 */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            aria-expanded={mobileOpen}
            aria-label="메뉴 열기"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              flexDirection: 'column' as const,
              gap: '5px',
              padding: '4px',
            }}
            className="show-mobile"
          >
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: 'block', width: '24px', height: '2px',
                background: 'var(--text)',
                transition: 'all 0.3s',
                transform: mobileOpen
                  ? i === 0 ? 'rotate(45deg) translate(5px,5px)'
                  : i === 1 ? 'scaleX(0)'
                  : 'rotate(-45deg) translate(5px,-5px)'
                  : 'none',
                opacity: mobileOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </div>

      {/* ── 모바일 메뉴 ─────────────────────────────────────── */}
      <div style={{
        display: mobileOpen ? 'flex' : 'none',
        position: 'fixed',
        top: '68px',
        left: 0, right: 0, bottom: 0,
        background: '#ffffff',
        zIndex: 450,
        padding: '24px var(--pad)',
        flexDirection: 'column' as const,
        overflowY: 'auto',
      }}>
        {NAV_ITEMS.map((item, i) => (
          <div key={i} style={{ borderBottom: '1px solid var(--line)', padding: '16px 0' }}>
            <Link href={item.href} onClick={() => setMobileOpen(false)} style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '22px', letterSpacing: '3px', textTransform: 'uppercase' as const,
              color: 'var(--text)', textDecoration: 'none', display: 'block',
              marginBottom: '10px',
            }}>
              {item.label}
            </Link>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', paddingLeft: '12px' }}>
              {item.drop.map((d, j) => (
                <Link key={j} href={d.href} onClick={() => setMobileOpen(false)} style={{
                  fontSize: '19px', color: 'var(--text-sub)', textDecoration: 'none', transition: 'color 0.2s',
                }}>
                  {d.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <Link href="/results" onClick={() => setMobileOpen(false)} style={{
            flex: 1, textAlign: 'center' as const,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '18px', fontWeight: 800, letterSpacing: '2.5px',
            textTransform: 'uppercase' as const,
            textDecoration: 'none',
            color: 'var(--navy)',
            border: '1.5px solid var(--navy)',
            padding: '12px',
          }}>
            경기 결과
          </Link>
          <Link href="/entry" onClick={() => setMobileOpen(false)} style={{
            flex: 1, textAlign: 'center' as const,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '18px', fontWeight: 800, letterSpacing: '2.5px',
            textTransform: 'uppercase' as const,
            textDecoration: 'none',
            color: 'white',
            background: 'var(--red)',
            padding: '12px',
          }}>
            참가 신청
          </Link>
        </div>
      </div>

    </>
  )
}
