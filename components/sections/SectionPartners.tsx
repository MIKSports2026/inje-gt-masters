'use client'
// components/sections/SectionPartners.tsx — v3 flat partner list
import Image from 'next/image'
import type { Partner } from '@/types/sanity'

interface Props { partners: Partner[] }

export default function SectionPartners({ partners }: Props) {
  return (
    <div style={{ padding: '48px 0', borderTop: '1px solid var(--line)' }}>
      <div className="inner">
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '18px', fontWeight: 800,
          letterSpacing: '4px', textTransform: 'uppercase' as const,
          color: 'var(--text-sub)', textAlign: 'center', marginBottom: '28px',
        }}>
          Official Partners &amp; Sponsors
        </div>

        {partners.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-sub)', padding: '16px 0' }}>
            <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '16px', letterSpacing: '2px' }}>
              파트너 정보를 준비중입니다.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            {partners.map((p) => (
              <div key={p._id}
                style={{
                  padding: '18px 44px',
                  border: '1px solid var(--line)',
                  margin: '-1px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  minWidth: '150px',
                  transition: 'background 0.2s, border-color 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.borderColor = 'var(--line-mid)'; const n = e.currentTarget.querySelector('.pn') as HTMLElement; if (n) n.style.color = 'var(--navy)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = 'var(--line)'; const n = e.currentTarget.querySelector('.pn') as HTMLElement; if (n) n.style.color = 'var(--line-mid)'; }}
              >
                {p.logo?.asset?.url ? (
                  <Image
                    src={p.logo.asset.url}
                    alt={p.name}
                    width={p.logo.asset.metadata?.dimensions?.width ?? 120}
                    height={p.logo.asset.metadata?.dimensions?.height ?? 48}
                    style={{ maxHeight: '44px', width: 'auto', objectFit: 'contain', filter: 'grayscale(100%) opacity(0.5)', transition: 'filter 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.filter = 'grayscale(0%) opacity(1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.filter = 'grayscale(100%) opacity(0.5)'; }}
                  />
                ) : (
                  <span className="pn" style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '18px', letterSpacing: '3px',
                    color: 'var(--line-mid)', transition: 'color 0.2s',
                  }}>
                    {p.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      
    </div>
  )
}
