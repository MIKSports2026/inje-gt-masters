'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { buildHeroSrcSet, buildSanityImageUrl } from '@/lib/sanity-image'
import { getYoutubeId } from '@/lib/youtube'
import type { HeroSlide } from '@/types/sanity'
import styles from './SectionHero.module.css'

interface Props {
  slides: HeroSlide[]
  videoUrl?: string
}

const ROTATION_INTERVAL = 6000

export default function SectionHero({ slides, videoUrl }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { setMounted(true) }, [])

  // 모바일(≤767px)에서는 데이터·배터리 부담과 세로 크롭 문제로 배경 영상 대신 이미지 사용
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const videoId = getYoutubeId(videoUrl?.trim())
  // 배경 영상은 데스크톱에서만 표시. 움직임 최소화 설정 시엔 이미지 유지
  const showVideo = mounted && !!videoId && !prefersReducedMotion && !isMobile

  const isMulti = slides.length >= 2 && !showVideo

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (!isMulti) return
    const handler = () => {
      setIsPaused(document.visibilityState !== 'visible')
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [isMulti])

  useEffect(() => {
    if (!isMulti || isPaused || prefersReducedMotion) return
    timerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, ROTATION_INTERVAL)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [currentIndex, isMulti, isPaused, prefersReducedMotion, slides.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
    setIsPaused(true)
  }, [])

  if (slides.length === 0 && !showVideo) {
    return (
      <section className={styles.hero} role="region" aria-label="메인 히어로 배너">
        <div className={styles.heroMedia}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #0b0b0b 0%, #181818 40%, #1a0008 100%)',
          }} />
        </div>
      </section>
    )
  }

  return (
    <section
      className={styles.hero}
      role="region"
      aria-label="메인 히어로 배너"
      onMouseEnter={() => isMulti && setIsPaused(true)}
      onMouseLeave={() => isMulti && setIsPaused(false)}
    >
      <div className={styles.heroMedia}>
        <div className={styles.slideContainer} aria-live="polite">
          {slides.map((slide, index) => {
            const srcSet = buildHeroSrcSet(slide.imageUrl, slide.hotspot)
            const isActive = index === currentIndex
            const isPriority = index === 0
            const isEager = index <= 2
            return (
              <picture
                key={`${slide.imageUrl}-${index}`}
                className={`${styles.slide} ${isActive ? styles.slideActive : ''}`}
                aria-hidden={!isActive}
              >
                {slide.mobileImageUrl && (
                  <source
                    media="(max-width: 767px)"
                    srcSet={`${buildSanityImageUrl(slide.mobileImageUrl, { width: 768, quality: 80, hotspot: slide.mobileHotspot })} 1x, ${buildSanityImageUrl(slide.mobileImageUrl, { width: 1536, quality: 80, hotspot: slide.mobileHotspot })} 2x`}
                  />
                )}
                <source
                  media="(max-width: 768px)"
                  srcSet={`${srcSet.mobile.src1x} 1x, ${srcSet.mobile.src2x} 2x`}
                />
                <source
                  media="(max-width: 1440px)"
                  srcSet={`${srcSet.tablet.src1x} 1x, ${srcSet.tablet.src2x} 2x`}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={srcSet.desktop.src1x}
                  srcSet={`${srcSet.desktop.src1x} 1x, ${srcSet.desktop.src2x} 2x`}
                  alt={slide.alt}
                  fetchPriority={isPriority ? 'high' : 'auto'}
                  loading={isEager ? 'eager' : 'lazy'}
                  decoding={isPriority ? 'sync' : 'async'}
                  className={styles.slideImage}
                />
              </picture>
            )
          })}
        </div>

        {showVideo && (
          <div className={styles.videoLayer} aria-hidden="true">
            <iframe
              className={styles.videoFrame}
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&playsinline=1&disablekb=1&fs=0&iv_load_policy=3`}
              title="메인 히어로 배경 영상"
              allow="autoplay; encrypted-media"
              tabIndex={-1}
              frameBorder={0}
            />
          </div>
        )}

      </div>

      {isMulti && (
        <div
          className={styles.indicators}
          role="tablist"
          aria-label="히어로 슬라이드 선택"
        >
          {slides.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
              onClick={() => goToSlide(index)}
              onFocus={() => setIsPaused(true)}
              aria-label={`슬라이드 ${index + 1}로 이동`}
              aria-current={index === currentIndex}
              role="tab"
            />
          ))}
        </div>
      )}
    </section>
  )
}
