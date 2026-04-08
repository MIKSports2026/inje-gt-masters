'use client'
// app/(site)/admin/applications/page.tsx — 신청자 목록 어드민
import { useState, useEffect, useCallback } from 'react'
import Breadcrumb from '@/components/ui/Breadcrumb'

// Sheets 열 순서 (v3 실제): [0]신청일시(클라이언트) [1]참가유형 [2]라운드 [3]클래스 [4]팀명
// [5]팀대표 [6]참가비 [7]차량 [8]D1이름 [9]D1생년월일 [10]D1혈액형 [11]D1연락처 [12]D1이메일 [13]D1라이선스
// [14]D2이름 [15]D2생년월일 [16]D2혈액형 [17]D2라이선스
// [18]D3이름 [19]D3생년월일 [20]D3혈액형 [21]D3라이선스
// [22]희망번호 [23]신청일시(서버)

function fmtDate(iso: string | undefined): string {
  if (!iso || !/\d{4}-\d{2}-\d{2}T/.test(iso)) return iso ?? '—'
  try {
    const kst = new Date(new Date(iso).getTime() + 9 * 60 * 60 * 1000)
    return kst.toISOString().slice(0, 10) + ' ' + kst.toISOString().slice(11, 16)
  } catch { return iso }
}

const COLS: { label: string; idx?: number; render?: (row: Row) => string }[] = [
  { label: '신청일시',   render: (row) => fmtDate(row[23]) },
  { label: '참가유형',   idx: 1  },
  { label: '라운드',     idx: 2  },
  { label: '클래스',     idx: 3  },
  { label: '팀명',       idx: 4  },
  { label: '팀 대표',    idx: 5  },
  { label: '차량',       idx: 7  },
  { label: '희망번호',   idx: 22 },
  { label: '드라이버',   render: (row) => [row[8], row[14], row[18]].filter(Boolean).join(' / ') },
  { label: '혈액형',     render: (row) => [row[10], row[16], row[20]].filter(Boolean).join(' / ') },
  { label: '연락처',     idx: 11 },
  { label: '이메일',     idx: 12 },
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
    COLS.some((c) => {
      const val = c.render ? c.render(row) : (c.idx !== undefined ? row[c.idx] ?? '' : '')
      return val.toLowerCase().includes(search.toLowerCase())
    })
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
                    <td key={c.label} style={c.idx === 3 ? { ...tdStyle, color: 'rgba(255,255,255,0.5)', fontSize: '13px' } : tdStyle}>
                      {c.render ? c.render(row) : (c.idx !== undefined ? row[c.idx] ?? '—' : '—')}
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
