// components/sections/SectionRound.tsx — Home: horizontal accordion season schedule
'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Round } from '@/types/sanity'
import { urlFor } from '@/lib/sanity.client'
import SectionHeader from '@/components/ui/SectionHeader'

type RoundStatus = 'upcoming' | 'entry_open' | 'entry_closed' | 'ongoing' | 'finished'

interface Props { rounds: Round[] }

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

function fmtDate(d: string) {
  const dt = new Date(d)
  return `${MONTHS[dt.getMonth()]} ${String(dt.getDate()).padStart(2, '0')}`
}

function statusLabel(s: RoundStatus): { text: string; isRed: boolean } {
  if (s === 'entry_open')   return { text: 'ENTRY OPEN',   isRed: true  }
  if (s === 'finished')     return { text: 'COMPLETED',    isRed: false }
  if (s === 'entry_closed') return { text: 'ENTRY CLOSED', isRed: false }
  return                           { text: 'UPCOMING',     isRed: false }
}

export default function SectionRound({ rounds }: Props) {
  const defaultId = rounds.find(r => r.status === 'entry_open')?._id ?? rounds[0]?._id ?? null
  const [activeId, setActiveId] = useState<string | null>(defaultId)

  if (!rounds.length) return null

  const season = rounds[0]?.season ?? 2026

  return (
    <section className="hs-section" id="rounds">
      <div className="hs-wrap">
        <SectionHeader subtitle={`${season} SEASON`} title="RACE SCHEDULE" />

        <div className="hs-panels">
          {rounds.map((r) => {
            const st      = (r.status ?? 'upcoming') as RoundStatus
            const isActive = activeId === r._id
            const isOpen   = st === 'entry_open'
            const isFin    = st === 'finished'
            const isClosed = st === 'entry_closed'
            const dateStr  = r.dateStart ? fmtDate(r.dateStart) : '—'
            const status   = statusLabel(st)
            const bgUrl    = r.heroImage?.asset
              ? urlFor(r.heroImage).width(1200).auto('format').url()
              : null

            return (
              <div
                key={r._id}
                className={[
                  'hs-panel',
                  isActive        ? 'hs-panel--active' : '',
                  st === 'finished' ? 'hs-panel--done'   : '',
                ].filter(Boolean).join(' ')}
                onMouseEnter={() => setActiveId(r._id)}
              >
                {/* 배경 이미지 레이어 */}
                <div
                  className="hs-bg"
                  style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined}
                >
                  <div className="hs-overlay" />
                </div>

                {/* 레드 바 */}
                <div className={`hs-redbar${isActive ? ' hs-redbar--on' : ''}`} />

                {/* 접힌 상태: 라운드 번호만 */}
                <div className="hs-collapsed">
                  <span className="hs-collapsed__num">
                    {String(r.roundNumber).padStart(2, '0')}
                  </span>
                </div>

                {/* 펼쳐진 상태 */}
                <div className="hs-expanded">
                  <div className="hs-exp-top">
                    <span className="hs-exp-date">{dateStr}</span>
                    <div className={`hs-exp-status${status.isRed ? ' hs-exp-status--red' : ''}`}>
                      <span className="hs-status-dot" style={{ background: status.isRed ? 'var(--primary-red, #E60023)' : '#444' }} />
                      {status.text}
                    </div>
                  </div>

                  <div className="hs-exp-bottom">
                    <div>
                      <h3 className="hs-exp-round">ROUND {String(r.roundNumber).padStart(2, '0')}</h3>
                      {r.title && <p className="hs-exp-title">{r.title}</p>}
                      <span className="hs-exp-loc">INJE SPEEDIUM</span>
                    </div>

                    <div className="hs-exp-cta">
                      {isOpen && (
                        <Link href={`/entry?tab=apply&round=R${r.roundNumber}`} className="hs-btn hs-btn--red">
                          APPLY NOW →
                        </Link>
                      )}
                      {isFin && (
                        <Link href={`/results?round=${r.slug.current}`} className="hs-btn hs-btn--outline">
                          RESULTS →
                        </Link>
                      )}
                      {(isClosed || st === 'upcoming' || st === 'ongoing') && (
                        <Link href="/season" className="hs-btn hs-btn--ghost">
                          SCHEDULE →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )
          })}
        </div>

        <div className="hs-footer">
          <Link href="/season" className="hs-all">FULL SCHEDULE →</Link>
        </div>
      </div>

      <style>{`
        /* ── 섹션 ── */
        .hs-section {
          background: var(--bg-carbon, #0a0a0a);
          padding: 80px 0;
        }
        .hs-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── 패널 컨테이너 ── */
        .hs-panels {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          width: 100%;
          height: 520px;
          gap: 2px;
          margin-top: 48px;
        }

        /* ── 개별 패널 ── */
        .hs-panel {
          position: relative;
          flex: 1 !important;
          min-width: 60px;
          background-color: #0d0d0d;
          cursor: pointer;
          overflow: hidden;
          transition: flex 0.6s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.4s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hs-panel:hover {
          background-color: #1a1a1a;
        }
        .hs-panel--active {
          flex: 5 !important;
          background-color: #000;
          cursor: default;
        }
        .hs-panel--done {
          opacity: .6;
        }
        .hs-panel--done:hover,
        .hs-panel--done.hs-panel--active {
          opacity: .8;
        }

        /* ── 배경 이미지 ── */
        .hs-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        .hs-panel--active .hs-bg {
          opacity: 1;
        }
        .hs-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(10,10,10,.92) 0%, rgba(10,10,10,.25) 100%);
        }

        /* ── 레드 바 ── */
        .hs-redbar {
          position: absolute;
          left: 0; top: 0;
          height: 100%;
          width: 4px;
          background: var(--primary-red, #E60023);
          transform: scaleY(0);
          transform-origin: top;
          transition: transform 0.4s cubic-bezier(0.8, 0, 0.2, 1);
          z-index: 5;
        }
        .hs-redbar--on {
          transform: scaleY(1);
        }

        /* ── 접힌 상태: 번호 ── */
        .hs-collapsed {
          position: absolute;
          z-index: 4;
          opacity: 1;
          transition: opacity 0.3s ease;
        }
        .hs-collapsed__num {
          font-family: var(--font-heading, 'Oswald'), sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          color: #333;
          transition: color 0.3s ease;
        }
        .hs-panel:hover .hs-collapsed__num {
          color: #666;
        }
        .hs-panel--active .hs-collapsed {
          opacity: 0;
          pointer-events: none;
        }

        /* ── 펼쳐진 콘텐츠 ── */
        .hs-expanded {
          position: absolute;
          inset: 0;
          padding: 36px 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          z-index: 4;
          opacity: 0;
          transform: translateX(-20px);
          transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
          pointer-events: none;
        }
        .hs-panel--active .hs-expanded {
          opacity: 1;
          transform: translateX(0);
          pointer-events: auto;
          transition-delay: 0.18s;
        }

        /* 상단: 날짜 + 상태 */
        .hs-exp-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .hs-exp-date {
          font-family: var(--font-heading, 'Oswald'), sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: 2px;
          color: var(--text-primary, #fff);
        }
        .hs-exp-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-heading, 'Oswald'), sans-serif;
          font-size: .9rem;
          font-weight: 600;
          letter-spacing: 1.5px;
          color: #777;
          text-transform: uppercase;
        }
        .hs-exp-status--red {
          color: var(--text-primary, #fff);
        }
        .hs-status-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* 하단: 라운드명 + CTA */
        .hs-exp-bottom {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .hs-exp-round {
          font-family: var(--font-heading, 'Oswald'), sans-serif;
          font-size: 3.8rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: 2px;
          color: var(--text-primary, #fff);
          margin: 0;
        }
        .hs-exp-title {
          font-family: var(--font-body, 'Noto Sans KR'), sans-serif;
          font-size: .9rem;
          color: rgba(255,255,255,.5);
          margin: 6px 0 4px;
        }
        .hs-exp-loc {
          font-family: var(--font-heading, 'Oswald'), sans-serif;
          font-size: .85rem;
          font-weight: 600;
          letter-spacing: 2px;
          color: var(--primary-red, #E60023);
          text-transform: uppercase;
        }

        /* CTA 버튼 */
        .hs-exp-cta {
          display: flex;
        }
        .hs-btn {
          font-family: var(--font-heading, 'Oswald'), sans-serif;
          font-size: .82rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          padding: 10px 22px;
          text-decoration: none;
          display: inline-block;
          transition: all .2s ease;
          white-space: nowrap;
        }
        .hs-btn--red {
          background: var(--primary-red, #E60023);
          color: #fff;
        }
        .hs-btn--red:hover { background: #C0001D; }
        .hs-btn--outline {
          color: #fff;
          border: 1px solid #555;
        }
        .hs-btn--outline:hover { background: #fff; color: #0a0a0a; }
        .hs-btn--ghost {
          color: #555;
          border: 1px solid #2a2a2a;
        }
        .hs-btn--ghost:hover { color: #aaa; border-color: #555; }

        /* ── 푸터 ── */
        .hs-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }
        .hs-all {
          font-family: var(--font-heading, 'Oswald'), sans-serif;
          font-size: .85rem;
          font-weight: 700;
          letter-spacing: 2px;
          color: rgba(255,255,255,.3);
          text-decoration: none;
          transition: color .2s ease;
        }
        .hs-all:hover { color: var(--primary-red, #E60023); }

        /* ── 모바일: 세로 아코디언 ── */
        @media (max-width: 900px) {
          .hs-panels {
            flex-direction: column !important;
            height: auto !important;
          }
          .hs-panel {
            height: 72px;
            flex: 0 0 72px !important;
            min-width: unset !important;
            justify-content: flex-start;
            padding-left: 20px;
          }
          .hs-panel--active {
            flex: 0 0 280px !important;
            height: 280px;
          }
          .hs-overlay {
            background: linear-gradient(to top, rgba(10,10,10,.92) 0%, rgba(10,10,10,.25) 100%);
          }
          .hs-redbar {
            width: 100%;
            height: 4px;
            top: 0; left: 0;
            transform: scaleX(0);
            transform-origin: left;
          }
          .hs-redbar--on {
            transform: scaleX(1);
          }
          .hs-collapsed {
            position: relative;
          }
          .hs-exp-round { font-size: 2.5rem; }
          .hs-expanded { padding: 20px 24px; }
        }
        @media (max-width: 640px) {
          .hs-section { padding: 60px 0; }
          .hs-exp-date { font-size: 1.1rem; }
          .hs-exp-round { font-size: 2rem; }
        }
      `}</style>
    </section>
  )
}
