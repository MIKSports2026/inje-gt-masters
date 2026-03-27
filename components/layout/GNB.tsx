// components/layout/GNB.tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import clsx  from 'clsx'
import type { SiteSettings } from '@/types/sanity'

// ── 메가메뉴 데이터 ─────────────────────────────────────────
const NAV_ITEMS = [
  {
    label: '대회소개',
    href:  '/#about',
    mega: [
      { title: '대회 개요',   links: [
        { label: '인제 GT 마스터즈란?', href: '/#about' },
        { label: 'Where Legends Begin', href: '/#about' },
        { label: '운영 조직',           href: '/#about' },
      ]},
      { title: '대회 역사',   links: [
        { label: '연도별 기록',    href: '/#history' },
        { label: '역대 챔피언',    href: '/#history' },
        { label: '주요 통계',      href: '/#history' },
      ]},
      { title: '인제스피디움', links: [
        { label: '서킷 소개',      href: '/#speedium' },
        { label: '찾아오는 길',    href: '/#speedium' },
        { label: '공식 홈페이지',  href: 'https://www.speedium.co.kr', external: true },
      ]},
      { title: '미디어룸', links: [
        { label: '보도자료',       href: '/news?category=press' },
        { label: '공식 사진',      href: '/media' },
        { label: '공식 영상',      href: '/media?type=video' },
      ]},
    ],
  },
  {
    label: '시즌안내',
    href:  '/#season',
    mega: [
      { title: '2026 시즌', links: [
        { label: '시즌 개요',        href: '/#season' },
        { label: 'R1 — 개막전',      href: '/season/2026-r1' },
        { label: 'R2 — 서머',        href: '/season/2026-r2' },
        { label: 'R3 — 나이트레이스', href: '/season/2026-r3' },
        { label: 'R4 — 파이널',      href: '/season/2026-r4' },
      ]},
      { title: '클래스', links: [
        { label: 'GT1 (Pro-Am)',     href: '/classes/gt1' },
        { label: 'GT2 (아마추어)',   href: '/classes/gt2' },
        { label: 'GT3 (입문)',       href: '/classes/gt3' },
        { label: '드리프트 KDGP',   href: '/classes/drift' },
        { label: '바이크',           href: '/classes/bike' },
        { label: '슈퍼카 챌린지',   href: '/classes/supercar' },
      ]},
      { title: '포인트 / 규정', links: [
        { label: '포인트 시스템',    href: '/season#points' },
        { label: '기술 규정 PDF',    href: '/season#regulations' },
        { label: '안전 장비 기준',   href: '/season#safety' },
      ]},
      { title: '역대 시즌', links: [
        { label: '2025 시즌',        href: '/history/2025' },
        { label: '2024 시즌',        href: '/history/2024' },
        { label: '전체 기록',        href: '/history' },
      ]},
    ],
  },
  {
    label: '경기정보',
    href:  '/#results',
    mega: [
      { title: '2026 결과', links: [
        { label: 'R1 개막전 결과',   href: '/results/2026-r1' },
        { label: 'R2 서머 결과',     href: '/results/2026-r2' },
        { label: 'R3 나이트 결과',   href: '/results/2026-r3' },
        { label: 'R4 파이널 결과',   href: '/results/2026-r4' },
      ]},
      { title: '챔피언십', links: [
        { label: 'GT1 스탠딩',       href: '/results#gt1' },
        { label: 'GT2 스탠딩',       href: '/results#gt2' },
        { label: 'GT3 스탠딩',       href: '/results#gt3' },
        { label: '드리프트 스탠딩',  href: '/results#drift' },
      ]},
      { title: '역대 기록', links: [
        { label: '서킷 기록',        href: '/results#records' },
        { label: '역대 챔피언',      href: '/history' },
      ]},
    ],
  },
  {
    label: '참가안내',
    href:  '/#entry',
    mega: [
      { title: '참가신청', links: [
        { label: '온라인 신청하기',  href: '/entry' },
        { label: '신청 현황 확인',   href: '/entry#status' },
        { label: '참가비 안내',      href: '/entry#fee' },
      ]},
      { title: '참가 자격', links: [
        { label: 'GT 클래스 자격',   href: '/entry#gt-eligibility' },
        { label: '드리프트 자격',    href: '/entry#drift-eligibility' },
        { label: '바이크 자격',      href: '/entry#bike-eligibility' },
      ]},
      { title: '규정 / 서류', links: [
        { label: '기술 규정 다운로드', href: '/entry#regulations' },
        { label: '차량 안전 기준',   href: '/entry#safety' },
        { label: '서식 자료실',      href: '/entry#forms' },
      ]},
      { title: '자주 묻는 질문', links: [
        { label: 'FAQ',              href: '/entry#faq' },
        { label: '카카오 문의',      href: '#kakao' },
      ]},
    ],
  },
  {
    label: '미디어',
    href:  '/#media',
    mega: [
      { title: '포토 갤러리', links: [
        { label: '전체 앨범',        href: '/media' },
        { label: 'R1 개막전',        href: '/media?round=r1' },
        { label: 'R2 서머',          href: '/media?round=r2' },
        { label: 'R3 나이트레이스',  href: '/media?round=r3' },
        { label: 'R4 파이널',        href: '/media?round=r4' },
      ]},
      { title: '동영상', links: [
        { label: '공식 유튜브',      href: '#youtube', external: true },
        { label: '하이라이트',       href: '/media?type=video' },
        { label: '드리프트 클립',    href: '/media?type=video&tag=drift' },
      ]},
    ],
  },
  {
    label: '소식',
    href:  '/news',
    mega: [
      { title: '공지사항', links: [
        { label: '전체 공지',        href: '/news?category=notice' },
        { label: '참가안내 공지',    href: '/news?category=entry' },
        { label: '기술규정 공지',    href: '/news?category=regulation' },
      ]},
      { title: '대회소식', links: [
        { label: '최신 소식',        href: '/news' },
        { label: '보도자료',         href: '/news?category=press' },
        { label: '이벤트',           href: '/news?category=event' },
      ]},
    ],
  },
  {
    label: '인제스피디움',
    href:  '/#speedium',
    mega: [
      { title: '서킷 정보', links: [
        { label: '서킷 소개',        href: '/#speedium' },
        { label: '찾아오는 길',      href: '/#speedium' },
        { label: '관람 안내',        href: '/#speedium' },
      ]},
      { title: '공식 링크', links: [
        { label: '인제스피디움 홈',  href: 'https://www.speedium.co.kr', external: true },
        { label: '트랙 데이 예약',   href: 'https://www.speedium.co.kr', external: true },
      ]},
    ],
  },
] as const

// ── 서브 타입 ────────────────────────────────────────────────
interface MegaCol {
  title: string
  links: readonly { label: string; href: string; external?: boolean }[]
}

// ── GNB 컴포넌트 ─────────────────────────────────────────────
export default function GNB({ settings }: { settings: SiteSettings | null }) {
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [openGroup,   setOpenGroup]   = useState<number | null>(null)
  const [openMega,    setOpenMega]    = useState<number | null>(null)
  const [scrolled,    setScrolled]    = useState(false)
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openMenu = (i: number) => {
    if (megaTimer.current) clearTimeout(megaTimer.current)
    setOpenMega(i)
  }
  const closeMenu = () => {
    megaTimer.current = setTimeout(() => setOpenMega(null), 200)
  }

  // 스크롤 감지 → 헤더 shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // 모바일 메뉴 열릴 때 body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <header
      className={clsx(
        'sticky top-0 z-[1000] transition-shadow duration-200',
        'bg-[rgba(244,246,248,0.92)] backdrop-blur-[14px] saturate-[170%]',
        'border-b border-[rgba(216,222,229,0.92)]',
        scrolled && 'shadow-md'
      )}
    >
      <div className="container">
        <div className="h-[76px] grid grid-cols-[auto_1fr_auto] gap-[22px] items-center relative">

          {/* ── 브랜드 ──────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-[14px] min-w-0">
            <div
              className="w-[46px] h-[46px] grid place-items-center font-[950] text-base text-white"
              style={{
                background:  'linear-gradient(135deg, #e60023, #6f0011)',
                clipPath:    'polygon(0 0, 78% 0, 100% 22%, 100% 100%, 0 100%)',
                boxShadow:   '0 12px 24px rgba(230,0,35,.22)',
              }}
            >
              GT
            </div>
            <div className="min-w-0">
              <strong className="block text-base leading-none tracking-tight whitespace-nowrap">
                {settings?.siteName ?? '인제 GT 마스터즈'}
              </strong>
              <span className="block text-[.76rem] text-muted whitespace-nowrap">
                {settings?.slogan ?? 'Where Legends Begin'}
              </span>
            </div>
          </Link>

          {/* ── 데스크톱 네비 ───────────────────────────────── */}
          <nav className="hidden lg:flex items-center justify-center gap-[22px]" aria-label="주 메뉴">
            {NAV_ITEMS.map((item, i) => (
              <div
                key={i}
                className="self-stretch flex items-center"
                onMouseEnter={() => openMenu(i)}
                onMouseLeave={closeMenu}
              >
                {/* 메뉴 트리거 */}
                <Link
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-2 h-full px-1 font-[850] text-[#1d2630]',
                    'relative after:content-[""] after:absolute after:left-0 after:right-0',
                    'after:bottom-0 after:h-[2px] after:bg-red after:transition-transform after:duration-[220ms]',
                    openMega === i ? 'after:scale-x-100 after:origin-left' : 'after:scale-x-0 after:origin-left'
                  )}
                >
                  {item.label}
                  <span
                    className="inline-block w-[6px] h-[6px] border-r-2 border-b-2 border-[#6d7782]"
                    style={{ transform: 'rotate(45deg) translateY(-2px)' }}
                  />
                </Link>

                {/* 메가 드롭다운 — 헤더 컨테이너 기준 전체 너비 */}
                {'mega' in item && (
                  <div
                    onMouseEnter={() => openMenu(i)}
                    onMouseLeave={closeMenu}
                    className={clsx(
                      'absolute left-0 right-0 top-full',
                      'p-4',
                      'bg-white border border-line shadow-mega',
                      'transition-all duration-[220ms]',
                      openMega === i
                        ? 'opacity-100 pointer-events-auto translate-y-0'
                        : 'opacity-0 pointer-events-none translate-y-1'
                    )}
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)',
                      display: 'grid',
                      gridTemplateColumns: `repeat(${(item.mega as readonly MegaCol[]).length}, 1fr)`,
                      gap: '12px',
                    }}
                  >
                    {(item.mega as readonly MegaCol[]).map((col, j) => (
                      <div
                        key={j}
                        className="p-[14px] border border-line relative"
                        style={{
                          background: 'linear-gradient(180deg, #fff, #f7f9fb)',
                          clipPath:   'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
                        }}
                      >
                        <div className="absolute left-0 top-0 w-full h-[2px] bg-gradient-to-r from-red to-transparent" />
                        <strong className="block mb-2 text-[.95rem]">{col.title}</strong>
                        {col.links.map((link, k) => (
                          <Link
                            key={k}
                            href={link.href}
                            target={link.external ? '_blank' : undefined}
                            rel={link.external ? 'noopener noreferrer' : undefined}
                            className="block py-[7px] text-[#3a434d] text-[.92rem] hover:text-red hover:translate-x-1 transition-all duration-150"
                          >
                            {link.label}
                            {link.external && (
                              <i className="fa-solid fa-arrow-up-right-from-square text-[.7rem] ml-1 opacity-60" />
                            )}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* ── 우측 액션 ───────────────────────────────────── */}
          <div className="flex items-center gap-[10px]">
            {/* 참가신청 버튼 (데스크톱) */}
            <Link
              href="/entry"
              className="hidden lg:inline-flex btn btn-primary text-sm"
            >
              <i className="fa-solid fa-flag-checkered" />
              참가 신청
            </Link>

            {/* 햄버거 (모바일) */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              aria-expanded={mobileOpen}
              aria-label="메뉴 열기"
              className={clsx(
                'lg:hidden w-[46px] h-[46px] border border-line bg-white relative p-0',
                'transition-all duration-[220ms]'
              )}
              style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)' }}
            >
              {[14, 21, 28].map((top, i) => (
                <span
                  key={i}
                  className={clsx(
                    'absolute left-[11px] right-[11px] h-[2px] bg-[#111] transition-all duration-[220ms]',
                    mobileOpen && i === 0 && 'translate-y-[7px] rotate-45',
                    mobileOpen && i === 1 && 'opacity-0',
                    mobileOpen && i === 2 && '-translate-y-[7px] -rotate-45',
                  )}
                  style={{ top }}
                />
              ))}
            </button>
          </div>

        </div>
      </div>

      {/* ── 모바일 메뉴 ─────────────────────────────────────── */}
      <div
        className={clsx(
          'lg:hidden border-t border-line bg-[rgba(244,246,248,0.98)]',
          'overflow-y-auto transition-all duration-300 origin-top',
          mobileOpen ? 'max-h-[calc(100vh-76px)] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        )}
      >
        <div className="container py-3 pb-5">

          {/* 참가신청 버튼 (모바일 상단) */}
          <div className="mb-3">
            <Link
              href="/entry"
              className="btn btn-primary w-full justify-center"
              onClick={() => setMobileOpen(false)}
            >
              <i className="fa-solid fa-flag-checkered" />
              참가 신청하기
            </Link>
          </div>

          {NAV_ITEMS.map((item, i) => (
            <div
              key={i}
              className="border-b border-[rgba(216,222,229,0.94)] py-2"
            >
              <button
                className="w-full min-h-[52px] px-0 bg-none border-none flex items-center justify-between font-[850] text-[#1d2630]"
                onClick={() => setOpenGroup(openGroup === i ? null : i)}
              >
                <span>{item.label}</span>
                <span
                  className={clsx(
                    'transition-transform duration-[220ms]',
                    openGroup === i && 'rotate-180'
                  )}
                >
                  <i className="fa-solid fa-chevron-down text-sm" />
                </span>
              </button>

              {/* 모바일 아코디언 패널 */}
              <div
                className={clsx(
                  'overflow-hidden transition-all duration-300',
                  openGroup === i ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                <div className="grid gap-2 pt-1 pb-3">
                  {'mega' in item && (item.mega as readonly MegaCol[]).flatMap(col =>
                    col.links.map((link, k) => (
                      <Link
                        key={`${col.title}-${k}`}
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        onClick={() => setMobileOpen(false)}
                        className="min-h-[44px] px-[14px] flex items-center bg-white border border-line text-[.94rem] font-[700] text-[#39434d] hover:text-red transition-colors"
                        style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                      >
                        {link.label}
                        {link.external && (
                          <i className="fa-solid fa-arrow-up-right-from-square text-[.7rem] ml-1 opacity-60" />
                        )}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </header>
  )
}
