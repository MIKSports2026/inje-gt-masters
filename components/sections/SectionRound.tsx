// components/sections/SectionRound.tsx — Vertical accordion
'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Round } from '@/types/sanity'

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

function fmtDate(d: string) {
  const dt = new Date(d)
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}.${String(dt.getDate()).padStart(2, '0')}`
}

export default function SectionRound({ rounds }: Props) {
  const data = rounds.length > 0 ? rounds : FALLBACK as unknown as Round[]
  const openIdx = data.findIndex(r => r.status === 'entry_open')
  const [active, setActive] = useState(openIdx >= 0 ? openIdx : 0)

  return (
    <section className="rnd" id="rounds">
      <div className="rnd__hd">
        <div className="rnd__kicker"><span className="rnd__kicker-line" />2026 SEASON</div>
        <h2 className="rnd__title">ROUNDS</h2>
      </div>

      <div className="rnd__acc">
        {data.map((r, i) => {
          const on = active === i
          const st = (r.status ?? 'upcoming') as RoundStatus
          const isOpen = st === 'entry_open'
          const isFin = st === 'finished'
          const dateStr = r.dateStart ? fmtDate(r.dateStart) : '—'
          const heroUrl = (r as any).heroImage?.asset?.url as string | undefined
          const resultUrl = (r as any).resultUrl as string | undefined
          const resultImg = (r as any).resultImage?.asset?.url as string | undefined
          const imgSrc = isFin ? (resultImg ?? heroUrl) : heroUrl

          return (
            <div
              key={r._id}
              className={`rnd__panel ${on ? 'rnd__panel--on' : ''}`}
              onClick={() => setActive(i)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') setActive(i) }}
            >
              {/* ── 닫힌 상태: 한 줄 ── */}
              <div className="rnd__closed">
                <span className="rnd__closed-num">R{String(r.roundNumber).padStart(2, '0')}</span>
                <span className="rnd__closed-date">{dateStr}</span>
                {isOpen && <span className="rnd__closed-badge">OPEN</span>}
                {isFin && <span className="rnd__closed-badge rnd__closed-badge--fin">END</span>}
              </div>

              {/* ── 열린 상태 ── */}
              <div className="rnd__opened">
                <div className="rnd__opened-left">
                  {isOpen && <div className="rnd__tag">접수중</div>}
                  {isFin && <div className="rnd__tag rnd__tag--fin">종료</div>}

                  <div className="rnd__num">R{String(r.roundNumber).padStart(2, '0')}</div>
                  <div className="rnd__date">{dateStr}</div>
                  <div className="rnd__loc">INJE SPEEDIUM</div>

                  {isOpen && (
                    <Link href={`/entry?tab=apply&round=R${r.roundNumber}`} className="rnd__cta" onClick={e => e.stopPropagation()}>
                      참가 신청 →
                    </Link>
                  )}
                  {isFin && resultUrl && (
                    <Link href={resultUrl} className="rnd__cta rnd__cta--ghost" onClick={e => e.stopPropagation()}>
                      결과 보기 →
                    </Link>
                  )}
                </div>

                <div className="rnd__opened-right">
                  <div className="rnd__img-shadow" />
                  <div className="rnd__img-wrap">
                    {imgSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imgSrc} alt={`R${r.roundNumber}`} className="rnd__img" />
                    ) : (
                      <div className="rnd__img-fb" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        .rnd { background: #0a0a0a; padding: 72px 0 64px; }
        .rnd__hd { max-width: 1400px; margin: 0 auto 32px; padding: 0 40px; }
        .rnd__kicker {
          font-family: 'Oswald',sans-serif; font-size: .8rem; font-weight: 600;
          letter-spacing: .2em; color: #E60023;
          display: flex; align-items: center; gap: 10px; margin-bottom: 8px;
        }
        .rnd__kicker-line { width: 28px; height: 2px; background: #E60023; }
        .rnd__title {
          font-family: 'Oswald',sans-serif; font-size: clamp(2rem,4vw,3.2rem);
          font-weight: 900; letter-spacing: -.03em; color: #fff; margin: 0;
        }

        .rnd__acc {
          max-width: 1400px; margin: 0 auto; padding: 0 40px;
          display: flex; flex-direction: column; gap: 2px;
        }

        /* Panel */
        .rnd__panel {
          position: relative; overflow: hidden; cursor: pointer;
          background: #111; height: 80px;
          transition: height .5s cubic-bezier(.25,1,.5,1);
        }
        .rnd__panel--on { height: 400px; }

        /* Closed row */
        .rnd__closed {
          position: absolute; inset: 0; z-index: 2;
          display: flex; align-items: center; gap: 20px;
          padding: 0 32px;
          transition: opacity .25s;
        }
        .rnd__panel--on .rnd__closed { opacity: 0; pointer-events: none; }

        .rnd__closed-num {
          font-family: 'Oswald',sans-serif; font-size: 2rem; font-weight: 900;
          letter-spacing: -.03em; color: rgba(255,255,255,.25);
          transform: skewX(-10deg);
        }
        .rnd__panel:hover .rnd__closed-num { color: rgba(255,255,255,.45); }
        .rnd__closed-date {
          font-family: 'Oswald',sans-serif; font-size: 1.4rem; font-weight: 700;
          letter-spacing: -.02em; color: rgba(255,255,255,.15);
        }
        .rnd__closed-badge {
          font-family: 'Oswald',sans-serif; font-size: .6rem; font-weight: 700;
          letter-spacing: .18em; color: #E60023;
          border: 1px solid rgba(230,0,35,.3); padding: 2px 10px;
          transform: skewX(-20deg);
        }
        .rnd__closed-badge--fin { color: rgba(255,255,255,.2); border-color: rgba(255,255,255,.08); }

        /* Opened */
        .rnd__opened {
          position: absolute; inset: 0; z-index: 1;
          display: grid; grid-template-columns: 1fr 1.1fr; gap: 40px;
          align-items: center; padding: 0 40px;
          opacity: 0; transition: opacity .4s ease .15s;
        }
        .rnd__panel--on .rnd__opened { opacity: 1; }

        .rnd__tag {
          display: inline-block;
          font-family: 'Oswald',sans-serif; font-size: .7rem; font-weight: 700;
          letter-spacing: .18em; text-transform: uppercase;
          color: #E60023; border-left: 2px solid #E60023;
          padding: 3px 14px; margin-bottom: 16px;
          transform: skewX(-20deg);
        }
        .rnd__tag--fin { color: rgba(255,255,255,.25); border-color: rgba(255,255,255,.12); }

        .rnd__num {
          font-family: 'Oswald',sans-serif; font-size: 6rem; font-weight: 900;
          letter-spacing: -.05em; color: #fff; line-height: .85;
          transform: skewX(-10deg); margin-bottom: 8px;
        }
        .rnd__date {
          font-family: 'Oswald',sans-serif; font-size: 2.5rem; font-weight: 700;
          letter-spacing: -.03em; color: rgba(255,255,255,.5);
          transform: skewX(-8deg); margin-bottom: 6px;
        }
        .rnd__loc {
          font-family: 'Oswald',sans-serif; font-size: 1.2rem; font-weight: 600;
          letter-spacing: .1em; color: rgba(255,255,255,.18);
          margin-bottom: 24px;
        }

        .rnd__cta {
          display: inline-block;
          font-family: 'Oswald',sans-serif; font-size: .85rem; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase; text-decoration: none;
          padding: 12px 32px; transform: skewX(-15deg);
          color: #fff; border: 1px solid #E60023;
          background: linear-gradient(135deg, rgba(230,0,35,.18), transparent);
          transition: all .25s;
        }
        .rnd__cta:hover {
          background: linear-gradient(135deg, rgba(230,0,35,.35), rgba(230,0,35,.05));
          box-shadow: 4px 4px 0 rgba(230,0,35,.2);
        }
        .rnd__cta--ghost {
          color: rgba(255,255,255,.5); border-color: rgba(255,255,255,.12);
          background: none;
        }
        .rnd__cta--ghost:hover { color: #fff; border-color: rgba(255,255,255,.3); }

        /* Image */
        .rnd__opened-right { position: relative; height: 320px; }
        .rnd__img-shadow {
          position: absolute; inset: 6px -6px -6px 6px;
          background: #E60023; opacity: .25;
          clip-path: polygon(8% 0, 100% 0, 92% 100%, 0 100%);
        }
        .rnd__img-wrap {
          position: relative; width: 100%; height: 100%;
          clip-path: polygon(8% 0, 100% 0, 92% 100%, 0 100%);
          overflow: hidden;
        }
        .rnd__img { width: 100%; height: 100%; object-fit: cover; }
        .rnd__img-fb {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, #111 0%, #1a0008 100%);
        }

        /* Mobile */
        @media (max-width: 992px) {
          .rnd__acc { padding: 0 20px; }
          .rnd__hd { padding: 0 20px; }
          .rnd__panel { height: 70px; }
          .rnd__panel--on { height: 520px; }
          .rnd__opened { grid-template-columns: 1fr; gap: 20px; padding: 20px; }
          .rnd__opened-right { height: 200px; order: -1; }
          .rnd__img-wrap { clip-path: polygon(6% 0, 100% 0, 94% 100%, 0 100%); }
          .rnd__img-shadow { clip-path: polygon(6% 0, 100% 0, 94% 100%, 0 100%); }
          .rnd__num { font-size: 3.5rem; }
          .rnd__date { font-size: 1.6rem; }
          .rnd__closed-num { font-size: 1.4rem; }
          .rnd__closed-date { font-size: 1rem; }
        }
      `}</style>
    </section>
  )
}
