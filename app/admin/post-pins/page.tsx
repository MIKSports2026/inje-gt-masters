'use client'
import { useState } from 'react'

interface P { _id: string; title: string; category: string; publishedAt: string; isPinned?: boolean }
const CAT: Record<string, string> = { notice: '공지사항', press: '보도자료', news: '대회소식' }

export default function PostPinsPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [posts, setPosts] = useState<P[]>([])
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function load() {
    setError('')
    const res = await fetch('/api/admin/post-pins')
    if (!res.ok) { setError('불러오지 못했습니다.'); return }
    setPosts((await res.json()).posts ?? [])
  }
  async function handleLogin() {
    setBusy('login'); setError('')
    try {
      const res = await fetch('/api/admin/results-import/auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }),
      })
      if (!res.ok) { setError('비밀번호가 올바르지 않습니다.'); return }
      setAuthed(true); await load()
    } catch { setError('로그인 오류') } finally { setBusy(null) }
  }
  async function toggle(p: P) {
    setBusy(p._id); setError('')
    try {
      const res = await fetch('/api/admin/post-pins', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: p._id, isPinned: !p.isPinned }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) { setError(data.error ?? '실패'); return }
      setPosts(data.posts ?? [])
    } catch { setError('오류') } finally { setBusy(null) }
  }
  async function unpinAll() {
    setBusy('all'); setError('')
    try {
      const res = await fetch('/api/admin/post-pins', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ unpinAll: true }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) { setError(data.error ?? '실패'); return }
      setPosts(data.posts ?? [])
    } catch { setError('오류') } finally { setBusy(null) }
  }

  if (!authed) {
    return (
      <main style={{ maxWidth: 400, margin: '80px auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>뉴스 고정(상단) 관리</h1>
        <input type="password" placeholder="관리자 비밀번호" value={password}
          onChange={e => setPassword(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleLogin() }}
          style={{ width: '100%', padding: 10, marginBottom: 12, border: '1px solid #ccc' }} />
        <button onClick={handleLogin} disabled={busy === 'login' || !password}
          style={{ width: '100%', padding: 12, background: '#E60023', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {busy === 'login' ? '확인 중...' : '로그인'}
        </button>
        {error && <p style={{ color: '#E60023', marginTop: 12, fontSize: 14 }}>{error}</p>}
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 820, margin: '40px auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>뉴스 고정(상단) 관리</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
        📌 고정된 글이 목록 최상단에 표시됩니다. 고정이 많으면 최신 글이 아래로 밀립니다. 오래된 글은 고정 해제하세요.
      </p>
      <button onClick={unpinAll} disabled={!!busy}
        style={{ padding: '8px 16px', background: '#fff', color: '#E60023', border: '1px solid #E60023', cursor: 'pointer', marginBottom: 16 }}>
        {busy === 'all' ? '처리 중...' : '전체 고정 해제 (최신순 정렬로)'}
      </button>
      {error && <p style={{ color: '#E60023', fontSize: 14 }}>{error}</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
            <th style={{ padding: 8 }}>고정</th>
            <th style={{ padding: 8 }}>날짜</th>
            <th style={{ padding: 8 }}>구분</th>
            <th style={{ padding: 8 }}>제목</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(p => (
            <tr key={p._id} style={{ borderBottom: '1px solid #eee', background: p.isPinned ? '#fff8e1' : '#fff' }}>
              <td style={{ padding: 8 }}>
                <button onClick={() => toggle(p)} disabled={busy === p._id}
                  style={{ padding: '4px 10px', cursor: 'pointer', border: '1px solid #ccc',
                    background: p.isPinned ? '#E60023' : '#fff', color: p.isPinned ? '#fff' : '#333' }}>
                  {busy === p._id ? '…' : (p.isPinned ? '📌 고정됨' : '고정')}
                </button>
              </td>
              <td style={{ padding: 8, whiteSpace: 'nowrap' }}>{(p.publishedAt || '').slice(0, 10)}</td>
              <td style={{ padding: 8, whiteSpace: 'nowrap' }}>{CAT[p.category] ?? p.category}</td>
              <td style={{ padding: 8 }}>{p.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
