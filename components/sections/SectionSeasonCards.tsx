// components/sections/SectionSeasonCards.tsx — Season page: grid card schedule
import Link from 'next/link'
import type { Round } from '@/types/sanity'
import { urlFor } from '@/lib/sanity.client'
import styles from './SectionSeasonCards.module.css'

type RoundStatus = 'upcoming' | 'entry_open' | 'entry_closed' | 'ongoing' | 'finished'

interface Props { rounds: Round[] }

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

function fmtDate(d: string) {
  const dt = new Date(d)
  return `${MONTHS[dt.getMonth()]} ${String(dt.getDate()).padStart(2, '0')}`
}

function getStatus(status: RoundStatus) {
  switch (status) {
    case 'entry_open':   return { label: 'ENTRY OPEN',   cls: styles.badgeEntryOpen,   isOpen: true,  isDone: false }
    case 'finished':     return { label: 'COMPLETED',    cls: styles.badgeCompleted,   isOpen: false, isDone: true  }
    case 'entry_closed': return { label: 'ENTRY CLOSED', cls: styles.badgeEntryClosed, isOpen: false, isDone: false }
    case 'ongoing':      return { label: 'ONGOING',      cls: styles.badgeOngoing,     isOpen: false, isDone: false }
    default:             return { label: 'UPCOMING',     cls: styles.badgeUpcoming,    isOpen: false, isDone: false }
  }
}

export default function SectionSeasonCards({ rounds }: Props) {
  if (!rounds.length) return null

  const season = rounds[0]?.season ?? 2026

  return (
    <section id="season" className={styles.seasonSection}>
      <div className="container">

        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>SEASON {season} SCHEDULE</h2>
          <div className={styles.redSlash} />
        </div>

        <div className={styles.seasonGrid}>
          {rounds.map((round) => {
            const st = (round.status ?? 'upcoming') as RoundStatus
            const { label, cls: statusCls, isOpen, isDone } = getStatus(st)
            const isFeature = isOpen
            const dateStr   = round.dateStart ? fmtDate(round.dateStart) : '—'
            const roundNum  = String(round.roundNumber).padStart(2, '0')
            const bgUrl     = round.heroImage?.asset
              ? urlFor(round.heroImage).width(1200).auto('format').url()
              : null

            const cardClass = [
              styles.seasonCard,
              isFeature ? styles.featureCard   : '',
              isDone    ? styles.isCompleted   : '',
              isOpen    ? styles.isHighlighted : '',
            ].filter(Boolean).join(' ')

            return (
              <div key={round._id} className={cardClass}>

                {/* Background */}
                {bgUrl ? (
                  <div
                    className={`${styles.cardBg} ${styles.imageBg}`}
                    style={{ backgroundImage: `url(${bgUrl})` }}
                  >
                    <div className={styles.cardOverlay} />
                  </div>
                ) : (
                  <div className={`${styles.cardBg} ${styles.carbonBg}`} />
                )}

                {/* Entry open top edge */}
                {isOpen && <div className={styles.cardEntryEdge} />}

                {/* Content */}
                <div className={styles.cardContent}>

                  {/* Top: badges */}
                  <div className={styles.cardTop}>
                    <span className={styles.cardRoundBadge}>ROUND {roundNum}</span>
                    <span className={`${styles.cardStatusBadge} ${statusCls}`}>{label}</span>
                  </div>

                  {/* Middle: date + location */}
                  <div className={styles.cardMiddle}>
                    <h3 className={styles.cardDateGiant}>{dateStr}</h3>
                    <div className={styles.cardLocation}>
                      <i className={`fa-solid fa-location-dot ${styles.locIcon}`} />
                      INJE SPEEDIUM
                    </div>
                  </div>

                  {/* Bottom: action */}
                  <div className={styles.cardBottom}>
                    {isDone && (
                      <Link
                        href={`/results?round=${round.slug?.current}`}
                        className={`${styles.cardBtn} ${styles.btnOutlineWhite}`}
                      >
                        VIEW RESULTS <i className="fa-solid fa-arrow-right" />
                      </Link>
                    )}
                    {isOpen && (
                      <Link
                        href={`/entry?tab=apply&round=R${round.roundNumber}`}
                        className={`${styles.cardBtn} ${styles.btnSolidRed}`}
                      >
                        APPLY NOW <i className="fa-solid fa-arrow-right" />
                      </Link>
                    )}
                    {!isDone && !isOpen && (
                      <div className={styles.cardPlaceholder}>OPENS LATER</div>
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
