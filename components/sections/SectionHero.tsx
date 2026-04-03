// components/sections/SectionHero.tsx — v7 Clean fullscreen hero
'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { SiteSettings, Round } from '@/types/sanity'

interface Props {
  settings:  SiteSettings | null
  nextRound: Round | null
  rounds:    Round[]
}

export default function SectionHero({ settings }: Props) {
  const images = (() => {
    const arr = settings?.heroImages?.filter(img => img?.asset?.url) ?? []
    if (arr.length > 0) return arr
    if (settings?.heroImage?.asset?.url) return [settings.heroImage]
    return []
  })()

  const [current, setCurrent] = useState(0)
  const [fade, setFade] = useState(true)

  const next = useCallback(() => {
    if (images.length <= 1) return
    setFade(false)
    setTimeout(() => {
      setCurrent(prev => (prev + 1) % images.length)
      setFade(true)
    }, 800)
  }, [images.length])

  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [next, images.length])

  const currentImg = images[current]

  return (
    <section aria-label="메인 히어로" className="hero">
      {/* 배경 이미지 */}
      {currentImg?.asset?.url ? (
        <Image
          key={current}
          src={currentImg.asset.url}
          alt={currentImg.alt ?? '인제 GT 마스터즈'}
          fill
          priority={current === 0}
          sizes="100vw"
          className="hero__bg"
          style={{ objectFit: 'cover', objectPosition: 'center', opacity: fade ? 1 : 0 }}
        />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #0b0b0b 0%, #181818 40%, #1a0008 100%)',
        }} />
      )}

      {/* 오버레이 */}
      <div className="hero__overlay" />

      {/* 중앙 로고 — 흰 배경 JPG를 CSS로 투명 처리 */}
      <div className="hero__center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-white.png" alt="INJE GT MASTERS" className="hero__logo" />
      </div>

      <style>{`
        .hero {
          position: relative;
          height: 100vh; min-height: 700px;
          overflow: hidden; background: #0a0a0a;
        }
        .hero__bg { transition: opacity 1s ease; }
        .hero__overlay {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(to top, rgba(10,10,10,.4) 0%, rgba(10,10,10,0) 40%, rgba(10,10,10,.7) 100%);
          pointer-events: none;
        }
        .hero__center {
          position: absolute; inset: 0; z-index: 2;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none;
        }
        .hero__logo {
          max-width: 600px; width: 80%;
          object-fit: contain;
          opacity: 0.95;
          filter: drop-shadow(0 0 40px rgba(230,0,35,0.25));
        }
        @media (max-width: 768px) {
          .hero { min-height: 480px; }
          .hero__logo { max-width: 85vw; }
        }
      `}</style>
    </section>
  )
}
