// app/(site)/classes/[slug]/page.tsx — 클래스 상세
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch } from '@/lib/sanity.client'
import { CLASS_DETAIL_QUERY } from '@/lib/queries'
import type { ClassInfo } from '@/types/sanity'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cls = await sanityFetch<ClassInfo>({ query: CLASS_DETAIL_QUERY, params: { slug: params.slug }, revalidate: 3600 }).catch(() => null)
  const name = cls?.name ?? '클래스 안내'
  return {
    title: name,
    description: `인제 GT 마스터즈 ${name} — 참가 자격, 참가비, 기술 규정 안내`,
  }
}

export default async function ClassDetailPage({ params }: { params: { slug: string } }) {
  const cls = await sanityFetch<ClassInfo>({ query: CLASS_DETAIL_QUERY, params: { slug: params.slug }, revalidate: 3600 }).catch(() => null)

  if (!cls) notFound()

  const c = cls
  const color = c.accentColor ?? '#e60023'
  const cut = 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)'

  return (
    <>
      {/* ── 히어로 ─────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '340px', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
        {c.heroImage?.asset?.url ? (
          <Image src={c.heroImage.asset.url} alt={c.name} fill style={{ objectFit: 'cover' }} sizes="100vw" priority />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg,${color}22,#111 60%)` }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,.08),rgba(0,0,0,.78))' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: '4px', bottom: 0, background: color }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingBottom: '40px', paddingTop: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', fontSize: '.84rem', color: 'rgba(255,255,255,.5)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>홈</Link>
            <span>/</span>
            <Link href="/season#classes" style={{ color: 'inherit', textDecoration: 'none' }}>클래스</Link>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,.8)' }}>{c.classCode}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span style={{ padding: '4px 14px', fontSize: '.88rem', fontWeight: 900, background: `${color}cc`, color: '#fff', clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)' }}>{c.classCode}</span>
            {c.isEntryOpen && <span style={{ padding: '4px 12px', fontSize: '.8rem', fontWeight: 900, background: 'rgba(34,197,94,.8)', color: '#fff', borderRadius: '4px' }}>접수중</span>}
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem,4vw,3rem)', lineHeight: 1.1, marginBottom: '10px' }}>{c.name}</h1>
          {c.nameEn && <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '.95rem' }}>{c.nameEn}</p>}
          {c.tagline && <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1rem', marginTop: '8px' }}>{c.tagline}</p>}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '28px', alignItems: 'start' }}>

            {/* ── 메인 ──────────────────────────────────────── */}
            <div style={{ display: 'grid', gap: '24px' }}>

              {/* 통계 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
                {[
                  { v: c.teamCount,   l: '참가 팀', s: '2026 시즌' },
                  { v: c.driverCount, l: '드라이버', s: '남녀 통합' },
                  { v: c.carCount ?? (c.teamCount ? Math.round(c.teamCount * 1.05) : undefined), l: '출전 차량', s: '엔트리 기준' },
                ].filter(s => s.v).map(s => (
                  <div key={s.l} style={{ background: 'var(--bg-2)', border: '1px solid var(--line)', clipPath: cut, padding: '20px', position: 'relative', textAlign: 'center' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: `linear-gradient(90deg,${color},${color}44 60%,transparent)` }} />
                    <strong style={{ display: 'block', fontSize: 'clamp(1.6rem,3vw,2.4rem)', color, lineHeight: 1, letterSpacing: '-.04em', fontWeight: 950 }}>{s.v}</strong>
                    <span style={{ display: 'block', fontSize: '.85rem', color: 'var(--muted)', marginTop: '6px' }}>{s.l}</span>
                    <span style={{ display: 'block', fontSize: '.76rem', color: 'var(--muted)' }}>{s.s}</span>
                  </div>
                ))}
              </div>

              {/* 클래스 특성 */}
              {c.features && c.features.length > 0 && (
                <div style={{ background: 'var(--bg-2)', border: '1px solid var(--line)', clipPath: cut, padding: '24px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: `linear-gradient(90deg,${color},${color}44 60%,transparent)` }} />
                  <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>클래스 규격</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '10px' }}>
                    {c.features.map((f, i) => (
                      <div key={i} style={{ padding: '14px', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '6px' }}>
                        <span style={{ display: 'block', fontSize: '.78rem', color: 'var(--muted)', marginBottom: '4px' }}>{f.label}</span>
                        <strong style={{ fontSize: '.95rem' }}>{f.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 참가 자격 */}
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--line)', clipPath: cut, padding: '24px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: `linear-gradient(90deg,${color},${color}44 60%,transparent)` }} />
                <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>참가 자격</h2>
                {c.eligibility && c.eligibility.length > 0 ? (
                  <div className="list">
                    {c.eligibility.map((item: string, i: number) => (
                      <li key={i}><span className="dot" style={{ background: color }} />{item}</li>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '.9rem', color: 'var(--muted)', padding: '12px 0' }}>참가 자격 정보를 준비중입니다.</p>
                )}
              </div>

              {/* 규정 PDF */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {c.regulationPdf?.asset?.url ? (
                  <a href={c.regulationPdf.asset.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: '.9rem', minHeight: '44px' }}>
                    <i className="fa-regular fa-file-pdf" style={{ color: 'var(--red)' }} />
                    기술 규정 PDF 다운로드
                  </a>
                ) : (
                  <div style={{ padding: '12px 18px', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '.86rem', color: 'var(--muted)' }}>
                    <i className="fa-regular fa-file-pdf" style={{ marginRight: '6px' }} />
                    기술 규정 PDF — 준비 중
                  </div>
                )}
              </div>
            </div>

            {/* ── 사이드바 ──────────────────────────────────── */}
            <div style={{ display: 'grid', gap: '16px' }}>
              {/* 참가비 & CTA */}
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--line)', clipPath: cut, padding: '22px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: `linear-gradient(90deg,${color},${color}44 60%,transparent)` }} />
                <h3 style={{ fontSize: '.9rem', marginBottom: '14px' }}>참가비</h3>
                {c.isFeePublic !== false && c.entryFeePerRound ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '.85rem', color: 'var(--muted)' }}>라운드당</span>
                      <strong style={{ fontSize: '1.3rem', color }}>{c.entryFeePerRound.toLocaleString()}원</strong>
                    </div>
                    {c.entryFeeSeason && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '.85rem', color: 'var(--muted)' }}>시즌 전체</span>
                        <strong style={{ fontSize: '1.1rem', color }}>{c.entryFeeSeason.toLocaleString()}원</strong>
                      </div>
                    )}
                    {c.entryFeeNote && <p style={{ fontSize: '.8rem', color: 'var(--muted)', marginTop: '8px', marginBottom: '14px', lineHeight: 1.5 }}>{c.entryFeeNote}</p>}
                  </>
                ) : (
                  <p style={{ fontSize: '.88rem', color: 'var(--muted)', marginBottom: '14px' }}>참가비는 문의해 주세요.</p>
                )}
                {c.isEntryOpen ? (
                  <Link href="/entry" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    <i className="fa-solid fa-flag-checkered" />지금 신청하기
                  </Link>
                ) : (
                  <Link href="/entry" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                    Register
                  </Link>
                )}
              </div>

              {/* 다른 클래스 */}
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--line)', clipPath: cut, padding: '18px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,var(--red),rgba(230,0,35,.35) 35%,transparent 75%)' }} />
                <h3 style={{ fontSize: '.88rem', marginBottom: '12px', color: 'var(--muted)' }}>다른 클래스</h3>
                <div style={{ display: 'grid', gap: '6px' }}>
                  {[
                    {slug:'gt1',    label:'GT1',      code:'GT1',     color:'#e60023'},
                    {slug:'gt2',    label:'GT2',      code:'GT2',     color:'#2563eb'},
                    {slug:'gt3',    label:'GT3',      code:'GT3',     color:'#b8921e'},
                    {slug:'drift',  label:'드리프트', code:'DRIFT',   color:'#16a34a'},
                    {slug:'bike',   label:'바이크',   code:'BIKE',    color:'#a855f7'},
                    {slug:'supercar',label:'슈퍼카',  code:'SUPERCAR',color:'#f97316'},
                  ].map((item) => {
                    const isCurrent = item.slug === params.slug
                    return (
                      <Link key={item.slug} href={`/classes/${item.slug}`} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 12px', textDecoration: 'none',
                        background: isCurrent ? `${item.color}14` : 'var(--surface-2)',
                        border: `1px solid ${isCurrent ? item.color + '44' : 'var(--line)'}`,
                        clipPath: 'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,0 100%)',
                        color: 'inherit',
                      }}>
                        <span style={{ fontSize: '.75rem', fontWeight: 900, padding: '2px 7px', background: `${item.color}18`, color: item.color, border: `1px solid ${item.color}30`, clipPath: 'polygon(0 0,calc(100% - 5px) 0,100% 5px,100% 100%,0 100%)' }}>{item.code}</span>
                        <span style={{ fontSize: '.84rem', fontWeight: 700 }}>{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
