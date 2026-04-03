// components/sections/SectionHero.tsx — v5 Fullscreen image-only hero with fade rolling
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
  // heroImages 배열 우선, 비어있으면 heroImage 단일 이미지를 [0]으로 호환
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
    }, 600)
  }, [images.length])

  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [next, images.length])

  const currentImg = images[current]

  return (
    <section aria-label="메인 히어로" style={{
      position: 'relative',
      height: '100vh',
      minHeight: '760px',
      overflow: 'hidden',
      background: '#070707',
    }}>
      {currentImg?.asset?.url ? (
        <Image
          key={current}
          src={currentImg.asset.url}
          alt={currentImg.alt ?? '인제 GT 마스터즈'}
          fill
          priority={current === 0}
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'opacity .6s ease',
            opacity: fade ? 1 : 0,
          }}
        />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #0b0b0b 0%, #181818 40%, #1a0008 100%)',
        }} />
      )}

      {/* 하단 비네팅 */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(to top, rgba(0,0,0,.3) 0%, transparent 30%)',
        pointerEvents: 'none',
      }} />
    </section>
  )
}
