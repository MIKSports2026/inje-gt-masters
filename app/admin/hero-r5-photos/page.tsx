'use client'
import { useState } from 'react'

const FILES = ['g026', 'g081', 'g016', 'g082']

export default function HeroR5PhotosPage() {
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
      const res = await fetch('/api/admin/hero-r5-photos', { method: 'POST' })
      const d = await res.json().catch(() => ({ ok: false, error: `응답 오류 (${res.status})` }))
      if (!res.ok || !d.ok) { setError(d.error ?? '실패'); return }
      setMsg(`✅ 완료 — 히어로 총 ${d.total}장: ${(d.order as string[]).join(', ')} (반영 최대 1분)`)
    } catch { setError('오류') } finally { setBusy(false) }
  }

  if (!authed) {
    return (
      <main style={{ maxWidth: 400, margin: '80px auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>히어로 R5 사진 교체</h1>
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
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>홈 히어로 정리 — 2027 캘린더 + R5 포디움·질주 사진</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
        <b>2027 캘린더를 1번</b>으로 두고, 이어서 챔피언 카드 5장, R5 사진 4장(포디움·질주 교차) 순으로 정리합니다. 이미 올라간 이미지는 재사용하며 여러 번 눌러도 중복되지 않습니다.
      </p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero-2027/desktop.jpg" alt="2027 캘린더" style={{ width: 200, borderRadius: 6, border: '1px solid #eee' }} />
        {FILES.map(f => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={f} src={`/r5-gallery/${f}.jpg`} alt={f} style={{ width: 140, borderRadius: 6, border: '1px solid #eee' }} />
        ))}
      </div>
      <button onClick={run} disabled={busy}
        style={{ padding: '12px 24px', background: '#E60023', color: '#fff', border: 'none', cursor: 'pointer' }}>
        {busy ? '처리 중…' : '히어로 정리 실행'}
      </button>
      {error && <p style={{ color: '#E60023', fontSize: 14, marginTop: 12 }}>{error}</p>}
      {msg && <p style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', padding: 12, fontSize: 14, marginTop: 12 }}>{msg}</p>}
    </main>
  )
}
