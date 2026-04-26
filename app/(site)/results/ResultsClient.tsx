'use client'
// app/(site)/results/ResultsClient.tsx
import { useState, useMemo } from 'react'
import type { Round } from '@/types/sanity'
import styles from './Results.module.css'

// ── 공개 타입 (page.tsx에서 import type으로 사용) ─────────────
export interface RoundStanding {
  position:   number
  carNumber?: string
  teamName?:  string
  driver1?:   string
  driver2?:   string
  driver3?:   string
  laps?:      number
  totalTime?: string
  gap?:       string
  fastestLap?:string
  points?:    number
  status?:    string
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
const CLASSES = [
  { code: 'masters-1',     label: 'Masters 1',    color: '#e60023' },
  { code: 'masters-2',     label: 'Masters 2',    color: '#2563eb' },
  { code: 'masters-n-evo', label: 'Masters N-evo', color: '#a855f7' },
  { code: 'masters-n',     label: 'Masters N',     color: '#b8921e' },
  { code: 'masters-3',     label: 'Masters 3',     color: '#16a34a' },
] as const

const MAIN_TABS  = ['Driver Ranking', 'Team Ranking', 'Round Results'] as const
const ROUND_NUMS = [1, 2, 3, 4, 5] as const

// ── 헬퍼 ──────────────────────────────────────────────────────
const isRace = (t: string) => t === 'race' || t === 'race1' || t === 'race2'

function medalStyle(pos: number, color: string) {
  const m: [string, string, string][] = [
    ['rgba(245,158,11,.12)', '#d97706',  'rgba(245,158,11,.3)'],
    ['rgba(156,163,175,.12)','#6b7280',  'rgba(156,163,175,.3)'],
    ['rgba(180,83,9,.12)',   '#92400e',  'rgba(180,83,9,.3)'],
  ]
  const [bg, fg, border] = pos <= 3 ? m[pos - 1] : [`${color}0d`, color, `${color}22`]
  return { background: bg, color: fg, border: `1px solid ${border}` }
}

function buildDriverRows(results: RoundResult[], classCode: string) {
  const races = results.filter(r => r.classCode === classCode && isRace(r.raceType))
  const map = new Map<string, {
    carNumber: string; driver1: string; driver2: string; driver3: string; teamName: string
    perRound: Record<number, number>; total: number
  }>()

  races.forEach(r => {
    r.standings.forEach(s => {
      const key = (s.carNumber?.trim() || s.driver1?.trim() || '').toLowerCase()
      if (!key) return
      if (!map.has(key)) {
        map.set(key, {
          carNumber: s.carNumber ?? '',
          driver1:   s.driver1   ?? '',
          driver2:   s.driver2   ?? '',
          driver3:   s.driver3   ?? '',
          teamName:  s.teamName  ?? '',
          perRound: {}, total: 0,
        })
      }
      const d = map.get(key)!
      const pts = s.points ?? 0
      d.perRound[r.roundNumber] = (d.perRound[r.roundNumber] ?? 0) + pts
      d.total += pts
    })
  })

  return [...map.values()]
    .sort((a, b) => b.total - a.total || a.driver1.localeCompare(b.driver1))
    .map((d, i) => ({ rank: i + 1, ...d }))
}

function buildTeamRows(results: RoundResult[], classCode: string) {
  const races = results.filter(r => r.classCode === classCode && isRace(r.raceType))
  const map = new Map<string, {
    teamName: string; carNums: Set<string>; driverSet: Set<string>
    perRound: Record<number, number>; total: number
  }>()

  races.forEach(r => {
    r.standings.forEach(s => {
      const key = s.teamName?.trim() || '—'
      if (!map.has(key)) {
        map.set(key, { teamName: key, carNums: new Set(), driverSet: new Set(), perRound: {}, total: 0 })
      }
      const t = map.get(key)!
      if (s.carNumber) t.carNums.add(s.carNumber)
      if (s.driver1)   t.driverSet.add(s.driver1)
      if (s.driver2)   t.driverSet.add(s.driver2)
      if (s.driver3)   t.driverSet.add(s.driver3)
      const pts = s.points ?? 0
      t.perRound[r.roundNumber] = (t.perRound[r.roundNumber] ?? 0) + pts
      t.total += pts
    })
  })

  return [...map.values()]
    .sort((a, b) => b.total - a.total)
    .map((t, i) => ({
      rank:     i + 1,
      teamName: t.teamName,
      carNums:  [...t.carNums].sort().join(' / '),
      drivers:  [...t.driverSet].join(' / '),
      perRound: t.perRound,
      total:    t.total,
    }))
}

// ── 컴포넌트 ──────────────────────────────────────────────────
export default function ResultsClient({ rounds, allResults }: Props) {
  const [mainTab,       setMainTab]       = useState(0)
  const [activeClass,   setActiveClass]   = useState('masters-1')
  const [selectedRound, setSelectedRound] = useState(1)

  const color = CLASSES.find(c => c.code === activeClass)?.color ?? '#e60023'

  const roundsWithResults = useMemo(
    () => new Set(
      allResults
        .filter(r => r.classCode === activeClass)
        .map(r => r.roundNumber)
    ),
    [allResults, activeClass]
  )

  const driverRows = useMemo(
    () => buildDriverRows(allResults, activeClass),
    [allResults, activeClass]
  )
  const teamRows = useMemo(
    () => buildTeamRows(allResults, activeClass),
    [allResults, activeClass]
  )
  const roundStandings = useMemo(
    () => allResults
      .filter(r => r.roundNumber === selectedRound && r.classCode === activeClass && isRace(r.raceType))
      .flatMap(r => r.standings)
      .sort((a, b) => a.position - b.position),
    [allResults, selectedRound, activeClass]
  )

  const showStatusColumn = useMemo(
    () => roundStandings.some(s =>
      s.status === 'dnf' || s.status === 'dns' || s.status === 'dsq'
    ),
    [roundStandings]
  )

  const showBestLapColumn = useMemo(
    () => roundStandings.some(s => !!s.fastestLap?.trim()),
    [roundStandings]
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

  const rankBox = (pos: number) => ({
    width: '32px', height: '32px',
    display: 'grid', placeItems: 'center',
    fontWeight: 900, fontSize: '.88rem',
    ...medalStyle(pos, color),
    clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)',
  })

  const carTag = {
    fontSize: '.73rem', fontWeight: 900, padding: '1px 7px',
    background: `${color}14`, color, border: `1px solid ${color}30`,
    clipPath: 'polygon(0 0,calc(100% - 4px) 0,100% 4px,100% 100%,0 100%)',
    display: 'inline-block',
  }

  const emptyMsg = (icon: string, msg: string) => (
    <div style={{ textAlign: 'center', padding: '52px 0', color: 'var(--muted)' }}>
      <i className={`fa-solid ${icon}`}
        style={{ fontSize: '2.4rem', opacity: .22, display: 'block', marginBottom: '12px' }} />
      <p style={{ fontSize: '.92rem' }}>{msg}</p>
    </div>
  )

  // ── 클래스 탭 ───────────────────────────────────────────────
  const classTabs = (
    <div className={styles.tabGroup}>
      {CLASSES.map(cls => (
        <button
          key={cls.code} type="button"
          className={`${styles.tabBtn}${activeClass === cls.code ? ` ${styles.active}` : ''}`}
          onClick={() => setActiveClass(cls.code)}
          style={{ '--tab-color': cls.color } as React.CSSProperties}
        >
          <span className={styles.tabBg} aria-hidden="true" />
          <span className={styles.tabLine} aria-hidden="true" />
          <span className={styles.tabLabel}>{cls.label}</span>
        </button>
      ))}
    </div>
  )

  return (
    <div>
      {/* ── 메인 탭 ─────────────────────────────────────────── */}
      <div className={`${styles.tabGroup} ${styles.mainTabGroup}`}>
        {MAIN_TABS.map((t, i) => (
          <button key={i} type="button"
            className={`${styles.tabBtn} ${styles.mainTabBtn}${mainTab === i ? ` ${styles.active}` : ''}`}
            onClick={() => setMainTab(i)}
          >
            <span className={styles.tabBg} aria-hidden="true" />
            <span className={styles.tabLine} aria-hidden="true" />
            <span className={styles.tabLabel}>{t}</span>
          </button>
        ))}
      </div>

      {/* ══ Driver Ranking ══════════════════════════════════ */}
      {mainTab === 0 && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <span className="eyebrow">2026 시즌 누적</span>
            <h2 style={{ fontSize: 'clamp(1.3rem,2vw,1.8rem)', marginTop: '4px' }}>Driver Ranking</h2>
          </div>
          {classTabs}
          {driverRows.length === 0
            ? emptyMsg('fa-chart-bar', '경기 결과를 준비중입니다.')
            : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%', borderCollapse: 'collapse',
                  background: 'var(--bg-2)', border: '1px solid var(--line)', clipPath: cut,
                }}>
                  <thead>
                    <tr>
                      <th style={TH()}>RANK</th>
                      <th style={TH()}>NO</th>
                      <th style={TH()}>드라이버</th>
                      <th style={TH()}>팀명</th>
                      {ROUND_NUMS.map(n =>
                        <th key={n} style={TH({ textAlign: 'center' })}>R{n}</th>
                      )}
                      <th style={TH({ textAlign: 'right', color })}>TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {driverRows.map(row => (
                      <tr key={row.carNumber || row.driver1}
                        style={{ transition: 'background .15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.03)')}
                        onMouseLeave={e => (e.currentTarget.style.background = '')}
                      >
                        <td style={TD()}>
                          <div style={rankBox(row.rank)}>{row.rank}</div>
                        </td>
                        <td style={TD()}>
                          <span style={carTag}>#{row.carNumber || '—'}</span>
                        </td>
                        <td style={TD()}>
                          {[row.driver1, row.driver2, row.driver3].filter(Boolean).join(' / ') || '—'}
                        </td>
                        <td style={TD({ color: 'var(--muted)', fontSize: '.84rem' })}>
                          {row.teamName || '—'}
                        </td>
                        {ROUND_NUMS.map(n => (
                          <td key={n} style={TD({
                            textAlign: 'center',
                            color: row.perRound[n] ? color : 'rgba(255,255,255,.18)',
                            fontWeight: row.perRound[n] ? 700 : 400,
                          })}>
                            {row.perRound[n] ?? '—'}
                          </td>
                        ))}
                        <td style={TD({ textAlign: 'right', fontWeight: 900, fontSize: '1rem', color })}>
                          {row.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        </div>
      )}

      {/* ══ Team Ranking ════════════════════════════════════ */}
      {mainTab === 1 && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <span className="eyebrow">2026 시즌 누적</span>
            <h2 style={{ fontSize: 'clamp(1.3rem,2vw,1.8rem)', marginTop: '4px' }}>Team Ranking</h2>
          </div>
          {classTabs}
          {teamRows.length === 0
            ? emptyMsg('fa-users', '경기 결과를 준비중입니다.')
            : (
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
                      {ROUND_NUMS.map(n =>
                        <th key={n} style={TH({ textAlign: 'center' })}>R{n}</th>
                      )}
                      <th style={TH({ textAlign: 'right', color })}>TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamRows.map(row => (
                      <tr key={row.teamName}
                        style={{ transition: 'background .15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.03)')}
                        onMouseLeave={e => (e.currentTarget.style.background = '')}
                      >
                        <td style={TD()}>
                          <div style={rankBox(row.rank)}>{row.rank}</div>
                        </td>
                        <td style={TD({ fontSize: '.8rem', color: 'var(--muted)' })}>
                          {row.carNums || '—'}
                        </td>
                        <td style={TD({ fontWeight: 700 })}>{row.teamName}</td>
                        <td style={TD({ color: 'var(--muted)', fontSize: '.82rem' })}>
                          {row.drivers || '—'}
                        </td>
                        {ROUND_NUMS.map(n => (
                          <td key={n} style={TD({
                            textAlign: 'center',
                            color: row.perRound[n] ? color : 'rgba(255,255,255,.18)',
                            fontWeight: row.perRound[n] ? 700 : 400,
                          })}>
                            {row.perRound[n] ?? '—'}
                          </td>
                        ))}
                        <td style={TD({ textAlign: 'right', fontWeight: 900, fontSize: '1rem', color })}>
                          {row.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        </div>
      )}

      {/* ══ Round Results ════════════════════════════════════ */}
      {mainTab === 2 && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <span className="eyebrow">라운드별 결과</span>
            <h2 style={{ fontSize: 'clamp(1.3rem,2vw,1.8rem)', marginTop: '4px' }}>Round Results</h2>
          </div>

          {/* 라운드 선택 */}
          <div className={styles.tabGroup}>
            {ROUND_NUMS.map(n => {
              const roundInfo = rounds.find(r => r.roundNumber === n)
              return (
                <button key={n} type="button"
                  className={`${styles.tabBtn}${selectedRound === n ? ` ${styles.active}` : ''}`}
                  onClick={() => setSelectedRound(n)}
                  title={roundInfo?.title}
                  style={{ '--tab-color': color } as React.CSSProperties}
                >
                  <span className={styles.tabBg} aria-hidden="true" />
                  <span className={styles.tabLine} aria-hidden="true" />
                  <span className={styles.tabLabel}>R{n}</span>
                </button>
              )
            })}
          </div>

          {classTabs}

          {/* 선택된 라운드 정보 */}
          {(() => {
            const info = rounds.find(r => r.roundNumber === selectedRound)
            if (info) return (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                marginBottom: '16px', padding: '10px 16px',
                background: 'var(--bg-2)', border: '1px solid var(--line)',
                clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)',
              }}>
                <span style={{
                  padding: '2px 10px', fontSize: '.72rem', fontWeight: 900,
                  background: `${color}14`, color, border: `1px solid ${color}30`,
                  clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)',
                }}>R{selectedRound}</span>
                <strong style={{ fontSize: '.92rem' }}>{info.title}</strong>
                <span style={{ fontSize: '.82rem', color: 'var(--muted)' }}>
                  {info.dateStart?.slice(0, 10).replace(/-/g, '.')}
                  {info.dateEnd && ` ~ ${info.dateEnd.slice(0, 10).replace(/-/g, '.')}`}
                </span>
              </div>
            )
            return null
          })()}

          {/* 결과 테이블 */}
          {!roundsWithResults.has(selectedRound)
            ? emptyMsg('fa-flag-checkered', '경기 준비중입니다.')
            : roundStandings.length === 0
            ? emptyMsg('fa-chart-bar', '경기 결과를 준비중입니다.')
            : (
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
                      <th style={TH({ textAlign: 'right', color })}>PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roundStandings.map((s, i) => (
                      <tr key={i}
                        style={{ transition: 'background .15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.03)')}
                        onMouseLeave={e => (e.currentTarget.style.background = '')}
                      >
                        <td style={TD()}>
                          <div style={rankBox(s.position)}>{s.position}</div>
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
                          {s.position === 1 ? 'LEADER' : (s.gap || '—')}
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
                        <td style={TD({ textAlign: 'right', fontWeight: 900, color })}>
                          {s.points ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        </div>
      )}
    </div>
  )
}
