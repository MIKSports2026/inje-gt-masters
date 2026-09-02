'use client'
import { useState } from 'react'

interface P { _id: string; title: string; publishedAt: string; round: string; blocks: number; images: number }

export default function PressArticlesPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [posts, setPosts] = useState<P[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  async function load() {
    const res = await fetch('/api/admin/press-articles')
    if (res.ok) setPosts((await res.json()).posts ?? [])
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
      const res = await fetch('/api/admin/press-articles', { method: 'POST' })
      const d = await res.json()
      if (!res.ok || !d.ok) { setError(d.error ?? '실패'); return }
      setMsg(`✅ 보도자료 ${d.count}건 게시 완료 (사진 ${d.uploaded}장 업로드). /media/news 에서 확인하세요.`)
    } catch { setError('오류') } finally { setBusy(false) }
  }

  if (!authed) {
    return (
      <main style={{ maxWidth: 400, margin: '80px auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>공식 보도자료 게시</h1>
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
    <main style={{ maxWidth: 720, margin: '40px auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>공식 보도자료 게시 (R1~R4)</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
        미크스포츠 공식 보도자료 {posts.length}건을 본문·사진과 함께 게시합니다. 사진은 자동 업로드되며, 여러 번 눌러도 중복되지 않습니다(덮어쓰기).
      </p>
      <button onClick={run} disabled={busy}
        style={{ padding: '12px 24px', background: '#E60023', color: '#fff', border: 'none', cursor: 'pointer', marginBottom: 16 }}>
        {busy ? '게시 중… (사진 업로드로 30초~1분 소요)' : '보도자료 일괄 게시'}
      </button>
      {error && <p style={{ color: '#E60023', fontSize: 14 }}>{error}</p>}
      {msg && <p style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', padding: 12, fontSize: 14 }}>{msg}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 8 }}>
        <thead><tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
          <th style={{ padding: 8 }}>발행일</th><th style={{ padding: 8 }}>제목</th>
          <th style={{ padding: 8 }}>문단</th><th style={{ padding: 8 }}>사진</th>
        </tr></thead>
        <tbody>
          {posts.map(p => (
            <tr key={p._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8, whiteSpace: 'nowrap' }}>{p.publishedAt.slice(0, 10)}</td>
              <td style={{ padding: 8 }}>{p.title}</td>
              <td style={{ padding: 8, textAlign: 'center' }}>{p.blocks}</td>
              <td style={{ padding: 8, textAlign: 'center' }}>{p.images}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
