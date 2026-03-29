'use client'
// components/sections/SectionHero.tsx — v3 Hero
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { SiteSettings, Round } from '@/types/sanity'

interface Props {
  settings:  SiteSettings | null
  nextRound: Round | null
  rounds:    Round[]
}

function pad(n: number) { return String(Math.max(0, n)).padStart(2, '0') }

function useCountdown(dateStart?: string) {
  const calc = () => {
    if (!dateStart) return null
    const diff = new Date(`${dateStart}T09:00:00+09:00`).getTime() - Date.now()
    if (diff <= 0) return null
    return {
      d: pad(Math.floor(diff / 86400000)),
      h: pad(Math.floor((diff % 86400000) / 3600000)),
      m: pad(Math.floor((diff % 3600000) / 60000)),
      s: pad(Math.floor((diff % 60000) / 1000)),
    }
  }
  const [t, setT] = useState(calc)
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id) })
  return t
}

export default function SectionHero({ settings, nextRound, rounds }: Props) {
  const countdown = useCountdown(nextRound?.dateStart)
  const season    = settings?.currentSeason ?? 2026
  const circuit   = settings?.circuitName ?? '인제스피디움'
  const heroImg   = (settings as any)?.heroImage?.asset?.url as string | undefined

  const dd  = nextRound?.dateStart ? new Date(nextRound.dateStart) : null
  const day = dd ? dd.getDate() : null
  const mon = dd ? dd.toLocaleDateString('en', { month: 'short', year: 'numeric' }).toUpperCase() : ''

  const numStyle: React.CSSProperties = {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '48px', fontWeight: 900, color: 'white',
    letterSpacing: '2px', lineHeight: 1, display: 'block',
    fontVariantNumeric: 'tabular-nums',
    minWidth: '2ch', textAlign: 'center',
  }
  const lblStyle: React.CSSProperties = {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '16.5px', fontWeight: 700, letterSpacing: '2px',
    textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
    marginTop: '4px', display: 'block',
  }

  return (
    <section aria-label="메인 히어로" style={{
      position: 'relative',
      minHeight: 'calc(100vh - 104px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      overflow: 'hidden',
    }}>
      {/* 키 비주얼 */}
      <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-2)' }}>
        {heroImg ? (
          <Image src={heroImg} alt="Hero" fill style={{ objectFit: 'cover', objectPosition: 'center 35%' }} priority sizes="100vw" />
        ) : null}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 65% 40%, rgba(220,0,26,0.1) 0%, transparent 55%), radial-gradient(ellipse 100% 100% at 10% 80%, rgba(0,0,0,0.8) 0%, transparent 55%), linear-gradient(160deg, #0b0b0b 0%, #181818 50%, #0f0b0b 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-conic-gradient(rgba(255,255,255,0.01) 0% 25%, transparent 0% 50%)', backgroundSize: '30px 30px' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 25%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.94) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.32) 40%, transparent 65%)' }} />

      {/* 배경 연도 텍스트 */}
      <div aria-hidden="true" style={{
        position: 'absolute', right: '-1%', bottom: '-8%',
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 'clamp(200px, 26vw, 400px)', lineHeight: 1, letterSpacing: '-10px',
        color: 'transparent', WebkitTextStroke: '1px rgba(0,0,0,0.06)',
        pointerEvents: 'none', userSelect: 'none',
      }}>{String(season).slice(-2)}</div>

      {/* 본문 */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'grid', gridTemplateColumns: '1fr minmax(280px,400px)',
        alignItems: 'flex-end', gap: '40px',
        padding: '0 var(--pad) 60px',
      }}>

        {/* 좌측 */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <span style={{ background: 'var(--red)', color: 'white', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '18px', fontWeight: 800, letterSpacing: '3.5px', textTransform: 'uppercase' as const, padding: '5px 14px' }}>
              {season} SEASON
            </span>
            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '19px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.45)' }}>
              WHERE LEGENDS BEGIN
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(72px, 10vw, 152px)',
            lineHeight: 0.88, letterSpacing: '2px',
            color: 'white', marginBottom: '16px',
          }}>
            INJE<br />
            <span style={{ color: 'var(--red)' }}>GT</span><br />
            <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.5)' }}>MASTERS</span>
          </h1>

          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(15px, 1.5vw, 19px)', fontWeight: 400,
            letterSpacing: '5px', color: 'rgba(255,255,255,0.38)',
            textTransform: 'uppercase' as const, marginBottom: '36px',
          }}>
            레이서의 근성과 머신의 한계가 만나는 곳
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link href="/entry" className="btn-fill">
              <i className="fa fa-flag-checkered" />
              참가 신청하기
            </Link>
            <Link href="/season" className="btn-line">
              {season} 일정 보기
            </Link>
          </div>
        </div>

        {/* 우측: 카운트다운 + 다음 라운드 */}
        <div style={{ display: 'grid', gap: '0' }}>
          {/* 카운트다운 박스 */}
          {countdown && (
            <div style={{
              background: 'rgba(10,10,10,0.6)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(20px)',
              padding: '24px 22px',
              marginBottom: '0',
            }}>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '18px', fontWeight: 800, letterSpacing: '3.5px',
                textTransform: 'uppercase' as const, color: 'var(--red)',
                marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span style={{ width: '16px', height: '2px', background: 'var(--red)', display: 'inline-block' }} />
                개막전 D-DAY
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
                {[{ v: countdown.d, l: 'DAYS' }, { v: countdown.h, l: 'HRS' }, { v: countdown.m, l: 'MIN' }, { v: countdown.s, l: 'SEC' }].map((u, i) => (
                  <div key={u.l} style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                    {i > 0 && <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '36px', fontWeight: 900, color: 'rgba(255,255,255,0.18)', flexShrink: 0 }}>:</span>}
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <span style={numStyle}>{u.v}</span>
                      <span style={lblStyle}>{u.l}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 다음 라운드 카드 */}
          {nextRound && (
            <Link href={`/season/${nextRound.slug.current}`} style={{
              background: 'white',
              padding: '18px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f8f6f3'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}
            >
              {day && (
                <div style={{ textAlign: 'center', paddingRight: '16px', borderRight: '1px solid #e0ddd8', flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '44px', fontWeight: 900, color: 'var(--red)', lineHeight: 1, letterSpacing: '1px', fontVariantNumeric: 'tabular-nums' }}>{day}</div>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '18px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' as const, color: '#8a8680' }}>{mon}</div>
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '15.5px', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase' as const, color: 'var(--red)', marginBottom: '5px' }}>
                  INJE GT MASTERS · Round {String(nextRound.roundNumber).padStart(2, '0')}
                </div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '19px', letterSpacing: '2px', color: '#141414', lineHeight: 1.1 }}>
                  {nextRound.title}
                </div>
                <div style={{ fontSize: '16.5px', color: '#8a8680', marginTop: '3px' }}>
                  📍 강원도 {circuit}
                </div>
              </div>
              <div style={{ fontSize: '18px', color: 'var(--red)', flexShrink: 0, transition: 'transform 0.2s' }}>→</div>
            </Link>
          )}

          {/* 라운드 없을 때 */}
          {!nextRound && (
            <div style={{ background: 'rgba(10,10,10,0.6)', border: '1px solid rgba(255,255,255,0.12)', padding: '24px 22px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
              <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '18px', letterSpacing: '2px' }}>
                {season} 시즌 일정을 준비중입니다
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 스크롤 힌트 */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        zIndex: 10, animation: 'scrollhint 2.5s ease-in-out infinite',
      }}>
        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '19px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)' }}>scroll</span>
        <div style={{ width: '1px', height: '32px', background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)' }} />
      </div>

      
    </section>
  )
}
