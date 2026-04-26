'use client'
// app/(site)/results/ResultsClient.tsx
import { useState, useMemo } from 'react'
import type { Round } from '@/types/sanity'
import styles from './Results.module.css'

// ── 공개 타입 (page.tsx에서 import type으로 사용) ─────────────
export interface RoundStanding {
  position?:   number
  carNumber?:  string
  teamName?:   string
  driver1?:    string
  driver2?:    string
  driver3?:    string
  laps?:       number
  totalTime?:  string
  gap?:        string
  fastestLap?: string
  points?:     number
  status?:     string
}

export interface RoundResult {
  _id:         string
  raceType:    string
  roundNumber: number
  classCode:   string
  standings:   RoundStanding[]
  championshipStandings?: {
    position:     number
    carNumber?:   string
    teamName?:    string
    driver1?:     string
    driver2?:     string
    totalPoints?: number
  }[]
}

interface Props {
  rounds:     Round[]
  allResults: RoundResult[]
}

// ── 상수 ──────────────────────────────────────────────────────
const RED = '#e60023'

const CLASSES = [
  { code: 'masters-1',     label: 'Masters 1'    },
  { code: 'masters-n-evo', label: 'Masters N-evo' },
  { code: 'masters-n',     label: 'Masters N'     },
  { code: 'masters-2',     label: 'Masters 2'     },
  { code: 'masters-3',     label: 'Masters 3'     },
] as const

const MAIN_TABS = ['라운드 결과', '누적 결과'] as const
const SUB_TABS  = ['팀 랭킹', '드라이버 랭킹'] as const

// ── 헬퍼 ──────────────────────────────────────────────────────
const isRace = (t: string) => t === 'race' || t === 'race1' || t === 'race2'

// ── 컴포넌트 ──────────────────────────────────────────────────
export default function ResultsClient({ rounds, allResults }: Props) {
  const [mainTab,     setMainTab]     = useState(0)
  const [subTab,      setSubTab]      = useState(0)
  const [activeClass, setActiveClass] = useState('masters-1')

  // 라운드 결과: R1 고정
  const SELECTED_ROUND = 1

  const roundStandings = useMemo(() => {
    const statusOrder = (s?: string) => {
      if (!s || s === 'classified') return 0
      if (s === 'dnf') return 1
      if (s === 'dns') return 2
      if (s === 'dsq') return 3
      return 4
    }
    return allResults
      .filter(r => r.roundNumber === SELECTED_ROUND && r.classCode === activeClass && isRace(r.raceType))
      .flatMap(r => r.standings)
      .sort((a, b) => {
        const ao = statusOrder(a.status), bo = statusOrder(b.status)
        if (ao !== bo) return ao - bo
        if (ao === 0) return (a.position ?? 999) - (b.position ?? 999)
        return 0
      })
  }, [allResults, activeClass])

  const showStatusColumn = useMemo(
    () => roundStandings.some(s => s.status === 'dnf' || s.status === 'dns' || s.status === 'dsq'),
    [roundStandings]
  )

  const showBestLapColumn = useMemo(
    () => roundStandings.some(s => !!s.fastestLap?.trim()),
    [roundStandings]
  )

  const hasRoundData = useMemo(
    () => allResults.some(r => r.roundNumber === SELECTED_ROUND && r.classCode === activeClass && isRace(r.raceType)),
    [allResults, activeClass]
  )

  // ── 공통 스타일 ─────────────────────────────────────────────
  const cut = 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)'

  const TH = (style?: React.CSSProperties) => ({
    padding: '8px 12px',
    fontSize: '.7rem', fontWeight: 900, letterSpacing: '.09em',
    textTransform: 'uppercase' as const,
    color: 'var(--muted)', borderBottom: '1px solid var(--line)',
    textAlign: 'left' as const, whiteSpace: 'nowrap' as const,
    background: 'var(--bg-2)',
    ...style,
  })

  const TD = (style?: React.CSSProperties) => ({
    padding: '11px 12px', fontSize: '.88rem',
    borderBottom: '1px solid rgba(255,255,255,.04)',
    verticalAlign: 'middle' as const,
    ...style,
  })

  const carTag = {
    fontSize: '.73rem', fontWeight: 900, padding: '1px 7px',
    background: `${RED}14`, color: RED, border: `1px solid ${RED}30`,
    clipPath: 'polygon(0 0,calc(100% - 4px) 0,100% 4px,100% 100%,0 100%)',
    display: 'inline-block',
  }

  const tabColor = { '--tab-color': RED } as React.CSSProperties

  // ── 집계 중 안내 ─────────────────────────────────────────────
  const pending = (
    <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--muted)' }}>
      <i className="fa-solid fa-chart-bar"
        style={{ fontSize: '2.4rem', opacity: .18, display: 'block', marginBottom: '14px' }} />
      <p style={{ fontSize: '.95rem' }}>집계 중입니다.</p>
    </div>
  )

  // ── 클래스 탭 ───────────────────────────────────────────────
  const classTabs = (
    <div className={styles.tabGroup} style={{ marginBottom: '20px' }}>
      {CLASSES.map(cls => (
        <button
          key={cls.code} type="button"
          className={`${styles.tabBtn}${activeClass === cls.code ? ` ${styles.active}` : ''}`}
          style={tabColor}
          onClick={() => setActiveClass(cls.code)}
        >
          <span className={styles.tabBg} aria-hidden="true" />
          <span className={styles.tabLine} aria-hidden="true" />
          <span className={styles.tabLabel} style={{ textTransform: 'none', letterSpacing: '.5px' }}>
            {cls.label}
          </span>
        </button>
      ))}
    </div>
  )

  // ── 라운드 결과 > 팀 랭킹 테이블 ────────────────────────────
  const roundTable = !hasRoundData ? (
    <div style={{ textAlign: 'center', padding: '52px 0', color: 'var(--muted)' }}>
      <i className="fa-solid fa-flag-checkered"
        style={{ fontSize: '2.4rem', opacity: .22, display: 'block', marginBottom: '12px' }} />
      <p style={{ fontSize: '.92rem' }}>경기 결과를 준비중입니다.</p>
    </div>
  ) : (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%', borderCollapse: 'collapse',
        background: 'var(--bg-2)', border: '1px solid var(--line)', clipPath: cut,
      }}>
        <thead>
          <tr>
            <th style={TH()}>RANK</th>
            <th style={TH()}>NO</th>
            <th style={TH()}>팀명</th>
            <th style={TH()}>드라이버</th>
            <th style={TH({ textAlign: 'center' })}>랩수</th>
            <th style={TH()}>기록</th>
            <th style={TH()}>GAP</th>
            {showBestLapColumn && <th style={TH()}>BEST LAP</th>}
            {showStatusColumn  && <th style={TH()}>STATUS</th>}
            <th style={TH({ textAlign: 'right', color: RED })}>PTS</th>
          </tr>
        </thead>
        <tbody>
          {roundStandings.map((s, i) => (
            <tr key={i}
              style={{ transition: 'background .15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.03)')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
            >
              <td style={TD({ fontWeight: 700 })}>
                {(!s.status || s.status === 'classified')
                  ? (s.position ?? '—')
                  : s.status === 'dnf' ? 'DNF'
                  : s.status === 'dns' ? 'DNS'
                  : 'DQ'}
              </td>
              <td style={TD()}>
                <span style={carTag}>#{s.carNumber || '—'}</span>
              </td>
              <td style={TD({ fontWeight: 700, fontSize: '.88rem' })}>
                {s.teamName || '—'}
              </td>
              <td style={TD()}>
                {[s.driver1, s.driver2, s.driver3].filter(Boolean).join(' / ') || '—'}
              </td>
              <td style={TD({ textAlign: 'center', color: 'var(--muted)' })}>
                {s.laps ?? '—'}
              </td>
              <td style={TD({ fontFamily: 'monospace', fontSize: '.84rem' })}>
                {s.totalTime || '—'}
              </td>
              <td style={TD({ fontFamily: 'monospace', fontSize: '.84rem', color: 'var(--muted)' })}>
                {s.position === 1 && (!s.status || s.status === 'classified') ? 'LEADER' : (s.gap || '—')}
              </td>
              {showBestLapColumn && (
                <td style={TD({ fontFamily: 'monospace', fontSize: '.84rem' })}>
                  {s.fastestLap || '—'}
                </td>
              )}
              {showStatusColumn && (
                <td style={TD()}>
                  {s.status === 'dnf' && <span className={`${styles.statusBadge} ${styles.statusDnf}`}>DNF</span>}
                  {s.status === 'dns' && <span className={`${styles.statusBadge} ${styles.statusDns}`}>DNS</span>}
                  {s.status === 'dsq' && <span className={`${styles.statusBadge} ${styles.statusDsq}`}>DSQ</span>}
                  {(!s.status || s.status === 'classified') && '—'}
                </td>
              )}
              <td style={TD({ textAlign: 'right', fontWeight: 900, color: RED })}>
                {s.points ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div>
      {/* ── 상위 탭: 라운드 결과 / 누적 결과 ───────────────── */}
      <div className={`${styles.tabGroup} ${styles.mainTabGroup}`}>
        {MAIN_TABS.map((t, i) => (
          <button key={i} type="button"
            className={`${styles.tabBtn} ${styles.mainTabBtn}${mainTab === i ? ` ${styles.active}` : ''}`}
            style={tabColor}
            onClick={() => setMainTab(i)}
          >
            <span className={styles.tabBg} aria-hidden="true" />
            <span className={styles.tabLine} aria-hidden="true" />
            <span className={styles.tabLabel}>{t}</span>
          </button>
        ))}
      </div>

      {/* ── 하위 탭: 팀 랭킹 / 드라이버 랭킹 ──────────────── */}
      <div className={styles.tabGroup} style={{ marginBottom: '24px' }}>
        {SUB_TABS.map((t, i) => (
          <button key={i} type="button"
            className={`${styles.tabBtn}${subTab === i ? ` ${styles.active}` : ''}`}
            style={tabColor}
            onClick={() => setSubTab(i)}
          >
            <span className={styles.tabBg} aria-hidden="true" />
            <span className={styles.tabLine} aria-hidden="true" />
            <span className={styles.tabLabel}>{t}</span>
          </button>
        ))}
      </div>

      {/* ── 클래스 탭 ───────────────────────────────────────── */}
      {classTabs}

      {/* ── 라운드 정보 배너 (라운드 결과 탭에서만) ─────────── */}
      {mainTab === 0 && (() => {
        const info = rounds.find(r => r.roundNumber === SELECTED_ROUND)
        if (!info) return null
        return (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            marginBottom: '16px', padding: '10px 16px',
            background: 'var(--bg-2)', border: '1px solid var(--line)',
            clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)',
          }}>
            <span style={{
              padding: '2px 10px', fontSize: '.72rem', fontWeight: 900,
              background: `${RED}14`, color: RED, border: `1px solid ${RED}30`,
              clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)',
            }}>R{SELECTED_ROUND}</span>
            <span style={{ fontSize: '.82rem', color: 'var(--muted)' }}>
              {info.dateStart?.slice(0, 10).replace(/-/g, '.')}
            </span>
          </div>
        )
      })()}

      {/* ── 콘텐츠 ──────────────────────────────────────────── */}
      {mainTab === 0 && subTab === 0 && roundTable}
      {mainTab === 0 && subTab === 1 && pending}
      {mainTab === 1 && pending}
    </div>
  )
}
