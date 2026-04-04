// components/sections/SectionSeason.tsx — v7 Compact accordion
'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Round } from '@/types/sanity'

type RoundStatus = 'upcoming' | 'entry_open' | 'entry_closed' | 'ongoing' | 'finished'

interface Props { rounds: Round[] }

const FALLBACK_ROUNDS: Array<{
  _id: string; roundNumber: number; title: string; dateStart: string;
  status: RoundStatus; slug: { current: string }; season: number; hasResults: boolean
}> = [
  { _id: 'fb-r1', roundNumber: 1, title: 'R1 개막전', dateStart: '2026-04-26', status: 'entry_open', slug: { current: '2026-r1' }, season: 2026, hasResults: false },
  { _id: 'fb-r2', roundNumber: 2, title: 'R2 서머레이스', dateStart: '2026-06-07', status: 'upcoming', slug: { current: '2026-r2' }, season: 2026, hasResults: false },
  { _id: 'fb-r3', roundNumber: 3, title: 'R3 나이트레이스', dateStart: '2026-08-02', status: 'upcoming', slug: { current: '2026-r3' }, season: 2026, hasResults: false },
  { _id: 'fb-r4', roundNumber: 4, title: 'R4 챔피언십', dateStart: '2026-09-06', status: 'upcoming', slug: { current: '2026-r4' }, season: 2026, hasResults: false },
  { _id: 'fb-r5', roundNumber: 5, title: 'R5 파이널', dateStart: '2026-10-11', status: 'upcoming', slug: { current: '2026-r5' }, season: 2026, hasResults: false },
]

function statusLabel(s: RoundStatus) {
  const m: Record<RoundStatus, string> = {
    entry_open: 'ENTRY OPEN', upcoming: 'UPCOMING', entry_closed: 'CLOSED',
    ongoing: 'ONGOING', finished: 'FINISHED',
  }
  return m[s] ?? 'UPCOMING'
}

function statusButton(s: RoundStatus, slug: string) {
  if (s === 'finished') return { label: '결과보기', href: `/results?round=${slug}` }
  if (s === 'entry_open') return { label: '접수하기', href: `/entry?round=${slug}` }
  return { label: '접수예정', href: `/season/${slug}` }
}

function fmtDate(d: string) {
  const dt = new Date(d)
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}.${String(dt.getDate()).padStart(2, '0')}`
}

export default function SectionSeason({ rounds }: Props) {
  const data = rounds.length > 0 ? rounds : FALLBACK_ROUNDS as unknown as Round[]
  const [active, setActive] = useState(0)

  return (
    <section className="ssn" id="schedule">
      <div className="ssn__hd">
        <div>
          <div className="ssn__kicker"><span className="ssn__kicker-line" />SEASON 2026</div>
          <h2 className="ssn__title">RACE CALENDAR</h2>
        </div>
        <div className="ssn__badge">5 ROUNDS</div>
      </div>

      <div className="ssn__acc">
        {data.map((r, i) => {
          const isActive = active === i
          const dateStr = r.dateStart ? fmtDate(r.dateStart) : '—'
          const st = (r.status ?? 'upcoming') as RoundStatus
          const isOpen = st === 'entry_open'
          const btn = statusButton(st, r.slug.current)
          const heroUrl = (r as any).heroImage?.asset?.url as string | undefined

          return (
            <div
              key={r._id}
              className={`ssn__p ${isActive ? 'ssn__p--on' : ''}`}
              onClick={() => setActive(i)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') setActive(i) }}
            >
              {heroUrl && <div className="ssn__p-bg" style={{ backgroundImage: `url(${heroUrl})` }} />}
              <div className="ssn__p-ov" />
              <div className="ssn__p-bar" />

              {/* 접힌 상태: 라운드번호 + 날짜 */}
              <div className="ssn__p-collapsed">
                <span className="ssn__p-rn">R{String(r.roundNumber).padStart(2, '0')}</span>
                <span className="ssn__p-dt">{dateStr}</span>
              </div>

              {/* 펼친 상태: 한 줄 정보 + 버튼 */}
              <div className="ssn__p-expanded">
                <div className="ssn__p-meta">
                  <span className="ssn__p-rn-big">{r.roundNumber} ROUND</span>
                  <span className="ssn__p-sep">·</span>
                  <span>{dateStr}</span>
                  <span className="ssn__p-sep">·</span>
                  <span className={`ssn__p-st ${isOpen ? 'ssn__p-st--open' : ''}`}>{statusLabel(st)}</span>
                </div>
                <div className="ssn__p-venue">{r.title}</div>
                <Link
                  href={btn.href}
                  className={`ssn__p-btn ${st === 'entry_open' ? 'ssn__p-btn--red' : ''}`}
                  onClick={e => e.stopPropagation()}
                >
                  {btn.label}
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        .ssn { background: #0a0a0a; padding: 60px 0; }
        .ssn__hd {
          max-width: 1400px; margin: 0 auto 32px; padding: 0 40px;
          display: flex; align-items: flex-end; justify-content: space-between;
        }
        .ssn__kicker {
          font-family: 'Oswald',sans-serif; font-size: 2.7rem; font-weight: 600;
          letter-spacing: .2em; color: #E60023; display: flex; align-items: center; gap: 10px;
          margin-bottom: 8px;
        }
        .ssn__kicker-line { width: 28px; height: 2px; background: #E60023; }
        .ssn__title {
          font-family: 'Oswald',sans-serif; font-size: clamp(2.7rem,5.25vw,4.2rem);
          font-weight: 700; letter-spacing: .04em; color: #fff; line-height: 1; margin: 0;
        }
        .ssn__badge {
          font-family: 'Oswald',sans-serif; font-size: .8rem; font-weight: 600;
          letter-spacing: .15em; color: rgba(255,255,255,.25);
          border: 1px solid rgba(255,255,255,.08); padding: 5px 14px;
        }

        /* Accordion */
        .ssn__acc {
          max-width: 1400px; margin: 0 auto; padding: 0 40px;
          display: flex; gap: 2px; height: 250px;
        }
        .ssn__p {
          flex: 1; position: relative; overflow: hidden; cursor: pointer;
          background: #111; transition: flex .5s cubic-bezier(.25,1,.5,1);
          display: flex; align-items: stretch;
        }
        .ssn__p--on { flex: 6; }

        .ssn__p-bg {
          position: absolute; inset: 0; background-size: cover; background-position: center;
          opacity: 0; transition: opacity .5s ease;
        }
        .ssn__p--on .ssn__p-bg { opacity: 1; }

        .ssn__p-ov {
          position: absolute; inset: 0;
          background: linear-gradient(to right, rgba(10,10,10,.92) 0%, rgba(10,10,10,.3) 100%);
          z-index: 1;
        }
        .ssn__p-bar {
          position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: #E60023; transform: scaleY(0); transform-origin: top;
          transition: transform .35s ease .08s; z-index: 3;
        }
        .ssn__p--on .ssn__p-bar { transform: scaleY(1); }

        /* Collapsed */
        .ssn__p-collapsed {
          position: absolute; inset: 0; z-index: 2;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
          transition: opacity .3s;
        }
        .ssn__p--on .ssn__p-collapsed { opacity: 0; pointer-events: none; }

        .ssn__p-rn {
          font-family: 'Oswald',sans-serif; font-size: 1.2rem; font-weight: 700;
          letter-spacing: .1em; color: #444;
        }
        .ssn__p:hover .ssn__p-rn { color: #666; }
        .ssn__p-dt {
          font-family: 'Oswald',sans-serif; font-size: .65rem; font-weight: 500;
          letter-spacing: .1em; color: #333; writing-mode: vertical-lr;
        }

        /* Expanded */
        .ssn__p-expanded {
          position: relative; z-index: 2; padding: 28px 24px;
          display: flex; flex-direction: column; justify-content: flex-end; height: 100%;
          opacity: 0; transform: translateX(-10px);
          transition: opacity .35s ease .15s, transform .35s ease .15s;
        }
        .ssn__p--on .ssn__p-expanded { opacity: 1; transform: translateX(0); }

        .ssn__p-meta {
          font-family: 'Oswald',sans-serif; font-size: .72rem; font-weight: 600;
          letter-spacing: .12em; color: rgba(255,255,255,.55);
          display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
          margin-bottom: 6px;
        }
        .ssn__p-sep { color: rgba(255,255,255,.2); }
        .ssn__p-rn-big {
          font-size: .85rem; font-weight: 700; color: #fff; letter-spacing: .08em;
        }
        .ssn__p-st { color: rgba(255,255,255,.4); }
        .ssn__p-st--open { color: #E60023; }

        .ssn__p-venue {
          font-family: 'Noto Sans KR',sans-serif; font-size: .85rem; font-weight: 500;
          color: rgba(255,255,255,.6); margin-bottom: 14px;
        }

        .ssn__p-btn {
          display: inline-block; align-self: flex-start;
          font-family: 'Oswald',sans-serif; font-size: .7rem; font-weight: 600;
          letter-spacing: .12em; text-transform: uppercase; text-decoration: none;
          color: rgba(255,255,255,.5); border: 1px solid rgba(255,255,255,.12);
          padding: 6px 16px; transition: all .2s;
        }
        .ssn__p-btn:hover { color: #fff; border-color: rgba(255,255,255,.3); }
        .ssn__p-btn--red { color: #E60023; border-color: rgba(230,0,35,.3); }
        .ssn__p-btn--red:hover { background: rgba(230,0,35,.1); border-color: #E60023; }

        /* Mobile */
        @media (max-width: 900px) {
          .ssn__acc { flex-direction: column; height: auto; padding: 0 20px; }
          .ssn__p { height: 60px; flex: none !important; transition: height .4s cubic-bezier(.25,1,.5,1); }
          .ssn__p--on { height: 200px; }
          .ssn__p-collapsed { flex-direction: row; gap: 12px; }
          .ssn__p-dt { writing-mode: horizontal-tb; }
          .ssn__hd { padding: 0 20px; }
        }
      `}</style>
    </section>
  )
}
