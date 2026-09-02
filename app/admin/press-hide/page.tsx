'use client'
import { useState } from 'react'

interface P { _id: string; title: string; isHidden: boolean }

export default function PressHidePage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [posts, setPosts] = useState<P[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  async function load() {
    const res = await fetch('/api/admin/press-hide')
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
  async function run(hide: boolean) {
    setBusy(true); setError(''); setMsg('')
    try {
      const res = await fetch(`/api/admin/press-hide${hide ? '' : '?action=show'}`, { method: 'POST' })
      const d = await res.json()
      if (!res.ok || !d.ok) { setError(d.error ?? '실패'); return }
      setMsg(hide ? `✅ 외부 보도자료 ${d.count}개를 숨겼습니다.` : `↩️ ${d.count}개를 다시 노출했습니다.`)
      await load()
    } catch { setError('오류') } finally { setBusy(false) }
  }

  if (!authed) {
    return (
      <main style={{ maxWidth: 400, margin: '80px auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>외부 보도자료 숨김</h1>
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

  const hiddenCount = posts.filter(p => p.isHidden).length
  return (
    <main style={{ maxWidth: 620, margin: '40px auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>외부 연결 보도자료 내리기</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
        외부 언론사 기사로 연결되는 보도자료 + 옛 중복 글 {posts.length}개를 목록에서 숨깁니다(삭제 아님). 언제든 복구할 수 있습니다.
        현재 숨김: <b>{hiddenCount}</b> / {posts.length}
      </p>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <button onClick={() => run(true)} disabled={busy}
          style={{ padding: '12px 22px', background: '#E60023', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {busy ? '처리 중…' : '외부 보도자료 숨기기'}
        </button>
        <button onClick={() => run(false)} disabled={busy}
          style={{ padding: '12px 22px', background: '#fff', color: '#333', border: '1px solid #ccc', cursor: 'pointer' }}>
          다시 노출(복구)
        </button>
      </div>
      {error && <p style={{ color: '#E60023', fontSize: 14 }}>{error}</p>}
      {msg && <p style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', padding: 12, fontSize: 14 }}>{msg}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 8 }}>
        <thead><tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
          <th style={{ padding: 8 }}>상태</th><th style={{ padding: 8 }}>제목</th>
        </tr></thead>
        <tbody>
          {posts.map(p => (
            <tr key={p._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8, whiteSpace: 'nowrap', color: p.isHidden ? '#E60023' : '#2e7d32' }}>{p.isHidden ? '숨김' : '노출'}</td>
              <td style={{ padding: 8 }}>{p.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
