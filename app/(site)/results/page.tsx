// app/(site)/results/page.tsx — 경기 결과 & 챔피언십 스탠딩
import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity.client'
import { SITE_SETTINGS_QUERY, ROUNDS_QUERY, RESULTS_BY_ROUND_QUERY, CHAMPIONSHIP_QUERY } from '@/lib/queries'
import type { SiteSettings, Round, Result, ClassCode } from '@/types/sanity'
import PageHero from '@/components/ui/PageHero'
import ResultsClient from './ResultsClient'

export const metadata: Metadata = {
  title: 'Results',
  description: '인제 GT 마스터즈 2026 시즌 경기 결과, 순위표, 챔피언십 스탠딩. 라운드별 결과 및 포인트 현황을 확인하세요.',
}

const CLASSES: { code: ClassCode; label: string; color: string }[] = [
  { code: 'masters-1',   label: 'Masters 1',    color: '#e60023' },
  { code: 'masters-2',   label: 'Masters 2',    color: '#2563eb' },
  { code: 'masters-n',   label: 'Masters N',    color: '#b8921e' },
  { code: 'masters-3',   label: 'Masters 3',    color: '#16a34a' },
  { code: 'masters-n-evo', label: 'Masters N-evo', color: '#a855f7' },
]


export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ round?: string; class?: string }>
}) {
  const { round: selectedRound, class: classParam } = await searchParams
  const selectedClass = (classParam ?? 'masters-1') as ClassCode

  const [siteSettings, rounds] = await Promise.all([
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY }),
    sanityFetch<Round[]>({ query: ROUNDS_QUERY, params: { season: 2026 }, revalidate: 300 }),
  ]).catch(() => [null, []] as [SiteSettings | null, Round[]])

  const displayRounds = rounds as Round[]

  const cut = 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)'

  return (
    <>
      {/* ── 히어로 ─────────────────────────────────────────── */}
      <PageHero
        image={(siteSettings as SiteSettings | null)?.heroResults}
        badge="Race Information"
        title="Results"
        subtitle="2026 시즌 누적 Driver Ranking · Team Ranking"
      />

      {/* ── 라운드 네비게이션 ──────────────────────────────── */}
      <section style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--line)', padding: '20px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {displayRounds.map(r => (
              <Link
                key={r._id}
                href={`/results?round=${r.slug.current}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 16px', fontWeight: 800, fontSize: '.9rem',
                  background: selectedRound === r.slug.current ? 'var(--red)' : 'var(--bg-2)',
                  color:      selectedRound === r.slug.current ? '#fff' : 'var(--text-mid)',
                  border:     `1px solid ${selectedRound === r.slug.current ? 'var(--red)' : 'var(--line)'}`,
                  clipPath:   'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)',
                  textDecoration: 'none',
                  opacity: r.hasResults ? 1 : 0.6,
                }}
              >
                <span style={{ fontSize: '.9rem', fontWeight: 800 }}>Round {r.roundNumber}</span>
                {!r.hasResults && <span style={{ fontSize: '.72rem', opacity: .7 }}>(예정)</span>}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div>

            {/* ── Driver / Team Ranking (메인) ─────────────── */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span className="eyebrow">Driver Ranking · Team Ranking</span>
                  <h2 style={{ fontSize: 'clamp(1.4rem,2.5vw,2rem)' }}>Driver Ranking</h2>
                </div>
                <span className="chip">2026 시즌 누적</span>
              </div>

              {/* 클래스 탭 */}
              <div className="tabs">
                {CLASSES.map(cls => (
                  <Link
                    key={cls.code}
                    href={`/results?${selectedRound ? `round=${selectedRound}&` : ''}class=${cls.code}`}
                    className={`tab${selectedClass === cls.code ? ' active' : ''}`}
                    style={{
                      textDecoration: 'none',
                      ...(selectedClass === cls.code ? { background: cls.color, borderColor: cls.color } : {}),
                    }}
                  >
                    {cls.label}
                  </Link>
                ))}
              </div>

              {/* 스탠딩 테이블 */}
              <ResultsClient
                classCode={selectedClass}
                classColor={CLASSES.find(c => c.code === selectedClass)?.color ?? '#e60023'}
                standings={[]}
              />
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
