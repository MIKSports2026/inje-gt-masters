// components/sections/SectionRound.tsx — Card grid (source design)
'use client'
import Link from 'next/link'
import type { Round } from '@/types/sanity'
import SectionHeader from '@/components/ui/SectionHeader'

type RoundStatus = 'upcoming' | 'entry_open' | 'entry_closed' | 'ongoing' | 'finished'

interface Props { rounds: Round[] }

const FALLBACK: Array<{
  _id: string; roundNumber: number; dateStart: string; status: RoundStatus;
  slug: { current: string }; season: number; title: string; hasResults: boolean
}> = [
  { _id: 'fb1', roundNumber: 1, dateStart: '2026-04-26', status: 'entry_open', slug: { current: '2026-r1' }, season: 2026, title: 'R1 개막전', hasResults: false },
  { _id: 'fb2', roundNumber: 2, dateStart: '2026-06-07', status: 'upcoming', slug: { current: '2026-r2' }, season: 2026, title: 'R2 서머레이스', hasResults: false },
  { _id: 'fb3', roundNumber: 3, dateStart: '2026-08-02', status: 'upcoming', slug: { current: '2026-r3' }, season: 2026, title: 'R3 나이트레이스', hasResults: false },
  { _id: 'fb4', roundNumber: 4, dateStart: '2026-09-06', status: 'upcoming', slug: { current: '2026-r4' }, season: 2026, title: 'R4 챔피언십', hasResults: false },
  { _id: 'fb5', roundNumber: 5, dateStart: '2026-10-11', status: 'upcoming', slug: { current: '2026-r5' }, season: 2026, title: 'R5 파이널', hasResults: false },
]

function fmtDateGiant(d: string) {
  const dt = new Date(d)
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
  return `${months[dt.getMonth()]} ${String(dt.getDate()).padStart(2, '0')}`
}

function statusBadge(s: RoundStatus) {
  if (s === 'entry_open') return { text: 'ENTRY OPEN', cls: 'sc-badge--open' }
  if (s === 'finished') return { text: 'COMPLETED', cls: 'sc-badge--done' }
  if (s === 'entry_closed') return { text: 'CLOSED', cls: 'sc-badge--done' }
  return { text: 'UPCOMING', cls: 'sc-badge--soon' }
}

export default function SectionRound({ rounds }: Props) {
  const data = rounds.length > 0 ? rounds : FALLBACK as unknown as Round[]

  return (
    <section className="sc-section" id="rounds">
      <div className="sc-container">
        <SectionHeader subtitle="2026 SEASON" title="RACE SCHEDULE" />

        <div className="sc-grid">
          {data.map((r) => {
            const st = (r.status ?? 'upcoming') as RoundStatus
            const isOpen = st === 'entry_open'
            const isFin = st === 'finished'
            const badge = statusBadge(st)
            const heroUrl = (r as any).heroImage?.asset?.url as string | undefined
            const dateStr = r.dateStart ? fmtDateGiant(r.dateStart) : '—'

            return (
              <div key={r._id} className={`sc-card ${isOpen ? 'sc-card--feature sc-card--highlight' : ''} ${isFin ? 'sc-card--done' : ''}`}>
                {/* Background */}
                {heroUrl ? (
                  <div className="sc-card__bg sc-card__bg--img" style={{ backgroundImage: `url(${heroUrl})` }}>
                    <div className="sc-card__overlay" />
                  </div>
                ) : (
                  <div className="sc-card__bg sc-card__bg--carbon" />
                )}

                {isOpen && <div className="sc-card__edge" />}

                {/* Content */}
                <div className="sc-card__content">
                  <div className="sc-card__top">
                    <span className="sc-card__round">ROUND {String(r.roundNumber).padStart(2, '0')}</span>
                    <span className={`sc-card__status ${badge.cls}`}>{badge.text}</span>
                  </div>

                  <div className="sc-card__mid">
                    <h3 className="sc-card__date">{dateStr}</h3>
                    <div className="sc-card__loc">INJE SPEEDIUM</div>
                  </div>

                  <div className="sc-card__bot">
                    {isFin && (
                      <Link href={`/results?round=${r.slug.current}`} className="sc-btn sc-btn--outline">
                        VIEW RESULTS →
                      </Link>
                    )}
                    {isOpen && (
                      <Link href={`/entry?tab=apply&round=R${r.roundNumber}`} className="sc-btn sc-btn--red">
                        APPLY NOW →
                      </Link>
                    )}
                    {!isFin && !isOpen && (
                      <div className="sc-card__placeholder">OPENS LATER</div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        .sc-section { background: var(--bg-carbon, #0a0a0a); min-height: 80vh; padding: 80px 0; }
        .sc-container { max-width: 1400px; margin: 0 auto; padding: 0 24px; }

        .sc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; width: 100%; grid-auto-flow: dense; }

        .sc-card {
          position: relative; background: #0b0b0b; min-height: 400px;
          overflow: hidden; display: flex; flex-direction: column;
          transition: transform .4s cubic-bezier(.25,1,.5,1), box-shadow .4s ease;
          clip-path: polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px);
        }
        .sc-card:hover { transform: translateY(-8px); box-shadow: 0 15px 35px rgba(0,0,0,.9); }
        .sc-card--feature { grid-column: span 2; }
        .sc-card--done { opacity: .9; }
        .sc-card--done:hover { opacity: 1; }
        .sc-card--highlight { border-bottom: 2px solid var(--primary-red, #E60023); }

        .sc-card__edge { position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: var(--primary-red); z-index: 5; }

        /* Background */
        .sc-card__bg { position: absolute; inset: 0; z-index: 1; transition: transform .6s ease; }
        .sc-card:hover .sc-card__bg { transform: scale(1.05); }
        .sc-card__bg--img { background-size: cover; background-position: center; filter: grayscale(80%) sepia(20%) hue-rotate(300deg); }
        .sc-card__overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(10,10,10,.9) 0%, rgba(10,10,10,.4) 40%, rgba(10,10,10,.95) 100%); }
        .sc-card__bg--carbon { background: linear-gradient(135deg, #111 0%, #050505 100%); }

        /* Content */
        .sc-card__content { position: relative; z-index: 10; display: flex; flex-direction: column; height: 100%; padding: 40px; }
        .sc-card__top { display: flex; justify-content: space-between; align-items: center; margin-bottom: auto; }
        .sc-card__round { font-family: var(--font-heading, 'Oswald'); font-size: 1.2rem; font-weight: 700; color: #aaa; letter-spacing: 2px; }
        .sc-card__status { font-family: var(--font-heading, 'Oswald'); font-size: .9rem; font-weight: 600; padding: 6px 12px; letter-spacing: 1px; }
        .sc-badge--open { background: var(--primary-red); color: #fff; }
        .sc-badge--done { color: #666; border: 1px solid #333; }
        .sc-badge--soon { color: #888; background: #1a1a1a; }

        .sc-card__mid { margin: 40px 0; }
        .sc-card__date { font-family: var(--font-heading, 'Oswald'); font-size: 5rem; font-weight: 900; line-height: .9; letter-spacing: -1px; color: var(--text-primary, #fff); margin: 0 0 16px; text-transform: uppercase; }
        .sc-card--feature .sc-card__date { font-size: 7rem; }
        .sc-card__loc { font-family: var(--font-heading, 'Oswald'); font-size: 1.1rem; font-weight: 600; color: #777; letter-spacing: 2px; }

        .sc-card__bot { display: flex; align-items: center; }
        .sc-btn {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          width: 100%; padding: 16px 0;
          font-family: var(--font-heading, 'Oswald'); font-size: 1.1rem; font-weight: 700;
          letter-spacing: 1px; text-decoration: none;
          transition: all .3s ease;
          clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px);
        }
        .sc-btn--outline { background: transparent; color: #fff; border: 1px solid #444; }
        .sc-btn--outline:hover { background: #fff; color: #0a0a0a; }
        .sc-btn--red { background: var(--primary-red); color: #fff; border: none; }
        .sc-btn--red:hover { background: #C0001D; transform: translateY(-2px); }
        .sc-card__placeholder { font-family: var(--font-heading, 'Oswald'); font-size: 1rem; font-weight: 600; color: #444; letter-spacing: 2px; }

        @media (max-width: 1200px) {
          .sc-grid { grid-template-columns: repeat(2, 1fr); }
          .sc-card--feature { grid-column: span 2; }
        }
        @media (max-width: 768px) {
          .sc-grid { grid-template-columns: 1fr; }
          .sc-card--feature { grid-column: span 1; }
          .sc-card__content { padding: 30px; }
          .sc-card__date, .sc-card--feature .sc-card__date { font-size: 3.5rem; }
        }
      `}</style>
    </section>
  )
}
