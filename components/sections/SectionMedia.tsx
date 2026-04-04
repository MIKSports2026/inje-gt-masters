'use client'
// components/sections/SectionMedia.tsx — v3 mosaic grid
import Link from 'next/link'
import type { Media, Post } from '@/types/sanity'

interface Props {
  media: Media[]
  posts?: Post[]
}

export default function SectionMedia({ media }: Props) {
  // 최대 5개: 첫 번째는 tall (span 2rows), 나머지 4개
  const items = media.slice(0, 5)

  const cellBase: React.CSSProperties = {
    position: 'relative', overflow: 'hidden',
    background: 'var(--bg-4)', cursor: 'pointer',
    borderRadius: 0,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  }

  return (
    <section className="sec sec-dark" id="media" aria-labelledby="med-ttl">
      <div className="inner">
        <div className="sec-hd">
          <div>
            <div className="sec-ey">PHOTO &amp; VIDEO</div>
            <h2 className="sec-ttl" id="med-ttl">Media Gallery</h2>
          </div>
          <Link href="/media" className="sec-more">전체 갤러리</Link>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-sub)' }}>
            <i className="fa-regular fa-image" style={{ fontSize: '2.5rem', opacity: .2, display: 'block', marginBottom: '14px' }} />
            <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '18px', letterSpacing: '2px' }}>
              미디어 콘텐츠를 준비중입니다.
            </p>
          </div>
        ) : (
          <div className="media-mosaic" style={{
            display: 'grid',
            gridTemplateColumns: '1.65fr 1fr 1fr',
            gridTemplateRows: '270px 210px',
            gap: '3px',
          }}>
            {items.map((m, i) => {
              const isTall   = i === 0
              const isVideo  = m.mediaType === 'video'
              const thumb    = isVideo
                ? (m.youtubeThumbnail ?? null)
                : (m as any).coverImage?.asset?.url ?? null
              const href     = `/media/${m.slug.current}`
              const tagLabel = isVideo ? '영상 ▶' : '포토'

              return (
                <Link key={m._id} href={href}
                  style={{ ...cellBase, gridRow: isTall ? 'span 2' : 'auto', display: 'block', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,.6)'; const bg = e.currentTarget.querySelector('.m-bg') as HTMLElement; if (bg) bg.style.transform = 'scale(1.05)'; const ov = e.currentTarget.querySelector('.m-overlay') as HTMLElement; if (ov) ov.style.background = 'linear-gradient(0deg, rgba(220,0,26,0.72) 0%, rgba(0,0,0,0.28) 55%, transparent 100%)'; const tag = e.currentTarget.querySelector('.m-tag') as HTMLElement; if (tag) tag.style.color = 'rgba(255,255,255,0.75)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; const bg = e.currentTarget.querySelector('.m-bg') as HTMLElement; if (bg) bg.style.transform = ''; const ov = e.currentTarget.querySelector('.m-overlay') as HTMLElement; if (ov) ov.style.background = 'linear-gradient(0deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 45%, transparent 100%)'; const tag = e.currentTarget.querySelector('.m-tag') as HTMLElement; if (tag) tag.style.color = 'var(--red)'; }}
                >
                  <div className="m-bg" style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: thumb ? `url(${thumb})` : undefined,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    backgroundColor: thumb ? undefined : `hsl(${i*40}, 8%, 22%)`,
                    transition: 'transform 0.5s ease',
                  }} />
                  {isVideo && (
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%',
                      transform: 'translate(-50%,-50%)',
                      width: '64px', height: '64px', borderRadius: '50%',
                      background: 'rgba(220,0,26,0.9)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: '20px',
                      boxShadow: '0 0 0 16px rgba(220,0,26,0.15)',
                      animation: 'pulse 2.5s infinite',
                    }}>
                      <i className="fa fa-play" />
                    </div>
                  )}
                  <div className="m-overlay" style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(0deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 45%, transparent 100%)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    padding: '18px', transition: 'background 0.3s',
                  }}>
                    <div className="m-tag" style={{
                      fontFamily: "'Barlow Condensed',sans-serif",
                      fontSize: '18px', fontWeight: 800,
                      letterSpacing: '2.5px', textTransform: 'uppercase' as const,
                      color: 'var(--red)', marginBottom: '5px',
                      transition: 'color 0.25s',
                    }}>{tagLabel}</div>
                    <div style={{ fontSize: '16.5px', fontWeight: 700, color: 'var(--text-primary, #fff)', lineHeight: 1.4, wordBreak: 'keep-all' }}>
                      {m.title}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      
    </section>
  )
}
