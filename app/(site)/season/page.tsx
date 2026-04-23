// app/(site)/season/page.tsx — 2026 시즌 안내 (라운드 일정 + 클래스 + 포인트)
import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity.client'
import { SITE_SETTINGS_QUERY, ROUNDS_QUERY, CLASSES_QUERY } from '@/lib/queries'
import type { SiteSettings, Round, ClassInfo } from '@/types/sanity'
import { resolveRoundStatus } from '@/lib/roundStatus'
import PageHero from '@/components/ui/PageHero'
import SectionSeasonSchedule from '@/components/sections/SectionSeasonSchedule'
import { ENTRY_CLOSED, ENTRY_CLOSED_TEXT_EN } from '@/lib/config'

export const metadata: Metadata = {
  title: '2026 Calendar',
  description: '인제 GT 마스터즈 2026 시즌 라운드 일정, 클래스 소개, 포인트 시스템, 규정 안내.',
}

const STATUS_MAP: Record<string, { text: string; color: string; bg: string }> = {
  upcoming:     { text: '예정',     color: '#3b82f6', bg: 'rgba(59,130,246,.1)'  },
  entry_open:   { text: '접수중',   color: '#16a34a', bg: 'rgba(22,163,74,.1)'   },
  entry_closed: { text: '접수마감', color: '#d97706', bg: 'rgba(217,119,6,.1)'   },
  ongoing:      { text: '진행중',   color: '#e60023', bg: 'rgba(230,0,35,.1)'    },
  finished:     { text: '종료',     color: '#6b7280', bg: 'rgba(107,114,128,.1)' },
}

const POINT_TABLE = [
  { pos: 1, pts: 25 }, { pos: 2, pts: 18 }, { pos: 3, pts: 15 },
  { pos: 4, pts: 12 }, { pos: 5, pts: 10 }, { pos: 6, pts: 8  },
  { pos: 7, pts: 6  }, { pos: 8, pts: 4  }, { pos: 9, pts: 2  }, { pos: 10, pts: 1 },
]

export default async function SeasonPage() {
  const [settings, rounds, classes] = await Promise.all([
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY }),
    sanityFetch<Round[]>({ query: ROUNDS_QUERY, params: { season: 2026 }, revalidate: 300 }),
    sanityFetch<ClassInfo[]>({ query: CLASSES_QUERY, revalidate: 3600 }),
  ]).catch(() => [null, [], []] as [SiteSettings | null, Round[], ClassInfo[]])

  const displayRounds = rounds as Round[]
  const displayClasses = classes as ClassInfo[]
const cut = 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)'

  return (
    <>
      {/* ── 히어로 ──────────────────────────────────────────── */}
      <PageHero
        image={(settings as SiteSettings | null)?.heroSeason}
        badge="2026 Season"
        title="2026 Calendar"
        subtitle="레이서의 근성과 머신의 한계가 만나는 곳"
      >
        <div style={{ marginTop: '20px' }}>
          <Link
            href={ENTRY_CLOSED ? '/season' : '/entry'}
            className="btn btn-primary"
            aria-disabled={ENTRY_CLOSED}
            style={ENTRY_CLOSED ? { pointerEvents: 'none', opacity: 0.5 } : undefined}
          >
            <i className="fa-solid fa-flag-checkered" />
            {ENTRY_CLOSED ? ENTRY_CLOSED_TEXT_EN : '2026 Register'}
          </Link>
        </div>
      </PageHero>

      {/* ── 라운드 일정 (카드 그리드) ───────────────────────── */}
      <SectionSeasonSchedule rounds={displayRounds} />


{/* ── CTA ──────────────────────────────────────────────── */}
      {!ENTRY_CLOSED && (
        <section style={{ background: 'linear-gradient(135deg,#111,#1a0008)', padding: '64px 0' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem,3vw,2.6rem)', marginBottom: '14px' }}>Where Legends Begin</h2>
            <p style={{ color: 'rgba(255,255,255,.65)', marginBottom: '28px', fontSize: 'clamp(.9rem,1.4vw,1.06rem)' }}>
              2026 인제 GT 마스터즈 — 지금 참가를 신청하세요.
            </p>
            <div className="btns" style={{ justifyContent: 'center' }}>
              <Link href="/entry" className="btn btn-primary" style={{ fontSize: '1.05rem', minHeight: '56px' }}>
                <i className="fa-solid fa-flag-checkered" />
                Register
              </Link>
              <Link href="/results" className="btn btn-ghost">
                경기 결과 보기
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
