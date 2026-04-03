// components/sections/SectionRound.tsx — Diagonal slider
'use client'
import { useState, useEffect, useCallback } from 'react'
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

function badgeInfo(s: RoundStatus) {
  if (s === 'entry_open') return { label: '접수중', cls: 'rnd__st--open' }
  if (s === 'entry_closed') return { label: '접수마감', cls: 'rnd__st--dim' }
  if (s === 'finished') return { label: '종료', cls: 'rnd__st--dim' }
  return { label: '접수예정', cls: '' }
}

function fmtDate(d: string) {
  const dt = new Date(d)
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}.${String(dt.getDate()).padStart(2, '0')}`
}

export default function SectionRound({ rounds }: Props) {
  const data = rounds.length > 0 ? rounds : FALLBACK as unknown as Round[]
  const [idx, setIdx] = useState(0)

  const next = useCallback(() => {
    setIdx(prev => (prev + 1) % data.length)
  }, [data.length])

  useEffect(() => {
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [next])

  const r = data[idx]
  const st = (r.status ?? 'upcoming') as RoundStatus
  const b = badgeInfo(st)
  const isOpen = st === 'entry_open'
  const dateStr = r.dateStart ? fmtDate(r.dateStart) : '—'
  const heroUrl = (r as any).heroImage?.asset?.url as string | undefined

  return (
    <section className="rnd" id="rounds">
      <div className="rnd__inner">
        {/* 좌측: 이미지 슬라이스 */}
        <div className="rnd__visual">
          <div className="rnd__img-shadow" />
          <div className="rnd__img-wrap">
            {heroUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={heroUrl} alt={r.title} className="rnd__img" />
            ) : (
              <div className="rnd__img-fallback" />
            )}
          </div>
        </div>

        {/* 우측: 콘텐츠 */}
        <div className="rnd__content" key={idx}>
          <div className={`rnd__st ${b.cls}`}>{b.label}</div>
          <div className="rnd__num">R{String(r.roundNumber).padStart(2, '0')}</div>
          <div className="rnd__date">{dateStr}</div>
          <div className="rnd__loc">
            <span className="rnd__slash">/</span>
            <span>INJE SPEEDIUM</span>
          </div>
          {isOpen ? (
            <Link href={`/entry?tab=apply&round=R${r.roundNumber}`} className="rnd__cta rnd__cta--on">
              참가 신청 →
            </Link>
          ) : (
            <span className="rnd__cta">접수 예정</span>
          )}
        </div>
      </div>

      {/* 슬래시 도트 네비게이션 */}
      <div className="rnd__dots">
        {data.map((_, i) => (
          <button
            key={i}
            className={`rnd__dot ${idx === i ? 'rnd__dot--on' : ''}`}
            onClick={() => setIdx(i)}
            aria-label={`Round ${i + 1}`}
          />
        ))}
      </div>

      <style>{`
        .rnd { background: #0a0a0a; padding: 72px 0 48px; overflow: hidden; }
        .rnd__inner {
          max-width: 1400px; margin: 0 auto; padding: 0 40px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center;
        }

        /* Visual — diagonal slice */
        .rnd__visual { position: relative; height: 400px; }
        .rnd__img-shadow {
          position: absolute; inset: 8px -8px -8px 8px;
          background: #E60023;
          clip-path: polygon(8% 0, 100% 0, 92% 100%, 0 100%);
          opacity: .35;
        }
        .rnd__img-wrap {
          position: relative; width: 100%; height: 100%;
          clip-path: polygon(8% 0, 100% 0, 92% 100%, 0 100%);
          overflow: hidden;
        }
        .rnd__img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform .6s ease;
        }
        .rnd__img-wrap:hover .rnd__img { transform: scale(1.04); }
        .rnd__img-fallback {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, #111 0%, #1a1a1a 50%, #0d0005 100%);
        }

        /* Content */
        .rnd__content {
          animation: rndFadeIn .5s ease forwards;
        }
        @keyframes rndFadeIn {
          from { opacity: 0; transform: translateX(16px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .rnd__st {
          display: inline-block;
          font-family: 'Oswald',sans-serif; font-size: .68rem; font-weight: 700;
          letter-spacing: .18em; text-transform: uppercase;
          color: rgba(255,255,255,.3);
          border-left: 2px solid rgba(255,255,255,.1);
          padding: 4px 14px; margin-bottom: 16px;
          transform: skewX(-20deg);
        }
        .rnd__st > * { transform: skewX(20deg); }
        .rnd__st--open { color: #E60023; border-color: #E60023; }
        .rnd__st--dim { color: rgba(255,255,255,.15); }

        .rnd__num {
          font-family: 'Oswald',sans-serif;
          font-size: clamp(3.5rem, 7vw, 5.5rem);
          font-weight: 700; letter-spacing: .04em;
          color: #fff; line-height: .9;
          transform: skewX(-12deg);
          margin-bottom: 14px;
        }
        .rnd__date {
          font-family: 'Oswald',sans-serif; font-size: 1rem; font-weight: 500;
          letter-spacing: .14em; color: rgba(255,255,255,.5);
          transform: skewX(-10deg);
          margin-bottom: 6px;
        }
        .rnd__loc {
          font-family: 'Oswald',sans-serif; font-size: .72rem; font-weight: 600;
          letter-spacing: .18em; color: rgba(255,255,255,.2);
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 28px;
        }
        .rnd__slash {
          font-size: 1.2rem; font-weight: 300;
          color: #E60023; opacity: .5;
          transform: skewX(-30deg); display: inline-block;
        }

        .rnd__cta {
          display: inline-block;
          font-family: 'Oswald',sans-serif; font-size: .78rem; font-weight: 600;
          letter-spacing: .12em; text-transform: uppercase; text-decoration: none;
          padding: 10px 28px;
          transform: skewX(-15deg);
          color: rgba(255,255,255,.2);
          border: 1px solid rgba(255,255,255,.08);
        }
        .rnd__cta--on {
          color: #fff; border-color: #E60023;
          background: linear-gradient(135deg, rgba(230,0,35,.15), transparent);
          transition: all .25s;
        }
        .rnd__cta--on:hover {
          background: linear-gradient(135deg, rgba(230,0,35,.3), rgba(230,0,35,.05));
          box-shadow: 4px 4px 0 rgba(230,0,35,.2);
        }

        /* Dots */
        .rnd__dots {
          display: flex; justify-content: center; gap: 6px;
          margin-top: 32px;
        }
        .rnd__dot {
          width: 14px; height: 4px; border: none; cursor: pointer;
          background: rgba(255,255,255,.12);
          transform: skewX(-30deg);
          transition: all .25s; padding: 0;
        }
        .rnd__dot--on { width: 28px; background: #E60023; }
        .rnd__dot:hover { background: rgba(255,255,255,.25); }

        /* Mobile */
        @media (max-width: 992px) {
          .rnd__inner { grid-template-columns: 1fr; gap: 28px; padding: 0 20px; }
          .rnd__visual { height: 300px; }
          .rnd__img-wrap {
            clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
          }
          .rnd__img-shadow {
            clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
          }
          .rnd__num { font-size: 3rem; }
        }
      `}</style>
    </section>
  )
}
