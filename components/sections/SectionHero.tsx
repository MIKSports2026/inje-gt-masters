'use client'
import { useState, useEffect } from 'react'
import type { SiteSettings, Round } from '@/types/sanity'

interface Props {
  settings: SiteSettings | null
  nextRound: Round | null
  rounds: Round[]
}

export default function SectionHero({ settings }: Props) {
  const images = settings?.heroImages?.filter(img => img?.asset?.url) ?? []
  const fallback = settings?.heroImage?.asset?.url ?? null
  const allUrls: string[] = images.length > 0
    ? images.map(img => img.asset!.url!)
    : fallback
    ? [fallback]
    : []

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (allUrls.length <= 1) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % allUrls.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [allUrls.length])

  const bgUrl = allUrls[current] ?? null

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '600px',
        backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
        backgroundColor: '#0a0a0a',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transition: 'background-image 1s ease',
      }}
    >
      {/* 오버레이 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0) 40%, rgba(10,10,10,0.7) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* 로고 — 이것만 표시 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-white.png"
        alt="INJE GT MASTERS"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '500px',
          height: 'auto',
          opacity: 0.95,
          filter: 'drop-shadow(0 0 40px rgba(230,0,35,0.25))',
          padding: '0 40px',
        }}
      />
    </section>
  )
}
