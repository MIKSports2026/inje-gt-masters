'use client'
// components/sections/SectionStatsBar.tsx — v3 navy stats bar
interface Props {
  rounds:      number
  cars:        number
  drivers:     number
  classes:     number
}

export default function SectionStatsBar({ rounds, cars, drivers, classes }: Props) {
  const stats = [
    { num: rounds,  label: '라운드' },
    { num: cars,    label: '경주차' },
    { num: drivers, label: '드라이버' },
    { num: classes, label: '클래스' },
  ]

  return (
    <div role="list" aria-label="대회 주요 통계" style={{
      background: 'var(--navy)',
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      borderBottom: '3px solid var(--red)',
      position: 'relative',
      zIndex: 10,
    }}>
      {stats.map((s, i) => (
        <div key={s.label} role="listitem" style={{
          padding: '24px 20px',
          textAlign: 'center',
          borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
          transition: 'background 0.2s',
          cursor: 'default',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,0,26,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = ''; }}
        >
          <div style={{
            fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
            fontSize: '46px', fontWeight: 900,
            color: i === 0 ? 'var(--red)' : 'white',
            lineHeight: 1, letterSpacing: '-2px',
          }}>
            {s.num || '—'}
          </div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '18px', fontWeight: 700,
            letterSpacing: '2px', textTransform: 'uppercase' as const,
            color: 'rgba(255,255,255,0.4)', marginTop: '5px',
          }}>
            {s.label}
          </div>
        </div>
      ))}

      
    </div>
  )
}
