'use client'
import { useState } from 'react'

interface S { id: string; entries: number }

export default function StandingsR4Page() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [team, setTeam] = useState<S[]>([])
  const [driver, setDriver] = useState<S[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  async function load() {
    const res = await fetch('/api/admin/standings-r4')
    if (res.ok) { const d = await res.json(); setTeam(d.team ?? []); setDriver(d.driver ?? []) }
  }
  async function handleLogin() {
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/admin/results-import/auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }),
      })
      if (!res.ok) { setError('비밀번호가 올바르지 않습니다.'); return }
      setAuthed(true); await load()
    } catch { setError('로그인 오류') } finally { setBusy(false) }
  }
  async function run() {
    setBusy(true); setError(''); setMsg('')
    try {
      const res = await fetch('/api/admin/standings-r4', { method: 'POST' })
      const d = await res.json()
      if (!res.ok || !d.ok) { setError(d.error ?? '실패'); return }
      setMsg(`✅ 스탠딩 업데이트 완료 — 팀 ${d.team}개 · 드라이버 ${d.driver}개 문서 (R4 반영 + M3 정정)`)
    } catch { setError('오류') } finally { setBusy(false) }
  }

  if (!authed) {
    return (
      <main style={{ maxWidth: 400, margin: '80px auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>R4 스탠딩 업데이트</h1>
        <input type="password" placeholder="관리자 비밀번호" value={password}
          onChange={e => setPassword(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleLogin() }}
          style={{ width: '100%', padding: 10, marginBottom: 12, border: '1px solid #ccc' }} />
        <button onClick={handleLogin} disabled={busy || !password}
          style={{ width: '100%', padding: 12, background: '#E60023', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {busy ? '확인 중...' : '로그인'}
        </button>
        {error && <p style={{ color: '#E60023', marginTop: 12, fontSize: 14 }}>{error}</p>}
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 560, margin: '40px auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>R4 반영 스탠딩 업데이트</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
        팀·드라이버 스탠딩에 <b>R4 포인트 반영</b>, <b>M3 원티드 드라이버 정정</b>(#55 임병춘·배지윤 / #44 김희태·김진한),
        <b>신규 참가 추가</b>(VANTAGE MAX 등), 순위 재정렬을 적용합니다. 검토 엑셀과 동일한 내용입니다.
      </p>
      <button onClick={run} disabled={busy}
        style={{ padding: '12px 24px', background: '#E60023', color: '#fff', border: 'none', cursor: 'pointer', marginBottom: 16 }}>
        {busy ? '업데이트 중…' : '스탠딩 업데이트 실행'}
      </button>
      {error && <p style={{ color: '#E60023', fontSize: 14 }}>{error}</p>}
      {msg && <p style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', padding: 12, fontSize: 14 }}>{msg}</p>}
      <div style={{ display: 'flex', gap: 24, marginTop: 8, fontSize: 13 }}>
        <div>
          <b>팀 스탠딩</b>
          {team.map(t => <div key={t.id}>{t.id.replace('teamStanding-2026-', '')} — {t.entries}팀</div>)}
        </div>
        <div>
          <b>드라이버 스탠딩</b>
          {driver.map(t => <div key={t.id}>{t.id.replace('driverStanding-2026-', '')} — {t.entries}명</div>)}
        </div>
      </div>
    </main>
  )
}
