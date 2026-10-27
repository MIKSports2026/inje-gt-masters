'use client'
import { useState } from 'react'

const VOICES = ['U-FLPpYSLtc', 'qjd9qV5mTi8', 'dR3kUP7VqNc', 'lqy6-ZqtPEg', 'gyB8f7WPN9M']

export default function HomeMediaR5Page() {
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
      const res = await fetch('/api/admin/home-media-r5', { method: 'POST' })
      const d = await res.json().catch(() => ({ ok: false, error: `응답 오류 (${res.status})` }))
      if (!res.ok || !d.ok) { setError(d.error ?? '실패'); return }
      setMsg(`✅ 완료 — 홈 MEDIA ${d.featured}칸 교체 (반영 최대 5분)`)
    } catch { setError('오류') } finally { setBusy(false) }
  }

  if (!authed) {
    return (
      <main style={{ maxWidth: 400, margin: '80px auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>홈 MEDIA 교체</h1>
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
    <main style={{ maxWidth: 640, margin: '40px auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>홈 MEDIA 교체 — 시즌 챔피언 소감 + R5 갤러리</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
        R3 갤러리·R3 영상을 홈에서 내리고, <b>2026 시즌 챔피언 소감 영상 5개</b>(클래스 순)와 <b>R5 갤러리</b>를 올립니다.
        R5 갤러리는 갤러리 페이지 맨 앞으로 옮깁니다. 여러 번 눌러도 결과는 같습니다.
      </p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {VOICES.map(v => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={v} src={`https://img.youtube.com/vi/${v}/hqdefault.jpg`} alt={v} style={{ width: 110, borderRadius: 6, border: '1px solid #eee' }} />
        ))}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/r5-gallery/g026.jpg" alt="R5 갤러리" style={{ width: 110, borderRadius: 6, border: '1px solid #eee' }} />
      </div>
      <button onClick={run} disabled={busy}
        style={{ padding: '12px 24px', background: '#E60023', color: '#fff', border: 'none', cursor: 'pointer' }}>
        {busy ? '처리 중…' : '홈 MEDIA 교체 실행'}
      </button>
      {error && <p style={{ color: '#E60023', fontSize: 14, marginTop: 12 }}>{error}</p>}
      {msg && <p style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', padding: 12, fontSize: 14, marginTop: 12 }}>{msg}</p>}
    </main>
  )
}
