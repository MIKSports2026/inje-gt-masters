'use client'
// components/sections/SectionDDayBanner.tsx — 공지 알림 띠 (Announcement Bar)
import Link from 'next/link'
import type { SiteSettings } from '@/types/sanity'

interface Props {
  settings: SiteSettings | null
}

export default function SectionDDayBanner({ settings }: Props) {
  const bar = settings?.announcementBar
  if (!bar?.isVisible || !bar?.text) return null

  const inner = (
    <div className="inner" style={{
      position: 'relative', zIndex: 1,
      height: '48px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: '8px',
    }}>
      <span style={{
        fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
        fontSize: '15px', fontWeight: 700, letterSpacing: '0.02em',
        color: 'white',
      }}>
        {bar.text}
      </span>
      {bar.link && (
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '14px', fontWeight: 800, letterSpacing: '1.5px',
          textTransform: 'uppercase' as const,
          color: 'rgba(255,255,255,0.7)',
          marginLeft: '4px',
        }}>
          →
        </span>
      )}
    </div>
  )

  const wrapStyle: React.CSSProperties = {
    background: 'var(--red)', position: 'relative', zIndex: 100, overflow: 'hidden',
    textDecoration: 'none', display: 'block', cursor: bar.link ? 'pointer' : 'default',
  }

  const patternOverlay = (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'repeating-conic-gradient(rgba(0,0,0,0.06) 0% 25%, transparent 0% 50%)',
      backgroundSize: '16px 16px',
    }} />
  )

  if (bar.link) {
    return (
      <Link href={bar.link} style={wrapStyle}>
        {patternOverlay}
        {inner}
      </Link>
    )
  }

  return (
    <div style={wrapStyle}>
      {patternOverlay}
      {inner}
    </div>
  )
}
