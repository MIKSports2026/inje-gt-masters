// app/(site)/history/page.tsx — 대회 역사
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch } from '@/lib/sanity.client'
import { HISTORY_QUERY } from '@/lib/queries'
import type { History } from '@/types/sanity'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: 'INJE GT MASTERS History',
  description: '인제 GT 마스터즈의 연도별 역사와 역대 챔피언 기록.',
}

export default async function HistoryPage() {
  const history = await sanityFetch<History[]>({ query: HISTORY_QUERY, revalidate: 3600 }).catch(() => [])
  const display = history as History[]
  const cut = 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)'

  return (
    <>
      <PageHero
        badge="History"
        title="INJE GT MASTERS History"
        subtitle="Where Legends Begin — 매 시즌 새로운 전설이 탄생합니다"
      />

      <section className="section">
        <div className="container">
          {display.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
              <i className="fa-solid fa-clock-rotate-left" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block', opacity: .3 }} />
              <p>역사 데이터를 준비중입니다.</p>
            </div>
          )}
          <div style={{ display: 'grid', gap: '28px' }}>
            {display.map((h, idx) => (
              <div key={h._id} style={{ background: 'var(--bg-2)', border: '1px solid var(--line)', clipPath: cut, overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: idx === 0 ? 'var(--red)' : 'var(--line-2)' }} />
                <div style={{ display: 'grid', gridTemplateColumns: h.heroImage?.asset?.url ? '1fr 260px' : '1fr', gap: '0' }}>
                  <div style={{ padding: '28px 28px 28px 36px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 950, color: idx === 0 ? 'var(--red)' : 'var(--muted)', letterSpacing: '-.04em' }}>{h.year}</span>
                      {h.edition && <span className="chip">{h.edition}</span>}
                      {idx === 0 && <span className="pill">최신</span>}
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.1rem,2vw,1.5rem)', marginBottom: '8px' }}>{h.headline}</h2>
                    {h.summary && <p style={{ color: 'var(--muted)', fontSize: '.92rem', lineHeight: 1.7, maxWidth: '640px', marginBottom: '16px' }}>{h.summary}</p>}

                    {/* 통계 */}
                    {h.stats && h.stats.length > 0 && (
                      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '16px' }}>
                        {h.stats.map((s, i) => (
                          <div key={i} style={{ textAlign: 'center' }}>
                            <strong style={{ display: 'block', fontSize: '1.4rem', color: 'var(--red)', letterSpacing: '-.04em', fontWeight: 950 }}>{s.value}</strong>
                            <span style={{ fontSize: '.78rem', color: 'var(--muted)' }}>{s.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 챔피언 */}
                    {h.champions && h.champions.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {h.champions.map((ch, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 12px', background: 'var(--surface-2)', border: '1px solid var(--line)', clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)' }}>
                            <span style={{ fontSize: '.75rem', fontWeight: 900, padding: '2px 7px', background: 'rgba(230,0,35,.08)', color: 'var(--red)', border: '1px solid rgba(230,0,35,.2)', clipPath: 'polygon(0 0,calc(100% - 5px) 0,100% 5px,100% 100%,0 100%)' }}>{ch.classCode}</span>
                            <div>
                              <strong style={{ display: 'block', fontSize: '.84rem' }}>{ch.driver1}{ch.driver2 ? ` / ${ch.driver2}` : ''}</strong>
                              {ch.teamName && <span style={{ fontSize: '.76rem', color: 'var(--muted)' }}>{ch.teamName}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 대표 이미지 */}
                  {h.heroImage?.asset?.url && (
                    <div style={{ position: 'relative', minHeight: '220px', overflow: 'hidden' }}>
                      <Image src={h.heroImage.asset.url} alt={`${h.year} 대회`} fill style={{ objectFit: 'cover' }} sizes="260px" />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(270deg,transparent,rgba(255,255,255,.08))' }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
