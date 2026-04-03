// components/layout/GNB.tsx — v4 Cinematic GNB
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { SiteSettings } from '@/types/sanity'

const NAV_ITEMS = [
  {
    label: 'MASTERS',
    href: '/masters/about',
    drop: [
      { label: '대회 소개', href: '/masters/about' },
      { label: '마스터즈 히스토리', href: '/masters/history' },
      { label: '역대 챔피언', href: '/masters/champions' },
      { label: '운영 조직도', href: '/masters/organization' },
    ],
  },
  {
    label: 'SEASON',
    href: '/season',
    drop: [
      { label: '경기 일정 / 클래스 소개', href: '/season' },
      { label: '규정', href: '/season/rules' },
      { label: '인제스피디움', href: '/circuit' },
    ],
  },
  {
    label: 'ENTRY',
    href: '/entry',
    drop: [
      { label: '참가 신청', href: '/entry' },
      { label: '클래스 소개', href: '/entry/classes' },
    ],
  },
  {
    label: 'RESULTS',
    href: '/results',
    drop: [
      { label: '경기 결과', href: '/results' },
      { label: '포인트 순위', href: '/results/standing' },
    ],
  },
  {
    label: 'MEDIA',
    href: '/media/notice',
    drop: [
      { label: '공지사항', href: '/media/notice' },
      { label: '보도자료', href: '/media/press' },
      { label: '미디어킷', href: '/media/kit' },
      { label: '영상', href: '/media/video' },
    ],
  },
] as const

export default function GNB({ settings }: { settings: SiteSettings | null }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDrop, setOpenDrop] = useState<number | null>(null)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header
        id="gnav"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 100,
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,.70), rgba(0,0,0,.28))',
          backdropFilter: 'blur(7px)',
          WebkitBackdropFilter: 'blur(7px)',
        }}
      >
        {/* 로고 */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }} aria-label="홈">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-white.jpg" alt="인제 GT 마스터즈" className="gnb-logo" style={{ height: '80px', width: 'auto', objectFit: 'contain', display: 'block' }} />
        </Link>

        {/* 데스크톱 메뉴 */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} aria-label="주 메뉴" className="gnb-desktop">
          {NAV_ITEMS.map((item, i) => (
            <div
              key={i}
              style={{ position: 'relative' }}
              onMouseEnter={() => setOpenDrop(i)}
              onMouseLeave={() => setOpenDrop(null)}
            >
              <Link href={item.href} className="gnb-link" style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '.08em',
                textTransform: 'uppercase' as const,
                textDecoration: 'none',
                color: 'rgba(255,255,255,.78)',
                transition: 'color .2s',
                position: 'relative',
                paddingBottom: '7px',
              }}>
                {item.label}
                <span className="gnb-link-bar" style={{
                  position: 'absolute',
                  left: 0,
                  bottom: '-7px',
                  height: '1px',
                  background: '#c81921',
                  width: openDrop === i ? '100%' : '0%',
                  transition: 'width .28s ease',
                }} />
              </Link>

              {/* 서브메뉴 */}
              <div style={{
                position: 'absolute',
                top: '27px',
                left: 0,
                display: 'flex',
                flexDirection: 'column',
                opacity: openDrop === i ? 1 : 0,
                transform: openDrop === i ? 'translateY(0)' : 'translateY(6px)',
                pointerEvents: openDrop === i ? 'auto' : 'none',
                transition: 'opacity .22s, transform .22s',
                paddingTop: '7px',
              }}>
                {item.drop.map((d, j) => (
                  <Link key={j} href={d.href} style={{
                    fontFamily: "'Noto Sans KR', sans-serif",
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,.34)',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    marginTop: j > 0 ? '7px' : 0,
                    transition: 'color .18s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,.72)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.34)' }}
                  >
                    {d.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

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
          {[0, 1, 2].map(k => (
            <span key={k} style={{
              display: 'block', width: '22px', height: '1.5px',
              background: 'rgba(255,255,255,.85)',
              transition: 'all 0.3s',
              transform: mobileOpen
                ? k === 0 ? 'rotate(45deg) translate(5px,5px)'
                : k === 1 ? 'scaleX(0)'
                : 'rotate(-45deg) translate(5px,-5px)'
                : 'none',
              opacity: mobileOpen && k === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </header>

      {/* 모바일 메뉴 */}
      <div style={{
        display: mobileOpen ? 'flex' : 'none',
        position: 'fixed',
        top: '70px',
        left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,.95)',
        backdropFilter: 'blur(12px)',
        zIndex: 99,
        padding: '24px 20px',
        flexDirection: 'column' as const,
        overflowY: 'auto',
      }}>
        {NAV_ITEMS.map((item, i) => (
          <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,.08)', padding: '16px 0' }}>
            <Link href={item.href} onClick={() => setMobileOpen(false)} style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: '16px', fontWeight: 500, letterSpacing: '.08em',
              textTransform: 'uppercase' as const,
              color: 'rgba(255,255,255,.85)', textDecoration: 'none', display: 'block',
              marginBottom: '8px',
            }}>
              {item.label}
            </Link>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px', paddingLeft: '12px' }}>
              {item.drop.map((d, j) => (
                <Link key={j} href={d.href} onClick={() => setMobileOpen(false)} style={{
                  fontFamily: "'Noto Sans KR', sans-serif",
                  fontSize: '12px', color: 'rgba(255,255,255,.4)', textDecoration: 'none',
                }}>
                  {d.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #gnav { height: 70px !important; padding: 0 18px !important; }
          .gnb-logo { height: 68px !important; }
        }
        .gnb-link:hover { color: #fff !important; }
      `}</style>
    </>
  )
}
