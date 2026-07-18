'use client'
import { useState } from 'react'

export default function HeroVideoPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [url, setUrl] = useState('')
  const [videoId, setVideoId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  async function load() {
    setError('')
    const res = await fetch('/api/admin/hero-video')
    if (!res.ok) { setError('현재 값을 불러오지 못했습니다.'); return }
    const data = await res.json()
    setUrl(data.current ?? '')
    setVideoId(data.videoId ?? null)
  }

  async function handleLogin() {
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/admin/results-import/auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) { setError('비밀번호가 올바르지 않습니다.'); return }
      setAuthed(true)
      await load()
    } catch { setError('로그인 중 오류가 발생했습니다.') }
    finally { setBusy(false) }
  }

  async function save() {
    setBusy(true); setError(''); setSaved(false)
    try {
      const res = await fetch('/api/admin/hero-video', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) { setError(data.error ?? '저장 실패'); return }
      setVideoId(data.videoId ?? null)
      setSaved(true)
    } catch { setError('저장 중 오류가 발생했습니다.') }
    finally { setBusy(false) }
  }

  if (!authed) {
    return (
      <main style={{ maxWidth: 400, margin: '80px auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>홈 히어로 배경 영상</h1>
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

  return (
    <main style={{ maxWidth: 640, margin: '40px auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>홈 히어로 배경 영상</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
        홈 상단 히어로에 배경으로 재생될 YouTube 영상 URL입니다. 비우고 저장하면 이미지 슬라이드로 돌아갑니다.
      </p>

      <label style={{ display: 'block', fontSize: 13, color: '#444', marginBottom: 6 }}>YouTube URL</label>
      <input type="text" value={url} onChange={e => { setUrl(e.target.value); setSaved(false) }}
        placeholder="https://youtu.be/..."
        style={{ width: '100%', padding: 10, marginBottom: 12, border: '1px solid #ccc', fontSize: 14 }} />

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={save} disabled={busy}
          style={{ padding: '10px 20px', background: '#E60023', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {busy ? '저장 중...' : '저장'}
        </button>
        <button onClick={() => { setUrl(''); }} disabled={busy}
          style={{ padding: '10px 20px', background: '#fff', color: '#333', border: '1px solid #ccc', cursor: 'pointer' }}>
          비우기
        </button>
      </div>

      {error && <p style={{ color: '#E60023', fontSize: 14 }}>{error}</p>}
      {saved && <p style={{ color: '#2e7d32', fontSize: 14 }}>✅ 저장되었습니다. (홈 반영까지 최대 1분)</p>}

      {videoId && (
        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 13, color: '#444', marginBottom: 8 }}>미리보기 (video ID: {videoId})</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt="미리보기"
            style={{ width: 320, maxWidth: '100%', borderRadius: 6, border: '1px solid #eee' }} />
        </div>
      )}
    </main>
  )
}
