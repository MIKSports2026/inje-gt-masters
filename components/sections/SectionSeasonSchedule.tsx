// components/sections/SectionSeasonSchedule.tsx — Season page card grid (SectionSeason.jsx design)
import Link from 'next/link'
import type { Round } from '@/types/sanity'

type RoundStatus = 'upcoming' | 'entry_open' | 'entry_closed' | 'ongoing' | 'finished'

interface Props { rounds: Round[] }

const FALLBACK: Array<{
  _id: string; roundNumber: number; dateStart: string; status: RoundStatus;
  slug: { current: string }; season: number; title: string; hasResults: boolean
}> = [
  { _id: 'fb1', roundNumber: 1, dateStart: '2026-04-26', status: 'entry_open', slug: { current: '2026-r1' }, season: 2026, title: 'R1 개막전', hasResults: false },
  { _id: 'fb2', roundNumber: 2, dateStart: '2026-06-07', status: 'upcoming',   slug: { current: '2026-r2' }, season: 2026, title: 'R2 서머레이스', hasResults: false },
  { _id: 'fb3', roundNumber: 3, dateStart: '2026-08-02', status: 'upcoming',   slug: { current: '2026-r3' }, season: 2026, title: 'R3 나이트레이스', hasResults: false },
  { _id: 'fb4', roundNumber: 4, dateStart: '2026-09-06', status: 'upcoming',   slug: { current: '2026-r4' }, season: 2026, title: 'R4 챔피언십', hasResults: false },
  { _id: 'fb5', roundNumber: 5, dateStart: '2026-10-11', status: 'upcoming',   slug: { current: '2026-r5' }, season: 2026, title: 'R5 파이널', hasResults: false },
]

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

function fmtDateGiant(d: string) {
  const dt = new Date(d)
  return `${MONTHS[dt.getMonth()]} ${String(dt.getDate()).padStart(2, '0')}`
}

function statusBadge(s: RoundStatus): { text: string; cls: string } {
  if (s === 'entry_open')   return { text: 'ENTRY OPEN', cls: 'sss-badge--open' }
  if (s === 'finished')     return { text: 'COMPLETED',  cls: 'sss-badge--done' }
  if (s === 'entry_closed') return { text: 'CLOSED',     cls: 'sss-badge--done' }
  return                           { text: 'UPCOMING',   cls: 'sss-badge--soon' }
}

export default function SectionSeasonSchedule({ rounds }: Props) {
  const data = rounds.length > 0 ? rounds : FALLBACK as unknown as Round[]

  return (
    <section className="sss-section" id="schedule">
      <div className="sss-container">

        {/* Section Header */}
        <div className="sss-header">
          <h2 className="sss-title">SEASON 2026 SCHEDULE</h2>
          <div className="sss-slash" />
        </div>

        {/* Card Grid */}
        <div className="sss-grid">
          {data.map((r) => {
            const st = (r.status ?? 'upcoming') as RoundStatus
            const isOpen = st === 'entry_open'
            const isFin  = st === 'finished'
            const badge  = statusBadge(st)
            const heroUrl = (r as any).heroImage?.asset?.url as string | undefined
            const dateStr = r.dateStart ? fmtDateGiant(r.dateStart) : '—'

            return (
              <div
                key={r._id}
                className={[
                  'sss-card',
                  isOpen ? 'sss-card--feature sss-card--open' : '',
                  isFin  ? 'sss-card--done' : '',
                ].join(' ')}
              >
                {/* Background */}
                {heroUrl ? (
                  <div className="sss-card__bg sss-card__bg--img" style={{ backgroundImage: `url(${heroUrl})` }}>
                    <div className="sss-card__overlay" />
                  </div>
                ) : (
                  <div className="sss-card__bg sss-card__bg--carbon" />
                )}

                {isOpen && <div className="sss-card__edge" />}

                {/* Content */}
                <div className="sss-card__content">

                  <div className="sss-card__top">
                    <span className="sss-card__round">ROUND {String(r.roundNumber).padStart(2, '0')}</span>
                    <span className={`sss-status ${badge.cls}`}>{badge.text}</span>
                  </div>

                  <div className="sss-card__mid">
                    <h3 className="sss-card__date">{dateStr}</h3>
                    <div className="sss-card__loc">
                      <span className="sss-loc-dot" />
                      INJE SPEEDIUM
                    </div>
                  </div>

                  <div className="sss-card__bot">
                    {isFin && (
                      <Link href={`/results?round=${r.slug.current}`} className="sss-btn sss-btn--outline">
                        VIEW RESULTS →
                      </Link>
                    )}
                    {isOpen && (
                      <Link href={`/entry?tab=apply&round=R${r.roundNumber}`} className="sss-btn sss-btn--red">
                        APPLY NOW →
                      </Link>
                    )}
                    {!isFin && !isOpen && (
                      <div className="sss-placeholder">OPENS LATER</div>
                    )}
                  </div>

                </div>
              </div>
            )
          })}
        </div>

      </div>

      <style>{`
        .sss-section {
          background: var(--bg-carbon, #0a0a0a);
          min-height: 80vh;
          padding: 80px 0;
        }
        .sss-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── 헤더 ── */
        .sss-header {
          margin-bottom: 48px;
        }
        .sss-title {
          font-family: var(--font-heading, 'Oswald'), sans-serif;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          font-weight: 700;
          color: var(--text-primary, #fff);
          letter-spacing: 2px;
          margin: 0 0 10px;
        }
        .sss-slash {
          width: 60px;
          height: 4px;
          background: var(--primary-red, #E60023);
        }

        /* ── 그리드 ── */
        .sss-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          width: 100%;
          grid-auto-flow: dense;
        }

        /* ── 카드 베이스 ── */
        .sss-card {
          position: relative;
          background: #0b0b0b;
          min-height: 400px;
          border-radius: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform .4s cubic-bezier(.25,1,.5,1), box-shadow .4s ease;
          clip-path: polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px);
        }
        .sss-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0,0,0,.9);
        }

        /* feature = entry_open → span 2 col */
        .sss-card--feature {
          grid-column: span 2;
        }
        .sss-card--open {
          border-bottom: 2px solid var(--primary-red, #E60023);
        }
        .sss-card--done {
          opacity: .9;
        }
        .sss-card--done:hover {
          opacity: 1;
        }

        /* top accent edge */
        .sss-card__edge {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 4px;
          background: var(--primary-red, #E60023);
          z-index: 5;
        }

        /* ── 배경 ── */
        .sss-card__bg {
          position: absolute;
          inset: 0;
          z-index: 1;
          transition: transform .6s ease;
        }
        .sss-card:hover .sss-card__bg {
          transform: scale(1.05);
        }
        .sss-card__bg--img {
          background-size: cover;
          background-position: center;
          filter: grayscale(80%) sepia(20%) hue-rotate(300deg);
        }
        .sss-card__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(10,10,10,.9) 0%, rgba(10,10,10,.4) 40%, rgba(10,10,10,.95) 100%);
        }
        .sss-card__bg--carbon {
          background: linear-gradient(135deg, #111 0%, #050505 100%);
        }

        /* ── 콘텐츠 ── */
        .sss-card__content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 40px;
        }

        .sss-card__top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: auto;
        }
        .sss-card__round {
          font-family: var(--font-heading, 'Oswald'), sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: #aaa;
          letter-spacing: 2px;
        }

        /* 상태 배지 */
        .sss-status {
          font-family: var(--font-heading, 'Oswald'), sans-serif;
          font-size: .9rem;
          font-weight: 600;
          padding: 6px 12px;
          letter-spacing: 1px;
        }
        .sss-badge--open { background: var(--primary-red, #E60023); color: #fff; }
        .sss-badge--done { color: #666; border: 1px solid #333; }
        .sss-badge--soon { color: #888; background: #1a1a1a; }

        /* 날짜 */
        .sss-card__mid {
          margin: 40px 0;
        }
        .sss-card__date {
          font-family: var(--font-heading, 'Oswald'), sans-serif;
          font-size: 5rem;
          font-weight: 900;
          line-height: .9;
          letter-spacing: -1px;
          color: var(--text-primary, #fff);
          margin: 0 0 16px;
          text-transform: uppercase;
        }
        .sss-card--feature .sss-card__date {
          font-size: 7rem;
        }

        .sss-card__loc {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-heading, 'Oswald'), sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #777;
          letter-spacing: 2px;
        }
        .sss-loc-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          background: var(--primary-red, #E60023);
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* 하단 버튼 */
        .sss-card__bot {
          display: flex;
          align-items: center;
        }
        .sss-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 16px 0;
          font-family: var(--font-heading, 'Oswald'), sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-decoration: none;
          transition: all .3s ease;
          border-radius: 0;
          clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px);
        }
        .sss-btn--outline {
          background: transparent;
          color: #fff;
          border: 1px solid #444;
        }
        .sss-btn--outline:hover {
          background: #fff;
          color: #0a0a0a;
        }
        .sss-btn--red {
          background: var(--primary-red, #E60023);
          color: #fff;
          border: none;
        }
        .sss-btn--red:hover {
          background: #C0001D;
          transform: translateY(-2px);
        }
        .sss-placeholder {
          font-family: var(--font-heading, 'Oswald'), sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #444;
          letter-spacing: 2px;
        }

        /* ── 반응형 ── */
        @media (max-width: 1200px) {
          .sss-grid { grid-template-columns: repeat(2, 1fr); }
          .sss-card--feature { grid-column: span 2; }
        }
        @media (max-width: 768px) {
          .sss-grid { grid-template-columns: 1fr; }
          .sss-card--feature { grid-column: span 1; }
          .sss-card__content { padding: 30px; }
          .sss-card__date,
          .sss-card--feature .sss-card__date { font-size: 3.5rem; }
        }
      `}</style>
    </section>
  )
}
