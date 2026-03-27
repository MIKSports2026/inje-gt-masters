// components/sections/SectionBrandStrip.tsx — v3 red CTA strip
import Link from 'next/link'

export default function SectionBrandStrip() {
  return (
    <div style={{
      background: 'var(--red)',
      padding: '48px var(--pad)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 배경 텍스트 */}
      <div aria-hidden="true" style={{
        position: 'absolute', right: '-10px', top: '50%',
        transform: 'translateY(-50%)',
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '140px', fontWeight: 400,
        letterSpacing: '6px', textTransform: 'uppercase' as const,
        color: 'rgba(0,0,0,0.12)',
        whiteSpace: 'nowrap', pointerEvents: 'none',
      }}>
        PUSH YOUR LIMIT
      </div>

      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: 'var(--max-w)', margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '40px',
      }}>
        <div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '16.5px', fontWeight: 700,
            letterSpacing: '4px', textTransform: 'uppercase' as const,
            color: 'rgba(255,255,255,0.65)', marginBottom: '8px',
          }}>
            2026 CAMPAIGN MESSAGE
          </div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(30px, 4vw, 54px)',
            letterSpacing: '4px', color: 'white', lineHeight: 1,
          }}>
            PUSH YOUR<br />LIMIT
          </div>
        </div>

        <Link href="/entry" className="btn-white">
          지금 도전하기
        </Link>
      </div>

      
    </div>
  )
}
