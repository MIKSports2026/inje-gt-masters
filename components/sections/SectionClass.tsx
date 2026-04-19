// components/sections/SectionClass.tsx — Horizontal accordion (Sanity classInfo 기반)
'use client'
import { useState, useCallback } from 'react'
import type { ClassInfo } from '@/types/sanity'
import SectionHeader from '@/components/ui/SectionHeader'
import type { SanityImage } from '@/types/sanity'

interface ClassWithGallery extends ClassInfo {
  gallery0?: SanityImage
  tuningRange?: string
}

interface Props {
  classes: ClassWithGallery[]
}

function getImageUrl(img: SanityImage | undefined | null): string | null {
  return img?.asset?.url ?? null
}

export default function SectionClass({ classes }: Props) {
  const [active, setActive] = useState(0)
  const [overlayIndex, setOverlayIndex] = useState<number | null>(null)

  const openOverlay = useCallback((e: React.MouseEvent, idx: number) => {
    e.stopPropagation()
    setOverlayIndex(idx)
  }, [])

  const closeOverlay = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    setOverlayIndex(null)
  }, [])

  if (classes.length === 0) return null

  return (
    <section className="cls" id="classes">
      <div className="cls__hd">
        <SectionHeader subtitle="PARTICIPATE" title="CLASSES" />
      </div>

      <div className="cls__acc">
        {classes.map((cls, i) => {
          const isActive = active === i
          const color = cls.accentColor ?? '#E60023'

          return (
            <div
              key={cls._id}
              className={`cls__p ${isActive ? 'cls__p--on' : ''}`}
              onClick={() => setActive(i)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') setActive(i) }}
            >
              <div className="cls__p-ov" />
              <div className="cls__p-bar" style={{ background: color }} />

              <div className="cls__p-collapsed">
                <span className="cls__p-name">{cls.name}</span>
              </div>

              <div className="cls__p-expanded">
                <div className="cls__p-left">
                  <div className="cls__p-tag">
                    <span className="cls__p-tag-inner" style={{ color }}>
                      {cls.classCode}
                    </span>
                  </div>
                  <h3 className="cls__p-title">{cls.name}</h3>
                  <div className="cls__p-meta">
                    <span className="cls__p-slash" style={{ color }}>/</span>
                    <span className="cls__p-elig">{cls.tagline ?? ''}</span>
                  </div>
                  <button
                    className="cls__p-btn"
                    onClick={e => openOverlay(e, i)}
                    style={{ borderColor: color, color: '#fff', cursor: 'pointer' }}
                  >
                    <span className="cls__p-btn-inner">VIEW DETAILS</span>
                  </button>
                </div>

                <div className="cls__p-right">
                  <div className="cls__p-slice">
                    {(() => {
                      const imgUrl = getImageUrl(cls.heroImage)
                        ?? getImageUrl(cls.cardImage)
                        ?? getImageUrl(cls.gallery0)
                      return (
                        <div
                          className="cls__p-slice-cut"
                          style={imgUrl ? {
                            backgroundImage: `url(${imgUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          } : undefined}
                        />
                      )
                    })()}
                  </div>
                </div>

                {/* 오버레이 */}
                {overlayIndex === i && (
                  <div
                    className="cls__overlay"
                    onClick={e => closeOverlay(e)}
                  >
                    <div className="cls__overlay-inner" onClick={e => e.stopPropagation()}>
                      <button
                        className="cls__overlay-close"
                        onClick={e => closeOverlay(e)}
                        aria-label="닫기"
                      >×</button>

                      <div className="cls__overlay-tag" style={{ borderLeftColor: color }}>
                        <span style={{ color }}>{cls.classCode}</span>
                      </div>
                      <h4 className="cls__overlay-title">{cls.name}</h4>

                      <div className="cls__overlay-rows">
                        {cls.features && cls.features.length > 0
                          ? cls.features.map((f, fi) => (
                            <div key={fi} className="cls__overlay-row">
                              <span className="cls__overlay-label">{f.label}</span>
                              <span className="cls__overlay-value">{f.value}</span>
                            </div>
                          ))
                          : cls.tagline && (
                            <div className="cls__overlay-row">
                              <span className="cls__overlay-label">클래스 소개</span>
                              <span className="cls__overlay-value">{cls.tagline}</span>
                            </div>
                          )
                        }
                        {cls.tuningRange && (
                          <div className="cls__overlay-row">
                            <span className="cls__overlay-label">개조 범위</span>
                            <span className="cls__overlay-value">{cls.tuningRange}</span>
                          </div>
                        )}
                        {(cls.entryFeePerRound || cls.entryFeeSeason) && (
                          <div className="cls__overlay-row">
                            <span className="cls__overlay-label">참가비</span>
                            <span className="cls__overlay-value">
                              {[
                                cls.entryFeePerRound
                                  ? `라운드 ${cls.entryFeePerRound.toLocaleString('ko-KR')}원`
                                  : '',
                                cls.entryFeeSeason
                                  ? `시즌 ${cls.entryFeeSeason.toLocaleString('ko-KR')}원`
                                  : '',
                              ].filter(Boolean).join('\n')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 도트 네비 */}
      <div className="cls__dots">
        {classes.map((_, i) => (
          <button
            key={i}
            className={`cls__dot ${active === i ? 'cls__dot--on' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Class ${i + 1}`}
          />
        ))}
      </div>

      <style>{`
        .cls { background: var(--bg-carbon, #0a0a0a); padding: 60px 0; position: relative; z-index: 1; }
        .cls__hd {
          max-width: 1400px; margin: 0 auto 32px; padding: 0 40px;
          display: flex; align-items: flex-end; justify-content: space-between;
        }

        .cls__acc {
          max-width: 1400px; margin: 0 auto; padding: 0 40px;
          display: flex; gap: 2px; height: 400px;
        }
        .cls__p {
          flex: 0.35; position: relative; overflow: visible; cursor: pointer;
          background: #1a1a1a;
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
          transition: flex .6s cubic-bezier(.8,0,.2,1), transform .4s cubic-bezier(.25,1,.5,1), box-shadow .4s ease;
          display: flex; align-items: stretch;
          border: none; outline: none; box-shadow: none;
        }
        .cls__p:hover {
          transform: translateY(-15px);
          box-shadow: 0 20px 40px rgba(0,0,0,.8);
        }
        .cls__p--on { flex: 5; }
        .cls__p--on:hover .cls__p-title { color: #E60023; }

        .cls__p-ov {
          position: absolute; inset: 0;
          background: transparent;
          z-index: 1;
        }
        .cls__p-bar {
          position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: #E60023; transform: scaleY(0); transform-origin: top;
          transition: transform .35s ease .08s; z-index: 3;
        }
        .cls__p--on .cls__p-bar { transform: scaleY(1); }

        .cls__p-collapsed {
          position: absolute; inset: 0; z-index: 2;
          display: flex; align-items: center; justify-content: center;
          transition: opacity .3s;
        }
        .cls__p--on .cls__p-collapsed { opacity: 0; pointer-events: none; }

        .cls__p-name {
          font-family: 'Oswald',sans-serif; font-size: .85rem; font-weight: 700;
          letter-spacing: .15em; text-transform: uppercase;
          color: rgba(255,255,255,.4);
          writing-mode: vertical-rl; text-orientation: mixed;
          transform: rotate(180deg);
        }
        .cls__p:hover .cls__p-name { color: rgba(255,255,255,.6); }

        .cls__p-expanded {
          position: absolute; inset: 0; z-index: 2;
          display: grid; grid-template-columns: 1fr 1.2fr;
          align-items: center;
          opacity: 0; pointer-events: none;
          transition: opacity .4s ease .2s;
        }
        .cls__p--on .cls__p-expanded { opacity: 1; pointer-events: auto; }

        .cls__p-left {
          display: flex; flex-direction: column; align-items: flex-start;
          padding: 40px 40px 40px 48px;
        }

        .cls__p-tag {
          background: #333; padding: 4px 16px;
          transform: skewX(-20deg);
          margin-bottom: 16px; border-left: 3px solid #E60023;
        }
        .cls__p-tag-inner {
          display: block; transform: skewX(20deg);
          font-family: 'Oswald',sans-serif; font-weight: 700;
          font-size: .9rem; letter-spacing: 2px;
        }

        .cls__p-title {
          font-family: 'Oswald',sans-serif; font-size: 4.5rem; font-weight: 900;
          line-height: 1.05; letter-spacing: -.04em; text-transform: uppercase;
          color: #fff; margin: 0 0 16px;
          text-shadow: none;
          transform: skewX(-10deg);
          transition: color .3s ease;
        }

        .cls__p-meta {
          display: flex; align-items: flex-start; gap: 12px;
          margin-bottom: 32px;
        }
        .cls__p-slash {
          color: #E60023; font-size: 1.5rem; font-weight: 900; font-style: italic;
        }
        .cls__p-elig {
          font-family: 'Oswald',sans-serif; color: #aaa;
          font-size: 1.1rem; letter-spacing: 1px; line-height: 1.5;
        }

        .cls__p-btn {
          display: inline-block;
          background: transparent;
          border: 2px solid #E60023;
          color: #ffffff;
          padding: 12px 28px;
          font-family: 'Oswald',sans-serif; font-weight: 700;
          font-size: .95rem; letter-spacing: 2px; text-transform: uppercase;
          text-decoration: none; transform: skewX(-15deg);
          transition: background .2s, box-shadow .2s;
        }
        .cls__p-btn:hover { background: rgba(230,0,35,.1); box-shadow: 4px 4px 0 rgba(230,0,35,.15); }
        .cls__p-btn-inner { display: block; transform: skewX(15deg); }

        .cls__p-right {
          position: relative; height: 100%;
          display: flex; align-items: center; justify-content: flex-end;
        }
        .cls__p-slice {
          position: relative; width: 100%; height: 90%;
          clip-path: polygon(15% 0, 100% 0, 85% 100%, 0 100%);
        }
        .cls__p-slice-cut {
          position: absolute; inset: 0;
          background: #111111;
        }

        /* Dots */
        .cls__dots {
          display: flex; justify-content: center; gap: 6px; margin-top: 28px;
        }
        .cls__dot {
          width: 14px; height: 4px; border: none; cursor: pointer; padding: 0;
          background: rgba(255,255,255,.12); transform: skewX(-30deg);
          transition: all .25s;
        }
        .cls__dot--on { width: 28px; background: #E60023; }
        .cls__dot:hover { background: rgba(255,255,255,.25); }

        /* Overlay */
        .cls__overlay {
          position: absolute; inset: 0; z-index: 20;
          background: rgba(0,0,0,0.88);
          display: flex; align-items: center; justify-content: center;
          animation: cls-ov-in .18s ease;
        }
        @keyframes cls-ov-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .cls__overlay-inner {
          position: relative;
          width: 100%; height: 100%;
          padding: 40px 48px;
          display: flex; flex-direction: column; justify-content: center;
          overflow-y: auto;
        }
        .cls__overlay-close {
          position: absolute; top: 16px; right: 20px;
          background: transparent; border: none; cursor: pointer;
          color: #fff; font-size: 1.8rem; line-height: 1;
          padding: 4px 8px;
          transition: color .2s;
        }
        .cls__overlay-close:hover { color: #E60023; }

        .cls__overlay-tag {
          display: inline-block;
          background: #333; padding: 3px 14px;
          border-left: 3px solid #E60023;
          margin-bottom: 12px;
          font-family: 'Oswald',sans-serif; font-weight: 700;
          font-size: .85rem; letter-spacing: 2px;
        }
        .cls__overlay-title {
          font-family: 'Oswald',sans-serif; font-size: 2rem; font-weight: 900;
          text-transform: uppercase; color: #fff;
          margin: 0 0 20px; letter-spacing: -.02em;
        }

        .cls__overlay-rows {
          display: flex; flex-direction: column; gap: 0;
        }
        .cls__overlay-row {
          display: flex; align-items: baseline; gap: 16px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .cls__overlay-row:first-child { border-top: 1px solid rgba(255,255,255,0.08); }
        .cls__overlay-label {
          font-family: 'Oswald',sans-serif; font-size: .78rem;
          font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
          color: rgba(255,255,255,0.45); white-space: nowrap; min-width: 100px;
        }
        .cls__overlay-value {
          font-family: 'Noto Sans KR',sans-serif; font-size: .9rem;
          color: rgba(255,255,255,0.9); line-height: 1.5;
          white-space: pre-line;
        }

        @media (max-width: 900px) {
          .cls__acc { flex-direction: column; height: auto; padding: 0 20px; }
          .cls__p { height: 56px; flex: none !important; transition: height .4s cubic-bezier(.25,1,.5,1); }
          .cls__p--on { height: auto; }
          .cls__p-collapsed { flex-direction: row; }
          .cls__p-name { writing-mode: horizontal-tb; transform: none; }
          .cls__p-expanded {
            grid-template-columns: 1fr;
            grid-template-rows: 200px auto;
            align-items: start;
          }
          .cls__p-right {
            display: flex;
            grid-row: 1;
            height: 200px;
            width: 100%;
          }
          .cls__p-slice {
            width: 100%;
            height: 100%;
            clip-path: none;
          }
          .cls__p-slice-cut {
            background-size: cover;
            background-position: center;
          }
          .cls__p-left { padding: 20px 24px 28px; grid-row: 2; }
          .cls__p-title { font-size: 2.2rem; }
          .cls__hd { padding: 0 20px; }
        }
      `}</style>
    </section>
  )
}
