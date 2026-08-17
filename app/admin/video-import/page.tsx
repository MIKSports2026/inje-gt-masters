'use client'
import { useState } from 'react'

interface V { title: string; featured: boolean; duration: string }

export default function VideoImportPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [videos, setVideos] = useState<V[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function load() {
    setError('')
    const res = await fetch('/api/admin/video-import')
    if (!res.ok) { setError('불러오지 못했습니다.'); return }
    setVideos((await res.json()).videos ?? [])
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
    setBusy(true); setError(''); setDone(false)
    try {
      const res = await fetch('/api/admin/video-import', { method: 'POST' })
      const d = await res.json()
      if (!res.ok || !d.ok) { setError(d.error ?? '등록 실패'); return }
      setDone(true)
    } catch { setError('등록 중 오류') } finally { setBusy(false) }
  }

  if (!authed) {
    return (
      <main style={{ maxWidth: 400, margin: '80px auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>영상 등록 + 홈 메인 설정</h1>
        <input type="password" placeholder="관리자 비밀번호" value={password}
          onChange={e => setPassword(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleLogin() }}
          style={{ width: '100%', padding: 10, marginBottom: 12, border: '1px solid #ccc' }} />
        <button onClick={handleLogin} disabled={busy || !password}
          style={{ width: '100%', padding: 12, background: '#E60023', color: '#fff', border: 'none', cursor: 'pointer' }}>로그인</button>
        {error && <p style={{ color: '#E60023', marginTop: 12, fontSize: 14 }}>{error}</p>}
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 640, margin: '40px auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>유튜브 영상 등록 + 홈 메인 설정</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
        미등록 영상 {videos.length}개를 등록합니다. ⭐ 표시 2개(R3 다큐·R3 풀레이스)만 <b>홈 메인</b>으로 설정하고, 나머지 기존 영상은 홈 노출에서 내립니다.
      </p>
      <button onClick={run} disabled={busy}
        style={{ padding: '12px 24px', background: '#E60023', color: '#fff', border: 'none', cursor: 'pointer', marginBottom: 16 }}>
        {busy ? '처리 중…' : '등록 + 홈 메인 설정'}
      </button>
      {error && <p style={{ color: '#E60023', fontSize: 14 }}>{error}</p>}
      {done && <p style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', padding: 12, fontSize: 14 }}>✅ 완료 — /media/video 와 홈 MEDIA 섹션에서 확인하세요.</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 8 }}>
        <thead><tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
          <th style={{ padding: 8 }}>홈메인</th><th style={{ padding: 8 }}>길이</th><th style={{ padding: 8 }}>제목</th>
        </tr></thead>
        <tbody>
          {videos.map((v, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8 }}>{v.featured ? '⭐' : ''}</td>
              <td style={{ padding: 8, whiteSpace: 'nowrap' }}>{v.duration}</td>
              <td style={{ padding: 8 }}>{v.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
