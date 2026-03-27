'use client'
// components/sections/SectionTicker.tsx — v3 red scrolling ticker
interface Props {
  items?: string[]
}

const DEFAULT_ITEMS = [
  'INJE GT MASTERS 2026',
  'ROUND 1 — 인제스피디움 개막전',
  '참가 접수 진행중',
  'GT1 · GT2 · GT3 · DRIFT KDGP · BIKE · SUPERCAR',
  '금호타이어 공식 후원',
  '강원도 인제스피디움 3.9KM 서킷',
]

export default function SectionTicker({ items }: Props) {
  const list = (items && items.length > 0) ? items : DEFAULT_ITEMS

  const itemStyle: React.CSSProperties = {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '18px', fontWeight: 700,
    letterSpacing: '2.5px', textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.88)',
    padding: '0 32px',
    display: 'flex', alignItems: 'center', gap: '28px', flexShrink: 0,
  }

  return (
    <div role="marquee" aria-label="실시간 소식" style={{
      background: 'var(--red)', height: '36px',
      display: 'flex', alignItems: 'center',
      overflow: 'hidden', position: 'relative', zIndex: 9,
    }}>
      {/* LIVE 태그 */}
      <div style={{
        background: 'rgba(0,0,0,0.25)', height: '36px',
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: '18px', fontWeight: 800,
        letterSpacing: '3px', textTransform: 'uppercase' as const,
        color: 'rgba(255,255,255,0.9)',
        padding: '0 18px', display: 'flex', alignItems: 'center', flexShrink: 0,
      }}>
        LIVE
      </div>

      {/* 스크롤 트랙 */}
      <div aria-hidden="true" style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{
          display: 'flex',
          animation: 'tickrun 32s linear infinite',
          whiteSpace: 'nowrap',
        }}>
          {/* 두 번 반복해서 seamless loop */}
          {[0, 1].map((rep) => (
            <div key={rep} style={itemStyle}>
              {list.map((text, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                  {i > 0 && <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.45)', flexShrink: 0 }} />}
                  {text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      
    </div>
  )
}
