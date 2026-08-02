'use client'
import { useState } from 'react'

interface SetInfo { classKey: string; classRef: string; raceType: string; count: number; docId: string }

const RACE_LABEL: Record<string, string> = { qualifying: '예선', race: '결승', race1: '결승1', race2: '결승2' }
const CLASS_LABEL: Record<string, string> = {
  M1: 'Masters 1', M2: 'Masters 2', M3: 'Masters 3', MN: 'Masters N', MNE: 'Masters N-evo',
}

export default function ResultsBatchPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [sets, setSets] = useState<SetInfo[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState<string[] | null>(null)

  async function load() {
    setError('')
    const res = await fetch('/api/admin/results-batch')
    if (!res.ok) { setError('불러오지 못했습니다.'); return }
    const data = await res.json()
    setSets(data.sets ?? [])
  }
  async function handleLogin() {
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/admin/results-import/auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) { setError('비밀번호가 올바르지 않습니다.'); return }
      setAuthed(true); await load()
    } catch { setError('로그인 오류') } finally { setBusy(false) }
  }
  async function handleImport() {
    setBusy(true); setError(''); setDone(null)
    try {
      const res = await fetch('/api/admin/results-batch', { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data.ok) { setError(data.error ?? '등록 실패'); return }
      setDone(data.detail ?? [])
    } catch { setError('등록 중 오류') } finally { setBusy(false) }
  }

  if (!authed) {
    return (
      <main style={{ maxWidth: 400, margin: '80px auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>경기 결과 일괄 등록 (R3)</h1>
        <input type="password" placeholder="관리자 비밀번호" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleLogin() }}
          style={{ width: '100%', padding: 10, marginBottom: 12, border: '1px solid #ccc' }} />
        <button onClick={handleLogin} disabled={busy || !password}
          style={{ width: '100%', padding: 12, background: '#E60023', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {busy ? '확인 중...' : '로그인'}
        </button>
        {error && <p style={{ color: '#E60023', marginTop: 12, fontSize: 14 }}>{error}</p>}
      </main>
    )
  }

  const total = sets.reduce((a, s) => a + s.count, 0)
  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>경기 결과 일괄 등록 (R3)</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
        예선·결승 {sets.length}개 결과셋(총 {total}행)을 한 번에 등록합니다. 같은 라운드·클래스·세션은 덮어씁니다.
      </p>

      <button onClick={handleImport} disabled={busy}
        style={{ padding: '12px 24px', background: '#E60023', color: '#fff', border: 'none', cursor: 'pointer', marginBottom: 16 }}>
        {busy ? '등록 중...' : `${sets.length}개 결과셋 등록하기`}
      </button>

      {error && <p style={{ color: '#E60023', fontSize: 14 }}>{error}</p>}
      {done && (
        <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', padding: 12, fontSize: 14, marginBottom: 12 }}>
          ✅ {done.length}개 결과셋 등록 완료
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
            <th style={{ padding: 8 }}>클래스</th>
            <th style={{ padding: 8 }}>세션</th>
            <th style={{ padding: 8 }}>행수</th>
          </tr>
        </thead>
        <tbody>
          {sets.map((s, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8 }}>{CLASS_LABEL[s.classKey] ?? s.classKey}</td>
              <td style={{ padding: 8 }}>{RACE_LABEL[s.raceType] ?? s.raceType}</td>
              <td style={{ padding: 8 }}>{s.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
