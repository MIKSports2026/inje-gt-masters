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
    <section className="ac-section" id="rounds">
      <div className="ac-container">
        <SectionHeader subtitle={`${season} SEASON`} title="RACE SCHEDULE" />

        <div className="ac-list">
          {rounds.map((r) => {
            const st       = (r.status ?? 'upcoming') as RoundStatus
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
                  'ac-item',
                  isActive          ? 'ac-item--active'   : '',
                  isOpen            ? 'ac-item--open'     : '',
                  st === 'finished' ? 'ac-item--done'     : '',
                ].filter(Boolean).join(' ')}
                onMouseEnter={() => setActiveId(r._id)}
              >
                {/* 배경 이미지 레이어 */}
                <div
                  className="ac-bg"
                  style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined}
                >
                  <div className="ac-overlay" />
                </div>

                {/* 레드 바 */}
                <div className={`ac-redbar${isActive ? ' ac-redbar--on' : ''}`} />

                {/* 접힌 상태: 라운드 번호만 */}
                <div className="ac-collapsed">
                  <span className="ac-collapsed__num">
                    {String(r.roundNumber).padStart(2, '0')}
                  </span>
                </div>

                {/* 펼쳐진 상태 */}
                <div className="ac-expanded">
                  <div className="ac-exp-top">
                    <span className="ac-exp-date">{dateStr}</span>
                    <div className={`ac-exp-status${status.isRed ? ' ac-exp-status--red' : ''}`}>
                      <span
                        className="ac-status-dot"
                        style={{ background: status.isRed ? 'var(--primary-red, #E60023)' : '#444' }}
                      />
                      {status.text}
                    </div>
                  </div>

                  <div className="ac-exp-bottom">
                    <div>
                      <h3 className="ac-exp-round">ROUND {String(r.roundNumber).padStart(2, '0')}</h3>
                      {r.title && <p className="ac-exp-title">{r.title}</p>}
                      <span className="ac-exp-loc">INJE SPEEDIUM</span>
                    </div>

                    <div className="ac-exp-cta">
                      {isOpen && (
                        <Link href={`/entry?tab=apply&round=R${r.roundNumber}`} className="ac-btn ac-btn--red">
                          APPLY NOW →
                        </Link>
                      )}
                      {isFin && (
                        <Link href={`/results?round=${r.slug.current}`} className="ac-btn ac-btn--outline">
                          RESULTS →
                        </Link>
                      )}
                      {(isClosed || st === 'upcoming' || st === 'ongoing') && (
                        <Link href="/season" className="ac-btn ac-btn--ghost">
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

        <div className="ac-footer">
          <Link href="/season" className="ac-all">FULL SCHEDULE →</Link>
        </div>
      </div>

      <style>{`
        /* ── 섹션 ── */
        .ac-section {
          background: var(--bg-carbon, #0a0a0a);
          padding: 80px 0;
        }
        .ac-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── 패널 컨테이너 ── */
        .ac-list {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          width: 100%;
          height: 500px;
          gap: 2px;
          margin-top: 48px;
        }

        /* ── 개별 패널 ── */
        .ac-item {
          position: relative;
          flex: 1 !important;
          min-width: 60px;
          width: auto !important;
          background-color: #0d0d0d;
          cursor: pointer;
          overflow: hidden;
          transition: flex 0.6s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.4s ease;
        }
        .ac-item:hover {
          background-color: #1a1a1a;
        }

        /* ── 활성 패널 (세 가지 클래스 모두 커버) ── */
        .ac-item--open,
        .ac-item--expanded,
        .ac-item--active {
          flex: 5 !important;
          background-color: #000;
          cursor: default;
        }
        .ac-item--done {
          opacity: .6;
        }
        .ac-item--done:hover,
        .ac-item--done.ac-item--active {
          opacity: .8;
        }

        /* ── 배경 이미지 ── */
        .ac-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        .ac-item--active .ac-bg,
        .ac-item--open .ac-bg {
          opacity: 1;
        }
        .ac-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(10,10,10,.92) 0%, rgba(10,10,10,.25) 100%);
        }

        /* ── 레드 바 ── */
        .ac-redbar {
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
        .ac-redbar--on {
          transform: scaleY(1);
        }

        /* ── 접힌 상태: 번호 ── */
        .ac-collapsed {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 4;
          opacity: 1;
          transition: opacity 0.3s ease;
        }
        .ac-collapsed__num {
          font-family: var(--font-heading, 'Oswald'), sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          color: #333;
          transition: color 0.3s ease;
          white-space: nowrap;
        }
        .ac-item:hover .ac-collapsed__num {
          color: #666;
        }
        .ac-item--active .ac-collapsed,
        .ac-item--open .ac-collapsed {
          opacity: 0;
          pointer-events: none;
        }

        /* ── 펼쳐진 콘텐츠 ── */
        .ac-expanded {
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
        .ac-item--active .ac-expanded,
        .ac-item--open .ac-expanded {
          opacity: 1;
          transform: translateX(0);
          pointer-events: auto;
          transition-delay: 0.18s;
        }

        /* 상단: 날짜 + 상태 */
        .ac-exp-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .ac-exp-date {
          font-family: var(--font-heading, 'Oswald'), sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: 2px;
          color: var(--text-primary, #fff);
        }
        .ac-exp-status {
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
        .ac-exp-status--red {
          color: var(--text-primary, #fff);
        }
        .ac-status-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* 하단: 라운드명 + CTA */
        .ac-exp-bottom {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .ac-exp-round {
          font-family: var(--font-heading, 'Oswald'), sans-serif;
          font-size: 3.8rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: 2px;
          color: var(--text-primary, #fff);
          margin: 0;
        }
        .ac-exp-title {
          font-family: var(--font-body, 'Noto Sans KR'), sans-serif;
          font-size: .9rem;
          color: rgba(255,255,255,.5);
          margin: 6px 0 4px;
        }
        .ac-exp-loc {
          font-family: var(--font-heading, 'Oswald'), sans-serif;
          font-size: .85rem;
          font-weight: 600;
          letter-spacing: 2px;
          color: var(--primary-red, #E60023);
          text-transform: uppercase;
        }

        /* CTA 버튼 */
        .ac-exp-cta {
          display: flex;
        }
        .ac-btn {
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
        .ac-btn--red { background: var(--primary-red, #E60023); color: #fff; }
        .ac-btn--red:hover { background: #C0001D; }
        .ac-btn--outline { color: #fff; border: 1px solid #555; }
        .ac-btn--outline:hover { background: #fff; color: #0a0a0a; }
        .ac-btn--ghost { color: #555; border: 1px solid #2a2a2a; }
        .ac-btn--ghost:hover { color: #aaa; border-color: #555; }

        /* ── 푸터 ── */
        .ac-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }
        .ac-all {
          font-family: var(--font-heading, 'Oswald'), sans-serif;
          font-size: .85rem;
          font-weight: 700;
          letter-spacing: 2px;
          color: rgba(255,255,255,.3);
          text-decoration: none;
          transition: color .2s ease;
        }
        .ac-all:hover { color: var(--primary-red, #E60023); }

        /* ── 모바일: 세로 아코디언 ── */
        @media (max-width: 900px) {
          .ac-list {
            flex-direction: column !important;
            height: auto !important;
          }
          .ac-item {
            flex: 0 0 72px !important;
            min-width: unset !important;
            width: 100% !important;
          }
          .ac-item--active,
          .ac-item--open,
          .ac-item--expanded {
            flex: 0 0 280px !important;
          }
          .ac-overlay {
            background: linear-gradient(to top, rgba(10,10,10,.92) 0%, rgba(10,10,10,.25) 100%);
          }
          .ac-redbar {
            width: 100%;
            height: 4px;
            top: 0; left: 0;
            transform: scaleX(0);
            transform-origin: left;
          }
          .ac-redbar--on { transform: scaleX(1); }
          .ac-collapsed { top: 50%; left: 24px; transform: translateY(-50%); }
          .ac-exp-round { font-size: 2.5rem; }
          .ac-expanded { padding: 20px 24px; }
        }
        @media (max-width: 640px) {
          .ac-section { padding: 60px 0; }
          .ac-exp-date { font-size: 1.1rem; }
          .ac-exp-round { font-size: 2rem; }
        }
      `}</style>
    </section>
  )
}
