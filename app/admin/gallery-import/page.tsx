'use client'
import { useState } from 'react'

export default function GalleryImportPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [total, setTotal] = useState(0)
  const [uploaded, setUploaded] = useState(0)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')
  const [doneMsg, setDoneMsg] = useState('')

  async function load() {
    setError('')
    const res = await fetch('/api/admin/gallery-import')
    if (!res.ok) { setError('상태를 불러오지 못했습니다.'); return }
    const d = await res.json()
    setTotal(d.total ?? 0); setUploaded(d.uploaded ?? 0)
  }
  async function handleLogin() {
    setError('')
    try {
      const res = await fetch('/api/admin/results-import/auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }),
      })
      if (!res.ok) { setError('비밀번호가 올바르지 않습니다.'); return }
      setAuthed(true); await load()
    } catch { setError('로그인 오류') }
  }
  async function run() {
    // 처음부터 다시 (offset 0에서 createOrReplace로 재생성)
    setRunning(true); setError(''); setDoneMsg(''); setUploaded(0)
    let offset = 0
    try {
      while (true) {
        const res = await fetch('/api/admin/gallery-import', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ offset }),
        })
        const d = await res.json()
        if (!res.ok || !d.ok) { setError(d.error ?? '업로드 실패 (offset ' + offset + ')'); break }
        setUploaded(d.uploaded); setTotal(d.total)
        if (d.done) { setDoneMsg(`✅ 전체 ${d.total}장 업로드 완료`); break }
        offset = d.next
      }
    } catch { setError('업로드 중 네트워크 오류') }
    finally { setRunning(false) }
  }

  if (!authed) {
    return (
      <main style={{ maxWidth: 400, margin: '80px auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>R3 갤러리 업로드</h1>
        <input type="password" placeholder="관리자 비밀번호" value={password}
          onChange={e => setPassword(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleLogin() }}
          style={{ width: '100%', padding: 10, marginBottom: 12, border: '1px solid #ccc' }} />
        <button onClick={handleLogin} disabled={!password}
          style={{ width: '100%', padding: 12, background: '#E60023', color: '#fff', border: 'none', cursor: 'pointer' }}>로그인</button>
        {error && <p style={{ color: '#E60023', marginTop: 12, fontSize: 14 }}>{error}</p>}
      </main>
    )
  }

  const pct = total ? Math.round((uploaded / total) * 100) : 0
  return (
    <main style={{ maxWidth: 560, margin: '40px auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>2026 R3 갤러리 업로드</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
        R3 오피셜포토 <b>{total}장</b>을 Sanity 갤러리로 업로드합니다. 10장씩 배치로 진행되며, 완료까지 창을 닫지 마세요. 다시 실행하면 처음부터 새로 덮어씁니다.
      </p>

      <button onClick={run} disabled={running}
        style={{ padding: '12px 24px', background: '#E60023', color: '#fff', border: 'none', cursor: running ? 'default' : 'pointer', marginBottom: 16 }}>
        {running ? `업로드 중… ${uploaded}/${total}` : (uploaded > 0 && !doneMsg ? '다시 업로드' : '업로드 시작')}
      </button>

      <div style={{ background: '#eee', borderRadius: 6, overflow: 'hidden', height: 22, marginBottom: 8 }}>
        <div style={{ width: pct + '%', background: '#E60023', height: '100%', transition: 'width .3s' }} />
      </div>
      <p style={{ fontSize: 14 }}>{uploaded} / {total} ({pct}%)</p>

      {error && <p style={{ color: '#E60023', fontSize: 14 }}>{error}</p>}
      {doneMsg && <p style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', padding: 12, fontSize: 14 }}>{doneMsg} — /media/gallery 에서 확인하세요.</p>}
    </main>
  )
}
