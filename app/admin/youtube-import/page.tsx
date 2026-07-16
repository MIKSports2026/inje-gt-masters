'use client'
import { useState } from 'react'

interface PlanItem {
  videoId: string
  title: string
  slug: string
  publishedAt?: string
  duration?: string
  round: string | null
  exists: boolean
}

export default function YoutubeImportPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [items, setItems] = useState<PlanItem[]>([])
  const [newCount, setNewCount] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<string | null>(null)

  async function loadPlan() {
    setError('')
    const res = await fetch('/api/admin/youtube-import')
    if (!res.ok) { setError('목록을 불러오지 못했습니다.'); return }
    const data = await res.json()
    setItems(data.items ?? [])
    setNewCount(data.newCount ?? 0)
  }

  async function handleLogin() {
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/admin/results-import/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) { setError('비밀번호가 올바르지 않습니다.'); return }
      setAuthed(true)
      await loadPlan()
    } catch { setError('로그인 중 오류가 발생했습니다.') }
    finally { setBusy(false) }
  }

  async function handleImport() {
    setBusy(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/admin/youtube-import', { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data.ok) { setError(data.error ?? '등록 실패'); return }
      setResult(`등록 완료 — 새로 추가 ${data.created}개 / 이미 있어 건너뜀 ${data.skipped}개`)
      await loadPlan()
    } catch { setError('등록 중 오류가 발생했습니다.') }
    finally { setBusy(false) }
  }

  if (!authed) {
    return (
      <main style={{ maxWidth: 400, margin: '80px auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>유튜브 쇼츠 일괄 등록</h1>
        <input
          type="password"
          placeholder="관리자 비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleLogin() }}
          style={{ width: '100%', padding: 10, marginBottom: 12, border: '1px solid #ccc' }}
        />
        <button onClick={handleLogin} disabled={busy || !password}
          style={{ width: '100%', padding: 12, background: '#E60023', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {busy ? '확인 중...' : '로그인'}
        </button>
        {error && <p style={{ color: '#E60023', marginTop: 12, fontSize: 14 }}>{error}</p>}
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 860, margin: '40px auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>유튜브 쇼츠 일괄 등록</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
        전체 {items.length}개 중 <strong style={{ color: '#E60023' }}>{newCount}개</strong>가 신규입니다.
        이미 등록된 영상은 자동으로 건너뜁니다. (여러 번 눌러도 중복 생성되지 않습니다)
      </p>

      <button onClick={handleImport} disabled={busy || newCount === 0}
        style={{
          padding: '12px 24px', background: newCount === 0 ? '#999' : '#E60023',
          color: '#fff', border: 'none', cursor: newCount === 0 ? 'default' : 'pointer', marginBottom: 20,
        }}>
        {busy ? '등록 중...' : newCount === 0 ? '등록할 신규 영상 없음' : `신규 ${newCount}개 등록하기`}
      </button>

      {error && <p style={{ color: '#E60023', fontSize: 14 }}>{error}</p>}
      {result && (
        <p style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', padding: 12, fontSize: 14 }}>{result}</p>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
            <th style={{ padding: 8 }}>상태</th>
            <th style={{ padding: 8 }}>라운드</th>
            <th style={{ padding: 8 }}>제목</th>
            <th style={{ padding: 8 }}>발행일</th>
            <th style={{ padding: 8 }}>길이</th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.videoId} style={{ borderBottom: '1px solid #eee', opacity: it.exists ? 0.45 : 1 }}>
              <td style={{ padding: 8, whiteSpace: 'nowrap' }}>
                {it.exists
                  ? <span style={{ color: '#888' }}>있음</span>
                  : <span style={{ color: '#E60023', fontWeight: 700 }}>신규</span>}
              </td>
              <td style={{ padding: 8 }}>{it.round ?? '—'}</td>
              <td style={{ padding: 8 }}>{it.title}</td>
              <td style={{ padding: 8, whiteSpace: 'nowrap' }}>{it.publishedAt?.slice(0, 10) ?? '—'}</td>
              <td style={{ padding: 8 }}>{it.duration ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
