// app/(site)/circuit/page.tsx — 인제스피디움 소개 + 오시는 길 + 관람 안내
import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity.client'
import { SITE_SETTINGS_QUERY } from '@/lib/queries'
import type { SiteSettings } from '@/types/sanity'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: 'Speedium',
  description: '인제 GT 마스터즈 개최지, 인제스피디움 서킷 소개 · 찾아오는 길 · 관람 안내.',
}

export default async function CircuitPage() {
  const siteSettings = await sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY }).catch(() => null)
  const cut = 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)'

  const specs = [
    { icon: 'fa-road', label: '서킷 전장', value: '3.908 km' },
    { icon: 'fa-rotate', label: '코너', value: '19개' },
    { icon: 'fa-arrows-left-right', label: '직선 구간', value: '640m' },
    { icon: 'fa-mountain', label: '고저차', value: '88m' },
    { icon: 'fa-location-dot', label: '소재지', value: '강원도 인제군' },
  ]

  const circuitInfo = [
    { icon: 'fa-location-dot', text: '주소 : 강원도 인제군 기린면 상하답로 130' },
    { icon: 'fa-road', text: '서킷 전장 : 3.908km / 고저차 88m' },
    { icon: 'fa-flag', text: '코너 수 : 19개 / 국내 최고 수준 상설 서킷' },
    { icon: 'fa-car', text: '서울 기준 약 2시간 30분 소요' },
    { icon: 'fa-eye', text: '그랜드스탠드 무료 관람' },
    { icon: 'fa-square-parking', text: '경기 당일 현장 주차 운영' },
  ]

  const spectatorInfo = [
    { icon: 'fa-ticket', title: '입장료', desc: '그랜드스탠드 무료 관람 · 피트 투어 별도' },
    { icon: 'fa-clock', title: '관람 시간', desc: '레이스 당일 오전 9시 ~ 오후 6시' },
    { icon: 'fa-utensils', title: '편의시설', desc: '푸드트럭 · 관람 편의시설 운영' },
    { icon: 'fa-camera', title: '포토존', desc: '공식 포토존 및 경주차 전시 운영' },
    { icon: 'fa-square-parking', title: '주차', desc: '대규모 무료 주차장 운영' },
    { icon: 'fa-bed', title: '숙박', desc: '서킷 인근 리조트 및 펜션 다수' },
  ]

  return (
    <>
      {/* ── 히어로 ─────────────────────────────────────────── */}
      <PageHero
        image={siteSettings?.heroCircuit}
        badge="Inje Speedium"
        title="Speedium"
        subtitle="전설이 시작되는 서킷 — 인제 GT 마스터즈 전 라운드 개최지"
        breadcrumb={[
          { label: '인제GT마스터즈', href: '/' },
          { label: 'INJE GT MASTERS', href: '/history' },
          { label: 'Speedium' },
        ]}
      />

      {/* ── 서킷 스펙 카드 ─────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '2px', background: 'var(--line)' }}>
            {specs.map((s) => (
              <div key={s.label} style={{ background: 'var(--bg-2)', padding: '28px 20px', textAlign: 'center' }}>
                <i className={`fa-solid ${s.icon}`} style={{ fontSize: '1.2rem', color: 'var(--red)', display: 'block', marginBottom: '12px' }} />
                <div style={{ fontFamily: "'Pretendard Variable',Pretendard,sans-serif", fontSize: 'clamp(1.4rem,2.5vw,1.8rem)', fontWeight: 900, lineHeight: 1, letterSpacing: '-1px' }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.82rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' as const, color: 'var(--text-sub)', marginTop: '8px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 서킷 소개 + 기본 정보 (2col) ──────────────────── */}
      <section className="section" id="about" style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--line)' }}>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">About the Circuit</span>
              <h2>서킷 소개</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
            {/* 좌측: 소개 텍스트 */}
            <div>
              <p style={{ fontSize: '1.08rem', lineHeight: 1.9, color: 'var(--text-mid)', wordBreak: 'keep-all', marginBottom: '24px' }}>
                강원도 인제군에 위치한 인제스피디움은 대한민국 최고의 모터스포츠 서킷입니다.
                총 길이 3.908km, 19개의 코너와 640m 직선 구간이 드라이버의 기술과 머신의 성능을 동시에 시험합니다.
                인제 GT 마스터즈의 유일한 개최지로, 이곳에서 모든 전설이 시작됩니다.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a href="https://www.injespeedium.com" target="_blank" rel="noopener noreferrer" className="btn-fill" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '.9rem' }}>
                  인제스피디움 공식 홈페이지 <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '.75rem' }} />
                </a>
                <a href="https://www.injespeedium.com" target="_blank" rel="noopener noreferrer" className="btn-line" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '.9rem' }}>
                  트랙 데이 예약 <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '.75rem' }} />
                </a>
              </div>
            </div>

            {/* 우측: 기본 정보 리스트 (v2 이식) */}
            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--line)', clipPath: cut, padding: '24px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,var(--red),rgba(230,0,35,.35) 35%,transparent 75%)' }} />
              <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>서킷 기본 정보</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {circuitInfo.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                    padding: '11px 0',
                    borderBottom: i < circuitInfo.length - 1 ? '1px solid var(--line)' : 'none',
                  }}>
                    <i className={`fa-solid ${item.icon}`} style={{ color: 'var(--red)', marginTop: '3px', flexShrink: 0, width: '18px', textAlign: 'center', fontSize: '.9rem' }} />
                    <span style={{ fontWeight: 700, fontSize: '.92rem', color: 'var(--text-mid)', lineHeight: 1.5 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 찾아오는 길 ───────────────────────────────────── */}
      <section className="section" id="directions">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Directions</span>
              <h2>찾아오는 길</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
            {/* 지도 */}
            <div style={{ clipPath: cut, overflow: 'hidden', border: '1px solid var(--line)' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3143.5!2d128.2844!3d38.0631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5f9e9b6e84e1c5a5%3A0x9a0b4e9d9e9b6e84!2z7J247KCc7Iqk7ZS465SU7JuA!5e0!3m2!1sko!2skr!4v1"
                width="100%"
                height="380"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="인제스피디움 위치"
              />
            </div>

            {/* 교통 안내 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '20px 24px', background: 'var(--bg-2)', border: '1px solid var(--line)', clipPath: cut }}>
                <div style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--text-sub)', letterSpacing: '1.5px', textTransform: 'uppercase' as const, marginBottom: '8px' }}>주소</div>
                <p style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.6 }}>
                  강원도 인제군 기린면 상하답로 130<br />
                  <span style={{ fontSize: '.9rem', color: 'var(--text-sub)', fontWeight: 400 }}>인제스피디움 (Inje Speedium)</span>
                </p>
              </div>

              <div style={{ padding: '20px 24px', background: 'var(--bg-2)', border: '1px solid var(--line)', clipPath: cut }}>
                <div style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--text-sub)', letterSpacing: '1.5px', textTransform: 'uppercase' as const, marginBottom: '12px' }}>
                  <i className="fa-solid fa-car" style={{ color: 'var(--red)', marginRight: '6px' }} />
                  자가용
                </div>
                <p style={{ fontSize: '.95rem', color: 'var(--text-mid)', lineHeight: 1.7, wordBreak: 'keep-all', marginBottom: '10px' }}>
                  서울에서 약 2시간 30분 (영동고속도로 → 44번 국도)
                </p>
                <div style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--text-sub)', letterSpacing: '1.5px', textTransform: 'uppercase' as const, marginBottom: '12px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--line)' }}>
                  <i className="fa-solid fa-bus" style={{ color: 'var(--red)', marginRight: '6px' }} />
                  대중교통
                </div>
                <p style={{ fontSize: '.95rem', color: 'var(--text-mid)', lineHeight: 1.7, wordBreak: 'keep-all' }}>
                  동서울터미널 → 인제 시외버스 → 택시 약 30분
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a href="https://map.naver.com/v5/search/인제스피디움" target="_blank" rel="noopener noreferrer" className="btn-line" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '.88rem', flex: 1, justifyContent: 'center' }}>
                  <i className="fa-solid fa-map-location-dot" /> 네이버 지도
                </a>
                <a href="https://map.kakao.com/?q=인제스피디움" target="_blank" rel="noopener noreferrer" className="btn-line" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '.88rem', flex: 1, justifyContent: 'center' }}>
                  <i className="fa-solid fa-map-location-dot" /> 카카오맵
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 관람 안내 (v2 이식) ────────────────────────────── */}
      <section className="section" id="spectator" style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--line)' }}>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Spectator Guide</span>
              <h2>관람 안내</h2>
            </div>
            <p className="lead">메인 그랜드스탠드에서 레이스 전 구간 조망 가능. 피트레인 투어, 포토존 등 부대행사도 함께 진행됩니다.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '16px' }}>
            {spectatorInfo.map((item) => (
              <div key={item.title} style={{
                display: 'flex', alignItems: 'flex-start', gap: '14px',
                padding: '20px',
                background: 'var(--bg-2)', border: '1px solid var(--line)',
                clipPath: cut, position: 'relative',
              }}>
                <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,var(--red),transparent 60%)' }} />
                <i className={`fa-solid ${item.icon}`} style={{ color: 'var(--red)', marginTop: '2px', width: '20px', textAlign: 'center', flexShrink: 0, fontSize: '1.1rem' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '.95rem', marginBottom: '4px' }}>{item.title}</strong>
                  <span style={{ color: 'var(--text-sub)', fontSize: '.88rem', lineHeight: 1.5 }}>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg,#111,#1a0008)', padding: '48px 0', textAlign: 'center' }}>
        <div className="container">
          <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '18px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase' as const, color: 'var(--red)', marginBottom: '12px' }}>
            WHERE LEGENDS BEGIN
          </p>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.4rem,3.5vw,2.4rem)', marginBottom: '24px' }}>
            인제스피디움에서 당신의 전설을 시작하세요
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
