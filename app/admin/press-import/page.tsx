'use client'
import { useState } from 'react'

interface PostInfo { title: string; media: string; publishedAt: string; slug: string; exists: boolean }

export default function PressImportPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [posts, setPosts] = useState<PostInfo[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function load() {
    setError('')
    const res = await fetch('/api/admin/press-import')
    if (!res.ok) { setError('불러오지 못했습니다.'); return }
    const data = await res.json()
    setPosts(data.posts ?? [])
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
    setBusy(true); setError(''); setDone(false)
    try {
      const res = await fetch('/api/admin/press-import', { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data.ok) { setError(data.error ?? '등록 실패'); return }
      setDone(true); await load()
    } catch { setError('등록 중 오류') } finally { setBusy(false) }
  }

  if (!authed) {
    return (
      <main style={{ maxWidth: 400, margin: '80px auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>언론보도 일괄 등록</h1>
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
    <main style={{ maxWidth: 780, margin: '40px auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>언론보도(press) 일괄 등록</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
        언론보도(R1~R3) {posts.length}건을 press 게시물로 등록합니다. 각 글은 요약 + 매체·기자 출처 + 원문 링크로 구성됩니다. 여러 번 눌러도 덮어쓰기라 중복되지 않습니다.
      </p>

      <button onClick={handleImport} disabled={busy}
        style={{ padding: '12px 24px', background: '#E60023', color: '#fff', border: 'none', cursor: 'pointer', marginBottom: 16 }}>
        {busy ? '등록 중...' : `${posts.length}건 등록하기`}
      </button>

      {error && <p style={{ color: '#E60023', fontSize: 14 }}>{error}</p>}
      {done && <p style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', padding: 12, fontSize: 14 }}>✅ 등록 완료</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 8 }}>
        <thead>
          <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
            <th style={{ padding: 8 }}>상태</th>
            <th style={{ padding: 8 }}>날짜</th>
            <th style={{ padding: 8 }}>매체</th>
            <th style={{ padding: 8 }}>제목</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(p => (
            <tr key={p.slug} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8, whiteSpace: 'nowrap' }}>
                {p.exists ? <span style={{ color: '#888' }}>등록됨</span> : <span style={{ color: '#E60023', fontWeight: 700 }}>신규</span>}
              </td>
              <td style={{ padding: 8, whiteSpace: 'nowrap' }}>{p.publishedAt.slice(0, 10)}</td>
              <td style={{ padding: 8, whiteSpace: 'nowrap' }}>{p.media}</td>
              <td style={{ padding: 8 }}>{p.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
