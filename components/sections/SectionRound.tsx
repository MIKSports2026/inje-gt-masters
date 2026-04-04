// components/sections/SectionRound.tsx — Horizontal accordion (like SectionSeason)
'use client'
import { useState } from 'react'
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
        <SectionHeader subtitle="2026 SEASON" title="RACE ROUNDS" />
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
              className={`rnd__p ${on ? 'rnd__p--on' : ''}`}
              onClick={() => setActive(i)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') setActive(i) }}
            >
              {/* 배경 이미지 */}
              {imgSrc && <div className="rnd__p-bg" style={{ backgroundImage: `url(${imgSrc})` }} />}
              <div className="rnd__p-ov" />
              <div className="rnd__p-bar" />

              {/* 닫힌: 세로 라운드번호 + 날짜 */}
              <div className="rnd__p-closed">
                <span className="rnd__p-closed-num">R{String(r.roundNumber).padStart(2, '0')}</span>
                <span className="rnd__p-closed-date">{dateStr}</span>
              </div>

              {/* 열린: 콘텐츠 */}
              <div className="rnd__p-open">
                {isOpen && <div className="rnd__p-tag">접수중</div>}
                {isFin && <div className="rnd__p-tag rnd__p-tag--fin">종료</div>}

                <div className="rnd__p-num">R{String(r.roundNumber).padStart(2, '0')}</div>
                <div className="rnd__p-date">{dateStr}</div>
                <div className="rnd__p-loc">INJE SPEEDIUM</div>

                {isOpen && (
                  <Link href={`/entry?tab=apply&round=R${r.roundNumber}`} className="rnd__p-cta" onClick={e => e.stopPropagation()}>
                    참가 신청 →
                  </Link>
                )}
                {isFin && resultUrl && (
                  <Link href={resultUrl} className="rnd__p-cta rnd__p-cta--ghost" onClick={e => e.stopPropagation()}>
                    결과 보기 →
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        .rnd { background: #0a0a0a; padding: 72px 0 64px; }
        .rnd__hd {
          max-width: 1400px; margin: 0 auto 32px; padding: 0 40px;
          display: flex; align-items: flex-end; justify-content: space-between;
        }

        /* ── Accordion ── */
        .rnd__acc {
          max-width: 1400px; margin: 0 auto; padding: 0 40px;
          display: flex; gap: 2px; height: 400px;
        }
        .rnd__p {
          flex: 1; position: relative; overflow: hidden; cursor: pointer;
          background: var(--bg-carbon-light, #1a1a1a);
          transition: flex .6s cubic-bezier(.25,1,.5,1);
          display: flex; align-items: flex-end;
        }
        .rnd__p--on { flex: 6; }

        .rnd__p-bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          opacity: 0; transition: opacity .6s ease;
        }
        .rnd__p--on .rnd__p-bg { opacity: 1; }

        .rnd__p-ov {
          position: absolute; inset: 0;
          background: linear-gradient(to right, rgba(10,10,10,.92) 0%, rgba(10,10,10,.25) 100%);
          z-index: 1;
        }
        .rnd__p-bar {
          position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
          background: #E60023; transform: scaleY(0); transform-origin: top;
          transition: transform .4s ease .1s; z-index: 3;
        }
        .rnd__p--on .rnd__p-bar { transform: scaleY(1); }

        /* Closed */
        .rnd__p-closed {
          position: absolute; inset: 0; z-index: 2;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
          transition: opacity .25s;
        }
        .rnd__p--on .rnd__p-closed { opacity: 0; pointer-events: none; }

        .rnd__p-closed-num {
          font-family: 'Oswald',sans-serif; font-size: 1.8rem; font-weight: 900;
          letter-spacing: -.03em; color: rgba(255,255,255,.2);
          writing-mode: vertical-lr; text-orientation: mixed;
          transform: skewY(-5deg);
        }
        .rnd__p:hover .rnd__p-closed-num { color: rgba(255,255,255,.4); }
        .rnd__p-closed-date {
          font-family: 'Oswald',sans-serif; font-size: .7rem; font-weight: 500;
          letter-spacing: .1em; color: rgba(255,255,255,.12);
          writing-mode: vertical-lr;
        }

        /* Open */
        .rnd__p-open {
          position: relative; z-index: 2; padding: 20px 28px;
          opacity: 0; transform: translateX(-12px);
          transition: opacity .4s ease .2s, transform .4s ease .2s;
        }
        .rnd__p--on .rnd__p-open { opacity: 1; transform: translateX(0); }

        .rnd__p-tag {
          display: inline-block;
          font-family: 'Oswald',sans-serif; font-size: 1rem; font-weight: 700;
          letter-spacing: .18em; text-transform: uppercase;
          color: #E60023; border-left: 3px solid #E60023;
          padding: 4px 16px; margin-bottom: 12px;
          transform: skewX(-20deg);
        }
        .rnd__p-tag--fin { color: rgba(255,255,255,.2); border-color: rgba(255,255,255,.1); }

        .rnd__p-num {
          font-family: 'Oswald',sans-serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900; letter-spacing: -.05em;
          color: #fff; line-height: .85;
          transform: skewX(-8deg);
          margin-bottom: 4px;
        }
        .rnd__p-date {
          font-family: 'Oswald',sans-serif; font-size: 1.4rem; font-weight: 700;
          letter-spacing: -.03em; color: rgba(255,255,255,.5);
          transform: skewX(-5deg);
          margin-bottom: 4px;
        }
        .rnd__p-loc {
          font-family: 'Oswald',sans-serif; font-size: .85rem; font-weight: 600;
          letter-spacing: .1em; color: rgba(255,255,255,.15);
          margin-bottom: 12px;
        }

        .rnd__p-cta {
          display: inline-block;
          font-family: 'Oswald',sans-serif; font-size: .95rem; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase; text-decoration: none;
          padding: 12px 28px; transform: skewX(-15deg);
          color: #fff; background: var(--primary-red, #E60023); border: none;
          transition: transform .2s, box-shadow .2s;
        }
        .rnd__p-cta:hover {
          transform: skewX(-15deg) scale(1.03);
          box-shadow: 0 0 15px rgba(230,0,35,.4);
        }
        .rnd__p-cta--ghost {
          background: transparent; color: #fff;
          border: 2px solid #fff;
        }
        .rnd__p-cta--ghost:hover {
          background: #fff; color: var(--bg-carbon, #0a0a0a);
          transform: skewX(-15deg) scale(1.03);
          box-shadow: none;
        }

        /* Mobile */
        @media (max-width: 900px) {
          .rnd__acc { flex-direction: column; height: auto; padding: 0 20px; }
          .rnd__p { height: 56px; flex: none !important; transition: height .5s cubic-bezier(.25,1,.5,1); }
          .rnd__p--on { height: 240px; }
          .rnd__p-closed { flex-direction: row; gap: 14px; }
          .rnd__p-closed-num { writing-mode: horizontal-tb; transform: none; font-size: 1.4rem; }
          .rnd__p-closed-date { writing-mode: horizontal-tb; font-size: .8rem; }
          .rnd__hd { padding: 0 20px; }
          .rnd__p-num { font-size: 3.5rem; }
          .rnd__p-date { font-size: 1.6rem; }
        }
      `}</style>
    </section>
  )
}
