'use client'
// app/(site)/admin/applications/page.tsx — 신청자 목록 어드민
import { useState, useEffect, useCallback } from 'react'
import Breadcrumb from '@/components/ui/Breadcrumb'

// 구조 A — 구버전 (20열 이하): 희망번호 없음, 신청일시 [19]
//   [0]참가유형 [1]라운드 [2]클래스 [3]팀명 [4]차량
//   [5]D1이름 [6]D1생년월일 [7]D1혈액형 [8]D1연락처 [9]D1이메일 [10]D1라이선스
//   [11]D2이름 [12]D2생년월일 [13]D2혈액형 [14]D2라이선스
//   [15]D3이름 [16]D3생년월일 [17]D3혈액형 [18]D3라이선스
//   [19]신청일시(ISO)
// 구조 B — 희망번호 추가 (21열): 희망번호 [19], 신청일시 [20]
//   [0-18] 구조A와 동일, [19]희망번호, [20]신청일시(ISO)
// 구조 C — 오늘 이후 (23열): 팀대표/참가비 추가, 희망번호 [21], 신청일시 [22]
//   [0]참가유형 [1]라운드 [2]클래스 [3]팀명 [4]차량 [5]팀대표 [6]참가비
//   [7]D1이름 [8]D1생년월일 [9]D1혈액형 [10]D1연락처 [11]D1이메일 [12]D1라이선스
//   [13]D2이름 [14]D2생년월일 [15]D2혈액형 [16]D2라이선스
//   [17]D3이름 [18]D3생년월일 [19]D3혈액형 [20]D3라이선스
//   [21]희망번호, [22]신청일시(ISO)

function fmtDate(iso: string | undefined): string {
  if (!iso || !/\d{4}-\d{2}-\d{2}T/.test(iso)) return iso || '—'
  try {
    const kst = new Date(new Date(iso).getTime() + 9 * 60 * 60 * 1000)
    return kst.toISOString().slice(0, 10) + ' ' + kst.toISOString().slice(11, 16)
  } catch { return iso }
}

function fmtPhone(val: string | undefined): string {
  if (!val) return '—'
  if (/^\d{10}$/.test(val) && val[0] === '1') {
    const p = '0' + val
    return `${p.slice(0, 3)}-${p.slice(3, 7)}-${p.slice(7)}`
  }
  return val
}

function fmtRound(val: string | undefined): string {
  if (!val) return '—'
  const m = val.match(/^R(\d+)\s/)
  if (m) return `Round ${m[1]}`
  return val
}

// 구조 판단: C → length>=23 / B → length>=20 / A → 나머지
function struct(row: Row): 'C' | 'B' | 'A' {
  if (row.length >= 23) return 'C'
  if (row.length >= 20) return 'B'
  return 'A'
}

const COLS: { label: string; render: (row: Row) => string }[] = [
  { label: '신청일시', render: (row) => {
      const s = struct(row)
      return fmtDate(s === 'C' ? row[22] : s === 'B' ? row[20] : row[19])
  }},
  { label: '참가유형', render: (row) => row[0] ?? '—' },
  { label: '라운드',   render: (row) => fmtRound(row[1]) },
  { label: '클래스',   render: (row) => row[2] ?? '—' },
  { label: '팀명',     render: (row) => row[3] ?? '—' },
  { label: '팀 대표',  render: (row) => struct(row) === 'C' ? (row[5] ?? '—') : '—' },
  { label: '차량',     render: (row) => row[4] ?? '—' },
  { label: '희망번호', render: (row) => {
      const s = struct(row)
      return s === 'C' ? (row[21] ?? '—') : s === 'B' ? (row[19] ?? '—') : '—'
  }},
  { label: '드라이버 1', render: (row) => (struct(row) === 'C' ? row[7]  : row[5])  || '—' },
  { label: '혈액형 1',   render: (row) => (struct(row) === 'C' ? row[9]  : row[7])  || '—' },
  { label: '드라이버 2', render: (row) => (struct(row) === 'C' ? row[13] : row[11]) || '—' },
  { label: '혈액형 2',   render: (row) => (struct(row) === 'C' ? row[15] : row[13]) || '—' },
  { label: '드라이버 3', render: (row) => (struct(row) === 'C' ? row[17] : row[15]) || '—' },
  { label: '혈액형 3',   render: (row) => (struct(row) === 'C' ? row[19] : row[17]) || '—' },
  { label: '연락처',   render: (row) => fmtPhone(struct(row) === 'C' ? row[10] : row[8]) },
  { label: '이메일',   render: (row) => (struct(row) === 'C' ? row[11] : row[9]) ?? '—' },
]

type Row = string[]

export default function AdminApplicationsPage() {
  const [authed,   setAuthed]   = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [loginErr, setLoginErr] = useState('')
  const [logging,  setLogging]  = useState(false)

  const [rows,    setRows]    = useState<Row[]>([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [search,  setSearch]  = useState('')

  // ── 초기 인증 상태 확인 ─────────────────────────────────
  useEffect(() => {
    fetch('/api/admin/applications')
      .then((r) => { if (r.ok) setAuthed(true) })
      .finally(() => setChecking(false))
  }, [])

  // ── 데이터 로드 ─────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const r = await fetch('/api/admin/applications')
      if (!r.ok) { setError('데이터를 불러오지 못했습니다.'); return }
      const json = await r.json()
      setRows((json.rows as Row[]).reverse()) // 최신순
    } catch {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (authed) loadData() }, [authed, loadData])

  // ── 로그인 ──────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLogging(true)
    setLoginErr('')
    try {
      const r = await fetch('/api/admin/auth', {
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

  // ── 로그아웃 ────────────────────────────────────────────
  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    setAuthed(false)
    setRows([])
  }

  // ── 필터 ────────────────────────────────────────────────
  const filtered = rows.filter((row) =>
    COLS.some((c) => c.render(row).toLowerCase().includes(search.toLowerCase()))
  )

  // ── 로딩 중 ─────────────────────────────────────────────
  if (checking) {
    return (
      <div style={pageStyle}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px' }}>로딩 중...</p>
      </div>
    )
  }

  // ── 로그인 폼 ───────────────────────────────────────────
  if (!authed) {
    return (
      <div style={pageStyle}>
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
          borderTop: '3px solid var(--red, #DC001A)',
          padding: '44px 40px', maxWidth: '400px', width: '100%',
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

  // ── 신청자 목록 ─────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#080e1a', padding: '40px 24px' }}>
      {/* 헤더 */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <Breadcrumb items={[
              { label: '인제 GT 마스터즈', href: '/' },
              { label: 'ADMIN' },
              { label: '신청자 목록' },
            ]} />
            <p style={{ margin: '0 0 4px', fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
              INJE GT MASTERS ADMIN
            </p>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: '#fff' }}>
              Register 목록
              <span style={{ marginLeft: '12px', fontSize: '16px', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>
                {filtered.length}건
              </span>
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={loadData} disabled={loading} style={btnSecondaryStyle}>
              {loading ? '불러오는 중...' : '새로고침'}
            </button>
            <button onClick={handleLogout} style={{ ...btnSecondaryStyle, borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.4)' }}>
              로그아웃
            </button>
          </div>
        </div>

        {/* 검색 */}
        <div style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="이름, 팀명, 이메일, 클래스 등으로 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, maxWidth: '360px' }}
          />
        </div>
      </div>

      {/* 에러 */}
      {error && (
        <div style={{ maxWidth: '1200px', margin: '0 auto 20px', padding: '14px 18px', background: 'rgba(220,0,26,0.1)', border: '1px solid rgba(220,0,26,0.3)', color: '#ff6b6b', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {/* 테이블 */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid rgba(220,0,26,0.6)' }}>
              <th style={thStyle}>#</th>
              {COLS.map((c) => (
                <th key={c.label} style={thStyle}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && !loading ? (
              <tr>
                <td colSpan={COLS.length + 1} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '15px' }}>
                  {search ? '검색 결과가 없습니다.' : '신청 데이터가 없습니다.'}
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(220,0,26,0.08)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}
                >
                  <td style={tdMutedStyle}>{filtered.length - i}</td>
                  {COLS.map((c) => (
                    <td key={c.label} style={tdStyle}>
                      {c.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── 스타일 상수 ────────────────────────────────────────────
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

const thStyle: React.CSSProperties = {
  padding: '12px 14px',
  textAlign: 'left',
  color: 'rgba(255,255,255,0.5)',
  fontWeight: 700,
  fontSize: '12px',
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
}

const tdStyle: React.CSSProperties = {
  padding: '13px 14px',
  color: 'rgba(255,255,255,0.82)',
  whiteSpace: 'nowrap',
}

const tdMutedStyle: React.CSSProperties = {
  ...tdStyle,
  color: 'rgba(255,255,255,0.25)',
  fontSize: '12px',
}
