'use client'
// app/admin/standings-import/page.tsx — 스탠딩 일괄 입력 어드민

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import * as XLSX from 'xlsx'

// ── 타입 ──────────────────────────────────────────────────────
type StandingType = 'team' | 'driver'

interface ClassInfo {
  _id:       string
  name:      string
  classCode: string
}

interface ExistingStanding {
  _id:       string
  _type:     string
  season:    number
  classCode: string
}

interface TeamRow {
  position:          string
  carNumber:         string
  teamName:          string
  drivers:           string
  racePoints:        string
  finishBonusPoints: string
  qualifyingPoints:  string
  totalPoints:       string
}

interface DriverRow {
  position:          string
  driverName:        string
  carNumber:         string
  teamName:          string
  racePoints:        string
  finishBonusPoints: string
  qualifyingPoints:  string
  totalPoints:       string
}

type EntryRow = TeamRow | DriverRow

// ── 빈 행 ─────────────────────────────────────────────────────
function emptyTeamRow(): TeamRow {
  return { position: '', carNumber: '', teamName: '', drivers: '', racePoints: '', finishBonusPoints: '', qualifyingPoints: '', totalPoints: '' }
}

function emptyDriverRow(): DriverRow {
  return { position: '', driverName: '', carNumber: '', teamName: '', racePoints: '', finishBonusPoints: '', qualifyingPoints: '', totalPoints: '' }
}

// ── 엑셀 파싱 ─────────────────────────────────────────────────
function parseTeamRow(cells: (string | undefined)[], classFilter: string): TeamRow | null {
  const c = (i: number) => (cells[i] ?? '').toString().trim()
  // 컬럼: 클래스(0) 순위(1) 차량번호(2) 팀명(3) 드라이버(4) 결승pt(5) 완주pt(6) 예선pt(7) 합계(8)
  if (classFilter && c(0) && c(0) !== classFilter) return null
  return {
    position:          c(1),
    carNumber:         c(2),
    teamName:          c(3),
    drivers:           c(4),
    racePoints:        c(5) || '0',
    finishBonusPoints: c(6) || '0',
    qualifyingPoints:  c(7) || '0',
    totalPoints:       c(8),
  }
}

function parseDriverRow(cells: (string | undefined)[], classFilter: string): DriverRow | null {
  const c = (i: number) => (cells[i] ?? '').toString().trim()
  // 컬럼: 클래스(0) 순위(1) 드라이버(2) 차량번호(3) 팀명(4) 결승pt(5) 완주pt(6) 예선pt(7) 합계(8)
  if (classFilter && c(0) && c(0) !== classFilter) return null
  return {
    position:          c(1),
    driverName:        c(2),
    carNumber:         c(3),
    teamName:          c(4),
    racePoints:        c(5) || '0',
    finishBonusPoints: c(6) || '0',
    qualifyingPoints:  c(7) || '0',
    totalPoints:       c(8),
  }
}

// ── 검증 ──────────────────────────────────────────────────────
interface RowError {
  position?:  string
  teamName?:  string
  driverName?: string
  totalPoints?: string
  sumMismatch?: string
}

function validateRow(row: EntryRow, type: StandingType): RowError {
  const errs: RowError = {}
  if (!row.position || isNaN(Number(row.position)) || Number(row.position) < 1) {
    errs.position = '순위 필수 (1 이상 정수)'
  }
  if (type === 'team') {
    const t = row as TeamRow
    if (!t.teamName?.trim()) errs.teamName = '팀명 필수'
  } else {
    const d = row as DriverRow
    if (!d.driverName?.trim()) errs.driverName = '드라이버명 필수'
  }
  if (row.totalPoints === '' || isNaN(Number(row.totalPoints))) {
    errs.totalPoints = '합계 필수'
  }
  // 합계 검증
  const race    = Number(row.racePoints        || 0)
  const bonus   = Number(row.finishBonusPoints || 0)
  const qual    = Number(row.qualifyingPoints  || 0)
  const total   = Number(row.totalPoints       || 0)
  if (row.totalPoints !== '' && !isNaN(total) && race + bonus + qual !== total) {
    errs.sumMismatch = `합계 불일치: ${race}+${bonus}+${qual}=${race+bonus+qual} ≠ ${total}`
  }
  return errs
}

// ── 스타일 ────────────────────────────────────────────────────
const pageWrap:   React.CSSProperties = { minHeight: '100vh', background: '#080e1a', padding: '40px 24px', fontFamily: 'sans-serif' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }
const selectStyle: React.CSSProperties = { padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '14px', outline: 'none', cursor: 'pointer', minWidth: '180px' }
const btnPrimary: React.CSSProperties = { padding: '13px 32px', background: '#DC001A', color: '#fff', border: 'none', fontSize: '15px', fontWeight: 800, cursor: 'pointer', letterSpacing: '1px' }
const btnSecondary: React.CSSProperties = { padding: '9px 18px', background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.25)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }
const cellInput: React.CSSProperties = { width: '100%', padding: '5px 7px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }

// ── 내부 컴포넌트 ─────────────────────────────────────────────
function StandingsImportContent() {
  const searchParams = useSearchParams()

  const [authed,   setAuthed]   = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [loginErr, setLoginErr] = useState('')
  const [logging,  setLogging]  = useState(false)

  const [classes,           setClasses]           = useState<ClassInfo[]>([])
  const [existingStandings, setExistingStandings] = useState<ExistingStanding[]>([])

  const [season,       setSeason]       = useState(2026)
  const [classRef,     setClassRef]     = useState('')
  const [standingType, setStandingType] = useState<StandingType>('team')

  const [rows,      setRows]      = useState<EntryRow[]>([emptyTeamRow()])
  const [fileError, setFileError] = useState('')
  const [submitting,  setSubmitting]  = useState(false)
  const [toast,       setToast]       = useState('')
  const [showOverwriteModal, setShowOverwriteModal] = useState(false)

  // ── 초기 인증 확인 ─────────────────────────────────────────
  useEffect(() => {
    fetch('/api/admin/standings-import/preview')
      .then(async (r) => {
        if (r.ok) {
          setAuthed(true)
          const json = await r.json()
          setClasses(json.classes ?? [])
          setExistingStandings(json.existingStandings ?? [])
        }
      })
      .finally(() => setChecking(false))
  }, [])

  const loadDropdowns = useCallback(async () => {
    const r = await fetch('/api/admin/standings-import/preview')
    if (r.ok) {
      const json = await r.json()
      setClasses(json.classes ?? [])
      setExistingStandings(json.existingStandings ?? [])
    }
  }, [])

  useEffect(() => { if (authed) loadDropdowns() }, [authed, loadDropdowns])

  // URL 파라미터 자동 선택
  useEffect(() => {
    if (!authed || classes.length === 0) return
    const classParam = searchParams.get('classRef')
    const seasonParam = searchParams.get('season')
    if (classParam && classes.some(c => c._id === classParam)) setClassRef(classParam)
    if (seasonParam && !isNaN(Number(seasonParam))) setSeason(Number(seasonParam))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, classes])

  // standingType 변경 시 rows 초기화
  useEffect(() => {
    setRows(standingType === 'team' ? [emptyTeamRow()] : [emptyDriverRow()])
  }, [standingType])

  // ── 로그인 ────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLogging(true)
    setLoginErr('')
    try {
      const r = await fetch('/api/admin/results-import/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (r.ok) { setAuthed(true); setPassword('') }
      else setLoginErr('비밀번호가 올바르지 않습니다.')
    } catch {
      setLoginErr('네트워크 오류가 발생했습니다.')
    } finally {
      setLogging(false)
    }
  }

  // ── 파일 업로드 ───────────────────────────────────────────
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError('')
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setFileError('파일 크기가 5MB를 초과합니다.'); return }

    const selectedClass = classes.find(c => c._id === classRef)
    const classFilter   = selectedClass?.name ?? ''

    try {
      const ab = await file.arrayBuffer()
      const wb = XLSX.read(ab, { type: 'array' })
      const sheetName = standingType === 'team' ? '팀스탠딩' : '드라이버스탠딩'
      const ws = wb.Sheets[sheetName] ?? wb.Sheets[wb.SheetNames[0]]
      const rawRows = XLSX.utils.sheet_to_json<(string | number | undefined)[]>(ws, { header: 1 })

      const dataRows = rawRows
        .filter(r => r.some(c => c !== undefined && c !== ''))
        .map(r => r.map(c => (c !== undefined ? String(c) : '')))

      // 첫 행 헤더 판단
      let start = 0
      if (dataRows.length > 0 && isNaN(Number(String(dataRows[0][1] ?? '').trim()))) start = 1

      const parsed: EntryRow[] = []
      for (const cells of dataRows.slice(start)) {
        const row = standingType === 'team'
          ? parseTeamRow(cells, classFilter)
          : parseDriverRow(cells, classFilter)
        if (row) parsed.push(row)
      }

      setRows(parsed.length > 0 ? parsed : (standingType === 'team' ? [emptyTeamRow()] : [emptyDriverRow()]))
    } catch {
      setFileError('파일 파싱 중 오류가 발생했습니다.')
    } finally {
      e.target.value = ''
    }
  }

  // ── 행 편집 ───────────────────────────────────────────────
  function updateRow(idx: number, field: string, value: string) {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r))
  }
  function addRow() {
    setRows(prev => [...prev, standingType === 'team' ? emptyTeamRow() : emptyDriverRow()])
  }
  function removeLastRow() {
    setRows(prev => prev.length > 1 ? prev.slice(0, -1) : prev)
  }

  // ── 기존 문서 덮어쓰기 경고 ───────────────────────────────
  const selectedClass = classes.find(c => c._id === classRef)
  const docType       = standingType === 'team' ? 'teamStanding' : 'driverStanding'
  const hasExisting   = existingStandings.some(
    s => s._type === docType && s.season === season && s.classCode === selectedClass?.classCode
  )

  // ── 저장 ─────────────────────────────────────────────────
  async function doSubmit() {
    if (!classRef) { alert('클래스를 선택하세요.'); return }

    const payload = rows.map(r => {
      const base = {
        position:          Number(r.position),
        racePoints:        Number(r.racePoints        || 0),
        finishBonusPoints: Number(r.finishBonusPoints || 0),
        qualifyingPoints:  Number(r.qualifyingPoints  || 0),
        totalPoints:       Number(r.totalPoints       || 0),
      }
      if (standingType === 'team') {
        const t = r as TeamRow
        return { ...base, ...(t.carNumber?.trim() ? { carNumber: t.carNumber } : {}), teamName: t.teamName, ...(t.drivers?.trim() ? { drivers: t.drivers } : {}) }
      } else {
        const d = r as DriverRow
        return { ...base, driverName: d.driverName, ...(d.carNumber?.trim() ? { carNumber: d.carNumber } : {}), ...(d.teamName?.trim() ? { teamName: d.teamName } : {}) }
      }
    })

    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/standings-import/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ season, classRef, classCode: selectedClass?.classCode ?? '', standingType, entries: payload }),
      })
      const json = await res.json()
      if (json.ok) {
        setToast(`저장 완료 (${json.count}건) — ${json._id}`)
        setShowOverwriteModal(false)
        loadDropdowns()
        setTimeout(() => setToast(''), 5000)
      } else {
        alert(`저장 실패: ${json.error}`)
      }
    } catch {
      alert('네트워크 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleSubmitClick() {
    if (hasExisting) { setShowOverwriteModal(true) }
    else { doSubmit() }
  }

  // ── 유효성 ────────────────────────────────────────────────
  const rowErrors  = rows.map(r => validateRow(r, standingType))
  const hasErrors  = rowErrors.some(e => Object.keys(e).length > 0)
  const canSubmit  = !hasErrors && !!classRef && rows.length > 0 && !submitting

  // ── 컬럼 헤더 ─────────────────────────────────────────────
  const TEAM_COLS = [
    { key: 'position',          label: '순위',    width: '60px'  },
    { key: 'carNumber',         label: '차번',    width: '70px'  },
    { key: 'teamName',          label: '팀명',    width: '150px' },
    { key: 'drivers',           label: '드라이버', width: '160px' },
    { key: 'racePoints',        label: '결승pt',  width: '75px'  },
    { key: 'finishBonusPoints', label: '완주pt',  width: '75px'  },
    { key: 'qualifyingPoints',  label: '예선pt',  width: '75px'  },
    { key: 'totalPoints',       label: '합계',    width: '75px'  },
  ]
  const DRIVER_COLS = [
    { key: 'position',          label: '순위',    width: '60px'  },
    { key: 'driverName',        label: '드라이버', width: '140px' },
    { key: 'carNumber',         label: '차번',    width: '70px'  },
    { key: 'teamName',          label: '팀명',    width: '140px' },
    { key: 'racePoints',        label: '결승pt',  width: '75px'  },
    { key: 'finishBonusPoints', label: '완주pt',  width: '75px'  },
    { key: 'qualifyingPoints',  label: '예선pt',  width: '75px'  },
    { key: 'totalPoints',       label: '합계',    width: '75px'  },
  ]
  const COLS = standingType === 'team' ? TEAM_COLS : DRIVER_COLS

  if (checking) return <div style={{ ...pageWrap, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'rgba(255,255,255,0.4)' }}>로딩 중...</p></div>

  // ── 로그인 폼 ─────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ ...pageWrap, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderTop: '3px solid #DC001A', padding: '44px 40px', maxWidth: '400px', width: '100%' }}>
          <p style={{ margin: '0 0 6px', fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>INJE GT MASTERS</p>
          <h1 style={{ margin: '0 0 28px', fontSize: '22px', color: '#fff', fontWeight: 800 }}>어드민 로그인</h1>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
            {loginErr && <p style={{ margin: 0, fontSize: '13px', color: '#ff6b6b' }}>{loginErr}</p>}
            <button type="submit" disabled={logging} style={btnPrimary}>{logging ? '확인 중...' : '로그인'}</button>
          </form>
        </div>
      </div>
    )
  }

  // ── 메인 UI ───────────────────────────────────────────────
  return (
    <div style={pageWrap}>
      {/* 헤더 */}
      <div style={{ maxWidth: '1400px', margin: '0 auto 28px' }}>
        <p style={{ margin: '0 0 4px', fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>INJE GT MASTERS ADMIN</p>
        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: '#fff' }}>스탠딩 입력</h1>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* 선택 바 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end', marginBottom: '24px', padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {/* 시즌 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase' }}>시즌</label>
            <select value={season} onChange={e => setSeason(Number(e.target.value))} style={selectStyle}>
              <option value={2026}>2026</option>
            </select>
          </div>

          {/* 클래스 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase' }}>클래스</label>
            <select value={classRef} onChange={e => setClassRef(e.target.value)} style={selectStyle}>
              <option value="">-- 클래스 선택 --</option>
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* 스탠딩 유형 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase' }}>유형</label>
            <select value={standingType} onChange={e => setStandingType(e.target.value as StandingType)} style={selectStyle}>
              <option value="team">팀 스탠딩</option>
              <option value="driver">드라이버 스탠딩</option>
            </select>
          </div>

          {/* 기존 데이터 경고 */}
          {hasExisting && classRef && (
            <div style={{ padding: '8px 14px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.4)', fontSize: '13px', color: '#f59e0b', alignSelf: 'flex-end' }}>
              ⚠️ 기존 데이터 있음 — 저장 시 덮어씁니다
            </div>
          )}

          {/* 버튼 영역 */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <a href="/templates/inje-gt-masters_standings_template.xlsx" download
              style={{ ...btnSecondary, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              📥 엑셀 양식 다운로드
            </a>
            <a href="/admin/results-import"
              style={{ ...btnSecondary, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              결과 입력 도구 →
            </a>
          </div>
        </div>

        {/* 파일 업로드 */}
        <div style={{ marginBottom: '20px', padding: '16px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ margin: '0 0 10px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
            엑셀 파일 업로드 (.xlsx). <strong style={{ color: 'rgba(255,255,255,0.7)' }}>유형에 맞는 시트</strong>를 자동으로 읽습니다 (팀스탠딩 / 드라이버스탠딩).
            클래스가 선택된 경우 해당 클래스 행만 가져옵니다.
          </p>
          <input type="file" accept=".xlsx" onChange={handleFileChange} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }} />
          {fileError && <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#ff6b6b' }}>{fileError}</p>}
        </div>

        {/* 직접 입력 테이블 */}
        <div style={{ marginBottom: '12px', display: 'flex', gap: '10px' }}>
          <button onClick={addRow} style={btnSecondary}>+ 행 추가</button>
          <button onClick={removeLastRow} disabled={rows.length <= 1} style={{ ...btnSecondary, opacity: rows.length <= 1 ? 0.4 : 1 }}>- 마지막 행 삭제</button>
          <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'rgba(255,255,255,0.4)', alignSelf: 'center' }}>{rows.length}행</span>
        </div>

        <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '900px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(220,0,26,0.5)' }}>
                <th style={{ padding: '8px 10px', color: 'rgba(255,255,255,0.35)', fontSize: '11px', textAlign: 'left', width: '36px' }}>#</th>
                {COLS.map(col => (
                  <th key={col.key} style={{ padding: '8px 6px', color: 'rgba(255,255,255,0.5)', fontSize: '11px', textAlign: 'left', width: col.width, whiteSpace: 'nowrap' }}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => {
                const errs = rowErrors[rowIdx]
                const hasSumErr = !!errs.sumMismatch
                return (
                  <tr key={rowIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: hasSumErr ? 'rgba(245,158,11,0.06)' : rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '4px 10px', color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>{rowIdx + 1}</td>
                    {COLS.map(col => (
                      <td key={col.key} style={{ padding: '4px 4px', verticalAlign: 'middle' }}>
                        <input
                          type="text"
                          value={(row as unknown as Record<string, string>)[col.key] ?? ''}
                          onChange={e => updateRow(rowIdx, col.key, e.target.value)}
                          style={{ ...cellInput, borderBottomColor: errs[col.key as keyof RowError] ? '#ff6b6b' : hasSumErr && col.key === 'totalPoints' ? '#f59e0b' : 'rgba(255,255,255,0.1)' }}
                        />
                        {errs[col.key as keyof RowError] && (
                          <p style={{ margin: '2px 0 0', fontSize: '10px', color: '#ff6b6b', lineHeight: 1.2 }}>{errs[col.key as keyof RowError]}</p>
                        )}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* 오류 요약 */}
        {hasErrors && (
          <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(220,0,26,0.08)', border: '1px solid rgba(220,0,26,0.3)', fontSize: '13px', color: '#ff8080' }}>
            {rowErrors.some(e => e.sumMismatch) && <div>합계 불일치 행이 있습니다. 확인 후 저장하세요.</div>}
            {rowErrors.some(e => e.position || e.teamName || e.driverName || e.totalPoints) && <div>필수 필드 누락이 있습니다. 빨간 셀을 확인하세요.</div>}
          </div>
        )}

        {/* 저장 버튼 */}
        <div style={{ display: 'flex', gap: '12px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={handleSubmitClick} disabled={!canSubmit}
            style={{ ...btnPrimary, opacity: !canSubmit ? 0.4 : 1, cursor: !canSubmit ? 'not-allowed' : 'pointer' }}>
            {submitting ? '저장 중...' : 'Sanity에 저장'}
          </button>
          {!classRef && <span style={{ alignSelf: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>클래스를 선택하세요</span>}
          {hasErrors && classRef && <span style={{ alignSelf: 'center', fontSize: '13px', color: '#ff8080' }}>유효성 오류를 먼저 수정하세요</span>}
        </div>
      </div>

      {/* 덮어쓰기 확인 모달 */}
      {showOverwriteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.15)', borderTop: '3px solid #f59e0b', padding: '36px 40px', maxWidth: '480px', width: '90%' }}>
            <p style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800, color: '#fff' }}>기존 데이터 존재</p>
            <p style={{ margin: '0 0 24px', fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
              {season}시즌 {selectedClass?.name ?? ''} {standingType === 'team' ? '팀' : '드라이버'} 스탠딩이 이미 저장되어 있습니다.<br />
              저장하면 전체 덮어씌워집니다.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowOverwriteModal(false)} style={btnSecondary}>취소</button>
              <button onClick={doSubmit} disabled={submitting} style={btnPrimary}>{submitting ? '저장 중...' : '덮어쓰기'}</button>
            </div>
          </div>
        </div>
      )}

      {/* 토스트 */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '32px', right: '32px', background: '#16a34a', color: '#fff', padding: '14px 22px', fontSize: '14px', fontWeight: 700, boxShadow: '0 4px 20px rgba(0,0,0,0.4)', zIndex: 9999 }}>
          {toast}
        </div>
      )}
    </div>
  )
}

// ── 기본 export: Suspense 래핑 ────────────────────────────────
export default function StandingsImportPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#080e1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px' }}>로딩 중...</p>
      </div>
    }>
      <StandingsImportContent />
    </Suspense>
  )
}
