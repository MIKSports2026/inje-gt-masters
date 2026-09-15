'use client'
import { useState } from 'react'

export default function HeroR4PhotosPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

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
    setBusy(true); setError(''); setMsg('')
    try {
      const res = await fetch('/api/admin/hero-r4-photos', { method: 'POST' })
      const d = await res.json()
      if (!res.ok || !d.ok) { setError(d.error ?? '실패'); return }
      setMsg(`✅ 히어로 교체 완료 — R4 사진 ${d.photos}장, 히어로 영상 제거됨`)
    } catch { setError('오류') } finally { setBusy(false) }
  }

  if (!authed) {
    return (
      <main style={{ maxWidth: 400, margin: '80px auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>히어로 배경 R4 사진 교체</h1>
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
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>홈 히어로 → R4 사진 (영상 제거)</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
        홈 히어로를 <b>R4 사진 2장(1번 포디움 샴페인 / 2번 그리드워크)</b>으로 교체하고, <b>히어로 영상은 제거</b>합니다.
        데스크톱·모바일 모두 사진이 배경으로 표시됩니다. (기존 R3·키비쥬얼 슬라이드 제거)
      </p>
      <button onClick={run} disabled={busy}
        style={{ padding: '12px 24px', background: '#E60023', color: '#fff', border: 'none', cursor: 'pointer' }}>
        {busy ? '교체 중…' : '히어로 배경 교체'}
      </button>
      {error && <p style={{ color: '#E60023', fontSize: 14, marginTop: 12 }}>{error}</p>}
      {msg && <p style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', padding: 12, fontSize: 14, marginTop: 12 }}>{msg}</p>}
    </main>
  )
}
