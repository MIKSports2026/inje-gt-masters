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
        maxWidth: '4000px',
        margin: '0 auto',
        height: '100vh',
        overflow: 'hidden',
        backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
        backgroundColor: !bgUrl ? '#0a0a0a' : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0) 40%, rgba(10,10,10,0.7) 100%)',
          zIndex: 1,
        }}
      />
    </section>
  )
}
