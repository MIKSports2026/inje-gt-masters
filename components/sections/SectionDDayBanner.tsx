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
    <div className="container" style={{
      height: '44px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: '8px',
    }}>
      <span style={{
        fontSize: '.88rem', fontWeight: 700, letterSpacing: '.02em',
        color: 'white',
      }}>
        {bar.text}
      </span>
      {bar.link && (
        <span style={{
          fontSize: '.82rem', fontWeight: 800, letterSpacing: '1.5px',
          color: 'rgba(255,255,255,0.7)',
        }}>
          →
        </span>
      )}
    </div>
  )

  const wrapStyle: React.CSSProperties = {
    background: 'var(--red)', position: 'relative', zIndex: 100, overflow: 'hidden',
    textDecoration: 'none', display: 'block',
  }

  if (bar.link) {
    return <Link href={bar.link} style={wrapStyle}>{inner}</Link>
  }

  return <div style={wrapStyle}>{inner}</div>
}
