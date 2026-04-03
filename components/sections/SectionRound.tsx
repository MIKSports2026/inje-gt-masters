// components/sections/SectionRound.tsx — Round slider cards
'use client'
import { useRef } from 'react'
import Link from 'next/link'
import type { Round } from '@/types/sanity'

type RoundStatus = 'upcoming' | 'entry_open' | 'entry_closed' | 'ongoing' | 'finished'

interface Props { rounds: Round[] }

const FALLBACK: Array<{
  _id: string; roundNumber: number; dateStart: string; status: RoundStatus;
  slug: { current: string }; season: number; title: string; hasResults: boolean
}> = [
  { _id: 'fb1', roundNumber: 1, dateStart: '2026-04-26', status: 'entry_open', slug: { current: '2026-r1' }, season: 2026, title: 'R1', hasResults: false },
  { _id: 'fb2', roundNumber: 2, dateStart: '2026-06-07', status: 'upcoming', slug: { current: '2026-r2' }, season: 2026, title: 'R2', hasResults: false },
  { _id: 'fb3', roundNumber: 3, dateStart: '2026-08-02', status: 'upcoming', slug: { current: '2026-r3' }, season: 2026, title: 'R3', hasResults: false },
  { _id: 'fb4', roundNumber: 4, dateStart: '2026-09-06', status: 'upcoming', slug: { current: '2026-r4' }, season: 2026, title: 'R4', hasResults: false },
  { _id: 'fb5', roundNumber: 5, dateStart: '2026-10-11', status: 'upcoming', slug: { current: '2026-r5' }, season: 2026, title: 'R5', hasResults: false },
]

function badge(s: RoundStatus) {
  const map: Record<RoundStatus, { label: string; cls: string }> = {
    entry_open: { label: '접수중', cls: 'rnd__badge--open' },
    upcoming: { label: '접수예정', cls: '' },
    entry_closed: { label: '접수마감', cls: 'rnd__badge--closed' },
    ongoing: { label: '진행중', cls: 'rnd__badge--open' },
    finished: { label: '종료', cls: 'rnd__badge--closed' },
  }
  return map[s] ?? map.upcoming
}

function fmtDate(d: string) {
  const dt = new Date(d)
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}.${String(dt.getDate()).padStart(2, '0')}`
}

export default function SectionRound({ rounds }: Props) {
  const data = rounds.length > 0 ? rounds : FALLBACK as unknown as Round[]
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  return (
    <section className="rnd" id="rounds">
      <div className="rnd__hd">
        <div>
          <div className="rnd__kicker"><span className="rnd__kicker-line" />2026 ROUNDS</div>
          <h2 className="rnd__title">RACE SCHEDULE</h2>
        </div>
        <div className="rnd__arrows">
          <button className="rnd__arrow" onClick={() => scroll(-1)} aria-label="이전">←</button>
          <button className="rnd__arrow" onClick={() => scroll(1)} aria-label="다음">→</button>
        </div>
      </div>

      <div className="rnd__track" ref={scrollRef}>
        {data.map((r) => {
          const st = (r.status ?? 'upcoming') as RoundStatus
          const b = badge(st)
          const isOpen = st === 'entry_open'
          const dateStr = r.dateStart ? fmtDate(r.dateStart) : '—'

          return (
            <div key={r._id} className="rnd__card">
              <div className="rnd__card-bar" />
              <div className="rnd__card-inner">
                <div className={`rnd__badge ${b.cls}`}>{b.label}</div>
                <div className="rnd__num">R{String(r.roundNumber).padStart(2, '0')}</div>
                <div className="rnd__date">{dateStr}</div>
                <div className="rnd__loc">INJE SPEEDIUM</div>
                {isOpen ? (
                  <Link
                    href={`/entry?tab=apply&round=R${r.roundNumber}`}
                    className="rnd__cta rnd__cta--active"
                  >
                    참가 신청 →
                  </Link>
                ) : (
                  <span className="rnd__cta">접수 예정</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        .rnd { background: #0a0a0a; padding: 72px 0 64px; }
        .rnd__hd {
          max-width: 1400px; margin: 0 auto 28px; padding: 0 40px;
          display: flex; align-items: flex-end; justify-content: space-between;
        }
        .rnd__kicker {
          font-family: 'Oswald',sans-serif; font-size: .8rem; font-weight: 600;
          letter-spacing: .2em; color: #E60023;
          display: flex; align-items: center; gap: 10px; margin-bottom: 8px;
        }
        .rnd__kicker-line { width: 28px; height: 2px; background: #E60023; }
        .rnd__title {
          font-family: 'Oswald',sans-serif; font-size: clamp(1.6rem,3vw,2.4rem);
          font-weight: 700; letter-spacing: .04em; color: #fff; margin: 0;
        }
        .rnd__arrows { display: flex; gap: 6px; }
        .rnd__arrow {
          width: 36px; height: 36px; display: grid; place-items: center;
          background: none; border: 1px solid rgba(255,255,255,.1);
          color: rgba(255,255,255,.4); font-size: 1rem; cursor: pointer;
          transition: all .2s; font-family: 'Oswald',sans-serif;
        }
        .rnd__arrow:hover { border-color: #E60023; color: #E60023; }

        .rnd__track {
          max-width: 1400px; margin: 0 auto; padding: 0 40px;
          display: flex; gap: 2px; overflow-x: auto;
          scroll-snap-type: x mandatory;
          -ms-overflow-style: none; scrollbar-width: none;
        }
        .rnd__track::-webkit-scrollbar { display: none; }

        .rnd__card {
          flex: 0 0 260px; scroll-snap-align: start;
          background: #111; position: relative; overflow: hidden;
          transition: background .2s;
        }
        .rnd__card:hover { background: #161616; }
        .rnd__card-bar {
          position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: #E60023; transform: scaleY(0); transform-origin: top;
          transition: transform .3s ease;
        }
        .rnd__card:hover .rnd__card-bar { transform: scaleY(1); }
        .rnd__card-inner { padding: 28px 24px; }

        .rnd__badge {
          font-family: 'Oswald',sans-serif; font-size: .62rem; font-weight: 700;
          letter-spacing: .15em; text-transform: uppercase;
          color: rgba(255,255,255,.3); border: 1px solid rgba(255,255,255,.08);
          padding: 3px 10px; display: inline-block; margin-bottom: 16px;
        }
        .rnd__badge--open { color: #E60023; border-color: rgba(230,0,35,.25); }
        .rnd__badge--closed { color: rgba(255,255,255,.2); }

        .rnd__num {
          font-family: 'Oswald',sans-serif; font-size: 2.6rem; font-weight: 700;
          letter-spacing: .06em; color: #fff; line-height: 1;
          transform: skewX(-3deg); margin-bottom: 12px;
        }
        .rnd__date {
          font-family: 'Oswald',sans-serif; font-size: .8rem; font-weight: 500;
          letter-spacing: .12em; color: rgba(255,255,255,.45); margin-bottom: 4px;
        }
        .rnd__loc {
          font-family: 'Oswald',sans-serif; font-size: .7rem; font-weight: 600;
          letter-spacing: .15em; color: rgba(255,255,255,.2);
          margin-bottom: 20px;
        }

        .rnd__cta {
          font-family: 'Oswald',sans-serif; font-size: .72rem; font-weight: 600;
          letter-spacing: .12em; text-transform: uppercase; text-decoration: none;
          color: rgba(255,255,255,.25); border: 1px solid rgba(255,255,255,.08);
          padding: 8px 18px; display: inline-block;
        }
        .rnd__cta--active {
          color: #E60023; border-color: rgba(230,0,35,.3);
          transition: all .2s;
        }
        .rnd__cta--active:hover { background: rgba(230,0,35,.08); border-color: #E60023; }

        @media (max-width: 768px) {
          .rnd__hd { padding: 0 20px; }
          .rnd__track { padding: 0 20px; }
          .rnd__card { flex: 0 0 220px; }
        }
      `}</style>
    </section>
  )
}
