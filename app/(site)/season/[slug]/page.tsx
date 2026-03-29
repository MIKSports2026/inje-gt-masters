// app/(site)/season/[slug]/page.tsx — 라운드 상세 페이지
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch } from '@/lib/sanity.client'
import { ROUND_DETAIL_QUERY } from '@/lib/queries'
import type { Round } from '@/types/sanity'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import { resolveRoundStatus } from '@/lib/roundStatus'

const STATUS_MAP: Record<string, { text: string; color: string; bg: string }> = {
  upcoming:     { text: '예정',     color: '#3b82f6', bg: 'rgba(59,130,246,.1)'  },
  entry_open:   { text: '접수중',   color: '#16a34a', bg: 'rgba(22,163,74,.1)'   },
  entry_closed: { text: '접수마감', color: '#d97706', bg: 'rgba(217,119,6,.1)'   },
  ongoing:      { text: '진행중',   color: '#e60023', bg: 'rgba(230,0,35,.1)'    },
  finished:     { text: '종료',     color: '#6b7280', bg: 'rgba(107,114,128,.1)' },
}


export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const round = await sanityFetch<Round>({ query: ROUND_DETAIL_QUERY, params: { slug: params.slug }, revalidate: 300 }).catch(() => null)
  const title = round?.title ?? '라운드 상세'
  const ogImage = round?.heroImage?.asset?.url ?? '/og-default.jpg'
  return {
    title,
    description: `인제 GT 마스터즈 ${title} — ${round?.dateStart ?? ''} 인제스피디움`,
    openGraph: { title, images: [ogImage] },
  }
}

export default async function RoundDetailPage({ params }: { params: { slug: string } }) {
  const round = await sanityFetch<Round>({ query: ROUND_DETAIL_QUERY, params: { slug: params.slug }, revalidate: 300 }).catch(() => null)

  if (!round) notFound()

  const r = round

  const resolvedStatus = resolveRoundStatus(r)
  const st = STATUS_MAP[resolvedStatus]
  const cut = 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)'
  const SESSION_COLORS: Record<string, string> = { practice: '#3b82f6', qualifying: '#f59e0b', race: '#e60023', other: '#6b7280' }

  return (
    <>
      {/* ── 히어로 ─────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '380px', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
        {/* 배경 이미지 / 그라데이션 */}
        {r.heroImage?.asset?.url ? (
          <Image src={r.heroImage.asset.url} alt={r.title ?? ''} fill style={{ objectFit: 'cover' }} sizes="100vw" priority />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#111,#1a0008 55%,#0d0d0d)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,.18) 0%,rgba(0,0,0,.78) 100%)', backgroundImage: 'repeating-linear-gradient(135deg,rgba(230,0,35,.04) 0 1px,transparent 1px 60px)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingBottom: '40px', paddingTop: '80px' }}>
          {/* 브레드크럼 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '.84rem', color: 'rgba(255,255,255,.5)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>홈</Link>
            <span>/</span>
            <Link href="/season" style={{ color: 'inherit', textDecoration: 'none' }}>시즌</Link>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,.8)' }}>R{r.roundNumber}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span style={{ padding: '4px 14px', fontSize: '.88rem', fontWeight: 900, background: 'rgba(230,0,35,.7)', color: '#fff', clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)' }}>
              {r.season} R{r.roundNumber}
            </span>
            {r.badge && <span style={{ padding: '4px 12px', fontSize: '.78rem', fontWeight: 900, background: 'rgba(255,255,255,.15)', color: '#fff', letterSpacing: '.08em', backdropFilter: 'blur(4px)' }}>{r.badge}</span>}
            <span style={{ padding: '4px 12px', fontSize: '.82rem', fontWeight: 900, background: st.bg, color: st.color, borderRadius: '4px', backdropFilter: 'blur(4px)' }}>{st.text}</span>
          </div>

          <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem,4vw,3.2rem)', lineHeight: 1.1, marginBottom: '12px' }}>{r.title}</h1>
          <div style={{ display: 'flex', gap: '18px', color: 'rgba(255,255,255,.7)', fontSize: '.9rem', flexWrap: 'wrap' }}>
            <span><i className="fa-solid fa-calendar" style={{ marginRight: '6px', color: 'var(--red)' }} />{r.dateStart}{r.dateEnd && r.dateEnd !== r.dateStart && ` — ${r.dateEnd}`}</span>
            <span><i className="fa-solid fa-location-dot" style={{ marginRight: '6px', color: 'var(--red)' }} />강원도 인제스피디움 3.9km</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '28px', alignItems: 'start' }}>

            {/* ── 메인 콘텐츠 ──────────────────────────────── */}
            <div style={{ display: 'grid', gap: '24px' }}>

              {/* 세션 스케줄 */}
              {r.schedule && r.schedule.length > 0 && (
                <div style={{ background: '#fff', border: '1px solid var(--line)', clipPath: cut, padding: '24px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,var(--red),rgba(230,0,35,.35) 35%,transparent 75%)' }} />
                  <h2 style={{ fontSize: '1.2rem', marginBottom: '18px' }}>
                    <i className="fa-solid fa-stopwatch" style={{ color: 'var(--red)', marginRight: '10px' }} />
                    세션 일정
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '16px' }}>
                    {r.schedule.map((day, di) => (
                      <div key={di} style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '8px', overflow: 'hidden' }}>
                        <div style={{ padding: '10px 16px', background: '#111', color: '#fff', fontSize: '.82rem', fontWeight: 900, letterSpacing: '.06em', textTransform: 'uppercase' }}>{day.dayLabel}</div>
                        {day.items.map((item, ii) => (
                          <div key={ii} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 16px', borderBottom: ii < day.items.length - 1 ? '1px solid var(--line)' : 'none' }}>
                            <span style={{ fontFamily: 'monospace', fontSize: '.85rem', fontWeight: 900, color: 'var(--red)', minWidth: '46px' }}>{item.time}</span>
                            <div style={{ flex: 1 }}>
                              <span style={{ fontSize: '.92rem', fontWeight: 700 }}>{item.label}</span>
                            </div>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: SESSION_COLORS[item.sessionType] ?? '#999', flexShrink: 0 }} />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  {/* 범례 */}
                  <div style={{ display: 'flex', gap: '16px', marginTop: '14px', flexWrap: 'wrap' }}>
                    {[['practice','연습'],['qualifying','예선'],['race','레이스']].map(([k,v]) => (
                      <span key={k} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '.78rem', color: 'var(--muted)' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: SESSION_COLORS[k] }} />{v}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 대회 설명 */}
              {r.description && r.description.length > 0 ? (
                <div style={{ background: '#fff', border: '1px solid var(--line)', clipPath: cut, padding: '24px', position: 'relative', fontSize: '1rem', lineHeight: 1.8, color: '#2a353f' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,var(--red),rgba(230,0,35,.35) 35%,transparent 75%)' }} />
                  <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>대회 안내</h2>
                  <PortableText value={r.description} />
                </div>
              ) : (
                <div style={{ background: '#fff', border: '1px solid var(--line)', clipPath: cut, padding: '24px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,var(--red),rgba(230,0,35,.35) 35%,transparent 75%)' }} />
                  <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>라운드 개요</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '12px' }}>
                    {[
                      { icon: 'fa-calendar', label: '대회 일정', value: `${r.dateStart} — ${r.dateEnd ?? r.dateStart}` },
                      { icon: 'fa-location-dot', label: '개최지', value: '인제스피디움 국제서킷' },
                      { icon: 'fa-road', label: '서킷 길이', value: '3.9km / 15개 코너' },
                      { icon: 'fa-users', label: '예상 참가', value: `최대 ${r.maxEntries ?? 120}대` },
                    ].map(item => (
                      <div key={item.label} style={{ padding: '14px', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '6px' }}>
                        <i className={`fa-solid ${item.icon}`} style={{ color: 'var(--red)', marginBottom: '6px', display: 'block' }} />
                        <span style={{ display: 'block', fontSize: '.78rem', color: 'var(--muted)', marginBottom: '3px' }}>{item.label}</span>
                        <strong style={{ fontSize: '.9rem' }}>{item.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 공지사항 */}
              {r.notices && r.notices.length > 0 && (
                <div style={{ background: 'rgba(230,0,35,.04)', border: '1px solid rgba(230,0,35,.18)', borderRadius: '8px', padding: '20px' }}>
                  <h2 style={{ fontSize: '1.1rem', color: 'var(--red)', marginBottom: '12px' }}>
                    <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '8px' }} />유의사항
                  </h2>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {r.notices.map((n, i) => (
                      <div key={i} style={{ padding: '12px 16px', background: '#fff', border: '1px solid rgba(230,0,35,.14)', borderRadius: '6px' }}>
                        <strong style={{ display: 'block', marginBottom: '4px', fontSize: '.95rem' }}>{n.title}</strong>
                        <p style={{ color: 'var(--muted)', fontSize: '.88rem', lineHeight: 1.6, margin: 0 }}>{n.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 결과 보기 */}
              {r.hasResults && (
                <Link href={`/results?round=${r.slug.current}`} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
                  padding: '18px 22px', background: 'linear-gradient(135deg,rgba(230,0,35,.06),rgba(230,0,35,.02))',
                  border: '1px solid rgba(230,0,35,.22)', clipPath: cut, textDecoration: 'none', color: 'inherit',
                }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem' }}>경기 결과 보기</strong>
                    <span style={{ fontSize: '.86rem', color: 'var(--muted)' }}>R{r.roundNumber} 최종 결과 및 챔피언십 포인트</span>
                  </div>
                  <i className="fa-solid fa-arrow-right" style={{ color: 'var(--red)', fontSize: '1.2rem' }} />
                </Link>
              )}
            </div>

            {/* ── 사이드바 ─────────────────────────────────── */}
            <div style={{ display: 'grid', gap: '16px' }}>
              {/* 참가신청 CTA */}
              <div style={{ background: '#fff', border: '1px solid var(--line)', clipPath: cut, padding: '22px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,var(--red),rgba(230,0,35,.35) 35%,transparent 75%)' }} />
                <h3 style={{ fontSize: '1rem', marginBottom: '14px' }}>참가 신청</h3>

                {resolvedStatus === 'entry_open' ? (
                  <>
                    <div style={{ padding: '10px 12px', background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.25)', borderRadius: '6px', marginBottom: '14px', fontSize: '.86rem', color: '#16a34a', fontWeight: 800 }}>
                      <i className="fa-solid fa-circle-check" style={{ marginRight: '6px' }} />현재 접수 중
                    </div>
                    {r.entryCloseDate && <p style={{ fontSize: '.84rem', color: 'var(--muted)', marginBottom: '12px' }}>마감: {r.entryCloseDate}</p>}
                    {r.entryFeeNote && <p style={{ fontSize: '.84rem', color: '#3a434d', marginBottom: '14px', lineHeight: 1.6 }}>{r.entryFeeNote}</p>}
                    {r.maxEntries && <p style={{ fontSize: '.82rem', color: 'var(--muted)', marginBottom: '14px' }}>최대 {r.maxEntries}대 선착순</p>}
                    <Link href="/entry" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      <i className="fa-solid fa-flag-checkered" />지금 신청하기
                    </Link>
                  </>
                ) : resolvedStatus === 'entry_closed' ? (
                  <div style={{ padding: '14px', background: 'rgba(217,119,6,.06)', border: '1px solid rgba(217,119,6,.2)', borderRadius: '6px', fontSize: '.88rem', color: '#d97706', fontWeight: 800, textAlign: 'center' }}>
                    <i className="fa-solid fa-ban" style={{ marginRight: '6px' }} />접수가 마감되었습니다.
                  </div>
                ) : resolvedStatus === 'finished' ? (
                  <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '.88rem' }}>
                    <i className="fa-solid fa-flag-checkered" style={{ fontSize: '1.4rem', display: 'block', marginBottom: '8px' }} />
                    대회가 종료되었습니다.
                  </div>
                ) : (
                  <div style={{ fontSize: '.86rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                    {r.entryOpenDate ? `접수 예정일: ${r.entryOpenDate}` : '접수 일정을 준비 중입니다.'}
                  </div>
                )}
              </div>

              {/* 라운드 목록 */}
              <div style={{ background: '#fff', border: '1px solid var(--line)', clipPath: cut, padding: '18px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,var(--red),rgba(230,0,35,.35) 35%,transparent 75%)' }} />
                <h3 style={{ fontSize: '.9rem', marginBottom: '12px' }}>2026 시즌 전체 일정</h3>
                <Link href="/season" style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 14px', textDecoration: 'none',
                  background: 'var(--surface-2)', border: '1px solid var(--line)',
                  clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)',
                  color: 'var(--red)', fontWeight: 800, fontSize: '.88rem',
                }}>
                  <i className="fa-solid fa-calendar" />
                  전체 시즌 일정 보기 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
