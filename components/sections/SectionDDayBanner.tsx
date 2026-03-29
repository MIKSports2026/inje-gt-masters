'use client'
// components/sections/SectionDDayBanner.tsx — D-Day 카운트다운 배너 (red bar)
import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Round } from '@/types/sanity'

interface Props { nextRound: Round | null }

function pad(n: number) { return String(Math.max(0, n)).padStart(2, '0') }

export default function SectionDDayBanner({ nextRound }: Props) {
  const [time, setTime] = useState({ d: '--', h: '--', m: '--', s: '--' })

  useEffect(() => {
    if (!nextRound?.dateStart) return
    const target = new Date(`${nextRound.dateStart}T09:00:00+09:00`).getTime()

    function tick() {
      const diff = target - Date.now()
      if (diff <= 0) return
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTime({ d: pad(d), h: pad(h), m: pad(m), s: pad(s) })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [nextRound?.dateStart])

  if (!nextRound) return null

  const dd   = nextRound.dateStart ? new Date(nextRound.dateStart) : null
  const mon  = dd ? dd.toLocaleDateString('en', { month: 'short', year: 'numeric' }).toUpperCase() : ''
  const date = dd ? dd.getDate() : ''

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '18px', fontWeight: 800, letterSpacing: '3.5px',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.7)',
    background: 'rgba(0,0,0,0.2)',
    padding: '4px 12px',
    whiteSpace: 'nowrap',
  }
  const numStyle: React.CSSProperties = {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '26px', fontWeight: 900, color: 'white', lineHeight: 1,
    letterSpacing: '2px', display: 'block',
    fontVariantNumeric: 'tabular-nums',
    minWidth: '2ch', textAlign: 'center',
  }
  const lblStyle: React.CSSProperties = {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '18px', fontWeight: 700, letterSpacing: '1.5px',
    textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)',
    display: 'block', marginTop: '1px',
  }
  const sepStyle: React.CSSProperties = {
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
    fontSize: '22px', fontWeight: 900,
    color: 'rgba(255,255,255,0.5)', padding: '0 2px',
  }

  return (
    <div role="timer" aria-label="다음 라운드 카운트다운" style={{
      background: 'var(--red)', position: 'relative', zIndex: 100, overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-conic-gradient(rgba(0,0,0,0.06) 0% 25%, transparent 0% 50%)',
        backgroundSize: '16px 16px',
      }} />
      <div className="inner" style={{
        position: 'relative', zIndex: 1,
        height: '52px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '20px',
      }}>
        {/* 좌측: 라운드명 + 카운트다운 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
          <div style={labelStyle}>
            ROUND {nextRound.roundNumber} D-DAY
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {[{ v: time.d, l: 'DAYS' }, { v: time.h, l: 'HRS' }, { v: time.m, l: 'MIN' }, { v: time.s, l: 'SEC' }].map((u, i) => (
              <div key={u.l} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {i > 0 && <span style={sepStyle}>:</span>}
                <div style={{ textAlign: 'center' }}>
                  <span style={numStyle}>{u.v}</span>
                  <span style={lblStyle}>{u.l}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 중앙: 라운드 정보 */}
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '20px', letterSpacing: '4px',
          color: 'rgba(255,255,255,0.9)',
          display: 'flex', alignItems: 'center', gap: '12px',
        }} className="dday-center-info">
          {nextRound.title}
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '18px' }}>·</span>
          {date} {mon}
        </div>

        {/* 우측: CTA */}
        <div style={{ flexShrink: 0 }}>
          <Link href="/entry" style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '19px', fontWeight: 800, letterSpacing: '2.5px',
            textTransform: 'uppercase',
            color: 'var(--red)', background: 'white',
            textDecoration: 'none', padding: '8px 20px',
            display: 'inline-block', transition: 'background 0.2s, color 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--red)'; }}
          >
            지금 신청
          </Link>
        </div>
      </div>

    </div>
  )
}
