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
    <section className="hero-section">
      {bgUrl ? (
        <img
          key={current}
          src={bgUrl}
          alt="인제 GT 마스터즈"
          className="hero-section__img"
        />
      ) : (
        <div className="hero-section__fallback" />
      )}
      <div className="hero-section__overlay" />

      <style>{`
        .hero-section {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #0a0a0a;
        }
        .hero-section__img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          transition: opacity 1s ease;
        }
        @media (min-aspect-ratio: 16/9) and (min-width: 1600px) {
          .hero-section__img {
            object-fit: contain;
            background: #0a0a0a;
          }
        }
        .hero-section__fallback {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0b0b0b 0%, #181818 40%, #1a0008 100%);
        }
        .hero-section__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0) 40%, rgba(10,10,10,0.7) 100%);
          z-index: 1;
          pointer-events: none;
        }
      `}</style>
    </section>
  )
}
