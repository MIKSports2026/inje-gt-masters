'use client'
import { useState } from 'react'

interface Round { _id: string; roundNumber: number; title?: string; dateStart?: string; status: string }

const STATUS_LABELS: Record<string, string> = {
  upcoming: '예정',
  entry_open: '접수중',
  entry_closed: '접수마감',
  ongoing: '진행중',
  finished: '종료',
}
const STATUS_ORDER = ['upcoming', 'entry_open', 'entry_closed', 'ongoing', 'finished']

export default function RoundStatusPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [rounds, setRounds] = useState<Round[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  async function load() {
    setError('')
    const res = await fetch('/api/admin/round-status')
    if (!res.ok) { setError('라운드를 불러오지 못했습니다.'); return }
    const data = await res.json()
    setRounds(data.rounds ?? [])
  }

  async function handleLogin() {
    setBusyId('login'); setError('')
    try {
      const res = await fetch('/api/admin/results-import/auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) { setError('비밀번호가 올바르지 않습니다.'); return }
      setAuthed(true)
      await load()
    } catch { setError('로그인 중 오류가 발생했습니다.') }
    finally { setBusyId(null) }
  }

  async function setStatus(roundId: string, status: string) {
    setBusyId(roundId); setError(''); setToast('')
    try {
      const res = await fetch('/api/admin/round-status', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roundId, status }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) { setError(data.error ?? '저장 실패'); return }
      setRounds(data.rounds ?? [])
      const r = (data.rounds ?? []).find((x: Round) => x._id === roundId)
      setToast(`R${r?.roundNumber} → ${STATUS_LABELS[status]} 저장됨`)
    } catch { setError('저장 중 오류가 발생했습니다.') }
    finally { setBusyId(null) }
  }

  if (!authed) {
    return (
      <main style={{ maxWidth: 400, margin: '80px auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>라운드 상태 관리</h1>
        <input type="password" placeholder="관리자 비밀번호" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleLogin() }}
          style={{ width: '100%', padding: 10, marginBottom: 12, border: '1px solid #ccc' }} />
        <button onClick={handleLogin} disabled={busyId === 'login' || !password}
          style={{ width: '100%', padding: 12, background: '#E60023', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {busyId === 'login' ? '확인 중...' : '로그인'}
        </button>
        {error && <p style={{ color: '#E60023', marginTop: 12, fontSize: 14 }}>{error}</p>}
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 760, margin: '40px auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>라운드 상태 관리</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
        참가 신청 페이지는 <b>접수중(entry_open)</b> 라운드만 신청을 받습니다. 마감하려면 <b>접수마감</b>으로 바꾸세요.
      </p>

      {error && <p style={{ color: '#E60023', fontSize: 14 }}>{error}</p>}
      {toast && <p style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', padding: 10, fontSize: 14 }}>✅ {toast}</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, marginTop: 12 }}>
        <thead>
          <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
            <th style={{ padding: 8 }}>라운드</th>
            <th style={{ padding: 8 }}>현재 상태</th>
            <th style={{ padding: 8 }}>변경</th>
          </tr>
        </thead>
        <tbody>
          {rounds.map(r => (
            <tr key={r._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8, whiteSpace: 'nowrap' }}>
                <b>R{r.roundNumber}</b> {r.title ?? ''}
                {r.dateStart && <span style={{ color: '#999', marginLeft: 6 }}>{String(r.dateStart).slice(0, 10)}</span>}
              </td>
              <td style={{ padding: 8, whiteSpace: 'nowrap' }}>
                <span style={{
                  padding: '2px 10px', borderRadius: 4, fontWeight: 700,
                  background: r.status === 'entry_open' ? '#e8f5e9' : '#f0f0f0',
                  color: r.status === 'entry_open' ? '#2e7d32' : '#555',
                }}>{STATUS_LABELS[r.status] ?? r.status}</span>
              </td>
              <td style={{ padding: 8 }}>
                <select
                  defaultValue={r.status}
                  disabled={busyId === r._id}
                  onChange={e => setStatus(r._id, e.target.value)}
                  style={{ padding: '6px 8px', border: '1px solid #ccc' }}>
                  {STATUS_ORDER.map(s => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
