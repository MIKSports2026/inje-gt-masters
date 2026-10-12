'use client'
import { useState } from 'react'

const CARDS = ['m1', 'mn', 'mnevo', 'm2', 'm3']

export default function HeroChampionsPage() {
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
      const res = await fetch('/api/admin/hero-champions', { method: 'POST' })
      const d = await res.json()
      if (!res.ok || !d.ok) { setError(d.error ?? '실패'); return }
      setMsg(`✅ 완료 — 챔피언 카드 ${d.champions}장을 맨 앞에 배치, 총 ${d.total}장. 유지: ${(d.kept as string[]).join(', ') || '없음'} / 제외: ${(d.dropped as string[]).join(', ') || '없음'} (반영 최대 1분)`)
    } catch { setError('오류') } finally { setBusy(false) }
  }

  if (!authed) {
    return (
      <main style={{ maxWidth: 400, margin: '80px auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>시즌 챔피언 카드 → 히어로</h1>
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
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>2026 시즌 챔피언 카드를 홈 히어로 앞부분에 배치</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
        클래스 순서(Masters 1 → N → N-evo → 2 → 3)로 챔피언 카드 5장을 히어로 <b>1~5번</b>에 넣습니다. 데스크톱(16:9)·모바일(4:5) 이미지가 함께 등록되고,
        기존 슬라이드는 뒤로 밀리며 상한 10장을 넘는 분량과 비노출 슬라이드는 제외됩니다. 여러 번 눌러도 중복되지 않습니다.
      </p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {CARDS.map(k => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={k} src={`/hero-champions/${k}-desktop.jpg`} alt={k} style={{ width: 118, borderRadius: 6, border: '1px solid #eee' }} />
        ))}
      </div>
      <button onClick={run} disabled={busy}
        style={{ padding: '12px 24px', background: '#E60023', color: '#fff', border: 'none', cursor: 'pointer' }}>
        {busy ? '처리 중…' : '히어로 1~5번으로 배치'}
      </button>
      {error && <p style={{ color: '#E60023', fontSize: 14, marginTop: 12 }}>{error}</p>}
      {msg && <p style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', padding: 12, fontSize: 14, marginTop: 12 }}>{msg}</p>}
    </main>
  )
}
