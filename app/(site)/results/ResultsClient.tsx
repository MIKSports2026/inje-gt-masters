'use client'
// app/(site)/results/ResultsClient.tsx — 순위표 클라이언트 컴포넌트
import { useState } from 'react'
import type { ClassCode } from '@/types/sanity'

interface Standing {
  pos:    number
  carNum: string
  team:   string
  d1:     string
  d2:     string
  pts:    number
}

interface Props {
  classCode:  ClassCode
  classColor: string
  standings:  Standing[]
}

const RACE_TABS = ['드라이버 순위', '팀 순위', '라운드 결과'] as const

export default function ResultsClient({ classCode, classColor, standings }: Props) {
  const [activeTab, setActiveTab] = useState(0)
  const cut12 = 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)'

  return (
    <div>
      {/* 탭 */}
      <div className="tabs">
        {RACE_TABS.map((t, i) => (
          <button key={i} type="button"
            className={`tab${activeTab === i ? ' active' : ''}`}
            onClick={() => setActiveTab(i)}
            style={activeTab === i ? { background: classColor, borderColor: classColor } : {}}
          >{t}</button>
        ))}
      </div>

      {/* 드라이버 순위 */}
      {activeTab === 0 && (
        <div style={{ display: 'grid', gap: '8px' }}>
          {standings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--muted)' }}>
              <i className="fa-solid fa-chart-bar" style={{ fontSize: '2.5rem', opacity: .3, display: 'block', marginBottom: '14px' }} />
              <p style={{ fontSize: '.92rem' }}>순위 데이터를 준비중입니다.</p>
            </div>
          ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: '12px', padding: '8px 16px', fontSize: '.78rem', fontWeight: 900, color: 'var(--muted)', letterSpacing: '.08em', textTransform: 'uppercase' }}>
            <span>순위</span><span>드라이버 / 팀</span><span>포인트</span>
          </div>
          )}
          {standings.map((s) => (
            <div key={s.pos} style={{
              minHeight: '68px', padding: '0 16px',
              display: 'grid', gridTemplateColumns: '52px 1fr auto',
              gap: '12px', alignItems: 'center',
              background: 'var(--bg-2)', border: '1px solid var(--line)',
              clipPath: cut12, position: 'relative',
            }}>
              {/* 순위 메달 */}
              <div style={{
                width: '40px', height: '40px', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: '1rem',
                ...(s.pos === 1 ? { background: 'rgba(245,158,11,.12)', color: '#d97706', border: '1px solid rgba(245,158,11,.3)' } :
                   s.pos === 2 ? { background: 'rgba(156,163,175,.12)', color: '#6b7280', border: '1px solid rgba(156,163,175,.3)' } :
                   s.pos === 3 ? { background: 'rgba(180,83,9,.12)',    color: '#92400e', border: '1px solid rgba(180,83,9,.3)'   } :
                                 { background: `${classColor}0d`, color: classColor, border: `1px solid ${classColor}22` }),
                clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)',
              }}>
                {s.pos <= 3 ? ['🥇', '🥈', '🥉'][s.pos - 1] : s.pos}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                  <span style={{
                    fontSize: '.75rem', fontWeight: 900, padding: '1px 7px',
                    background: `${classColor}14`, color: classColor, border: `1px solid ${classColor}30`,
                    clipPath: 'polygon(0 0,calc(100% - 5px) 0,100% 5px,100% 100%,0 100%)',
                  }}>#{s.carNum}</span>
                  <strong style={{ fontSize: '.95rem' }}>{s.d1}</strong>
                  {s.d2 && s.d2 !== '—' && <span style={{ fontSize: '.85rem', color: 'var(--muted)' }}>/ {s.d2}</span>}
                </div>
                <span style={{ fontSize: '.82rem', color: 'var(--muted)' }}>{s.team}</span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <strong style={{ fontSize: '1.1rem', color: classColor }}>{s.pts}</strong>
                <span style={{ fontSize: '.72rem', color: 'var(--muted)', marginLeft: '3px' }}>PTS</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 팀 순위 */}
      {activeTab === 1 && (
        <div style={{ display: 'grid', gap: '8px' }}>
          {standings.length === 0 && (
            <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--muted)' }}>
              <i className="fa-solid fa-users" style={{ fontSize: '2.5rem', opacity: .3, display: 'block', marginBottom: '14px' }} />
              <p style={{ fontSize: '.92rem' }}>팀 순위 데이터를 준비중입니다.</p>
            </div>
          )}
          {standings.map((s) => (
            <div key={s.pos} style={{
              minHeight: '60px', padding: '0 16px',
              display: 'grid', gridTemplateColumns: '52px 1fr auto',
              gap: '12px', alignItems: 'center',
              background: 'var(--bg-2)', border: '1px solid var(--line)', clipPath: cut12,
            }}>
              <div style={{ width: '40px', height: '40px', display: 'grid', placeItems: 'center', fontWeight: 900, background: `${classColor}0d`, color: classColor, border: `1px solid ${classColor}22`, clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)' }}>{s.pos}</div>
              <strong style={{ fontSize: '.95rem' }}>{s.team}</strong>
              <div style={{ textAlign: 'right' }}>
                <strong style={{ fontSize: '1.1rem', color: classColor }}>{Math.round(s.pts * 1.1)}</strong>
                <span style={{ fontSize: '.72rem', color: 'var(--muted)', marginLeft: '3px' }}>PTS</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 라운드 결과 */}
      {activeTab === 2 && (
        <div style={{ padding: '24px', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '8px', textAlign: 'center', color: 'var(--muted)' }}>
          <i className="fa-solid fa-flag-checkered" style={{ fontSize: '2.5rem', opacity: .3, display: 'block', marginBottom: '12px' }} />
          <p>라운드별 상세 결과는 각 라운드 종료 후 업데이트됩니다.</p>
        </div>
      )}
    </div>
  )
}
