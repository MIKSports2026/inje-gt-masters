'use client'
import { useState, useEffect, type ReactNode, type CSSProperties, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { getYoutubeId } from '@/lib/youtube'

interface Props {
  youtubeUrl?: string | null
  children: ReactNode
  className?: string
  style?: CSSProperties
  onMouseEnter?: (e: MouseEvent<HTMLElement>) => void
  onMouseLeave?: (e: MouseEvent<HTMLElement>) => void
  ariaLabel?: string
}

export default function VideoLink({ youtubeUrl, children, className, style, onMouseEnter, onMouseLeave, ariaLabel }: Props) {
  const id = getYoutubeId(youtubeUrl)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  if (!id) {
    return (
      <a href={youtubeUrl ?? '#'} target="_blank" rel="noopener noreferrer"
         className={className} style={style}
         onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} aria-label={ariaLabel}>
        {children}
      </a>
    )
  }
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}
        style={{ border: 'none', padding: 0, width: '100%', textAlign: 'left', font: 'inherit', cursor: 'pointer', ...style }}
        onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} aria-label={ariaLabel ?? '영상 재생'}>
        {children}
      </button>
      {open && mounted && createPortal(
        <div onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', width: 'min(960px,100%)', aspectRatio: '16 / 9', background: '#000' }}>
            <button type="button" onClick={() => setOpen(false)} aria-label="닫기"
              style={{ position: 'absolute', top: '-44px', right: 0, width: '40px', height: '40px', background: 'transparent', border: 'none', color: '#fff', fontSize: '28px', lineHeight: 1, cursor: 'pointer' }}>×</button>
            <iframe src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`} title="YouTube video player"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
          </div>
        </div>, document.body)}
    </>
  )
}
