'use client'
// app/admin/results-import/page.tsx — 경기 결과 일괄 입력 어드민

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import * as XLSX from 'xlsx'

// ── 타입 정의 ─────────────────────────────────────────────────
type RaceType = 'qualifying' | 'race1' | 'race2' | 'race'
type Status = 'classified' | 'dnf' | 'dns' | 'dsq'

const VALID_RACE_TYPES: RaceType[] = ['qualifying', 'race1', 'race2', 'race']

interface StandingRow {
  position: string
  carNumber: string
  teamName: string
  driver1: string
  driver2: string
  driver3: string
  carModel: string
  laps: string
  totalTime: string
  gap: string
  fastestLap: string
  points: string
  status: Status | ''
}

interface Round {
  _id: string
  title: string
  roundNumber: number
  date: string
}

interface ClassInfo {
  _id: string
  name: string
  code: string
}

type TabType = 'manual' | 'paste' | 'file'

// ── 빈 행 생성 ────────────────────────────────────────────────
function emptyRow(): StandingRow {
  return {
    position: '',
    carNumber: '',
    teamName: '',
    driver1: '',
    driver2: '',
    driver3: '',
    carModel: '',
    laps: '',
    totalTime: '',
    gap: '',
    fastestLap: '',
    points: '',
    status: '',
  }
}

// ── 파싱: 탭 구분 텍스트 → StandingRow[] ─────────────────────
function parseTabText(text: string): StandingRow[] {
  const lines = text.split('\n').filter((l) => l.trim())
  const rows: StandingRow[] = []

  for (let i = 0; i < lines.length; i++) {
    const cells = lines[i].split('\t')
    // 첫 행 첫 셀이 숫자 불가 = 헤더 → 스킵
    if (i === 0 && isNaN(Number(cells[0]?.trim()))) continue
    rows.push(cellsToRow(cells))
  }
  return rows.length > 0 ? rows : [emptyRow()]
}

function cellsToRow(cells: (string | undefined)[]): StandingRow {
  const c = (i: number) => (cells[i] ?? '').trim()
  const rawPos = c(0)
  const rawStatus = c(12)

  // 순위 셀이 "DNF"/"DQ"/"DNS"/"DSQ" 텍스트이면 → position 비우고 status 자동 매핑
  const posStatusMap: Record<string, Status> = {
    dnf: 'dnf', dns: 'dns', dq: 'dsq', dsq: 'dsq',
  }
  const posAsStatus = posStatusMap[rawPos.toLowerCase()]
  const resolvedPosition = posAsStatus ? '' : rawPos
  const resolvedStatus = posAsStatus
    ? posAsStatus
    : (['classified', 'dnf', 'dns', 'dsq'].includes(rawStatus) ? rawStatus : '') as Status | ''

  return {
    position: resolvedPosition,
    carNumber: c(1),
    teamName: c(2),
    driver1: c(3),
    driver2: c(4),
    driver3: c(5),
    carModel: c(6),
    laps: c(7),
    totalTime: c(8),
    gap: c(9),
    fastestLap: c(10),
    points: c(11),
    status: resolvedStatus,
  }
}

// ── 행 유효성 검사 ────────────────────────────────────────────
interface RowError {
  position?: string
  teamName?: string
  driver1?: string
  status?: string
}

function validateRow(row: StandingRow): RowError {
  const errs: RowError = {}
  const isClassified = !row.status || row.status === 'classified'
  if (isClassified) {
    if (!row.position || isNaN(Number(row.position)) || Number(row.position) < 1) {
      errs.position = 'position 필수 (1 이상 정수)'
    } else if (!Number.isInteger(Number(row.position))) {
      errs.position = 'position은 정수여야 합니다'
    }
  } else if (row.position && (!Number.isInteger(Number(row.position)) || Number(row.position) < 1)) {
    errs.position = 'position은 1 이상 정수여야 합니다'
  }
  if (!row.teamName.trim()) errs.teamName = 'teamName 필수'
  if (!row.driver1.trim()) errs.driver1 = 'driver1 필수'
  if (row.status && !['classified', 'dnf', 'dns', 'dsq'].includes(row.status)) {
    errs.status = '유효하지 않은 status'
  }
  return errs
}

function getDuplicatePositions(rows: StandingRow[]): Set<string> {
  const counts = new Map<string, number>()
  // classified 행만 중복 체크 (DNF/DNS/DSQ는 position 없어도 됨)
  rows
    .filter((r) => !r.status || r.status === 'classified')
    .forEach((r) => {
      if (r.position) counts.set(r.position, (counts.get(r.position) ?? 0) + 1)
    })
  const dups = new Set<string>()
  counts.forEach((cnt, pos) => { if (cnt > 1) dups.add(pos) })
  return dups
}

// ── 스타일 상수 ───────────────────────────────────────────────
const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#080e1a',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 24px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.15)',
  color: '#fff',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box',
}

const btnPrimaryStyle: React.CSSProperties = {
  padding: '13px',
  background: 'var(--red, #DC001A)',
  color: '#fff',
  border: 'none',
  fontSize: '15px',
  fontWeight: 800,
  cursor: 'pointer',
  letterSpacing: '1px',
}

const btnSecondaryStyle: React.CSSProperties = {
  padding: '9px 18px',
  background: 'transparent',
  color: 'rgba(255,255,255,0.7)',
  border: '1px solid rgba(255,255,255,0.25)',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
}

const selectStyle: React.CSSProperties = {
  padding: '10px 14px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.2)',
  color: '#fff',
  fontSize: '14px',
  outline: 'none',
  cursor: 'pointer',
  minWidth: '180px',
}

const cellInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '5px 7px',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  color: '#fff',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
}

// ── 내부 컴포넌트 (useSearchParams 사용) ─────────────────────
function ResultsImportContent() {
  const searchParams = useSearchParams()

  const [authed,   setAuthed]   = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [loginErr, setLoginErr] = useState('')
  const [logging,  setLogging]  = useState(false)

  const [rounds,  setRounds]  = useState<Round[]>([])
  const [classes, setClasses] = useState<ClassInfo[]>([])

  const [roundRef,  setRoundRef]  = useState('')
  const [classRef,  setClassRef]  = useState('')
  const [raceType,  setRaceType]  = useState<RaceType>('race')

  const [activeTab, setActiveTab] = useState<TabType>('manual')
  const [rows,      setRows]      = useState<StandingRow[]>([emptyRow()])

  const [pasteText, setPasteText] = useState('')
  const [fileError, setFileError] = useState('')

  const [submitting,  setSubmitting]  = useState(false)
  const [toast,       setToast]       = useState('')
  const [previewWarn, setPreviewWarn] = useState<{ count: number } | null>(null)
  const [showModal,   setShowModal]   = useState(false)

  // ── 초기 인증 확인 ─────────────────────────────────────────
  useEffect(() => {
    fetch('/api/admin/results-import/preview')
      .then(async (r) => {
        if (r.ok) {
          setAuthed(true)
          const json = await r.json()
          setRounds(json.rounds ?? [])
          setClasses(json.classes ?? [])
        }
      })
      .finally(() => setChecking(false))
  }, [])

  const loadDropdowns = useCallback(async () => {
    const r = await fetch('/api/admin/results-import/preview')
    if (r.ok) {
      const json = await r.json()
      setRounds(json.rounds ?? [])
      setClasses(json.classes ?? [])
    }
  }, [])

  useEffect(() => { if (authed) loadDropdowns() }, [authed, loadDropdowns])

  // ── URL 파라미터 → 드롭다운 자동 선택 ─────────────────────
  useEffect(() => {
    if (!authed || rounds.length === 0) return
    const roundParam = searchParams.get('roundRef')
    const classParam = searchParams.get('classRef')
    const raceParam  = searchParams.get('raceType')

    if (roundParam && rounds.some((r) => r._id === roundParam)) {
      setRoundRef(roundParam)
    }
    if (classParam && classes.some((c) => c._id === classParam)) {
      setClassRef(classParam)
    }
    if (raceParam && (VALID_RACE_TYPES as string[]).includes(raceParam)) {
      setRaceType(raceParam as RaceType)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, rounds, classes])

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

  // ── 행 편집 ───────────────────────────────────────────────
  function updateRow(idx: number, field: keyof StandingRow, value: string) {
    setRows((prev) => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r))
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow()])
  }

  function removeLastRow() {
    setRows((prev) => prev.length > 1 ? prev.slice(0, -1) : prev)
  }

  // ── 붙여넣기 파싱 ─────────────────────────────────────────
  function handleParse() {
    const parsed = parseTabText(pasteText)
    setRows(parsed)
    setActiveTab('manual')
  }

  // ── 파일 업로드 ──────────────────────────────────────────
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError('')
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setFileError('파일 크기가 5MB를 초과합니다.')
      return
    }

    try {
      const ab = await file.arrayBuffer()
      const wb = XLSX.read(ab, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rawRows = XLSX.utils.sheet_to_json<(string | number | undefined)[]>(ws, { header: 1 })

      const dataRows = rawRows
        .filter((r) => r.some((c) => c !== undefined && c !== ''))
        .map((r) => r.map((c) => (c !== undefined ? String(c) : '')))

      // 첫 행 헤더 판단
      let start = 0
      if (dataRows.length > 0 && isNaN(Number(String(dataRows[0][0] ?? '').trim()))) {
        start = 1
      }

      const parsed = dataRows.slice(start).map((cells) => cellsToRow(cells))
      setRows(parsed.length > 0 ? parsed : [emptyRow()])
      setActiveTab('manual')
    } catch {
      setFileError('파일 파싱 중 오류가 발생했습니다.')
    } finally {
      e.target.value = ''
    }
  }

  // ── 기존 데이터 확인 ─────────────────────────────────────
  async function handlePreviewCheck() {
    if (!roundRef || !classRef) {
      alert('라운드와 클래스를 먼저 선택하세요.')
      return
    }
    try {
      const r = await fetch('/api/admin/results-import/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roundRef, classRef, raceType }),
      })
      const json = await r.json()
      if (json.exists) {
        setPreviewWarn({ count: json.existingStandingsCount })
        setShowModal(true)
      } else {
        setPreviewWarn(null)
        alert('저장된 결과가 없습니다. 새로 생성됩니다.')
      }
    } catch {
      alert('네트워크 오류가 발생했습니다.')
    }
  }

  // ── 저장 ─────────────────────────────────────────────────
  async function handleSubmit() {
    if (!roundRef || !classRef) {
      alert('라운드와 클래스를 선택하세요.')
      return
    }

    const standingsPayload = rows.map((r) => ({
      ...(r.position ? { position: Number(r.position) } : {}),
      ...(r.carNumber ? { carNumber: r.carNumber } : {}),
      teamName: r.teamName,
      driver1: r.driver1,
      ...(r.driver2 ? { driver2: r.driver2 } : {}),
      ...(r.driver3 ? { driver3: r.driver3 } : {}),
      ...(r.carModel ? { carModel: r.carModel } : {}),
      ...(r.laps ? { laps: Number(r.laps) } : {}),
      ...(r.totalTime ? { totalTime: r.totalTime } : {}),
      ...(r.gap ? { gap: r.gap } : {}),
      ...(r.fastestLap ? { fastestLap: r.fastestLap } : {}),
      ...(r.points ? { points: Number(r.points) } : {}),
      status: (r.status || 'classified') as Status,
    }))

    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/results-import/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roundRef, classRef, raceType, standings: standingsPayload }),
      })
      const json = await res.json()
      if (json.ok) {
        setToast(`저장 완료 (${json.standingsCount}건) — ${json.action === 'created' ? '새로 생성' : '덮어쓰기'}`)
        setRows([emptyRow()])
        setPreviewWarn(null)
        setShowModal(false)
        setTimeout(() => setToast(''), 4000)
      } else {
        alert(`저장 실패: ${json.error}`)
      }
    } catch {
      alert('네트워크 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── 유효성 계산 ───────────────────────────────────────────
  const rowErrors = rows.map(validateRow)
  const dupPositions = getDuplicatePositions(rows)
  const hasErrors = rowErrors.some((e) => Object.keys(e).length > 0) || dupPositions.size > 0
  const canSubmit = !hasErrors && roundRef && classRef && rows.length > 0 && !submitting

  // ── 로딩 중 ───────────────────────────────────────────────
  if (checking) {
    return (
      <div style={pageStyle}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px' }}>로딩 중...</p>
      </div>
    )
  }

  // ── 로그인 폼 ─────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={pageStyle}>
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderTop: '3px solid var(--red, #DC001A)',
          padding: '44px 40px',
          maxWidth: '400px',
          width: '100%',
        }}>
          <p style={{ margin: '0 0 6px', fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
            INJE GT MASTERS
          </p>
          <h1 style={{ margin: '0 0 28px', fontSize: '22px', color: '#fff', fontWeight: 800 }}>
            어드민 로그인
          </h1>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
            {loginErr && (
              <p style={{ margin: 0, fontSize: '13px', color: '#ff6b6b' }}>{loginErr}</p>
            )}
            <button type="submit" disabled={logging} style={btnPrimaryStyle}>
              {logging ? '확인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── 컬럼 헤더 정의 ────────────────────────────────────────
  const COL_HEADERS = [
    { key: 'position',   label: '순위',       width: '60px',  type: 'number' },
    { key: 'carNumber',  label: '차량번호',   width: '80px',  type: 'text' },
    { key: 'teamName',   label: '팀명',        width: '140px', type: 'text' },
    { key: 'driver1',    label: '드라이버1',  width: '110px', type: 'text' },
    { key: 'driver2',    label: '드라이버2',  width: '110px', type: 'text' },
    { key: 'driver3',    label: '드라이버3',  width: '110px', type: 'text' },
    { key: 'carModel',   label: '차량',        width: '110px', type: 'text' },
    { key: 'laps',       label: '랩수',        width: '60px',  type: 'number' },
    { key: 'totalTime',  label: '총시간',      width: '90px',  type: 'text' },
    { key: 'gap',        label: '갭',          width: '80px',  type: 'text' },
    { key: 'fastestLap', label: '패스티스트', width: '90px',  type: 'text' },
    { key: 'points',     label: '포인트',      width: '70px',  type: 'number' },
    { key: 'status',     label: '상태',        width: '110px', type: 'select' },
  ] as const

  // ── 메인 UI ───────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#080e1a', padding: '40px 24px', fontFamily: 'sans-serif' }}>
      {/* 헤더 */}
      <div style={{ maxWidth: '1400px', margin: '0 auto 28px' }}>
        <p style={{ margin: '0 0 4px', fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
          INJE GT MASTERS ADMIN
        </p>
        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: '#fff' }}>
          경기 결과 입력
        </h1>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* 선택 바 */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center',
          marginBottom: '24px', padding: '20px', background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase' }}>라운드</label>
            <select value={roundRef} onChange={(e) => setRoundRef(e.target.value)} style={selectStyle}>
              <option value="">-- 라운드 선택 --</option>
              {rounds.map((r) => (
                <option key={r._id} value={r._id}>
                  R{r.roundNumber} {r.title} ({r.date?.slice(0, 10) ?? ''})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase' }}>클래스</label>
            <select value={classRef} onChange={(e) => setClassRef(e.target.value)} style={selectStyle}>
              <option value="">-- 클래스 선택 --</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>{c.code} {c.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase' }}>세션</label>
            <select value={raceType} onChange={(e) => setRaceType(e.target.value as RaceType)} style={selectStyle}>
              <option value="qualifying">예선 (qualifying)</option>
              <option value="race1">레이스 1 (race1)</option>
              <option value="race2">레이스 2 (race2)</option>
              <option value="race">결선 (race)</option>
            </select>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'flex-end', paddingBottom: '2px', flexWrap: 'wrap' }}>
            {/* 엑셀 양식 다운로드 */}
            <a
              href="/templates/inje-gt-masters_results_template.xlsx"
              download
              style={{
                ...btnSecondaryStyle,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              📥 엑셀 양식 다운로드
            </a>
            <button onClick={handlePreviewCheck} style={btnSecondaryStyle}>
              기존 데이터 확인
            </button>
          </div>
        </div>

        {/* 탭 */}
        <div style={{ display: 'flex', gap: 0, marginBottom: '0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          {([
            { id: 'manual', label: '✏️ 직접 입력' },
            { id: 'paste',  label: '📋 붙여넣기' },
            { id: 'file',   label: '📁 파일 업로드' },
          ] as { id: TabType; label: string }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '10px 20px',
                background: activeTab === t.id ? 'rgba(220,0,26,0.15)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === t.id ? '2px solid #DC001A' : '2px solid transparent',
                color: activeTab === t.id ? '#fff' : 'rgba(255,255,255,0.45)',
                fontSize: '14px',
                fontWeight: activeTab === t.id ? 700 : 400,
                cursor: 'pointer',
                marginBottom: '-1px',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div style={{ padding: '20px 0' }}>
          {/* 붙여넣기 탭 */}
          {activeTab === 'paste' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                엑셀에서 Ctrl+C 후 아래에 Ctrl+V. 컬럼 순서: 순위 / 차량번호 / 팀명 / 드라이버1 / 드라이버2 / 드라이버3 / 차량모델 / 랩수 / 총시간 / 갭 / 패스티스트랩 / 포인트 / 상태
              </p>
              <textarea
                placeholder="엑셀에서 Ctrl+C 후 여기에 Ctrl+V (탭 구분)"
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                rows={10}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  lineHeight: '1.5',
                }}
              />
              <button onClick={handleParse} style={{ ...btnSecondaryStyle, alignSelf: 'flex-start' }}>
                파싱 후 입력 탭으로 이동
              </button>
            </div>
          )}

          {/* 파일 업로드 탭 */}
          {activeTab === 'file' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                .xlsx, .csv, .tsv 파일 업로드 (최대 5MB). 첫 행이 숫자가 아니면 헤더로 처리.
              </p>
              <input
                type="file"
                accept=".xlsx,.csv,.tsv"
                onChange={handleFileChange}
                style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}
              />
              {fileError && (
                <p style={{ margin: 0, fontSize: '13px', color: '#ff6b6b' }}>{fileError}</p>
              )}
            </div>
          )}

          {/* 직접 입력 탭 (미리보기 포함) */}
          {activeTab === 'manual' && (
            <div>
              <div style={{ marginBottom: '12px', display: 'flex', gap: '10px' }}>
                <button onClick={addRow} style={btnSecondaryStyle}>+ 행 추가</button>
                <button onClick={removeLastRow} disabled={rows.length <= 1} style={{ ...btnSecondaryStyle, opacity: rows.length <= 1 ? 0.4 : 1 }}>
                  - 마지막 행 삭제
                </button>
                <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'rgba(255,255,255,0.4)', alignSelf: 'center' }}>
                  {rows.length}행
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '1100px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid rgba(220,0,26,0.5)' }}>
                      <th style={{ padding: '8px 10px', color: 'rgba(255,255,255,0.35)', fontSize: '11px', textAlign: 'left', width: '36px' }}>#</th>
                      {COL_HEADERS.map((col) => (
                        <th key={col.key} style={{ padding: '8px 6px', color: 'rgba(255,255,255,0.5)', fontSize: '11px', textAlign: 'left', width: col.width, whiteSpace: 'nowrap' }}>
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, rowIdx) => {
                      const errs = rowErrors[rowIdx]
                      const isDup = row.position ? dupPositions.has(row.position) : false

                      return (
                        <tr
                          key={rowIdx}
                          style={{
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            background: isDup
                              ? 'rgba(220,0,26,0.12)'
                              : rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                          }}
                        >
                          <td style={{ padding: '4px 10px', color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>{rowIdx + 1}</td>
                          {COL_HEADERS.map((col) => (
                            <td key={col.key} style={{ padding: '4px 4px', verticalAlign: 'middle' }}>
                              {col.type === 'select' ? (
                                <select
                                  value={row.status}
                                  onChange={(e) => updateRow(rowIdx, 'status', e.target.value)}
                                  style={{ ...cellInputStyle, borderBottom: '1px solid rgba(255,255,255,0.15)' }}
                                >
                                  <option value="">classified</option>
                                  <option value="classified">classified</option>
                                  <option value="dnf">dnf</option>
                                  <option value="dns">dns</option>
                                  <option value="dsq">dsq</option>
                                </select>
                              ) : (
                                <input
                                  type={col.type}
                                  value={row[col.key as keyof StandingRow]}
                                  onChange={(e) => updateRow(rowIdx, col.key as keyof StandingRow, e.target.value)}
                                  disabled={col.key === 'position' && !!row.status && row.status !== 'classified'}
                                  style={{
                                    ...cellInputStyle,
                                    borderBottomColor: errs[col.key as keyof RowError] ? '#ff6b6b' : 'rgba(255,255,255,0.1)',
                                    ...(col.key === 'position' && !!row.status && row.status !== 'classified'
                                      ? { opacity: 0.3, cursor: 'not-allowed' }
                                      : {}),
                                  }}
                                />
                              )}
                              {errs[col.key as keyof RowError] && (
                                <p style={{ margin: '2px 0 0', fontSize: '10px', color: '#ff6b6b', lineHeight: 1.2 }}>
                                  {errs[col.key as keyof RowError]}
                                </p>
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
                <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(220,0,26,0.08)', border: '1px solid rgba(220,0,26,0.3)', fontSize: '13px', color: '#ff8080' }}>
                  {dupPositions.size > 0 && <div>position 중복: {Array.from(dupPositions).join(', ')}</div>}
                  {rowErrors.some((e) => Object.keys(e).length > 0) && <div>필수 필드 누락 또는 유효성 오류가 있습니다. 빨간 셀을 확인하세요.</div>}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              ...btnPrimaryStyle,
              padding: '13px 32px',
              opacity: !canSubmit ? 0.4 : 1,
              cursor: !canSubmit ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? '저장 중...' : 'Sanity에 저장'}
          </button>
          {!roundRef && <span style={{ alignSelf: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>라운드를 선택하세요</span>}
          {!classRef && roundRef && <span style={{ alignSelf: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>클래스를 선택하세요</span>}
          {hasErrors && roundRef && classRef && <span style={{ alignSelf: 'center', fontSize: '13px', color: '#ff8080' }}>유효성 오류를 먼저 수정하세요</span>}
        </div>
      </div>

      {/* 덮어쓰기 경고 모달 */}
      {showModal && previewWarn && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
        }}>
          <div style={{
            background: '#111827', border: '1px solid rgba(255,255,255,0.15)',
            borderTop: '3px solid #f59e0b', padding: '36px 40px', maxWidth: '480px', width: '90%',
          }}>
            <p style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800, color: '#fff' }}>
              기존 데이터 존재
            </p>
            <p style={{ margin: '0 0 24px', fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
              이 라운드+클래스+세션 조합에 이미 결과 <strong style={{ color: '#fff' }}>{previewWarn.count}건</strong>이 저장되어 있습니다.
              <br />저장하면 전체 덮어씌워집니다.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowModal(false)} style={btnSecondaryStyle}>
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{ ...btnPrimaryStyle, padding: '12px 28px' }}
              >
                {submitting ? '저장 중...' : '덮어쓰기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 토스트 */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '32px', right: '32px',
          background: '#16a34a', color: '#fff',
          padding: '14px 22px', fontSize: '14px', fontWeight: 700,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)', zIndex: 9999,
        }}>
          {toast}
        </div>
      )}
    </div>
  )
}

// ── 기본 export: Suspense 래핑 (useSearchParams 요구사항) ────
export default function ResultsImportPage() {
  return (
    <Suspense fallback={
      <div style={pageStyle}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px' }}>로딩 중...</p>
      </div>
    }>
      <ResultsImportContent />
    </Suspense>
  )
}
