'use client'
// app/(site)/classes/ClassesTabs.tsx — 풀블리드 히어로 카드 + skewX 탭
import { useState } from 'react'
import Link from 'next/link'
import type { ClassPageData } from './page'

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

const fmtKRW = (n: number) => n.toLocaleString('ko-KR') + '원'

export default function ClassesTabs({ classes }: { classes: ClassPageData[] }) {
  const [activeIdx, setActiveIdx] = useState(0)

  if (!classes.length) return null

  const cls = classes[activeIdx]

  const specs = [
    { label: '참가 자격',   value: extractText(cls.eligibility) },
    { label: '개조 범위',   value: cls.tuningRange ?? '' },
    { label: '타이어',      value: cls.tireSpec    ?? '' },
    { label: '최저 중량',   value: cls.minWeight   ?? '' },
    { label: '안전 장비',   value: cls.safetySpec  ?? '' },
  ].filter(s => s.value)

  const hasFee = cls.entryFeePerRound || cls.entryFeePerSeason

  return (
    <div style={{ background: '#111' }}>

      {/* ── 탭 바 ─────────────────────────────────────────────── */}
      <nav
        aria-label="클래스 선택"
        style={{
          background:   '#1a1a1a',
          borderBottom: '1px solid #2a2a2a',
          display:      'flex',
          gap:          '4px',
          padding:      '20px 40px 0',
          overflowX:    'auto',
        }}
      >
        {classes.map((c, i) => (
          <button
            key={c._id}
            role="tab"
            aria-selected={i === activeIdx}
            onClick={() => setActiveIdx(i)}
            style={{
              fontFamily:    'var(--font-oswald, Oswald, sans-serif)',
              fontSize:      '13px',
              fontWeight:    700,
              letterSpacing: '1px',
              color:         i === activeIdx ? '#fff' : '#777',
              background:    i === activeIdx ? '#E60023' : 'transparent',
              border:        'none',
              padding:       '12px 28px',
              cursor:        'pointer',
              transform:     'skewX(-15deg)',
              transition:    'background .2s, color .2s',
              whiteSpace:    'nowrap',
              flexShrink:    0,
            }}
          >
            <span style={{ display: 'inline-block', transform: 'skewX(15deg)' }}>
              {c.name.toUpperCase()}
            </span>
          </button>
        ))}
      </nav>

      {/* ── 풀블리드 히어로 카드 ──────────────────────────────── */}
      <div
        style={{
          position:   'relative',
          minHeight:  '520px',
          display:    'flex',
          alignItems: 'center',
          overflow:   'hidden',
        }}
      >
        {/* 배경 이미지 */}
        <div
          aria-hidden="true"
          style={{
            position:           'absolute',
            inset:              0,
            backgroundImage:    cls.imageUrl ? `url(${cls.imageUrl})` : undefined,
            backgroundSize:     'cover',
            backgroundPosition: 'center',
            backgroundRepeat:   'no-repeat',
            background:         cls.imageUrl ? undefined : 'linear-gradient(135deg,#1a1a1a 0%,#2a2a2a 100%)',
          }}
        />

        {/* 그라데이션 오버레이 */}
        <div
          aria-hidden="true"
          style={{
            position:   'absolute',
            inset:      0,
            background: 'linear-gradient(to right, rgba(0,0,0,.92) 0%, rgba(0,0,0,.75) 50%, rgba(0,0,0,.35) 100%)',
          }}
        />

        {/* 콘텐츠 그리드 */}
        <div
          style={{
            position:            'relative',
            zIndex:              2,
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,360px),1fr))',
            gap:                 '60px',
            padding:             'clamp(40px,6vw,72px) clamp(24px,5vw,64px)',
            width:               '100%',
            maxWidth:            '1200px',
            margin:              '0 auto',
          }}
        >

          {/* ── 좌측 패널 ──────────────────────────────────────── */}
          <div>
            {/* 배지 */}
            <div style={{
              display:       'inline-block',
              background:    '#E60023',
              fontFamily:    'var(--font-oswald, Oswald, sans-serif)',
              fontSize:      '11px',
              fontWeight:    700,
              letterSpacing: '3px',
              color:         '#fff',
              padding:       '4px 16px',
              marginBottom:  '16px',
              clipPath:      'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)',
            }}>
              ENTRY CLASS
            </div>

            {/* 클래스명 */}
            <h2 style={{
              fontFamily:    'var(--font-oswald, Oswald, sans-serif)',
              fontSize:      'clamp(40px,6vw,72px)',
              fontWeight:    700,
              lineHeight:    1,
              letterSpacing: '-1px',
              color:         '#fff',
              marginBottom:  '10px',
            }}>
              {cls.name.replace(/Masters\s*/i, 'MASTERS ')}
            </h2>

            {/* tagline */}
            {cls.tuningRange && (
              <p style={{ fontSize: '15px', color: '#aaa', marginBottom: '32px', lineHeight: 1.5 }}>
                {cls.tuningRange.split('\n')[0]}
              </p>
            )}

            {/* 구분선 */}
            <div style={{ width: '40px', height: '2px', background: '#E60023', marginBottom: '28px' }} />

            {/* 참가비 */}
            {hasFee && (
              <>
                <div style={{
                  fontFamily:    'var(--font-oswald, Oswald, sans-serif)',
                  fontSize:      '11px',
                  letterSpacing: '3px',
                  color:         '#555',
                  marginBottom:  '10px',
                }}>
                  ENTRY FEE
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '36px' }}>
                  {cls.entryFeePerRound && (
                    <div style={{
                      background: 'rgba(255,255,255,.05)',
                      border:     '1px solid rgba(255,255,255,.08)',
                      padding:    '14px 16px',
                    }}>
                      <div style={{ fontSize: '11px', color: '#555', letterSpacing: '1px', marginBottom: '6px' }}>라운드당</div>
                      <div style={{
                        fontFamily: 'var(--font-oswald, Oswald, sans-serif)',
                        fontSize:   '22px',
                        fontWeight: 700,
                        color:      '#fff',
                      }}>
                        {fmtKRW(cls.entryFeePerRound)}
                      </div>
                    </div>
                  )}
                  {cls.entryFeePerSeason && (
                    <div style={{
                      background: 'rgba(255,255,255,.05)',
                      border:     '1px solid rgba(255,255,255,.08)',
                      padding:    '14px 16px',
                    }}>
                      <div style={{ fontSize: '11px', color: '#555', letterSpacing: '1px', marginBottom: '6px' }}>연간 패키지</div>
                      <div style={{
                        fontFamily: 'var(--font-oswald, Oswald, sans-serif)',
                        fontSize:   '22px',
                        fontWeight: 700,
                        color:      '#fff',
                      }}>
                        {fmtKRW(cls.entryFeePerSeason)}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* REGISTER 버튼 */}
            <Link
              href="/entry"
              style={{
                display:       'inline-flex',
                alignItems:    'center',
                gap:           '10px',
                background:    '#E60023',
                color:         '#fff',
                fontFamily:    'var(--font-oswald, Oswald, sans-serif)',
                fontSize:      '15px',
                fontWeight:    700,
                letterSpacing: '2px',
                padding:       '16px 40px',
                textDecoration:'none',
                clipPath:      'polygon(16px 0%,100% 0%,calc(100% - 16px) 100%,0% 100%)',
              }}
            >
              REGISTER NOW →
            </Link>
          </div>

          {/* ── 우측 패널 — TECHNICAL SPECS ────────────────────── */}
          {specs.length > 0 && (
            <div>
              <div style={{
                fontFamily:    'var(--font-oswald, Oswald, sans-serif)',
                fontSize:      '12px',
                fontWeight:    600,
                letterSpacing: '4px',
                color:         '#E60023',
                marginBottom:  '20px',
              }}>
                TECHNICAL SPECS
              </div>

              <dl style={{ margin: 0 }}>
                {specs.map((s, i) => (
                  <div
                    key={s.label}
                    style={{
                      display:      'grid',
                      gridTemplateColumns: '130px 1fr',
                      gap:          '16px',
                      padding:      '16px 0',
                      borderTop:    i === 0 ? '1px solid rgba(255,255,255,.07)' : undefined,
                      borderBottom: '1px solid rgba(255,255,255,.07)',
                    }}
                  >
                    <dt style={{
                      fontFamily:    'var(--font-oswald, Oswald, sans-serif)',
                      fontSize:      '12px',
                      letterSpacing: '2px',
                      color:         '#555',
                      paddingTop:    '2px',
                      margin:        0,
                    }}>
                      {s.label}
                    </dt>
                    <dd style={{ fontSize: '14px', color: '#ccc', margin: 0, lineHeight: 1.65 }}>
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
