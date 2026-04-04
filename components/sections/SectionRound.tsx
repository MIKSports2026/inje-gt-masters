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
                className={`ac-item${isActive ? ' ac-item--active' : ''}`}
                onMouseEnter={() => setActiveId(r._id)}
              >
                {/* 배경 이미지 */}
                <div
                  className="ac-bg"
                  style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined}
                >
                  <div className="ac-overlay" />
                </div>

                {/* 레드 바 */}
                <div className="ac-redbar" />

                {/* 접힌 상태: 라운드 번호 */}
                <div className="ac-collapsed">
                  <span className="ac-collapsed-num">
                    {String(r.roundNumber).padStart(2, '0')}
                  </span>
                </div>

                {/* 펼쳐진 상태 */}
                <div className="ac-detail">
                  <div className="ac-detail__top">
                    <span className="ac-detail__date">{dateStr}</span>
                    <div className={`ac-detail__status${status.isRed ? ' ac-detail__status--red' : ''}`}>
                      <span style={{
                        width: 9, height: 9,
                        borderRadius: '50%',
                        flexShrink: 0,
                        display: 'inline-block',
                        background: status.isRed ? 'var(--primary-red, #E60023)' : '#444',
                      }} />
                      {status.text}
                    </div>
                  </div>

                  <div className="ac-detail__bottom">
                    <h3 className="ac-detail__round">
                      ROUND {String(r.roundNumber).padStart(2, '0')}
                    </h3>
                    <span className="ac-detail__location">INJE SPEEDIUM</span>

                    {isOpen && (
                      <Link href={`/entry?tab=apply&round=R${r.roundNumber}`} className="ac-btn--red">
                        APPLY NOW →
                      </Link>
                    )}
                    {isFin && (
                      <Link href={`/results?round=${r.slug.current}`} className="ac-btn--ghost">
                        VIEW RESULTS →
                      </Link>
                    )}
                    {(isClosed || st === 'upcoming' || st === 'ongoing') && (
                      <Link href="/season" className="ac-btn--ghost">
                        FULL SCHEDULE →
                      </Link>
                    )}
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
