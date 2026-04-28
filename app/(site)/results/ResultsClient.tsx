'use client'
// app/(site)/results/ResultsClient.tsx
import { useState, useMemo, useEffect, useRef } from 'react'
import type { Round } from '@/types/sanity'
import styles from './Results.module.css'

// ── 공개 타입 ─────────────────────────────────────────────────
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

export interface TeamStandingEntry {
  position:    number
  carNumber?:  string
  teamName:    string
  drivers?:    string
  totalPoints: number
}

export interface DriverStandingEntry {
  position:    number
  driverName:  string
  carNumber?:  string
  teamName?:   string
  totalPoints: number
}

export interface TeamStanding {
  _id:       string
  season:    number
  classCode: string
  entries:   TeamStandingEntry[]
}

export interface DriverStanding {
  _id:       string
  season:    number
  classCode: string
  entries:   DriverStandingEntry[]
}

interface Props {
  rounds:          Round[]
  allResults:      RoundResult[]
  teamStandings:   TeamStanding[]
  driverStandings: DriverStanding[]
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

function fmtDate(d?: string) {
  return d?.slice(0, 10).replace(/-/g, '.') ?? ''
}

// ── 컴포넌트 ──────────────────────────────────────────────────
export default function ResultsClient({ rounds, allResults, teamStandings, driverStandings }: Props) {
  // 결과 데이터가 있는 라운드 번호 Set
  const roundsWithData = useMemo(
    () => new Set(allResults.filter(r => isRace(r.raceType)).map(r => r.roundNumber)),
    [allResults]
  )

  // 초기 선택 라운드: 결과 있는 라운드 중 가장 최신
  const initialRound = useMemo(() => {
    const nums = [...roundsWithData]
    return nums.length > 0 ? Math.max(...nums) : (rounds[0]?.roundNumber ?? 1)
  }, [roundsWithData, rounds])

  const [mainTab,       setMainTab]       = useState(0)
  const [subTab,        setSubTab]        = useState(0)
  const [sessionTab,    setSessionTab]    = useState(0)  // 0=결승 1=예선
  const [activeClass,   setActiveClass]   = useState('masters-1')
  const [selectedRound, setSelectedRound] = useState(initialRound)
  const [dropdownOpen,  setDropdownOpen]  = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 드롭다운 외부 클릭 닫기
  useEffect(() => {
    if (!dropdownOpen) return
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [dropdownOpen])

  // 선택된 라운드 데이터
  const selectedRoundInfo = useMemo(
    () => rounds.find(r => r.roundNumber === selectedRound),
    [rounds, selectedRound]
  )

  const roundStandings = useMemo(() => {
    const statusOrder = (s?: string) => {
      if (!s || s === 'classified') return 0
      if (s === 'dnf') return 1
      if (s === 'dns') return 2
      if (s === 'dsq') return 3
      return 4
    }
    return allResults
      .filter(r => r.roundNumber === selectedRound && r.classCode === activeClass && isRace(r.raceType))
      .flatMap(r => r.standings)
      .sort((a, b) => {
        const ao = statusOrder(a.status), bo = statusOrder(b.status)
        if (ao !== bo) return ao - bo
        if (ao === 0) return (a.position ?? 999) - (b.position ?? 999)
        return 0
      })
  }, [allResults, selectedRound, activeClass])

  const showStatusColumn  = useMemo(() => roundStandings.some(s => s.status === 'dnf' || s.status === 'dns' || s.status === 'dsq'), [roundStandings])
  const showBestLapColumn = useMemo(() => roundStandings.some(s => !!s.fastestLap?.trim()), [roundStandings])
  const hasRoundData      = useMemo(() => roundsWithData.has(selectedRound) && roundStandings.length > 0, [roundsWithData, selectedRound, roundStandings])

  // ── 예선 데이터 ───────────────────────────────────────────
  const qualifyingStandings = useMemo(() => {
    const statusOrder = (s?: string) => {
      if (!s || s === 'classified') return 0
      if (s === 'dnf') return 1
      if (s === 'dns') return 2
      if (s === 'dsq') return 3
      return 4
    }
    return allResults
      .filter(r => r.roundNumber === selectedRound && r.classCode === activeClass && r.raceType === 'qualifying')
      .flatMap(r => r.standings)
      .sort((a, b) => {
        const ao = statusOrder(a.status), bo = statusOrder(b.status)
        if (ao !== bo) return ao - bo
        if (ao === 0) return (a.position ?? 999) - (b.position ?? 999)
        return 0
      })
  }, [allResults, selectedRound, activeClass])

  const showQualifyingStatusColumn = useMemo(() => qualifyingStandings.some(s => s.status === 'dnf' || s.status === 'dns' || s.status === 'dsq'), [qualifyingStandings])
  const hasQualifyingData          = useMemo(() => qualifyingStandings.length > 0, [qualifyingStandings])

  // ── 누적 스탠딩 (activeClass 기준) ──────────────────────────
  const activeTeamStanding = useMemo(
    () => [...(teamStandings.find(s => s.classCode === activeClass)?.entries ?? [])]
      .sort((a, b) => (a.position ?? 999) - (b.position ?? 999)),
    [teamStandings, activeClass]
  )
  const activeDriverStanding = useMemo(
    () => [...(driverStandings.find(s => s.classCode === activeClass)?.entries ?? [])]
      .sort((a, b) => (a.position ?? 999) - (b.position ?? 999)),
    [driverStandings, activeClass]
  )

  // ── 공통 스타일 ─────────────────────────────────────────────
  const cut = 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)'

  const TH = (s?: React.CSSProperties) => ({
    padding: '8px 12px', fontSize: '.7rem', fontWeight: 900, letterSpacing: '.09em',
    textTransform: 'uppercase' as const, color: 'var(--muted)',
    borderBottom: '1px solid var(--line)', textAlign: 'left' as const,
    whiteSpace: 'nowrap' as const, background: 'var(--bg-2)', ...s,
  })
  const TD = (s?: React.CSSProperties) => ({
    padding: '11px 12px', fontSize: '.88rem',
    borderBottom: '1px solid rgba(255,255,255,.04)', verticalAlign: 'middle' as const, ...s,
  })

  const carTag: React.CSSProperties = {
    fontSize: '.73rem', fontWeight: 900, padding: '1px 7px',
    background: `${RED}14`, color: RED, border: `1px solid ${RED}30`,
    clipPath: 'polygon(0 0,calc(100% - 4px) 0,100% 4px,100% 100%,0 100%)',
    display: 'inline-block',
  }

  // ── 탭 스타일 헬퍼 ──────────────────────────────────────────
  // 2차 탭: 언더라인
  const subTabStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 18px', background: 'none', border: 'none',
    borderBottom: `2px solid ${active ? RED : 'transparent'}`,
    color: active ? '#fff' : 'rgba(255,255,255,.4)',
    fontSize: '.88rem', fontWeight: active ? 700 : 400,
    cursor: 'pointer', transition: 'all .2s', letterSpacing: '.5px',
  })
  // 3차 탭: 텍스트 + 얇은 언더라인
  const classTabStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px', background: 'none', border: 'none',
    borderBottom: `1px solid ${active ? RED : 'transparent'}`,
    color: active ? '#fff' : 'rgba(255,255,255,.38)',
    fontSize: '.85rem', fontWeight: active ? 700 : 400,
    cursor: 'pointer', transition: 'all .2s', letterSpacing: '.3px',
  })

  // ── 집계 중 ───────────────────────────────────────────────
  const pending = (
    <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--muted)' }}>
      <i className="fa-solid fa-chart-bar"
        style={{ fontSize: '2.4rem', opacity: .18, display: 'block', marginBottom: '14px' }} />
      <p style={{ fontSize: '.95rem' }}>집계 중입니다.</p>
    </div>
  )

  const noStandingData = (
    <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--muted)' }}>
      <i className="fa-solid fa-chart-bar"
        style={{ fontSize: '2.4rem', opacity: .18, display: 'block', marginBottom: '14px' }} />
      <p style={{ fontSize: '.95rem' }}>이번 시즌 데이터가 아직 입력되지 않았습니다.</p>
    </div>
  )

  // ── 팀 스탠딩 테이블 ─────────────────────────────────────
  const teamStandingTable = activeTeamStanding.length === 0 ? noStandingData : (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg-2)', border: '1px solid var(--line)', clipPath: cut }}>
        <thead>
          <tr>
            <th style={TH()}>RANK</th>
            <th style={TH()}>NO</th>
            <th style={TH()}>팀명</th>
            <th style={TH()}>드라이버</th>
            <th style={TH({ textAlign: 'right', color: RED })}>PTS</th>
          </tr>
        </thead>
        <tbody>
          {activeTeamStanding.map((s, i) => (
            <tr key={i}
              style={{ transition: 'background .15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.03)')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
            >
              <td style={TD({ fontWeight: 700 })}>{s.position ?? '—'}</td>
              <td style={TD()}><span style={carTag}>#{s.carNumber || '—'}</span></td>
              <td style={TD({ fontWeight: 700, fontSize: '.88rem' })}>{s.teamName || '—'}</td>
              <td style={TD({ color: 'var(--muted)', fontSize: '.84rem' })}>{s.drivers || '—'}</td>
              <td style={TD({ textAlign: 'right', fontWeight: 900, color: RED })}>{s.totalPoints ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // ── 드라이버 스탠딩 테이블 ───────────────────────────────
  const driverStandingTable = activeDriverStanding.length === 0 ? noStandingData : (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg-2)', border: '1px solid var(--line)', clipPath: cut }}>
        <thead>
          <tr>
            <th style={TH()}>RANK</th>
            <th style={TH()}>드라이버</th>
            <th style={TH()}>NO</th>
            <th style={TH()}>팀명</th>
            <th style={TH({ textAlign: 'right', color: RED })}>PTS</th>
          </tr>
        </thead>
        <tbody>
          {activeDriverStanding.map((s, i) => (
            <tr key={i}
              style={{ transition: 'background .15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.03)')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
            >
              <td style={TD({ fontWeight: 700 })}>{s.position ?? '—'}</td>
              <td style={TD({ fontWeight: 700, fontSize: '.88rem' })}>{s.driverName || '—'}</td>
              <td style={TD()}><span style={carTag}>#{s.carNumber || '—'}</span></td>
              <td style={TD({ color: 'var(--muted)', fontSize: '.84rem' })}>{s.teamName || '—'}</td>
              <td style={TD({ textAlign: 'right', fontWeight: 900, color: RED })}>{s.totalPoints ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // ── 라운드 드롭다운 라벨 ────────────────────────────────────
  const roundLabel = (r: Round) =>
    `R${r.roundNumber} · ${fmtDate(r.dateStart)}`

  // ── 결과 테이블 ───────────────────────────────────────────
  const roundTable = !roundsWithData.has(selectedRound) ? (
    <div style={{ textAlign: 'center', padding: '52px 0', color: 'var(--muted)' }}>
      <i className="fa-solid fa-flag-checkered"
        style={{ fontSize: '2.4rem', opacity: .22, display: 'block', marginBottom: '12px' }} />
      <p style={{ fontSize: '.92rem' }}>결과 준비 중입니다.</p>
    </div>
  ) : !hasRoundData ? (
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
              <td style={TD()}><span style={carTag}>#{s.carNumber || '—'}</span></td>
              <td style={TD({ fontWeight: 700, fontSize: '.88rem' })}>{s.teamName || '—'}</td>
              <td style={TD()}>{[s.driver1, s.driver2, s.driver3].filter(Boolean).join(' / ') || '—'}</td>
              <td style={TD({ textAlign: 'center', color: 'var(--muted)' })}>{s.laps ?? '—'}</td>
              <td style={TD({ fontFamily: 'monospace', fontSize: '.84rem' })}>{s.totalTime || '—'}</td>
              <td style={TD({ fontFamily: 'monospace', fontSize: '.84rem', color: 'var(--muted)' })}>
                {s.position === 1 && (!s.status || s.status === 'classified') ? 'LEADER' : (s.gap || '—')}
              </td>
              {showBestLapColumn && (
                <td style={TD({ fontFamily: 'monospace', fontSize: '.84rem' })}>{s.fastestLap || '—'}</td>
              )}
              {showStatusColumn && (
                <td style={TD()}>
                  {s.status === 'dnf' && <span className={`${styles.statusBadge} ${styles.statusDnf}`}>DNF</span>}
                  {s.status === 'dns' && <span className={`${styles.statusBadge} ${styles.statusDns}`}>DNS</span>}
                  {s.status === 'dsq' && <span className={`${styles.statusBadge} ${styles.statusDsq}`}>DSQ</span>}
                  {(!s.status || s.status === 'classified') && '—'}
                </td>
              )}
              <td style={TD({ textAlign: 'right', fontWeight: 900, color: RED })}>{s.points ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // ── 예선 결과 테이블 ──────────────────────────────────────
  const qualifyingTable = !hasQualifyingData ? (
    <div style={{ textAlign: 'center', padding: '52px 0', color: 'var(--muted)' }}>
      <i className="fa-solid fa-stopwatch"
        style={{ fontSize: '2.4rem', opacity: .22, display: 'block', marginBottom: '12px' }} />
      <p style={{ fontSize: '.92rem' }}>예선 결과를 준비 중입니다.</p>
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
            <th style={TH({ fontFamily: 'monospace' })}>BEST LAP</th>
            <th style={TH({ fontFamily: 'monospace' })}>DIFF</th>
            {showQualifyingStatusColumn && <th style={TH()}>STATUS</th>}
            <th style={TH({ textAlign: 'right', color: RED })}>PTS</th>
          </tr>
        </thead>
        <tbody>
          {qualifyingStandings.map((s, i) => (
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
              <td style={TD()}><span style={carTag}>#{s.carNumber || '—'}</span></td>
              <td style={TD({ fontWeight: 700, fontSize: '.88rem' })}>{s.teamName || '—'}</td>
              <td style={TD()}>{[s.driver1, s.driver2, s.driver3].filter(Boolean).join(' / ') || '—'}</td>
              <td style={TD({ fontFamily: 'monospace', fontSize: '.84rem' })}>{s.fastestLap || '—'}</td>
              <td style={TD({ fontFamily: 'monospace', fontSize: '.84rem', color: 'var(--muted)' })}>
                {s.position === 1 && (!s.status || s.status === 'classified') ? '—' : (s.gap || '—')}
              </td>
              {showQualifyingStatusColumn && (
                <td style={TD()}>
                  {s.status === 'dnf' && <span className={`${styles.statusBadge} ${styles.statusDnf}`}>DNF</span>}
                  {s.status === 'dns' && <span className={`${styles.statusBadge} ${styles.statusDns}`}>DNS</span>}
                  {s.status === 'dsq' && <span className={`${styles.statusBadge} ${styles.statusDsq}`}>DSQ</span>}
                  {(!s.status || s.status === 'classified') && '—'}
                </td>
              )}
              <td style={TD({ textAlign: 'right', fontWeight: 900, color: RED })}>{s.points ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // ── 정렬된 라운드 목록 ───────────────────────────────────────
  const sortedRounds = useMemo(
    () => [...rounds].sort((a, b) => a.roundNumber - b.roundNumber),
    [rounds]
  )

  return (
    <div>
      {/* ── 1차 탭: 라운드 결과 / 누적 결과 (알약 스타일) ──── */}
      <div className={`${styles.tabGroup} ${styles.mainTabGroup}`}>
        {MAIN_TABS.map((t, i) => (
          <button key={i} type="button"
            className={`${styles.tabBtn} ${styles.mainTabBtn}${mainTab === i ? ` ${styles.active}` : ''}`}
            style={{ '--tab-color': RED } as React.CSSProperties}
            onClick={() => setMainTab(i)}
          >
            <span className={styles.tabBg} aria-hidden="true" />
            <span className={styles.tabLine} aria-hidden="true" />
            <span className={styles.tabLabel}>{t}</span>
          </button>
        ))}
      </div>

      {/* ── 라운드 드롭다운 (라운드 결과 탭에서만) ─────────── */}
      {mainTab === 0 && sortedRounds.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontSize: '.68rem', fontWeight: 900, letterSpacing: '.12em',
              color: 'rgba(255,255,255,.3)', textTransform: 'uppercase',
            }}>ROUND</span>

            <div ref={dropdownRef} style={{ position: 'relative' }}>
              {/* 드롭다운 버튼 */}
              <button
                type="button"
                onClick={() => setDropdownOpen(v => !v)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '7px 14px', background: 'var(--bg-2)',
                  border: `1px solid ${dropdownOpen ? RED : 'var(--line)'}`,
                  color: '#fff', fontSize: '.88rem', fontWeight: 700,
                  cursor: 'pointer', transition: 'border-color .2s',
                  clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)',
                }}
              >
                {selectedRoundInfo ? roundLabel(selectedRoundInfo) : `R${selectedRound}`}
                <i className={`fa-solid fa-chevron-${dropdownOpen ? 'up' : 'down'}`}
                  style={{ fontSize: '.7rem', opacity: .6 }} />
              </button>

              {/* 드롭다운 목록 */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 4px)', left: 0,
                  minWidth: '200px', background: '#1a1a1a',
                  border: '1px solid var(--line)', zIndex: 100,
                  clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)',
                }}>
                  {sortedRounds.map(r => {
                    const hasData = roundsWithData.has(r.roundNumber)
                    const isSelected = r.roundNumber === selectedRound
                    return (
                      <button
                        key={r._id}
                        type="button"
                        onClick={() => { setSelectedRound(r.roundNumber); setDropdownOpen(false) }}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          width: '100%', padding: '10px 14px', background: isSelected ? `${RED}18` : 'none',
                          border: 'none', borderBottom: '1px solid rgba(255,255,255,.05)',
                          color: hasData ? (isSelected ? '#fff' : 'rgba(255,255,255,.8)') : 'rgba(255,255,255,.3)',
                          fontSize: '.86rem', fontWeight: isSelected ? 700 : 400,
                          cursor: 'pointer', textAlign: 'left',
                          transition: 'background .15s',
                        }}
                        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,.04)' }}
                        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'none' }}
                      >
                        <span>{roundLabel(r)}</span>
                        {!hasData && (
                          <span style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.25)', marginLeft: '8px' }}>
                            준비 중
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 2차 탭: 팀 랭킹 / 드라이버 랭킹 (언더라인) ────── */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid var(--line)' }}>
        {SUB_TABS.map((t, i) => (
          <button key={i} type="button"
            style={subTabStyle(subTab === i)}
            onClick={() => setSubTab(i)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── 3차 탭: 클래스 (텍스트 + 얇은 언더라인) ─────────── */}
      <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        {CLASSES.map(cls => (
          <button key={cls.code} type="button"
            style={classTabStyle(activeClass === cls.code)}
            onClick={() => setActiveClass(cls.code)}
          >
            {cls.label}
          </button>
        ))}
      </div>

      {/* ── 콘텐츠 ──────────────────────────────────────────── */}
      {mainTab === 0 && subTab === 0 && (
        <>
          {/* ── 세션 탭: 결승 / 예선 ──────────────────────── */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid var(--line)' }}>
            <button type="button" style={subTabStyle(sessionTab === 0)} onClick={() => setSessionTab(0)}>결승</button>
            <button type="button" style={subTabStyle(sessionTab === 1)} onClick={() => setSessionTab(1)}>예선</button>
          </div>
          {sessionTab === 0 && roundTable}
          {sessionTab === 1 && qualifyingTable}
        </>
      )}
      {mainTab === 0 && subTab === 1 && pending}
      {mainTab === 1 && subTab === 0 && teamStandingTable}
      {mainTab === 1 && subTab === 1 && driverStandingTable}
    </div>
  )
}
