// components/sections/SectionRound.tsx — Home: horizontal accordion season schedule
'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Round } from '@/types/sanity'
import { urlFor } from '@/lib/sanity.client'
import SectionHeader from '@/components/ui/SectionHeader'
import styles from './SectionRound.module.css'

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
    <section className={styles.acSection} id="rounds">
      <div className={styles.acContainer}>
        <SectionHeader subtitle={`${season} SEASON`} title="RACE SCHEDULE" />

        <div className={styles.acList}>
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
                  styles.acItem,
                  isActive ? styles.acItemActive : '',
                ].filter(Boolean).join(' ')}
                onMouseEnter={() => setActiveId(r._id)}
              >
                {/* 배경 이미지 */}
                <div
                  className={styles.acBg}
                  style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined}
                >
                  <div className={styles.acOverlay} />
                </div>

                {/* 레드 바 */}
                <div className={styles.acRedbar} />

                {/* 접힌 상태: 라운드 번호 */}
                <div className={styles.acCollapsed}>
                  <span className={styles.acCollapsedNum}>
                    {String(r.roundNumber).padStart(2, '0')}
                  </span>
                </div>

                {/* 펼쳐진 상태 */}
                <div className={styles.acDetail}>
                  <div className={styles.acDetailTop}>
                    <span className={styles.acDetailDate}>{dateStr}</span>
                    <div className={[
                      styles.acDetailStatus,
                      status.isRed ? styles.acDetailStatusRed : '',
                    ].filter(Boolean).join(' ')}>
                      <span
                        style={{
                          width: 9, height: 9,
                          borderRadius: '50%',
                          flexShrink: 0,
                          display: 'inline-block',
                          background: status.isRed ? 'var(--primary-red, #E60023)' : '#444',
                        }}
                      />
                      {status.text}
                    </div>
                  </div>

                  <div className={styles.acDetailBottom}>
                    <h3 className={styles.acDetailRound}>
                      ROUND {String(r.roundNumber).padStart(2, '0')}
                    </h3>
                    <span className={styles.acDetailLocation}>INJE SPEEDIUM</span>

                    {isOpen && (
                      <Link
                        href={`/entry?tab=apply&round=R${r.roundNumber}`}
                        className={styles.acDetailBtnRed}
                      >
                        APPLY NOW →
                      </Link>
                    )}
                    {isFin && (
                      <Link
                        href={`/results?round=${r.slug.current}`}
                        className={styles.acDetailBtnOutline}
                      >
                        VIEW RESULTS →
                      </Link>
                    )}
                    {(isClosed || st === 'upcoming' || st === 'ongoing') && (
                      <Link
                        href="/season"
                        className={styles.acDetailBtnOutline}
                      >
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
