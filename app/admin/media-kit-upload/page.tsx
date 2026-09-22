'use client'
import { useState } from 'react'

export default function MediaKitUploadPage() {
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
      const res = await fetch('/api/admin/media-kit-upload', { method: 'POST' })
      const d = await res.json()
      if (!res.ok || !d.ok) { setError(d.error ?? '실패'); return }
      setMsg(`✅ 4라운드 미디어킷 업로드 완료 (${d.sizeKB}KB). /media/kit 에서 다운로드 가능합니다.`)
    } catch { setError('오류') } finally { setBusy(false) }
  }

  if (!authed) {
    return (
      <main style={{ maxWidth: 400, margin: '80px auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>R4 미디어킷 업로드</h1>
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
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>4라운드 미디어킷 업로드</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
        <b>2026 인제 GT 마스터즈 4라운드 미디어킷 (최종본 .pdf)</b>을 업로드하고, /media/kit 의 R4 카드를 <b>공개</b>로 전환합니다. (기존 v1 파일은 최종 PDF로 교체) 아울러 <b>공식 사진 갤러리(R4, 109장)</b>도 함께 연결됩니다.
      </p>
      <button onClick={run} disabled={busy}
        style={{ padding: '12px 24px', background: '#E60023', color: '#fff', border: 'none', cursor: 'pointer' }}>
        {busy ? '업로드 중…' : '미디어킷 업로드 + 공개'}
      </button>
      {error && <p style={{ color: '#E60023', fontSize: 14, marginTop: 12 }}>{error}</p>}
      {msg && <p style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', padding: 12, fontSize: 14, marginTop: 12 }}>{msg}</p>}
    </main>
  )
}
