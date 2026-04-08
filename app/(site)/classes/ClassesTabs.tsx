'use client'
// app/(site)/classes/ClassesTabs.tsx — 탭 네비게이션 + 탭 콘텐츠 + 토글
import { useState } from 'react'
import Link from 'next/link'
import type { ClassPageData } from './page'

const CUT = 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)'

/** Portable Text 배열 또는 문자열에서 텍스트 추출 */
function extractText(v: any): string {
  if (!v) return ''
  if (typeof v === 'string') return v
  if (Array.isArray(v)) {
    return v
      .map(block => {
        if (block?._type === 'block' && Array.isArray(block.children)) {
          return block.children.map((c: any) => c.text ?? '').join('')
        }
        return ''
      })
      .filter(Boolean)
      .join('\n')
  }
  return ''
}

export default function ClassesTabs({ classes }: { classes: ClassPageData[] }) {
  const [activeIdx, setActiveIdx]     = useState(0)
  const [openTuning, setOpenTuning]   = useState(false)

  if (!classes.length) return null

  const cls = classes[activeIdx]

  const specs = [
    { label: '참가 자격 / 배기량', value: extractText(cls.eligibility) },
    { label: '타이어 규정',         value: cls.tireSpec   ?? '' },
    { label: '최저 중량',           value: cls.minWeight  ?? '' },
    { label: '안전 장비',           value: cls.safetySpec ?? '' },
  ].filter(s => s.value)

  const hasTuning = !!(cls.tuningRange || cls.features?.length)

  const fmtKRW = (n: number) => n.toLocaleString('ko-KR') + '원'

  const handleTab = (i: number) => {
    setActiveIdx(i)
    setOpenTuning(false)
  }

  return (
    <section style={{ background: 'var(--bg-carbon)', padding: '48px 0 80px' }}>
      <div className="container">

        {/* ── 탭 네비게이션 ─────────────────────────────────────── */}
        <nav aria-label="클래스 선택" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {classes.map((c, i) => (
            <button
              key={c._id}
              role="tab"
              aria-selected={i === activeIdx}
              onClick={() => handleTab(i)}
              style={{
                padding: '10px 28px',
                background:   i === activeIdx ? 'var(--primary-red)' : 'var(--bg-2)',
                color:        i === activeIdx ? '#fff' : 'var(--text-sub)',
                border:       'none',
                cursor:       'pointer',
                fontSize:     '13px',
                fontWeight:   700,
                letterSpacing: '.06em',
                clipPath:     CUT,
                transition:   'background .2s, color .2s',
              }}
            >
              {c.name}
            </button>
          ))}
        </nav>

        {/* ── 탭 콘텐츠 ─────────────────────────────────────────── */}
        <div style={{
          display:               'grid',
          gridTemplateColumns:   'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
          gap:                   '40px',
          alignItems:            'start',
        }}>

          {/* 좌: 차량 이미지 */}
          <div style={{
            background:   'var(--bg-2)',
            clipPath:     CUT,
            overflow:     'hidden',
            aspectRatio:  '16 / 9',
          }}>
            {cls.imageUrl
              ? (
                <img
                  src={cls.imageUrl}
                  alt={cls.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              )
              : (
                <div style={{
                  width: '100%', height: '100%', minHeight: '200px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-sub)', fontSize: '13px',
                }} />
              )
            }
          </div>

          {/* 우: 클래스 정보 */}
          <div>
            <h2 style={{
              color:          '#fff',
              fontSize:       'clamp(1.5rem, 3vw, 2.2rem)',
              fontWeight:     900,
              letterSpacing:  '-.02em',
              marginBottom:   '24px',
            }}>
              {cls.name}
            </h2>

            {/* 스펙 목록 */}
            {specs.length > 0 && (
              <dl style={{ display: 'flex', flexDirection: 'column', marginBottom: '28px' }}>
                {specs.map(s => (
                  <div key={s.label} style={{
                    display:      'flex',
                    gap:          '16px',
                    padding:      '12px 0',
                    borderBottom: '1px solid rgba(255,255,255,.07)',
                  }}>
                    <dt style={{
                      color:         'var(--text-sub)',
                      fontSize:      '12px',
                      fontWeight:    700,
                      letterSpacing: '.04em',
                      minWidth:      '110px',
                      flexShrink:    0,
                      paddingTop:    '2px',
                    }}>
                      {s.label}
                    </dt>
                    <dd style={{ color: 'var(--text-mid)', fontSize: '14px', margin: 0, lineHeight: 1.7 }}>
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {/* 참가비 — 작고 조용하게 */}
            {(cls.entryFeePerRound || cls.entryFeePerSeason) && (
              <div style={{
                color:         'var(--text-sub)',
                fontSize:      '12px',
                lineHeight:    1.8,
                letterSpacing: '.02em',
                marginBottom:  '20px',
              }}>
                {cls.entryFeePerRound  && <div>라운드 참가비 {fmtKRW(cls.entryFeePerRound)}</div>}
                {cls.entryFeePerSeason && <div>시즌 참가비 {fmtKRW(cls.entryFeePerSeason)}</div>}
              </div>
            )}

            {/* 참가 신청 + 개조 범위 토글 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
              <Link href="/entry" className="btn btn-primary">
                <i className="fa-solid fa-flag-checkered" />
                참가 신청
              </Link>
              {hasTuning && (
                <button
                  onClick={() => setOpenTuning(v => !v)}
                  style={{
                    background:    'none',
                    border:        '1px solid rgba(255,255,255,.15)',
                    color:         'var(--text-sub)',
                    cursor:        'pointer',
                    padding:       '10px 18px',
                    fontSize:      '12px',
                    fontWeight:    700,
                    letterSpacing: '.04em',
                    transition:    'border-color .2s, color .2s',
                  }}
                >
                  개조 범위 상세 {openTuning ? '▲' : '▼'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── 개조 범위 + features 토글 패널 ──────────────────────── */}
        {openTuning && hasTuning && (
          <div style={{
            marginTop:    '48px',
            borderTop:    '1px solid rgba(255,255,255,.08)',
            paddingTop:   '40px',
          }}>

            {cls.tuningRange && (
              <div style={{ marginBottom: '36px' }}>
                <h3 style={{
                  color:         'var(--primary-red)',
                  fontSize:      '11px',
                  fontWeight:    800,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  marginBottom:  '14px',
                }}>
                  개조 범위
                </h3>
                <p style={{
                  color:      'var(--text-mid)',
                  fontSize:   '14px',
                  lineHeight: 1.85,
                  whiteSpace: 'pre-line',
                  maxWidth:   '720px',
                }}>
                  {cls.tuningRange}
                </p>
              </div>
            )}

            {cls.features && cls.features.length > 0 && (
              <div>
                <h3 style={{
                  color:         'var(--primary-red)',
                  fontSize:      '11px',
                  fontWeight:    800,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  marginBottom:  '16px',
                }}>
                  주요 특징
                </h3>
                <div style={{
                  display:               'grid',
                  gridTemplateColumns:   'repeat(auto-fill, minmax(200px, 1fr))',
                  gap:                   '12px',
                }}>
                  {cls.features.map((f, i) => (
                    <div key={i} style={{
                      background:  'var(--bg-2)',
                      padding:     '16px 18px',
                      borderLeft:  '3px solid var(--primary-red)',
                    }}>
                      <div style={{ color: 'var(--text-sub)', fontSize: '11px', fontWeight: 700, letterSpacing: '.04em', marginBottom: '5px' }}>
                        {f.label}
                      </div>
                      <div style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 700 }}>
                        {f.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  )
}
