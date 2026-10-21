// components/sections/SectionPartners.tsx — v3 로고만 표시 (박스·선·등급/이름 텍스트 없음)
'use client'
import Image from 'next/image'
import type { Partner } from '@/types/sanity'
import SectionHeader from '@/components/ui/SectionHeader'

interface Props { partners: Partner[] }

const FALLBACK_PARTNERS = [
  { name: '금호타이어', slug: 'kumho', tier: 'title' },
  { name: '스티어', slug: 'steer', tier: 'official' },
  { name: 'MOTION', slug: 'motion', tier: 'official' },
  { name: '인제군', slug: 'injgun', tier: 'support' },
  { name: '인제스피디움', slug: 'speedium', tier: 'support' },
  { name: '하늘내린인제', slug: 'skyinje', tier: 'support' },
]

export default function SectionPartners({ partners }: Props) {
  const list = partners.length > 0
    ? partners.map(p => ({
        name: p.name,
        slug: p.name.toLowerCase().replace(/\s+/g, '-'),
        tier: p.tier,
        sanityLogo: p.logo?.asset?.url,
      }))
    : FALLBACK_PARTNERS.map(p => ({ ...p, sanityLogo: undefined }))

  return (
    <section className="ptn" id="partners">
      <div className="ptn__inner">
        <SectionHeader subtitle="SUPPORTED BY" title="PARTNERS" />

        <div className="ptn__grid">
          {list.map((p) => {
            const logoSrc = p.sanityLogo ?? `/partners/${p.slug}.png`
            return (
              <div key={p.slug} className="ptn__card">
                <div className="ptn__logo-wrap">
                  <Image
                    src={logoSrc}
                    alt={p.name}
                    width={160}
                    height={64}
                    className="ptn__logo-img"
                    style={{ objectFit: 'contain' }}
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement
                      img.style.display = 'none'
                      const fallbackEl = img.nextElementSibling as HTMLElement
                      if (fallbackEl) fallbackEl.style.display = 'block'
                    }}
                  />
                  <span className="ptn__name-fallback" style={{ display: 'none' }}>{p.name}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .ptn {
          background: var(--bg-carbon, #0a0a0a);
          padding: 64px 0;
        }
        .ptn__logo-img { transition: transform .25s ease; }
        .ptn__card:hover .ptn__logo-img { transform: scale(1.05); }
        .ptn__inner { max-width: 1400px; margin: 0 auto; padding: 0 40px; }
        .ptn__grid {
          display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 40px 64px;
        }
        .ptn__card { display: flex; align-items: center; justify-content: center; }
        .ptn__logo-wrap { height: 64px; display: flex; align-items: center; justify-content: center; }
        .ptn__name-fallback {
          font-family: 'Oswald', sans-serif; font-size: 1rem; font-weight: 700;
          letter-spacing: .08em; color: rgba(255,255,255,.4);
        }
        @media (max-width: 768px) {
          .ptn__inner { padding: 0 20px; }
          .ptn__grid { gap: 28px 36px; }
          .ptn__logo-wrap { height: 48px; }
        }
      ` }} />
    </section>
  )
}
