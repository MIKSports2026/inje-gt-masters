// components/sections/SectionSeason.tsx — v6 Accordion with fallback data
'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Round } from '@/types/sanity'

interface Props { rounds: Round[] }

const FALLBACK_ROUNDS = [
  { _id: 'fb-r1', roundNumber: 1, title: 'R1 개막전', dateStart: '2026-04-26', status: 'entry_open' as const, slug: { current: '2026-r1' }, season: 2026, hasResults: false },
  { _id: 'fb-r2', roundNumber: 2, title: 'R2 서머레이스', dateStart: '2026-06-07', status: 'upcoming' as const, slug: { current: '2026-r2' }, season: 2026, hasResults: false },
  { _id: 'fb-r3', roundNumber: 3, title: 'R3 나이트레이스', dateStart: '2026-08-02', status: 'upcoming' as const, slug: { current: '2026-r3' }, season: 2026, hasResults: false },
  { _id: 'fb-r4', roundNumber: 4, title: 'R4 챔피언십', dateStart: '2026-09-06', status: 'upcoming' as const, slug: { current: '2026-r4' }, season: 2026, hasResults: false },
  { _id: 'fb-r5', roundNumber: 5, title: 'R5 파이널', dateStart: '2026-10-11', status: 'upcoming' as const, slug: { current: '2026-r5' }, season: 2026, hasResults: false },
]

const CLASSES = ['Master 1', 'Master 2', 'Master N', 'Master 3']

export default function SectionSeason({ rounds }: Props) {
  const data = rounds.length > 0 ? rounds : FALLBACK_ROUNDS as unknown as Round[]
  const [active, setActive] = useState(0)

  return (
    <section className="ssn" id="schedule" aria-labelledby="ssn-ttl">
      <div className="ssn__hd">
        <div>
          <div className="ssn__kicker">
            <span className="ssn__kicker-line" />
            SEASON 2026
          </div>
          <h2 className="ssn__title" id="ssn-ttl">RACE CALENDAR</h2>
        </div>
        <div className="ssn__rounds-badge">5 ROUNDS</div>
      </div>

      <div className="ssn__accordion">
        {data.map((r, i) => {
          const isActive = active === i
          const dd = r.dateStart ? new Date(r.dateStart) : null
          const dateStr = dd
            ? `${dd.getFullYear()}.${String(dd.getMonth() + 1).padStart(2, '0')}.${String(dd.getDate()).padStart(2, '0')}`
            : '—'
          const isOpen = r.status === 'entry_open'
          const heroUrl = (r as any).heroImage?.asset?.url as string | undefined

          return (
            <div
              key={r._id}
              className={`ssn__panel ${isActive ? 'ssn__panel--active' : ''}`}
              onClick={() => setActive(i)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') setActive(i) }}
            >
              {heroUrl && (
                <div className="ssn__panel-bg" style={{ backgroundImage: `url(${heroUrl})` }} />
              )}
              <div className="ssn__panel-overlay" />
              <div className="ssn__panel-bar" />

              <div className="ssn__panel-num">
                R{String(r.roundNumber).padStart(2, '0')}
              </div>

              <div className="ssn__panel-info">
                <div className="ssn__panel-date">{dateStr}</div>
                <div className={`ssn__panel-status ${isOpen ? 'ssn__panel-status--open' : ''}`}>
                  {isOpen ? 'ENTRY OPEN' : 'UPCOMING'}
                </div>
                <div className="ssn__panel-round">
                  ROUND {String(r.roundNumber).padStart(2, '0')}
                </div>
                <div className="ssn__panel-venue">{r.title}</div>
                {/* 클래스 태그 */}
                <div className="ssn__panel-classes">
                  {CLASSES.map(c => (
                    <span key={c} className="ssn__class-tag">{c}</span>
                  ))}
                </div>
                <Link
                  href={`/season/${r.slug.current}`}
                  className="ssn__panel-link"
                  onClick={e => e.stopPropagation()}
                >
                  자세히 보기 →
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        .ssn { background: #0a0a0a; padding: 80px 0; position: relative; }
        .ssn__hd {
          max-width: 1400px; margin: 0 auto; padding: 0 40px;
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 40px;
        }
        .ssn__kicker {
          font-family: 'Oswald', sans-serif; font-size: .85rem; font-weight: 600;
          letter-spacing: .2em; text-transform: uppercase; color: #E60023;
          display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
        }
        .ssn__kicker-line { display: inline-block; width: 32px; height: 2px; background: #E60023; }
        .ssn__title {
          font-family: 'Oswald', sans-serif; font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 700; letter-spacing: .04em; color: #fff; line-height: 1; margin: 0;
        }
        .ssn__rounds-badge {
          font-family: 'Oswald', sans-serif; font-size: .9rem; font-weight: 600;
          letter-spacing: .15em; color: rgba(255,255,255,.3);
          border: 1px solid rgba(255,255,255,.1); padding: 6px 16px;
        }
        .ssn__accordion {
          max-width: 1400px; margin: 0 auto; padding: 0 40px;
          display: flex; gap: 2px; height: 500px;
        }
        .ssn__panel {
          flex: 1; position: relative; overflow: hidden; cursor: pointer;
          background: #111; transition: flex .6s cubic-bezier(.25,1,.5,1);
          display: flex; align-items: flex-end;
        }
        .ssn__panel--active { flex: 5; }
        .ssn__panel-bg {
          position: absolute; inset: 0; background-size: cover; background-position: center;
          opacity: 0; transition: opacity .6s ease;
        }
        .ssn__panel--active .ssn__panel-bg { opacity: 1; }
        .ssn__panel-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to right, rgba(10,10,10,.9) 0%, rgba(10,10,10,.2) 100%);
          z-index: 1;
        }
        .ssn__panel-bar {
          position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
          background: #E60023; transform: scaleY(0); transform-origin: top;
          transition: transform .4s ease .1s; z-index: 3;
        }
        .ssn__panel--active .ssn__panel-bar { transform: scaleY(1); }
        .ssn__panel-num {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          font-family: 'Oswald', sans-serif; font-size: 1.4rem; font-weight: 700;
          letter-spacing: .1em; color: #333; writing-mode: vertical-lr; text-orientation: mixed;
          z-index: 2; transition: color .3s, opacity .3s;
        }
        .ssn__panel:hover .ssn__panel-num { color: #666; }
        .ssn__panel--active .ssn__panel-num { opacity: 0; }
        .ssn__panel-info {
          position: relative; z-index: 2; padding: 32px 28px;
          opacity: 0; transform: translateX(-12px);
          transition: opacity .4s ease .2s, transform .4s ease .2s;
        }
        .ssn__panel--active .ssn__panel-info { opacity: 1; transform: translateX(0); }
        .ssn__panel-date {
          font-family: 'Oswald', sans-serif; font-size: .8rem; font-weight: 500;
          letter-spacing: .15em; color: rgba(255,255,255,.5); margin-bottom: 8px;
        }
        .ssn__panel-status {
          font-family: 'Oswald', sans-serif; font-size: .72rem; font-weight: 700;
          letter-spacing: .2em; text-transform: uppercase; color: rgba(255,255,255,.4);
          margin-bottom: 14px;
        }
        .ssn__panel-status--open { color: #E60023; }
        .ssn__panel-round {
          font-family: 'Oswald', sans-serif; font-size: clamp(1.8rem, 3vw, 2.8rem);
          font-weight: 700; letter-spacing: .05em; color: #fff; line-height: 1; margin-bottom: 6px;
        }
        .ssn__panel-venue {
          font-family: 'Noto Sans KR', sans-serif; font-size: .9rem; font-weight: 500;
          color: rgba(255,255,255,.65); margin-bottom: 12px;
        }
        .ssn__panel-classes {
          display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px;
        }
        .ssn__class-tag {
          font-family: 'Oswald', sans-serif; font-size: .65rem; font-weight: 600;
          letter-spacing: .1em; text-transform: uppercase;
          color: rgba(255,255,255,.5); border: 1px solid rgba(255,255,255,.12);
          padding: 3px 8px; background: rgba(255,255,255,.04);
        }
        .ssn__panel-link {
          font-family: 'Oswald', sans-serif; font-size: .78rem; font-weight: 600;
          letter-spacing: .12em; text-transform: uppercase; color: #E60023;
          text-decoration: none; transition: opacity .2s;
        }
        .ssn__panel-link:hover { opacity: .7; }
        @media (max-width: 900px) {
          .ssn__accordion { flex-direction: column; height: auto; padding: 0 20px; }
          .ssn__panel { height: 80px; flex: none !important; transition: height .5s cubic-bezier(.25,1,.5,1); }
          .ssn__panel--active { height: 300px; }
          .ssn__panel-num { writing-mode: horizontal-tb; }
          .ssn__hd { padding: 0 20px; }
        }
      `}</style>
    </section>
  )
}
