'use client'
import { useState } from 'react'

export default function HeroR4Page() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleLogin() {
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/admin/results-import/auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }),
      })
      if (!res.ok) { setError('비밀번호가 올바르지 않습니다.'); return }
      setAuthed(true)
    } catch { setError('로그인 오류') } finally { setBusy(false) }
  }
  async function run() {
    setBusy(true); setError(''); setDone(false)
    try {
      const res = await fetch('/api/admin/hero-r4', { method: 'POST' })
      const d = await res.json()
      if (!res.ok || !d.ok) { setError(d.error ?? '실패'); return }
      setDone(true)
    } catch { setError('오류') } finally { setBusy(false) }
  }

  if (!authed) {
    return (
      <main style={{ maxWidth: 400, margin: '80px auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>R4 키비쥬얼 → 히어로 1번</h1>
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
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>R4 키비쥬얼을 홈 히어로 1번 슬라이드로</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
        R4 키비쥬얼(FULL STRIKE : BREAKING DAWN)을 홈 히어로 <b>맨 앞 슬라이드</b>로 추가합니다. 데스크톱(16:9)·모바일(세로) 이미지가 함께 등록됩니다. 여러 번 눌러도 중복되지 않습니다.
      </p>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/r4-hero/desktop.jpg" alt="R4 데스크톱" style={{ width: 220, borderRadius: 6, border: '1px solid #eee' }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/r4-hero/mobile.jpg" alt="R4 모바일" style={{ width: 90, borderRadius: 6, border: '1px solid #eee' }} />
      </div>
      <button onClick={run} disabled={busy}
        style={{ padding: '12px 24px', background: '#E60023', color: '#fff', border: 'none', cursor: 'pointer' }}>
        {busy ? '처리 중…' : '히어로 1번으로 등록'}
      </button>
      {error && <p style={{ color: '#E60023', fontSize: 14, marginTop: 12 }}>{error}</p>}
      {done && <p style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', padding: 12, fontSize: 14, marginTop: 12 }}>✅ 완료 — 홈 히어로 첫 슬라이드로 R4 키비쥬얼이 등록됐습니다. (반영 최대 1분)</p>}
    </main>
  )
}
