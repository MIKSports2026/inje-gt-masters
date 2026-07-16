'use client'
import { useState } from 'react'

interface Item { id: string; slug: string; label: string; hasHero: boolean; exists: boolean }
interface Result { label: string; ok: boolean; error?: string }

export default function ClassImagesPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState<Result[] | null>(null)

  async function loadState() {
    setError('')
    const res = await fetch('/api/admin/class-images')
    if (!res.ok) { setError('상태를 불러오지 못했습니다.'); return }
    const data = await res.json()
    setItems(data.items ?? [])
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
      await loadState()
    } catch { setError('로그인 중 오류가 발생했습니다.') }
    finally { setBusy(false) }
  }

  async function handleUpload() {
    setBusy(true); setError(''); setResults(null)
    try {
      const res = await fetch('/api/admin/class-images', { method: 'POST' })
      const data = await res.json()
      setResults(data.results ?? null)
      if (!res.ok || !data.ok) { setError(data.error ?? '등록 실패'); return }
      await loadState()
    } catch { setError('등록 중 오류가 발생했습니다.') }
    finally { setBusy(false) }
  }

  if (!authed) {
    return (
      <main style={{ maxWidth: 400, margin: '80px auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>클래스 대표 이미지 등록</h1>
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
    <main style={{ maxWidth: 720, margin: '40px auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>클래스 대표 이미지 등록</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
        5개 클래스의 대표 이미지(heroImage)를 일괄 등록합니다. 여러 번 눌러도 최신 이미지로 덮어씁니다.
      </p>

      <button onClick={handleUpload} disabled={busy}
        style={{ padding: '12px 24px', background: '#E60023', color: '#fff', border: 'none', cursor: 'pointer', marginBottom: 20 }}>
        {busy ? '등록 중...' : '5개 클래스 대표 이미지 등록'}
      </button>

      {error && <p style={{ color: '#E60023', fontSize: 14 }}>{error}</p>}
      {results && (
        <ul style={{ fontSize: 14, lineHeight: 1.8, listStyle: 'none', padding: 0 }}>
          {results.map((r, i) => (
            <li key={i}>{r.ok ? '✅' : '❌'} {r.label}{r.error ? ` — ${r.error}` : ''}</li>
          ))}
        </ul>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, marginTop: 20 }}>
        <thead>
          <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
            <th style={{ padding: 8 }}>클래스</th>
            <th style={{ padding: 8 }}>미리보기</th>
            <th style={{ padding: 8 }}>현재 대표 이미지</th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8, fontWeight: 600 }}>{it.label}</td>
              <td style={{ padding: 8 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/class-images/${it.slug}.jpg`} alt={it.label}
                  style={{ width: 160, height: 90, objectFit: 'cover', borderRadius: 4 }} />
              </td>
              <td style={{ padding: 8 }}>
                {it.hasHero
                  ? <span style={{ color: '#2e7d32' }}>설정됨</span>
                  : <span style={{ color: '#999' }}>없음</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
