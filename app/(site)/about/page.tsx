// app/(site)/about/page.tsx — 대회 소개
import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity.client'
import { SITE_SETTINGS_QUERY, CLASSES_QUERY, PARTNERS_QUERY } from '@/lib/queries'
import type { SiteSettings, ClassInfo, Partner } from '@/types/sanity'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: '대회 소개 | 인제 GT 마스터즈',
  description: '대한민국 정통 GT 내구레이스, 인제 GT 마스터즈의 대회 소개 — Where Legends Begin.',
}

export default async function AboutPage() {
  const [settings, classes, partners] = await Promise.all([
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY }),
    sanityFetch<ClassInfo[]>({ query: CLASSES_QUERY }),
    sanityFetch<Partner[]>({ query: PARTNERS_QUERY, params: { currentSeason: 2026 } }),
  ]).catch(() => [null, [], []] as const)

  const s  = settings as SiteSettings | null
  const cl = classes as ClassInfo[]
  const pt = partners as Partner[]
  const cut = 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)'

  const values = [
    { icon: 'fa-road', title: '끝까지 달린다', desc: '포기하지 않는 끈기와 열정으로 자신의 한계를 시험하며, 순수한 레이싱 본능을 깨웁니다.' },
    { icon: 'fa-users', title: '누구나 도전한다', desc: '아마추어부터 세미프로까지, 제한된 예산으로 경험하는 진정한 모터스포츠의 현장감.' },
    { icon: 'fa-bolt', title: '한계를 넘는다', desc: '엄격한 규제보다 창의적인 개조를 허용하여, 미케닉의 기술력과 머신의 잠재력을 극대화합니다.' },
  ]

  const stats = [
    { num: '2015', label: '첫 시즌 개최' },
    { num: `${cl.length || 6}`, label: '공식 클래스' },
    { num: '107+', label: '역대 최다 참가팀' },
    { num: '3.908', label: '서킷 길이 (km)' },
  ]

  return (
    <>
      {/* 히어로 */}
      <PageHero
        image={s?.heroAbout}
        badge="About"
        title="인제 GT 마스터즈"
        subtitle="Where Legends Begin — 대한민국 정통 GT 내구레이스"
      />

      {/* 대회 소개 */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">About the Race</span>
              <h2>대한민국 최고의 GT 내구레이스</h2>
            </div>
          </div>

          <div style={{ maxWidth: '780px', marginBottom: '40px' }}>
            <p style={{ fontSize: '1.08rem', lineHeight: 1.9, color: 'var(--text-mid)', wordBreak: 'keep-all' }}>
              인제 GT 마스터즈는 강원도 인제스피디움(3.908km)에서 개최되는 대한민국 정통 GT 내구레이스입니다.
              대한민국에서 가장 오래 달리고, 가장 저렴하게 참여하며, 가장 자유롭게 개조할 수 있는
              GT 내구레이스 — 아마추어부터 프로까지, 당신의 한계를 시험하세요.
            </p>
          </div>

          {/* 핵심 가치 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '16px', marginBottom: '48px' }}>
            {values.map((v) => (
              <div key={v.title} style={{ background: 'var(--bg-2)', border: '1px solid var(--line)', clipPath: cut, padding: '28px 24px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,var(--red),rgba(230,0,35,.35) 35%,transparent 75%)' }} />
                <i className={`fa-solid ${v.icon}`} style={{ fontSize: '1.4rem', color: 'var(--red)', marginBottom: '14px', display: 'block' }} />
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{v.title}</h3>
                <p style={{ fontSize: '.92rem', color: 'var(--text-mid)', lineHeight: 1.7, wordBreak: 'keep-all' }}>{v.desc}</p>
              </div>
            ))}
          </div>

          {/* 통계 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2px', background: 'var(--line)', marginBottom: '48px' }}>
            {stats.map((s) => (
              <div key={s.label} style={{ background: 'var(--bg-2)', padding: '28px 20px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Pretendard Variable',Pretendard,sans-serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 900, color: 'var(--red)', lineHeight: 1, letterSpacing: '-1px' }}>
                  {s.num}
                </div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.85rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' as const, color: 'var(--text-sub)', marginTop: '8px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 서킷 정보 */}
      <section className="section" style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--line)' }}>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Circuit</span>
              <h2>인제스피디움</h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
            <div>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.9, color: 'var(--text-mid)', wordBreak: 'keep-all', marginBottom: '24px' }}>
                강원도 인제군에 위치한 인제스피디움은 총 길이 3.908km, 고저차 88m의 테크니컬 서킷입니다.
                15개의 코너와 650m 직선 구간이 드라이버의 기술과 머신의 성능을 동시에 시험합니다.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { label: '서킷 길이', value: '3.908 km' },
                  { label: '코너 수', value: '15개' },
                  { label: '직선 구간', value: '650m' },
                  { label: '소재지', value: '강원도 인제군' },
                ].map((item) => (
                  <div key={item.label} style={{ padding: '14px 16px', background: 'var(--bg-2)', border: '1px solid var(--line)', clipPath: cut }}>
                    <div style={{ fontSize: '.78rem', fontWeight: 600, color: 'var(--text-sub)', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--bg-4)', border: '1px solid var(--line)', aspectRatio: '16/10', display: 'grid', placeItems: 'center', clipPath: cut }}>
              <div style={{ textAlign: 'center', color: 'var(--text-sub)', opacity: .5 }}>
                <i className="fa-solid fa-map" style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }} />
                <span style={{ fontSize: '.85rem' }}>서킷 맵 준비중</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 클래스 요약 */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Race Classes</span>
              <h2>{cl.length || 6}개 공식 클래스</h2>
            </div>
            <Link href="/season#classes" className="sec-more" style={{ fontWeight: 700, color: 'var(--red)', textDecoration: 'none' }}>
              전체 보기 →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '12px' }}>
            {cl.map((c) => {
              const color = c.accentColor ?? '#e60023'
              return (
                <Link key={c._id} href={`/classes/${c.slug.current}`} style={{
                  display: 'block', textDecoration: 'none', color: 'inherit',
                  background: 'var(--bg-2)', border: '1px solid var(--line)', clipPath: cut,
                  padding: '18px 16px', position: 'relative', transition: 'box-shadow .2s',
                }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: color }} />
                  <span style={{ padding: '3px 10px', fontSize: '.78rem', fontWeight: 900, background: `${color}14`, color, border: `1px solid ${color}38`, clipPath: 'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,0 100%)' }}>
                    {c.classCode}
                  </span>
                  <div style={{ marginTop: '10px', fontSize: '.95rem', fontWeight: 700 }}>{c.name}</div>
                  {c.tagline && <p style={{ fontSize: '.82rem', color: 'var(--text-sub)', marginTop: '4px', lineHeight: 1.4 }}>{c.tagline}</p>}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 후원사 */}
      {pt.length > 0 && (
        <section id="partners" className="section" style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--line)' }}>
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">Partners & Sponsors</span>
                <h2>후원사 소개</h2>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
              {pt.map((p) => (
                <div key={p._id} style={{
                  padding: '20px 28px', background: 'var(--bg-2)', border: '1px solid var(--line)',
                  clipPath: cut, display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <span style={{ fontSize: '.82rem', fontWeight: 800, color: 'var(--text-sub)', letterSpacing: '1px', textTransform: 'uppercase' as const }}>
                    {p.tier}
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 700 }}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg,#111,#1a0008)', padding: '48px 0', textAlign: 'center' }}>
        <div className="container">
          <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '18px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase' as const, color: 'var(--red)', marginBottom: '12px' }}>
            PUSH YOUR LIMIT
          </p>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem,4vw,2.8rem)', marginBottom: '24px' }}>
            당신의 한계를 시험할 준비가 되셨나요?
          </h2>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/entry" className="btn-fill" style={{ fontSize: '1rem', padding: '14px 32px' }}>
              <i className="fa fa-flag-checkered" /> Register
            </Link>
            <Link href="/season" className="btn-line" style={{ fontSize: '1rem', padding: '14px 32px', color: 'rgba(255,255,255,.7)', borderColor: 'rgba(255,255,255,.3)' }}>
              2026 시즌 일정 보기
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
