// app/(site)/season/page.tsx — 2026 시즌 안내 (라운드 일정 + 클래스 + 포인트)
import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity.client'
import { SITE_SETTINGS_QUERY, ROUNDS_QUERY, CLASSES_QUERY, REGULATIONS_QUERY } from '@/lib/queries'
import type { SiteSettings, Round, ClassInfo } from '@/types/sanity'
import { resolveRoundStatus } from '@/lib/roundStatus'
import PageHero from '@/components/ui/PageHero'
import SectionRound from '@/components/sections/SectionRound'

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

      {/* ── 라운드 일정 (카드 그리드) ───────────────────────── */}
      <SectionRound rounds={displayRounds} />


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
                      <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: 'var(--bg-2)', border: '1px solid var(--line)', clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)', textDecoration: 'none', color: 'inherit' }}>
                        <i className="fa-regular fa-file-pdf" style={{ fontSize: '1.4rem', color: 'var(--red)', flexShrink: 0 }} />
                        <span style={{ fontSize: '.9rem', fontWeight: 700 }}>{doc.title}</span>
                        <i className="fa-solid fa-download" style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: '.85rem' }} />
                      </a>
                    ) : (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: 'var(--bg-2)', border: '1px solid var(--line)', clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)', opacity: .6 }}>
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
