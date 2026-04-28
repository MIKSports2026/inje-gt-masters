'use client'
// app/admin/standings-import/page.tsx — 스탠딩 일괄 입력 어드민

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import * as XLSX from 'xlsx'

// ── 타입 ──────────────────────────────────────────────────────
type StandingType = 'team' | 'driver'
type UploadMode   = 'bulk' | 'single'

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
  position:    string
  carNumber:   string
  teamName:    string
  drivers:     string
  r1:          string
  r2:          string
  r3:          string
  r4:          string
  r5:          string
  totalPoints: string
}

interface DriverRow {
  position:    string
  driverName:  string
  carNumber:   string
  teamName:    string
  r1:          string
  r2:          string
  r3:          string
  r4:          string
  r5:          string
  totalPoints: string
}

type EntryRow = TeamRow | DriverRow

interface ClassGroup {
  className: string
  classRef:  string
  classCode: string
  rows:      EntryRow[]
}

// ── 빈 행 ─────────────────────────────────────────────────────
function emptyTeamRow(): TeamRow {
  return { position: '', carNumber: '', teamName: '', drivers: '', r1: '', r2: '', r3: '', r4: '', r5: '', totalPoints: '' }
}

function emptyDriverRow(): DriverRow {
  return { position: '', driverName: '', carNumber: '', teamName: '', r1: '', r2: '', r3: '', r4: '', r5: '', totalPoints: '' }
}

// ── 엑셀 파싱 ─────────────────────────────────────────────────
function parseTeamRow(cells: string[], classFilter: string): TeamRow | null {
  const c = (i: number) => (cells[i] ?? '').toString().trim()
  // 컬럼: 클래스(0) 순위(1) 차량번호(2) 팀명(3) 드라이버(4) R1(5) R2(6) R3(7) R4(8) R5(9) 합계(10)
  if (classFilter && c(0) && c(0) !== classFilter) return null
  return {
    position:    c(1),
    carNumber:   c(2),
    teamName:    c(3),
    drivers:     c(4),
    r1:          c(5),
    r2:          c(6),
    r3:          c(7),
    r4:          c(8),
    r5:          c(9),
    totalPoints: c(10),
  }
}

function parseDriverRow(cells: string[], classFilter: string): DriverRow | null {
  const c = (i: number) => (cells[i] ?? '').toString().trim()
  // 컬럼: 클래스(0) 순위(1) 드라이버(2) 차량번호(3) 팀명(4) R1(5) R2(6) R3(7) R4(8) R5(9) 합계(10)
  if (classFilter && c(0) && c(0) !== classFilter) return null
  return {
    position:    c(1),
    driverName:  c(2),
    carNumber:   c(3),
    teamName:    c(4),
    r1:          c(5),
    r2:          c(6),
    r3:          c(7),
    r4:          c(8),
    r5:          c(9),
    totalPoints: c(10),
  }
}

// ── 검증 ──────────────────────────────────────────────────────
interface RowError {
  position?:    string
  teamName?:    string
  driverName?:  string
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
  if (row.totalPoints !== '' && isNaN(Number(row.totalPoints))) {
    errs.totalPoints = '합계 형식 오류'
  }
  const r = row as TeamRow
  const rSum = [r.r1, r.r2, r.r3, r.r4, r.r5]
    .reduce((acc, v) => acc + (v !== '' ? Number(v) || 0 : 0), 0)
  const total = Number(row.totalPoints || 0)
  if (row.totalPoints !== '' && !isNaN(total) && rSum !== total) {
    errs.sumMismatch = `합계 불일치: R1~R5 합=${rSum} ≠ 입력합계=${total}`
  }
  return errs
}

// ── 스타일 ────────────────────────────────────────────────────
const pageWrap:     React.CSSProperties = { minHeight: '100vh', background: '#080e1a', padding: '40px 24px', fontFamily: 'sans-serif' }
const inputStyle:   React.CSSProperties = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }
const selectStyle:  React.CSSProperties = { padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '14px', outline: 'none', cursor: 'pointer', minWidth: '180px' }
const btnPrimary:   React.CSSProperties = { padding: '13px 32px', background: '#DC001A', color: '#fff', border: 'none', fontSize: '15px', fontWeight: 800, cursor: 'pointer', letterSpacing: '1px' }
const btnSecondary: React.CSSProperties = { padding: '9px 18px', background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.25)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }
const cellInput:    React.CSSProperties = { width: '100%', padding: '5px 7px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }

// ── 컬럼 정의 ─────────────────────────────────────────────────
const TEAM_COLS = [
  { key: 'position',    label: '순위',     width: '60px'  },
  { key: 'carNumber',   label: '차번',     width: '70px'  },
  { key: 'teamName',    label: '팀명',     width: '150px' },
  { key: 'drivers',     label: '드라이버', width: '160px' },
  { key: 'r1',          label: 'R1',       width: '60px'  },
  { key: 'r2',          label: 'R2',       width: '60px'  },
  { key: 'r3',          label: 'R3',       width: '60px'  },
  { key: 'r4',          label: 'R4',       width: '60px'  },
  { key: 'r5',          label: 'R5',       width: '60px'  },
  { key: 'totalPoints', label: '합계',     width: '75px'  },
]
const DRIVER_COLS = [
  { key: 'position',    label: '순위',     width: '60px'  },
  { key: 'driverName',  label: '드라이버', width: '140px' },
  { key: 'carNumber',   label: '차번',     width: '70px'  },
  { key: 'teamName',    label: '팀명',     width: '140px' },
  { key: 'r1',          label: 'R1',       width: '60px'  },
  { key: 'r2',          label: 'R2',       width: '60px'  },
  { key: 'r3',          label: 'R3',       width: '60px'  },
  { key: 'r4',          label: 'R4',       width: '60px'  },
  { key: 'r5',          label: 'R5',       width: '60px'  },
  { key: 'totalPoints', label: '합계',     width: '75px'  },
]

// ── 공용 테이블 컴포넌트 ─────────────────────────────────────
interface EntryTableProps {
  rows:          EntryRow[]
  standingType:  StandingType
  onUpdateRow:   (idx: number, field: string, value: string) => void
  onAddRow:      () => void
  onRemoveLastRow: () => void
}

function EntryTable({ rows, standingType, onUpdateRow, onAddRow, onRemoveLastRow }: EntryTableProps) {
  const COLS       = standingType === 'team' ? TEAM_COLS : DRIVER_COLS
  const rowErrors  = rows.map(r => validateRow(r, standingType))
  const hasErrors  = rowErrors.some(e => Object.keys(e).length > 0)

  return (
    <>
      <div style={{ marginBottom: '12px', display: 'flex', gap: '10px' }}>
        <button onClick={onAddRow} style={btnSecondary}>+ 행 추가</button>
        <button onClick={onRemoveLastRow} disabled={rows.length <= 1} style={{ ...btnSecondary, opacity: rows.length <= 1 ? 0.4 : 1 }}>- 마지막 행 삭제</button>
        <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'rgba(255,255,255,0.4)', alignSelf: 'center' }}>{rows.length}행</span>
      </div>
      <div style={{ overflowX: 'auto', marginBottom: '12px' }}>
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
              const errs      = rowErrors[rowIdx]
              const hasSumErr = !!errs.sumMismatch
              return (
                <tr key={rowIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: hasSumErr ? 'rgba(245,158,11,0.06)' : rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '4px 10px', color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>{rowIdx + 1}</td>
                  {COLS.map(col => (
                    <td key={col.key} style={{ padding: '4px 4px', verticalAlign: 'middle' }}>
                      <input
                        type="text"
                        value={(row as unknown as Record<string, string>)[col.key] ?? ''}
                        onChange={e => onUpdateRow(rowIdx, col.key, e.target.value)}
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
      {hasErrors && (
        <div style={{ marginBottom: '8px', padding: '8px 12px', background: 'rgba(220,0,26,0.08)', border: '1px solid rgba(220,0,26,0.3)', fontSize: '12px', color: '#ff8080' }}>
          {rowErrors.some(e => e.sumMismatch) && <div style={{ color: '#f59e0b' }}>⚠ 합계 불일치 행 있음 (저장은 가능)</div>}
          {rowErrors.some(e => e.position || e.teamName || e.driverName || e.totalPoints) && <div>필수 필드 누락 있음</div>}
        </div>
      )}
    </>
  )
}

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
  const [uploadMode,   setUploadMode]   = useState<UploadMode>('bulk')

  // 단일 모드 상태
  const [rows, setRows] = useState<EntryRow[]>([emptyTeamRow()])

  // 일괄 모드 상태
  const [bulkGroups,   setBulkGroups]   = useState<ClassGroup[]>([])
  const [unknownNames, setUnknownNames] = useState<string[]>([])

  const [fileError,          setFileError]          = useState('')
  const [submitting,         setSubmitting]         = useState(false)
  const [toast,              setToast]              = useState('')
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
    const classParam  = searchParams.get('classRef')
    const seasonParam = searchParams.get('season')
    if (classParam && classes.some(c => c._id === classParam)) setClassRef(classParam)
    if (seasonParam && !isNaN(Number(seasonParam))) setSeason(Number(seasonParam))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, classes])

  // standingType / uploadMode 변경 시 데이터 초기화
  useEffect(() => {
    setRows(standingType === 'team' ? [emptyTeamRow()] : [emptyDriverRow()])
    setBulkGroups([])
    setUnknownNames([])
    setFileError('')
  }, [standingType, uploadMode])

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
    setUnknownNames([])
    setBulkGroups([])
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setFileError('파일 크기가 5MB를 초과합니다.'); return }

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

      const bodyRows = dataRows.slice(start)

      if (uploadMode === 'single') {
        // 단일 모드: 기존 동작 — 선택 클래스만 필터
        const selectedClass = classes.find(c => c._id === classRef)
        const classFilter   = selectedClass?.name ?? ''
        const parsed: EntryRow[] = []
        for (const cells of bodyRows) {
          const row = standingType === 'team'
            ? parseTeamRow(cells, classFilter)
            : parseDriverRow(cells, classFilter)
          if (row) parsed.push(row)
        }
        setRows(parsed.length > 0 ? parsed : (standingType === 'team' ? [emptyTeamRow()] : [emptyDriverRow()]))
      } else {
        // 일괄 모드: 클래스 컬럼 기준으로 그룹화
        const groupMap = new Map<string, EntryRow[]>()
        const unknown  = new Set<string>()

        for (const cells of bodyRows) {
          const className = (cells[0] ?? '').toString().trim()
          if (!className) continue
          const matched = classes.find(c => c.name === className)
          if (!matched) { unknown.add(className); continue }
          if (!groupMap.has(matched._id)) groupMap.set(matched._id, [])
          const row = standingType === 'team'
            ? parseTeamRow(cells, '')
            : parseDriverRow(cells, '')
          if (row) groupMap.get(matched._id)!.push(row)
        }

        // classes 배열 정렬 순서 유지
        const groups: ClassGroup[] = []
        for (const cls of classes) {
          const clsRows = groupMap.get(cls._id)
          if (clsRows && clsRows.length > 0) {
            groups.push({ className: cls.name, classRef: cls._id, classCode: cls.classCode, rows: clsRows })
          }
        }

        setBulkGroups(groups)
        setUnknownNames([...unknown])
        if (groups.length === 0 && unknown.size === 0) setFileError('데이터 행을 찾을 수 없습니다.')
      }
    } catch {
      setFileError('파일 파싱 중 오류가 발생했습니다.')
    } finally {
      e.target.value = ''
    }
  }

  // ── 단일 모드 행 편집 ─────────────────────────────────────
  function updateRow(idx: number, field: string, value: string) {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r))
  }
  function addRow() {
    setRows(prev => [...prev, standingType === 'team' ? emptyTeamRow() : emptyDriverRow()])
  }
  function removeLastRow() {
    setRows(prev => prev.length > 1 ? prev.slice(0, -1) : prev)
  }

  // ── 일괄 모드 행 편집 ─────────────────────────────────────
  function updateBulkRow(gi: number, ri: number, field: string, value: string) {
    setBulkGroups(prev => prev.map((g, idx) =>
      idx !== gi ? g : { ...g, rows: g.rows.map((r, i) => i !== ri ? r : { ...r, [field]: value }) }
    ))
  }
  function addBulkRow(gi: number) {
    setBulkGroups(prev => prev.map((g, idx) =>
      idx !== gi ? g : { ...g, rows: [...g.rows, standingType === 'team' ? emptyTeamRow() : emptyDriverRow()] }
    ))
  }
  function removeLastBulkRow(gi: number) {
    setBulkGroups(prev => prev.map((g, idx) =>
      idx !== gi || g.rows.length <= 1 ? g : { ...g, rows: g.rows.slice(0, -1) }
    ))
  }

  // ── 단일 모드: 기존 문서 덮어쓰기 체크 ──────────────────────
  const selectedClass = classes.find(c => c._id === classRef)
  const docType       = standingType === 'team' ? 'teamStanding' : 'driverStanding'
  const hasExisting   = existingStandings.some(
    s => s._type === docType && s.season === season && s.classCode === selectedClass?.classCode
  )

  // ── 일괄 모드: 덮어쓰기 대상 목록 ───────────────────────────
  const bulkOverwriteList = bulkGroups
    .filter(g => existingStandings.some(s => s._type === docType && s.season === season && s.classCode === g.classCode))
    .map(g => g.className)

  // ── 엔트리 payload 변환 ────────────────────────────────────
  function toPayload(r: EntryRow) {
    const rx = r as TeamRow
    const roundDefs = [
      { roundNumber: 1, val: rx.r1 },
      { roundNumber: 2, val: rx.r2 },
      { roundNumber: 3, val: rx.r3 },
      { roundNumber: 4, val: rx.r4 },
      { roundNumber: 5, val: rx.r5 },
    ]
    const rounds = roundDefs
      .filter(rd => rd.val !== '')
      .map(rd => ({ roundNumber: rd.roundNumber, points: Number(rd.val) || 0 }))
    const computedTotal = rounds.reduce((acc, rd) => acc + rd.points, 0)
    const totalPoints   = r.totalPoints !== '' ? Number(r.totalPoints) || 0 : computedTotal
    const base          = { position: Number(r.position), rounds, totalPoints }
    if (standingType === 'team') {
      const t = r as TeamRow
      return { ...base, ...(t.carNumber?.trim() ? { carNumber: t.carNumber } : {}), teamName: t.teamName, ...(t.drivers?.trim() ? { drivers: t.drivers } : {}) }
    } else {
      const d = r as DriverRow
      return { ...base, driverName: d.driverName, ...(d.carNumber?.trim() ? { carNumber: d.carNumber } : {}), ...(d.teamName?.trim() ? { teamName: d.teamName } : {}) }
    }
  }

  // ── 단일 저장 ─────────────────────────────────────────────
  async function doSubmit() {
    if (!classRef) { alert('클래스를 선택하세요.'); return }
    const payload = rows.map(toPayload)
    setSubmitting(true)
    try {
      const res  = await fetch('/api/admin/standings-import/submit', {
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

  // ── 일괄 저장 ─────────────────────────────────────────────
  async function doBulkSubmit() {
    if (bulkGroups.length === 0) { alert('저장할 데이터가 없습니다.'); return }
    const batches = bulkGroups.map(g => ({
      classRef:  g.classRef,
      classCode: g.classCode,
      entries:   g.rows.map(toPayload),
    }))
    setSubmitting(true)
    try {
      const res  = await fetch('/api/admin/standings-import/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ season, standingType, batches }),
      })
      const json = await res.json()
      if (json.ok) {
        const summary = (json.results as { classCode: string; count: number }[])
          .map(r => `${r.classCode}(${r.count}건)`).join(', ')
        setToast(`일괄 저장 완료 — ${summary}`)
        setShowOverwriteModal(false)
        loadDropdowns()
        setTimeout(() => setToast(''), 6000)
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
    if (uploadMode === 'bulk') {
      if (bulkOverwriteList.length > 0) setShowOverwriteModal(true)
      else doBulkSubmit()
    } else {
      if (hasExisting) setShowOverwriteModal(true)
      else doSubmit()
    }
  }

  // ── 유효성 ────────────────────────────────────────────────
  // sumMismatch는 경고만 — 저장 blocking 아님
  const isBlocking = (e: RowError) => !!(e.position || e.teamName || e.driverName || e.totalPoints)
  const rowErrors  = rows.map(r => validateRow(r, standingType))
  const hasErrors  = rowErrors.some(e => Object.keys(e).length > 0)
  const canSubmit  = !submitting && (
    uploadMode === 'single'
      ? (!rowErrors.some(isBlocking) && !!classRef && rows.length > 0)
      : (bulkGroups.length > 0 && bulkGroups.every(g =>
          g.rows.map(r => validateRow(r, standingType)).every(e => !isBlocking(e))
        ))
  )

  if (checking) return (
    <div style={{ ...pageWrap, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(255,255,255,0.4)' }}>로딩 중...</p>
    </div>
  )

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

        {/* ── 업로드 모드 토글 ──────────────────────────────── */}
        <div style={{ marginBottom: '16px', padding: '14px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '28px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase', flexShrink: 0 }}>업로드 모드</span>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="radio" name="uploadMode" value="bulk" checked={uploadMode === 'bulk'} onChange={() => setUploadMode('bulk')} style={{ accentColor: '#DC001A' }} />
            <span style={{ fontSize: '14px', color: uploadMode === 'bulk' ? '#fff' : 'rgba(255,255,255,0.45)', fontWeight: uploadMode === 'bulk' ? 700 : 400 }}>
              전체 일괄 <span style={{ fontSize: '12px', opacity: 0.6 }}>(모든 클래스 한 번에)</span>
            </span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="radio" name="uploadMode" value="single" checked={uploadMode === 'single'} onChange={() => setUploadMode('single')} style={{ accentColor: '#DC001A' }} />
            <span style={{ fontSize: '14px', color: uploadMode === 'single' ? '#fff' : 'rgba(255,255,255,0.45)', fontWeight: uploadMode === 'single' ? 700 : 400 }}>
              단일 클래스 <span style={{ fontSize: '12px', opacity: 0.6 }}>(1개만 선택)</span>
            </span>
          </label>
        </div>

        {/* ── 선택 바 ───────────────────────────────────────── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end', marginBottom: '24px', padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {/* 시즌 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase' }}>시즌</label>
            <select value={season} onChange={e => setSeason(Number(e.target.value))} style={selectStyle}>
              <option value={2026}>2026</option>
            </select>
          </div>

          {/* 클래스 — 단일 모드에서만 표시 */}
          {uploadMode === 'single' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase' }}>클래스</label>
              <select value={classRef} onChange={e => setClassRef(e.target.value)} style={selectStyle}>
                <option value="">-- 클래스 선택 --</option>
                {classes.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* 스탠딩 유형 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase' }}>유형</label>
            <select value={standingType} onChange={e => setStandingType(e.target.value as StandingType)} style={selectStyle}>
              <option value="team">팀 스탠딩</option>
              <option value="driver">드라이버 스탠딩</option>
            </select>
          </div>

          {/* 단일 모드: 기존 데이터 경고 */}
          {uploadMode === 'single' && hasExisting && classRef && (
            <div style={{ padding: '8px 14px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.4)', fontSize: '13px', color: '#f59e0b', alignSelf: 'flex-end' }}>
              ⚠️ 기존 데이터 있음 — 저장 시 덮어씁니다
            </div>
          )}

          {/* 일괄 모드: 덮어쓰기 대상 목록 */}
          {uploadMode === 'bulk' && bulkOverwriteList.length > 0 && (
            <div style={{ padding: '8px 14px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.4)', fontSize: '13px', color: '#f59e0b', alignSelf: 'flex-end' }}>
              ⚠️ 덮어쓰기 대상: {bulkOverwriteList.join(', ')}
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

        {/* ── 파일 업로드 ───────────────────────────────────── */}
        <div style={{ marginBottom: '20px', padding: '16px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ margin: '0 0 10px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
            {uploadMode === 'bulk'
              ? <><strong style={{ color: 'rgba(255,255,255,0.7)' }}>전체 일괄 모드</strong> — 클래스 컬럼 기준으로 자동 분류합니다. 통합 엑셀 1개 업로드로 전체 클래스 저장.</>
              : <><strong style={{ color: 'rgba(255,255,255,0.7)' }}>단일 클래스 모드</strong> — 선택한 클래스 행만 가져옵니다.</>
            }
          </p>
          <input type="file" accept=".xlsx" onChange={handleFileChange} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }} />
          {fileError && <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#ff6b6b' }}>{fileError}</p>}
        </div>

        {/* 알 수 없는 클래스명 경고 */}
        {unknownNames.length > 0 && (
          <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.35)', fontSize: '13px', color: '#f59e0b' }}>
            ⚠️ 인식되지 않은 클래스명 (해당 행 제외됨): <strong>{unknownNames.join(', ')}</strong>
            <br /><span style={{ fontSize: '12px', opacity: 0.8 }}>올바른 클래스명: {classes.map(c => c.name).join(', ')}</span>
          </div>
        )}

        {/* ── 일괄 모드 미리보기 ────────────────────────────── */}
        {uploadMode === 'bulk' && bulkGroups.map((group, gi) => {
          const grpErrors   = group.rows.map(r => validateRow(r, standingType))
          const grpHasError = grpErrors.some(e => Object.keys(e).length > 0)
          return (
            <div key={group.classRef} style={{ marginBottom: '28px', border: `1px solid ${grpHasError ? 'rgba(220,0,26,0.4)' : 'rgba(255,255,255,0.1)'}`, borderTop: `3px solid ${grpHasError ? '#DC001A' : '#16a34a'}` }}>
              <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontWeight: 700, fontSize: '15px', color: '#fff' }}>{group.className}</span>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{group.rows.length}행</span>
                {grpHasError && <span style={{ fontSize: '12px', color: '#ff6b6b', marginLeft: 'auto' }}>⚠ 오류 있음 — 저장 전 수정 필요</span>}
              </div>
              <div style={{ padding: '12px 16px' }}>
                <EntryTable
                  rows={group.rows}
                  standingType={standingType}
                  onUpdateRow={(ri, field, val) => updateBulkRow(gi, ri, field, val)}
                  onAddRow={() => addBulkRow(gi)}
                  onRemoveLastRow={() => removeLastBulkRow(gi)}
                />
              </div>
            </div>
          )
        })}

        {/* ── 단일 모드 테이블 ───────────────────────────────── */}
        {uploadMode === 'single' && (
          <EntryTable
            rows={rows}
            standingType={standingType}
            onUpdateRow={updateRow}
            onAddRow={addRow}
            onRemoveLastRow={removeLastRow}
          />
        )}

        {/* 일괄 모드 저장 요약 */}
        {uploadMode === 'bulk' && bulkGroups.length > 0 && (
          <div style={{ marginBottom: '16px', padding: '10px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
            저장 대상: {bulkGroups.map(g => `${g.className} (${g.rows.length}행)`).join(' · ')}
          </div>
        )}

        {/* 저장 버튼 */}
        <div style={{ display: 'flex', gap: '12px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={handleSubmitClick} disabled={!canSubmit}
            style={{ ...btnPrimary, opacity: !canSubmit ? 0.4 : 1, cursor: !canSubmit ? 'not-allowed' : 'pointer' }}>
            {submitting
              ? '저장 중...'
              : uploadMode === 'bulk'
                ? (bulkGroups.length > 0 ? `${bulkGroups.length}개 클래스 모두 저장` : '저장')
                : 'Sanity에 저장'
            }
          </button>
          {uploadMode === 'single' && !classRef && (
            <span style={{ alignSelf: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>클래스를 선택하세요</span>
          )}
          {uploadMode === 'single' && rowErrors.some(isBlocking) && classRef && (
            <span style={{ alignSelf: 'center', fontSize: '13px', color: '#ff8080' }}>유효성 오류를 먼저 수정하세요</span>
          )}
          {uploadMode === 'bulk' && bulkGroups.length === 0 && (
            <span style={{ alignSelf: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>엑셀 파일을 업로드하세요</span>
          )}
        </div>
      </div>

      {/* 덮어쓰기 확인 모달 */}
      {showOverwriteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.15)', borderTop: '3px solid #f59e0b', padding: '36px 40px', maxWidth: '480px', width: '90%' }}>
            <p style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800, color: '#fff' }}>기존 데이터 존재</p>
            <p style={{ margin: '0 0 24px', fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
              {uploadMode === 'bulk'
                ? <>{bulkOverwriteList.join(', ')} 스탠딩이 이미 저장되어 있습니다.<br />저장하면 해당 클래스 데이터가 전체 덮어씌워집니다.</>
                : <>{season}시즌 {selectedClass?.name ?? ''} {standingType === 'team' ? '팀' : '드라이버'} 스탠딩이 이미 저장되어 있습니다.<br />저장하면 전체 덮어씌워집니다.</>
              }
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowOverwriteModal(false)} style={btnSecondary}>취소</button>
              <button onClick={uploadMode === 'bulk' ? doBulkSubmit : doSubmit} disabled={submitting} style={btnPrimary}>
                {submitting ? '저장 중...' : '덮어쓰기'}
              </button>
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
