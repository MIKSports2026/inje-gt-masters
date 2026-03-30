'use client'
// components/sections/SectionHero.tsx — v3 Hero (키비주얼 + 그라데이션 패널)
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

export default function SectionHero({ settings, nextRound }: Props) {
  const countdown = useCountdown(nextRound?.dateStart)
  const season    = settings?.currentSeason ?? 2026
  const heroImg   = settings?.heroImage?.asset?.url
  const heroAlt   = settings?.heroImage?.alt ?? '인제 GT 마스터즈'

  const dd  = nextRound?.dateStart ? new Date(nextRound.dateStart) : null
  const monthDay = dd
    ? `${dd.getMonth() + 1}.${String(dd.getDate()).padStart(2, '0')}`
    : null

  const numFont: React.CSSProperties = {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontVariantNumeric: 'tabular-nums',
  }

  return (
    <section aria-label="메인 히어로" style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#0a0a0a' }}>

      {/* ── 배경 이미지 (전체 영역) ──────────────────────── */}
      {heroImg ? (
        <Image
          src={heroImg} alt={heroAlt} fill priority sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #0b0b0b 0%, #181818 40%, #1a0008 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(48px, 8vw, 120px)',
            letterSpacing: '6px', color: 'rgba(255,255,255,0.04)',
          }}>INJE GT MASTERS</span>
        </div>
      )}

      {/* ── 우측 그라데이션 오버레이 ─────────────────────── */}
      <div className="hero-gradient" style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, transparent 0%, transparent 35%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.78) 70%, rgba(0,0,0,0.92) 85%)',
      }} />
      {/* 하단 보정 그라데이션 */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3) 100%)',
      }} />

      {/* ── 우측 콘텐츠 패널 ─────────────────────────────── */}
      <div className="hero-panel" style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: '380px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        padding: '36px 40px 36px 32px',
        gap: '28px',
        zIndex: 2,
      }}>
        {/* 카운트다운 */}
        {countdown ? (
          <div>
            <div style={{
              ...numFont, fontSize: '13px', fontWeight: 800,
              letterSpacing: '3px', textTransform: 'uppercase',
              color: 'var(--red)', marginBottom: '12px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{ width: '14px', height: '2px', background: 'var(--red)', display: 'inline-block' }} />
              D-DAY
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', ...numFont }}>
              <span style={{ fontSize: '54px', fontWeight: 900, color: 'white', lineHeight: 1, letterSpacing: '1px' }}>
                {countdown.d}
              </span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', marginRight: '6px' }}>DAYS</span>
              <span style={{ fontSize: '36px', fontWeight: 900, color: 'white', lineHeight: 1, letterSpacing: '1px' }}>
                {countdown.h}:{countdown.m}
              </span>
              <span style={{ fontSize: '24px', fontWeight: 900, color: 'rgba(255,255,255,0.35)', lineHeight: 1 }}>
                :{countdown.s}
              </span>
            </div>
          </div>
        ) : nextRound ? (
          <div style={{ ...numFont, fontSize: '18px', fontWeight: 800, color: 'var(--red)', letterSpacing: '2px' }}>
            RACE DAY
          </div>
        ) : null}

        {/* 구분선 */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.12)' }} />

        {/* 라운드 정보 */}
        {nextRound ? (
          <div>
            {monthDay && (
              <div style={{
                ...numFont, fontSize: '15px', fontWeight: 700,
                color: 'rgba(255,255,255,0.5)', letterSpacing: '1px',
                marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <i className="fa-regular fa-calendar" style={{ fontSize: '13px' }} />
                {monthDay}
              </div>
            )}
            <div style={{
              ...numFont, fontSize: '28px', fontWeight: 900,
              letterSpacing: '4px', textTransform: 'uppercase',
              color: 'white', lineHeight: 1.1,
            }}>
              ROUND {String(nextRound.roundNumber).padStart(2, '0')}
            </div>
            <div style={{
              fontSize: '14px', fontWeight: 600,
              color: 'rgba(255,255,255,0.45)', marginTop: '6px',
            }}>
              {nextRound.title}
            </div>
          </div>
        ) : (
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
            {season} 시즌 일정 준비중
          </div>
        )}

        {/* 구분선 */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.12)' }} />

        {/* CTA 버튼 */}
        <div style={{ display: 'grid', gap: '10px' }}>
          <Link
            href={nextRound ? `/entry?tab=apply&round=R${nextRound.roundNumber}` : '/entry'}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: 'var(--red)', color: 'white',
              padding: '14px 20px', textDecoration: 'none',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '16px', fontWeight: 800, letterSpacing: '2px',
              textTransform: 'uppercase',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            <i className="fa-solid fa-flag-checkered" style={{ fontSize: '14px' }} />
            참가신청하기
          </Link>
          <Link
            href="/season"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: 'transparent', color: 'rgba(255,255,255,0.65)',
              padding: '13px 20px', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.18)',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '15px', fontWeight: 700, letterSpacing: '2px',
              textTransform: 'uppercase',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'; e.currentTarget.style.color = 'white' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
          >
            <i className="fa-regular fa-calendar" style={{ fontSize: '13px' }} />
            {season} 일정 보기
          </Link>
        </div>
      </div>

      {/* ── 반응형 CSS ────────────────────────────────────── */}
      <style>{`
        @media (max-width: 768px) {
          .hero-gradient {
            background: linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.92) 85%) !important;
          }
          .hero-panel {
            position: relative !important;
            width: 100% !important;
            top: auto !important;
            right: auto !important;
            bottom: auto !important;
            padding: 24px 20px !important;
          }
          section[aria-label="메인 히어로"] {
            aspect-ratio: auto !important;
            display: flex;
            flex-direction: column;
          }
          section[aria-label="메인 히어로"] > img,
          section[aria-label="메인 히어로"] > span {
            position: relative !important;
          }
        }
      `}</style>
    </section>
  )
}
