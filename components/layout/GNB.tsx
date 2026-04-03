// components/layout/GNB.tsx — v5 Carbon GNB
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { SiteSettings } from '@/types/sanity'

const NAV_ITEMS = [
  {
    label: 'MASTERS',
    href: '/about',
    drop: [
      { label: '대회 소개', href: '/about' },
      { label: '마스터즈 히스토리', href: '/history' },
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
    href: '/media',
    drop: [
      { label: '공지사항', href: '/media' },
      { label: '보도자료', href: '/media/press' },
      { label: '미디어킷', href: '/media/kit' },
      { label: '영상', href: '/media/video' },
    ],
  },
] as const

export default function GNB({ settings }: { settings: SiteSettings | null }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDrop, setOpenDrop] = useState<number | null>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header id="gnav" className={`gnav ${scrolled ? 'gnav--scrolled' : ''}`}>
        <div className="gnav__inner">
          {/* 로고 */}
          <Link href="/" className="gnav__logo-link" aria-label="홈">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-white.png"
              alt="INJE GT MASTERS"
              className="gnav__logo"
            />
          </Link>

          {/* 데스크톱 메뉴 */}
          <nav className="gnav__nav gnb-desktop" aria-label="주 메뉴">
            {NAV_ITEMS.map((item, i) => (
              <div
                key={i}
                className="gnav__item"
                onMouseEnter={() => setOpenDrop(i)}
                onMouseLeave={() => setOpenDrop(null)}
              >
                <Link href={item.href} className="gnav__link">
                  {item.label}
                  <span className="gnav__link-bar" />
                </Link>

                {/* 서브메뉴 패널 */}
                <div className={`gnav__drop ${openDrop === i ? 'gnav__drop--open' : ''}`}>
                  {item.drop.map((d, j) => (
                    <Link key={j} href={d.href} className="gnav__drop-link">
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
            className={`gnav__burger show-mobile ${mobileOpen ? 'gnav__burger--open' : ''}`}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* 모바일 풀스크린 메뉴 */}
      <div className={`gnav__mobile ${mobileOpen ? 'gnav__mobile--open' : ''}`}>
        {NAV_ITEMS.map((item, i) => (
          <div key={i} className="gnav__mobile-group">
            <Link href={item.href} onClick={() => setMobileOpen(false)} className="gnav__mobile-title">
              {item.label}
            </Link>
            <div className="gnav__mobile-subs">
              {item.drop.map((d, j) => (
                <Link key={j} href={d.href} onClick={() => setMobileOpen(false)} className="gnav__mobile-sub">
                  {d.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        /* ── GNB Base ─────────────────────────── */
        .gnav {
          position: fixed; top: 0; left: 0; width: 100%;
          z-index: 1000;
          background: transparent;
          transition: all .32s ease;
        }
        .gnav--scrolled {
          background: #0a0a0a;
          border-bottom: 2px solid rgba(255,255,255,.05);
          box-shadow: 0 5px 0 rgba(230,0,35,.1);
        }
        .gnav__inner {
          max-width: 1400px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px 40px;
          transition: padding .32s ease;
        }
        .gnav--scrolled .gnav__inner { padding: 16px 40px; }

        /* ── Logo ────────────────────────────── */
        .gnav__logo-link { display: flex; align-items: center; text-decoration: none; flex-shrink: 0; }
        .gnav__logo {
          height: 96px; width: auto;
          object-fit: contain;
          background: transparent;
          border: none;
          padding: 0;
          display: block;
        }

        /* ── Nav Links ───────────────────────── */
        .gnav__nav { display: flex; align-items: center; gap: 36px; }
        .gnav__item { position: relative; }
        .gnav__link {
          font-family: 'Oswald', sans-serif;
          font-size: 1.2rem; font-weight: 700;
          letter-spacing: .06em;
          text-transform: uppercase;
          text-decoration: none;
          color: #CCCCCC;
          transform: scaleY(1.1) skewX(-2deg);
          display: inline-block;
          position: relative;
          padding-bottom: 6px;
          transition: color .2s;
        }
        .gnav__link:hover { color: #FFFFFF; }
        .gnav__link-bar {
          position: absolute; left: 0; bottom: 0;
          width: 100%; height: 2px;
          background: #E60023;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .25s ease;
        }
        .gnav__link:hover .gnav__link-bar { transform: scaleX(1); }

        /* ── Dropdown ────────────────────────── */
        .gnav__drop {
          position: absolute; top: 100%; left: -12px;
          min-width: 200px;
          background: #0A0A0A;
          border-top: 3px solid #E60023;
          border-bottom: 1px solid rgba(255,255,255,.1);
          box-shadow: 10px 10px 0 rgba(0,0,0,.8);
          padding: 8px 0;
          opacity: 0; visibility: hidden;
          transform: translateY(8px);
          transition: opacity .22s ease, transform .22s ease, visibility .22s;
          z-index: 1100;
        }
        .gnav__drop--open {
          opacity: 1; visibility: visible;
          transform: translateY(0);
        }
        .gnav__drop-link {
          display: block;
          font-family: 'Noto Sans KR', sans-serif;
          font-size: .82rem; font-weight: 500;
          color: rgba(255,255,255,.55);
          text-decoration: none;
          padding: 12px 20px;
          border-left: 2px solid transparent;
          transition: all .18s ease;
          white-space: nowrap;
        }
        .gnav__drop-link:hover {
          color: #fff;
          border-left-color: #E60023;
          padding-left: 26px;
          background: rgba(230,0,35,.06);
        }

        /* ── Hamburger ───────────────────────── */
        .gnav__burger {
          display: none; background: none; border: none;
          cursor: pointer; padding: 6px;
          flex-direction: column; gap: 5px;
        }
        .gnav__burger span {
          display: block; width: 24px; height: 2px;
          background: rgba(255,255,255,.85);
          transition: all .3s ease;
          transform-origin: center;
        }
        .gnav__burger--open span { background: #E60023; }
        .gnav__burger--open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .gnav__burger--open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .gnav__burger--open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

        /* ── Mobile Menu ─────────────────────── */
        .gnav__mobile {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: 100%; max-width: 380px;
          background: rgba(10,10,10,.98);
          backdrop-filter: blur(16px);
          z-index: 999;
          padding: 100px 28px 40px;
          overflow-y: auto;
          transform: translateX(100%);
          transition: transform .35s cubic-bezier(.4,0,.2,1);
        }
        .gnav__mobile--open { transform: translateX(0); }
        .gnav__mobile-group {
          padding: 18px 0;
          border-bottom: 1px solid rgba(255,255,255,.06);
        }
        .gnav__mobile-title {
          font-family: 'Oswald', sans-serif;
          font-size: 1.1rem; font-weight: 700;
          letter-spacing: .08em; text-transform: uppercase;
          color: rgba(255,255,255,.9);
          text-decoration: none; display: block;
          margin-bottom: 10px;
        }
        .gnav__mobile-subs { display: flex; flex-direction: column; gap: 8px; padding-left: 14px; }
        .gnav__mobile-sub {
          font-family: 'Noto Sans KR', sans-serif;
          font-size: .8rem; font-weight: 500;
          color: rgba(255,255,255,.38);
          text-decoration: none;
          transition: color .15s;
        }
        .gnav__mobile-sub:hover { color: rgba(255,255,255,.75); }

        /* ── Responsive ──────────────────────── */
        @media (max-width: 1100px) {
          .gnb-desktop { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 1101px) {
          .show-mobile { display: none !important; }
          .gnav__mobile { display: none; }
        }
        @media (max-width: 768px) {
          .gnav__inner { padding: 16px 18px !important; }
          .gnav--scrolled .gnav__inner { padding: 12px 18px !important; }
          .gnav__logo { height: 64px !important; }
          .gnav__mobile { max-width: 100%; }
        }
      `}</style>
    </>
  )
}
