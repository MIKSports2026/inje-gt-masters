// app/(site)/season/page.tsx — 2026 시즌 안내 (라운드 일정 + 클래스 + 포인트)
import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity.client'
import { SITE_SETTINGS_QUERY, ROUNDS_QUERY, CLASSES_QUERY, REGULATIONS_QUERY } from '@/lib/queries'
import type { SiteSettings, Round, ClassInfo } from '@/types/sanity'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: '2026 시즌 안내',
  description: '인제 GT 마스터즈 2026 시즌 라운드 일정, 클래스 소개, 포인트 시스템, 규정 안내.',
}

const STATUS_MAP: Record<string, { text: string; color: string; bg: string }> = {
  upcoming:     { text: '예정',     color: '#3b82f6', bg: 'rgba(59,130,246,.1)'  },
  entry_open:   { text: '접수중',   color: '#16a34a', bg: 'rgba(22,163,74,.1)'   },
  entry_closed: { text: '접수마감', color: '#d97706', bg: 'rgba(217,119,6,.1)'   },
  ongoing:      { text: '진행중',   color: '#e60023', bg: 'rgba(230,0,35,.1)'    },
  finished:     { text: '종료',     color: '#6b7280', bg: 'rgba(107,114,128,.1)' },
}

const POINT_TABLE = [
  { pos: 1, pts: 25 }, { pos: 2, pts: 18 }, { pos: 3, pts: 15 },
  { pos: 4, pts: 12 }, { pos: 5, pts: 10 }, { pos: 6, pts: 8  },
  { pos: 7, pts: 6  }, { pos: 8, pts: 4  }, { pos: 9, pts: 2  }, { pos: 10, pts: 1 },
]

export default async function SeasonPage() {
  const [settings, rounds, classes, regulations] = await Promise.all([
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY }),
    sanityFetch<Round[]>({ query: ROUNDS_QUERY, params: { season: 2026 }, revalidate: 300 }),
    sanityFetch<ClassInfo[]>({ query: CLASSES_QUERY, revalidate: 3600 }),
    sanityFetch<any[]>({ query: REGULATIONS_QUERY, params: { season: 2026 }, revalidate: 3600 }),
  ]).catch(() => [null, [], [], []] as [SiteSettings | null, Round[], ClassInfo[], any[]])

  const displayRounds = rounds as Round[]
  const displayClasses = classes as ClassInfo[]
  const displayRegulations = (regulations as any[]) ?? []

  const cut = 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)'

  return (
    <>
      {/* ── 히어로 ──────────────────────────────────────────── */}
      <PageHero
        image={(settings as SiteSettings | null)?.heroSeason}
        badge="2026 Season"
        title="2026 SEASON"
        subtitle="레이서의 근성과 머신의 한계가 만나는 곳"
      >
        <div style={{ marginTop: '20px' }}>
          <Link href="/entry" className="btn btn-primary">
            <i className="fa-solid fa-flag-checkered" />
            2026 참가 신청
          </Link>
        </div>
      </PageHero>

      {/* ── 라운드 일정 ──────────────────────────────────────── */}
      <section className="section" id="schedule">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">2026 Schedule</span>
              <h2>라운드 일정</h2>
            </div>
          </div>

          {displayRounds.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
              <i className="fa-solid fa-calendar-xmark" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block', opacity: .3 }} />
              <p>라운드 일정을 준비중입니다.</p>
            </div>
          )}
          <div style={{ display: 'grid', gap: '20px' }}>
            {displayRounds.map((r) => {
              const st = STATUS_MAP[r.status] ?? STATUS_MAP.upcoming
              return (
                <div key={r._id} style={{ background: '#fff', border: '1px solid var(--line)', clipPath: cut, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--red)' }} />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', padding: '24px 28px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '.9rem', fontWeight: 900, padding: '3px 12px', background: 'rgba(230,0,35,.08)', color: 'var(--red)', border: '1px solid rgba(230,0,35,.22)', clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)' }}>
                          R{r.roundNumber}
                        </span>
                        {r.badge && (
                          <span style={{ fontSize: '.76rem', fontWeight: 900, padding: '2px 8px', background: '#111', color: '#fff', letterSpacing: '.08em' }}>{r.badge}</span>
                        )}
                        <span style={{ fontSize: '.8rem', fontWeight: 900, padding: '3px 10px', background: st.bg, color: st.color, borderRadius: '4px' }}>
                          {st.text}
                        </span>
                      </div>

                      <h3 style={{ fontSize: 'clamp(1.1rem,2vw,1.4rem)', marginBottom: '6px' }}>{r.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--muted)', fontSize: '.88rem', flexWrap: 'wrap' }}>
                        <span><i className="fa-solid fa-calendar" style={{ marginRight: '6px', color: 'var(--red)' }} />{r.dateStart}{r.dateEnd && r.dateEnd !== r.dateStart && ` — ${r.dateEnd}`}</span>
                        <span><i className="fa-solid fa-location-dot" style={{ marginRight: '6px', color: 'var(--red)' }} />인제스피디움</span>
                      </div>

                      {/* 세션 스케줄 */}
                      {r.schedule && r.schedule.length > 0 && (
                        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '12px' }}>
                          {r.schedule.map((day, di) => (
                            <div key={di} style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '6px', padding: '12px' }}>
                              <strong style={{ display: 'block', fontSize: '.82rem', marginBottom: '8px', color: 'var(--muted)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{day.dayLabel}</strong>
                              {day.items.map((item, ii) => (
                                <div key={ii} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '5px 0', borderBottom: ii < day.items.length - 1 ? '1px solid var(--line)' : 'none' }}>
                                  <span style={{ fontSize: '.8rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--red)', minWidth: '46px' }}>{item.time}</span>
                                  <span style={{ fontSize: '.85rem' }}>{item.label}</span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px' }}>
                      {r.status === 'entry_open' && (
                        <Link href="/entry" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                          <i className="fa-solid fa-flag-checkered" />참가 신청
                        </Link>
                      )}
                      {r.hasResults && (
                        <Link href={`/results?round=${r.slug.current}`} className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }}>결과 보기</Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 클래스 소개 ─────────────────────────────────────── */}
      <section className="section" id="classes" style={{ background: 'var(--surface-2)' }}>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Classes</span>
              <h2>6개 클래스</h2>
            </div>
            <p className="lead">GT 내구레이스부터 드리프트·바이크·슈퍼카까지</p>
          </div>

          {displayClasses.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted)' }}>
              <i className="fa-solid fa-flag-checkered" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block', opacity: .3 }} />
              <p>클래스 정보를 준비중입니다.</p>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '16px' }}>
            {displayClasses.map((c) => {
              const color = c.accentColor ?? '#e60023'
              return (
                <div key={c._id} style={{ background: '#fff', border: '1px solid var(--line)', clipPath: cut, padding: '22px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: `linear-gradient(90deg,${color},${color}44 60%,transparent)` }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ padding: '4px 12px', fontSize: '.8rem', fontWeight: 900, background: `${color}14`, color, border: `1px solid ${color}38`, clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)' }}>
                      {c.classCode}
                    </span>
                    {c.isEntryOpen ? (
                      <span style={{ fontSize: '.75rem', fontWeight: 900, color: '#16a34a' }}>접수중</span>
                    ) : (
                      <span style={{ fontSize: '.75rem', color: 'var(--muted)' }}>접수 예정</span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '4px' }}>{c.name}</h3>
                  {c.tagline && <p style={{ fontSize: '.86rem', color: 'var(--muted)', marginBottom: '12px' }}>{c.tagline}</p>}

                  {/* 통계 */}
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    {c.teamCount && (
                      <div style={{ textAlign: 'center' }}>
                        <strong style={{ display: 'block', fontSize: '1.2rem', color }}>{c.teamCount}</strong>
                        <span style={{ fontSize: '.75rem', color: 'var(--muted)' }}>팀</span>
                      </div>
                    )}
                    {c.driverCount && (
                      <div style={{ textAlign: 'center' }}>
                        <strong style={{ display: 'block', fontSize: '1.2rem', color }}>{c.driverCount}</strong>
                        <span style={{ fontSize: '.75rem', color: 'var(--muted)' }}>드라이버</span>
                      </div>
                    )}
                  </div>

                  {/* 피처 */}
                  {c.features && c.features.length > 0 && (
                    <div style={{ display: 'grid', gap: '6px', paddingTop: '12px', borderTop: '1px solid var(--line)' }}>
                      {c.features.slice(0, 3).map((f, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.84rem' }}>
                          <span style={{ color: 'var(--muted)' }}>{f.label}</span>
                          <strong>{f.value}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 포인트 시스템 ────────────────────────────────────── */}
      <section className="section" id="points">
        <div className="container" style={{ maxWidth: '860px' }}>
          <div className="section-head">
            <div>
              <span className="eyebrow">Points System</span>
              <h2>포인트 시스템</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '24px' }}>
            {/* 포인트 테이블 */}
            <div style={{ background: '#fff', border: '1px solid var(--line)', clipPath: cut, padding: '22px', position: 'relative', gridColumn: 'span 1' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,var(--red),rgba(230,0,35,.35) 35%,transparent 75%)' }} />
              <h3 style={{ marginBottom: '14px' }}>결승 레이스 포인트</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {POINT_TABLE.map(({ pos, pts }) => (
                  <div key={pos} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '6px 10px', background: 'var(--surface-2)', borderRadius: '4px',
                  }}>
                    <span style={{ fontSize: '.85rem', fontWeight: 700, color: pos <= 3 ? 'var(--red)' : 'var(--muted)' }}>
                      {pos <= 3 ? ['🥇', '🥈', '🥉'][pos - 1] : `${pos}위`}
                    </span>
                    <strong style={{ color: 'var(--red)' }}>{pts} pts</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* 추가 포인트 */}
            <div style={{ background: '#fff', border: '1px solid var(--line)', clipPath: cut, padding: '22px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,var(--red),rgba(230,0,35,.35) 35%,transparent 75%)' }} />
              <h3 style={{ marginBottom: '14px' }}>추가 포인트</h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                {[
                  { label: '예선 폴포지션',  pts: '+2 pts' },
                  { label: '패스티스트 랩',  pts: '+1 pt' },
                  { label: '시즌 전 라운드 완주', pts: '보너스 추가' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--surface-2)', borderRadius: '4px' }}>
                    <span style={{ fontSize: '.88rem' }}>{item.label}</span>
                    <strong style={{ color: 'var(--red)', fontSize: '.9rem' }}>{item.pts}</strong>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(230,0,35,.04)', border: '1px solid rgba(230,0,35,.14)', borderRadius: '6px', fontSize: '.84rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                ※ DNF(리타이어)는 완주 조건 미달 시 포인트 없음.<br />
                DNS·DSQ는 해당 라운드 포인트 무효.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 규정 ─────────────────────────────────────────────── */}
      <section className="section" id="regulations" style={{ background: 'var(--surface-2)' }}>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Regulations</span>
              <h2>기술 규정</h2>
            </div>
          </div>
          {(() => {
            const FALLBACK_DOCS = [
              '2026 공통 기술 규정 v1.2',
              'GT1/GT2 클래스 세부 규정',
              'GT3 입문 클래스 규정',
              '드리프트 KDGP 규정',
              '안전장비 기준 가이드라인',
              '차량 계량 & 검차 절차',
            ]
            const docs = displayRegulations.length > 0
              ? displayRegulations.map(r => ({ title: r.title, url: r.file?.asset?.url }))
              : FALLBACK_DOCS.map(title => ({ title, url: null }))

            return (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '12px' }}>
                  {docs.map((doc, i) => (
                    doc.url ? (
                      <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: '#fff', border: '1px solid var(--line)', clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)', textDecoration: 'none', color: 'inherit' }}>
                        <i className="fa-regular fa-file-pdf" style={{ fontSize: '1.4rem', color: 'var(--red)', flexShrink: 0 }} />
                        <span style={{ fontSize: '.9rem', fontWeight: 700 }}>{doc.title}</span>
                        <i className="fa-solid fa-download" style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: '.85rem' }} />
                      </a>
                    ) : (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: '#fff', border: '1px solid var(--line)', clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)', opacity: .6 }}>
                        <i className="fa-regular fa-file-pdf" style={{ fontSize: '1.4rem', color: 'var(--red)', flexShrink: 0 }} />
                        <span style={{ fontSize: '.9rem', fontWeight: 700 }}>{doc.title}</span>
                        <span style={{ marginLeft: 'auto', fontSize: '.75rem', color: 'var(--muted)' }}>준비중</span>
                      </div>
                    )
                  ))}
                </div>
                {displayRegulations.length === 0 && (
                  <p style={{ marginTop: '12px', fontSize: '.84rem', color: 'var(--muted)' }}>
                    * 규정 PDF는 추후 업데이트 예정입니다.
                  </p>
                )}
              </>
            )
          })()}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg,#111,#1a0008)', padding: '64px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem,3vw,2.6rem)', marginBottom: '14px' }}>Where Legends Begin</h2>
          <p style={{ color: 'rgba(255,255,255,.65)', marginBottom: '28px', fontSize: 'clamp(.9rem,1.4vw,1.06rem)' }}>
            2026 인제 GT 마스터즈 — 지금 참가를 신청하세요.
          </p>
          <div className="btns" style={{ justifyContent: 'center' }}>
            <Link href="/entry" className="btn btn-primary" style={{ fontSize: '1.05rem', minHeight: '56px' }}>
              <i className="fa-solid fa-flag-checkered" />
              참가 신청하기
            </Link>
            <Link href="/results" className="btn btn-ghost">
              경기 결과 보기
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
