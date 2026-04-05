'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
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
      {/* 배경 이미지 래퍼 — absolute inset-0 으로 섹션에 딱 맞게 */}
      <div className="hero-section__img-wrap">
        {bgUrl ? (
          <Image
            key={current}
            src={bgUrl}
            alt="인제 GT 마스터즈"
            fill
            sizes="100vw"
            priority
            style={{ objectFit: 'cover', objectPosition: 'center center' }}
          />
        ) : (
          <div className="hero-section__fallback" />
        )}
      </div>

      {/* 상하 그라디언트 */}
      <div className="hero-section__overlay" />
      {/* 좌우 그라디언트 */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to right, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0) 12%, rgba(10,10,10,0) 88%, rgba(10,10,10,0.95) 100%)',
      }} />

      <style>{`
        .hero-section {
          position: relative;
          width: 100%;
          height: 100svh;
          height: 100vh; /* fallback for browsers without svh support */
          overflow: hidden;
          background: #0a0a0a;
        }
        @supports (height: 100svh) {
          .hero-section { height: 100svh; }
        }
        .hero-section__img-wrap {
          position: absolute;
          inset: 0;
          overflow: hidden;
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
