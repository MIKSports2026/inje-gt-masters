// components/sections/SectionPartners.tsx — v2 Dark theme with local logo fallback
'use client'
import Image from 'next/image'
import type { Partner } from '@/types/sanity'

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
        <div className="ptn__kicker">
          <span className="ptn__kicker-line" />
          PARTNERS &amp; SPONSORS
        </div>

        <div className="ptn__grid">
          {list.map((p) => {
            const logoSrc = p.sanityLogo ?? `/partners/${p.slug}.png`
            return (
              <div key={p.slug} className="ptn__card">
                <div className="ptn__tier">{p.tier}</div>
                <div className="ptn__logo-wrap">
                  <Image
                    src={logoSrc}
                    alt={p.name}
                    width={140}
                    height={56}
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
                <div className="ptn__name">{p.name}</div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        .ptn {
          background: var(--bg-carbon, #0a0a0a);
          padding: 64px 0;
          border-top: 1px solid rgba(255,255,255,.06);
        }
        .ptn__logo-img {
          filter: grayscale(100%); opacity: .5;
          transition: filter .3s ease, opacity .3s ease;
        }
        .ptn__card:hover .ptn__logo-img {
          filter: grayscale(0%); opacity: 1;
        }
        .ptn__inner { max-width: 1400px; margin: 0 auto; padding: 0 40px; }
        .ptn__kicker {
          font-family: 'Oswald', sans-serif; font-size: .85rem; font-weight: 600;
          letter-spacing: .2em; text-transform: uppercase; color: rgba(255,255,255,.3);
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 36px; text-align: center; justify-content: center;
        }
        .ptn__kicker-line { display: inline-block; width: 24px; height: 1px; background: rgba(255,255,255,.15); }
        .ptn__grid {
          display: flex; flex-wrap: wrap; justify-content: center; gap: 2px;
        }
        .ptn__card {
          padding: 24px 32px; background: #111;
          border: 1px solid rgba(255,255,255,.04);
          display: flex; flex-direction: column; align-items: center;
          min-width: 160px; transition: background .2s;
        }
        .ptn__card:hover { background: #1a1a1a; }
        .ptn__tier {
          font-family: 'Oswald', sans-serif; font-size: .6rem; font-weight: 600;
          letter-spacing: .15em; text-transform: uppercase;
          color: rgba(255,255,255,.2); margin-bottom: 12px;
        }
        .ptn__logo-wrap { height: 56px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
        .ptn__name {
          font-family: 'Noto Sans KR', sans-serif; font-size: .75rem; font-weight: 500;
          color: rgba(255,255,255,.3);
        }
        .ptn__name-fallback {
          font-family: 'Oswald', sans-serif; font-size: 1rem; font-weight: 700;
          letter-spacing: .08em; color: rgba(255,255,255,.4);
        }
        @media (max-width: 768px) {
          .ptn__inner { padding: 0 20px; }
          .ptn__card { min-width: 120px; padding: 18px 20px; }
        }
      `}</style>
    </section>
  )
}
