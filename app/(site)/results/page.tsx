// app/(site)/results/page.tsx — 경기 결과 & 챔피언십 스탠딩
import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity.client'
import { ROUNDS_QUERY, RESULTS_BY_ROUND_QUERY, CHAMPIONSHIP_QUERY } from '@/lib/queries'
import type { Round, Result, ClassCode } from '@/types/sanity'
import ResultsClient from './ResultsClient'

export const metadata: Metadata = {
  title: '경기 결과',
  description: '인제 GT 마스터즈 2026 시즌 경기 결과, 순위표, 챔피언십 스탠딩. 라운드별 결과 및 포인트 현황을 확인하세요.',
}

const CLASSES: { code: ClassCode; label: string; color: string }[] = [
  { code: 'GT1',      label: 'GT1 Pro-Am',     color: '#e60023' },
  { code: 'GT2',      label: 'GT2 아마추어',   color: '#2563eb' },
  { code: 'GT3',      label: 'GT3 입문',       color: '#b8921e' },
  { code: 'DRIFT',    label: '드리프트 KDGP',  color: '#16a34a' },
  { code: 'BIKE',     label: '바이크',         color: '#a855f7' },
  { code: 'SUPERCAR', label: '슈퍼카 챌린지',  color: '#f97316' },
]


export default async function ResultsPage({
  searchParams,
}: {
  searchParams: { round?: string; class?: string }
}) {
  const selectedRound = searchParams.round
  const selectedClass = (searchParams.class ?? 'GT1') as ClassCode

  const rounds = await sanityFetch<Round[]>({
    query:     ROUNDS_QUERY,
    params:    { season: 2026 },
    revalidate: 300,
  }).catch(() => [] as Round[])

  const displayRounds = rounds as Round[]

  const cut = 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)'

  return (
    <>
      {/* ── 히어로 ─────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg,#111,#1a0008 55%,#0d0d0d)',
        padding: '56px 0 48px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg,rgba(230,0,35,.04) 0 1px,transparent 1px 60px)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="pill">Race Information</span>
          <h1 style={{ color: '#fff', marginTop: '10px', fontSize: 'clamp(2rem,5vw,4.2rem)' }}>경기 결과</h1>
          <p style={{ color: 'rgba(255,255,255,.65)', marginTop: '10px', fontSize: 'clamp(.9rem,1.4vw,1.06rem)' }}>
            2026 시즌 라운드별 결과 및 챔피언십 스탠딩
          </p>
        </div>
      </section>

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
                  background: selectedRound === r.slug.current ? 'var(--red)' : '#fff',
                  color:      selectedRound === r.slug.current ? '#fff' : '#3a434d',
                  border:     `1px solid ${selectedRound === r.slug.current ? 'var(--red)' : 'var(--line)'}`,
                  clipPath:   'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)',
                  textDecoration: 'none',
                  opacity: r.hasResults ? 1 : 0.6,
                }}
              >
                <span>R{r.roundNumber}</span>
                <span style={{ fontSize: '.8rem', fontWeight: 700 }}>{r.title.replace(/R\d — /, '')}</span>
                {!r.hasResults && <span style={{ fontSize: '.72rem', opacity: .7 }}>(예정)</span>}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>

            {/* ── 챔피언십 스탠딩 (메인) ──────────────────── */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span className="eyebrow">Championship Standings</span>
                  <h2 style={{ fontSize: 'clamp(1.4rem,2.5vw,2rem)' }}>챔피언십 스탠딩</h2>
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
                    {cls.code}
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

            {/* ── 사이드: 라운드 카드 ──────────────────────── */}
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ background: '#fff', border: '1px solid var(--line)', clipPath: cut, padding: '22px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,var(--red),rgba(230,0,35,.35) 35%,transparent 75%)' }} />
                <h3 style={{ marginBottom: '14px' }}>2026 시즌 일정</h3>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {displayRounds.map(r => (
                    <div key={r._id} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 12px', background: 'var(--surface-2)', border: '1px solid var(--line)',
                      clipPath: 'polygon(0 0,calc(100% - 9px) 0,100% 9px,100% 100%,0 100%)',
                    }}>
                      <span style={{ width: '32px', height: '32px', display: 'grid', placeItems: 'center', background: 'rgba(230,0,35,.08)', color: 'var(--red)', border: '1px solid rgba(230,0,35,.18)', fontWeight: 900, fontSize: '.82rem', clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)', flexShrink: 0 }}>R{r.roundNumber}</span>
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: 'block', fontSize: '.88rem' }}>{r.title}</strong>
                        <span style={{ fontSize: '.78rem', color: 'var(--muted)' }}>{r.dateStart}</span>
                      </div>
                      {r.hasResults && (
                        <Link href={`/results?round=${r.slug.current}`} style={{ fontSize: '.78rem', fontWeight: 900, color: 'var(--red)' }}>결과보기</Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 서킷 레코드 */}
              <div id="records" style={{ background: '#fff', border: '1px solid var(--line)', clipPath: cut, padding: '22px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,var(--red),rgba(230,0,35,.35) 35%,transparent 75%)' }} />
                <h3 style={{ marginBottom: '14px' }}>서킷 랩레코드</h3>
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--muted)' }}>
                  <i className="fa-solid fa-stopwatch" style={{ fontSize: '2rem', opacity: .3, display: 'block', marginBottom: '10px' }} />
                  <p style={{ fontSize: '.88rem' }}>랩레코드 데이터를 준비중입니다.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
