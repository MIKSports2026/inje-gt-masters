'use client'
// GalleryClient.tsx — 라운드 필터 + 라이트박스

import { useState, useEffect, useCallback } from 'react'
import styles from './GalleryPage.module.css'

export interface PhotoItem {
  url:          string
  lqip?:        string
  alt?:         string
  caption?:     string
  credit?:      string
  roundNumber?: number
  roundTitle?:  string
  albumTitle:   string
}

interface Props {
  photos:          PhotoItem[]
  availableRounds: number[]
}

export default function GalleryClient({ photos, availableRounds }: Props) {
  const [activeRound, setActiveRound] = useState<number>(0)   // 0 = 전체
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  /* ── 필터 적용 ─────────────────────────────────────── */
  const filtered = activeRound
    ? photos.filter(p => p.roundNumber === activeRound)
    : photos

  /* ── 라이트박스 제어 ──────────────────────────────── */
  const openLightbox  = (idx: number) => setLightboxIdx(idx)
  const closeLightbox = useCallback(() => setLightboxIdx(null), [])

  const goPrev = useCallback(() =>
    setLightboxIdx(i => (i !== null && i > 0 ? i - 1 : i)), [])

  const goNext = useCallback(() =>
    setLightboxIdx(i => (i !== null && i < filtered.length - 1 ? i + 1 : i)), [filtered.length])

  /* ── 키보드 이벤트 ─────────────────────────────────── */
  useEffect(() => {
    if (lightboxIdx === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     closeLightbox()
      if (e.key === 'ArrowLeft')  goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIdx, closeLightbox, goPrev, goNext])

  /* ── body scroll lock ──────────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxIdx])

  const current = lightboxIdx !== null ? filtered[lightboxIdx] : null

  return (
    <>
      {/* ── 라운드 필터 탭 ──────────────────────────── */}
      <div className={styles.filterBar}>
        <button
          className={`${styles.filterBtn} ${activeRound === 0 ? styles.filterBtnActive : ''}`}
          onClick={() => setActiveRound(0)}
        >
          전체
        </button>
        {availableRounds.map(rn => (
          <button
            key={rn}
            className={`${styles.filterBtn} ${activeRound === rn ? styles.filterBtnActive : ''}`}
            onClick={() => { setActiveRound(rn); setLightboxIdx(null) }}
          >
            R{String(rn).padStart(2, '0')}
          </button>
        ))}
      </div>

      {/* ── 사진 그리드 ─────────────────────────────── */}
      <div className={styles.grid}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <i className="fa-solid fa-images" style={{ fontSize: '3rem', opacity: 0.2, display: 'block', marginBottom: '16px' }} />
            <p>해당 라운드 사진이 없습니다.</p>
          </div>
        ) : (
          filtered.map((photo, i) => (
            <div
              key={`${photo.url}-${i}`}
              className={styles.cell}
              style={{ animationDelay: `${Math.min(i * 0.04, 0.5)}s` }}
              onClick={() => openLightbox(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.alt ?? photo.caption ?? photo.albumTitle}
                className={styles.cellImg}
                loading="lazy"
              />
              <div className={styles.cellOverlay} />
              <div className={styles.cellZoom}>
                <i className="fa-solid fa-magnifying-glass-plus" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── 라이트박스 ──────────────────────────────── */}
      {lightboxIdx !== null && current && (
        <div
          className={styles.lbBackdrop}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="사진 뷰어"
        >
          {/* 닫기 */}
          <button
            className={styles.lbClose}
            onClick={closeLightbox}
            aria-label="닫기"
          >
            <i className="fa-solid fa-xmark" />
          </button>

          {/* 이전 */}
          <button
            className={`${styles.lbPrev} ${lightboxIdx === 0 ? styles.lbDisabled : ''}`}
            onClick={e => { e.stopPropagation(); goPrev() }}
            aria-label="이전 사진"
          >
            <i className="fa-solid fa-chevron-left" />
          </button>

          {/* 이미지 영역 — 클릭 전파 차단 */}
          <div className={styles.lbInner} onClick={e => e.stopPropagation()}>
            <div className={styles.lbImgWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.url}
                alt={current.alt ?? current.caption ?? ''}
                className={styles.lbImg}
              />
            </div>

            {(current.caption || current.credit) && (
              <p className={styles.lbCaption}>
                {current.caption}
                {current.credit && (
                  <span style={{ color: '#444', marginLeft: '8px' }}>
                    © {current.credit}
                  </span>
                )}
              </p>
            )}

            <span className={styles.lbCounter}>
              {lightboxIdx + 1} / {filtered.length}
            </span>
          </div>

          {/* 다음 */}
          <button
            className={`${styles.lbNext} ${lightboxIdx === filtered.length - 1 ? styles.lbDisabled : ''}`}
            onClick={e => { e.stopPropagation(); goNext() }}
            aria-label="다음 사진"
          >
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
      )}
    </>
  )
}
