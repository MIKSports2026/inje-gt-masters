// app/(site)/entry/page.tsx — 참가신청 페이지 (토스페이먼츠 결제 링크 연동)
import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity.client'
import { SITE_SETTINGS_QUERY, CLASSES_QUERY, ROUNDS_QUERY } from '@/lib/queries'
import type { SiteSettings, ClassInfo, Round } from '@/types/sanity'
import EntryForm from './EntryForm'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: '참가 신청',
  description: '인제 GT 마스터즈 2026 시즌 온라인 참가 신청. GT1·GT2·GT3·드리프트·바이크·슈퍼카 클래스 선착순 접수. 토스페이먼츠 안전 결제.',
  openGraph: {
    title: '참가 신청 | 인제 GT 마스터즈 2026',
    description: '2026 시즌 온라인 참가 신청 — 토스페이먼츠 결제',
  },
}

const FAQ = [
  {
    q: '참가 신청 후 취소·환불이 가능한가요?',
    a: '대회 30일 전까지 전액 환불, 7~29일 전 50%, 7일 이내는 환불이 불가합니다. 취소는 운영 이메일로 접수해 주세요.',
  },
  {
    q: '드라이버 2인 교대 규정이 있나요?',
    a: 'GT1·GT2는 2인 이상 드라이버 교대가 필수입니다. GT3·드리프트·바이크·슈퍼카는 단독 출전도 가능합니다.',
  },
  {
    q: '차량은 어떻게 준비하나요?',
    a: '자차 지참 또는 팀 소속 차량으로 출전합니다. 클래스별 기술 규정 PDF를 반드시 사전에 확인하세요.',
  },
  {
    q: '국제 라이선스가 필요한가요?',
    a: 'GT1은 국내 A등급 이상, GT2·GT3는 B등급 이상이 필요합니다. 드리프트·바이크·슈퍼카는 클래스별 별도 자격 규정을 확인하세요.',
  },
  {
    q: '결제는 어떤 방식을 지원하나요?',
    a: '토스페이먼츠를 통해 카드·계좌이체·토스로 안전하게 결제할 수 있습니다. 신청 후 48시간 내 결제 링크가 발송됩니다.',
  },
]

export default async function EntryPage() {
  const today = new Date().toISOString().slice(0, 10)

  const [settings, classes, rounds] = await Promise.all([
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, revalidate: 3600 }),
    sanityFetch<ClassInfo[]>({ query: CLASSES_QUERY, revalidate: 3600 }),
    sanityFetch<Round[]>({ query: ROUNDS_QUERY, params: { season: 2026 }, revalidate: 300 }),
  ]).catch(() => [null, [], []] as [SiteSettings | null, ClassInfo[], Round[]])

  // Sanity 미연결 시 개발 환경에서는 폼 노출 (실제 운영 시 Sanity에서 제어)
  const isOpen = settings?.isEntryOpen ?? true
  const openRounds = (rounds as Round[]).filter(r => r.status === 'entry_open' || r.status === 'upcoming')
  const cut = 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)'

  const displayClasses = classes as ClassInfo[]

  return (
    <>
      {/* ── 페이지 히어로 ────────────────────────────────────── */}
      <PageHero
        image={(settings as SiteSettings | null)?.heroEntry}
        badge="2026 Season Entry"
        title="참가 신청"
        subtitle="당신의 도전이 시작되는 곳, 인제 GT 마스터즈."
      >
        {/* 상태 배너 */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          marginTop: '20px', padding: '10px 18px',
          background: isOpen ? 'rgba(34,197,94,.12)' : 'rgba(230,0,35,.10)',
          border: `1px solid ${isOpen ? 'rgba(34,197,94,.3)' : 'rgba(230,0,35,.3)'}`,
          borderRadius: '6px', color: isOpen ? '#4ade80' : '#ff6b6b',
          fontSize: '.9rem', fontWeight: 800,
        }}>
          <i className={`fa-solid ${isOpen ? 'fa-circle-check' : 'fa-clock'}`} />
          {isOpen
            ? '현재 참가 신청 접수 중입니다.'
            : ((settings as SiteSettings | null)?.entryNotice ?? '참가 신청 일정을 준비 중입니다.')}
        </div>
      </PageHero>

      {/* ── 클래스 & 참가비 ────────────────────────────────────── */}
      <section className="section" id="fee" style={{ background: 'var(--surface-2)' }}>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Class & Fee</span>
              <h2>클래스 & 참가비</h2>
            </div>
            <p className="lead">클래스별 참가비 및 접수 현황을 확인하세요.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '16px' }}>
            {displayClasses.map((c) => {
              const color = c.accentColor ?? '#e60023'
              const fee = c.entryFeePerRound
              return (
                <div key={c._id} style={{
                  background: '#fff', border: '1px solid var(--line)',
                  clipPath: cut, position: 'relative', overflow: 'hidden',
                  padding: '22px',
                }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: `linear-gradient(90deg,${color},${color}44 60%,transparent)` }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{
                      padding: '4px 12px', fontSize: '.8rem', fontWeight: 900,
                      background: `${color}14`, color, border: `1px solid ${color}38`,
                      clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)',
                    }}>{c.classCode}</span>
                    {c.isEntryOpen ? (
                      <span style={{ fontSize: '.78rem', fontWeight: 900, color: '#16a34a', padding: '3px 10px', background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.25)', borderRadius: '4px' }}>접수중</span>
                    ) : (
                      <span style={{ fontSize: '.78rem', color: 'var(--muted)' }}>접수 예정</span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '6px' }}>{c.name}</h3>
                  {c.tagline && <p style={{ fontSize: '.88rem', color: 'var(--muted)', marginBottom: '10px' }}>{c.tagline}</p>}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--line)' }}>
                    <span style={{ fontSize: '.85rem', color: 'var(--muted)' }}>라운드당 참가비</span>
                    {(c.isFeePublic !== false && fee) ? (
                      <strong style={{ fontSize: '1.05rem', color: 'var(--red)' }}>
                        {fee.toLocaleString()}원
                      </strong>
                    ) : (
                      <span style={{ fontSize: '.88rem', color: 'var(--muted)' }}>문의</span>
                    )}
                  </div>
                  {c.entryFeeNote && (
                    <p style={{ fontSize: '.8rem', color: 'var(--muted)', marginTop: '6px' }}>{c.entryFeeNote}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 참가신청 폼 / 토스페이먼츠 ──────────────────────────── */}
      <section className="section" id="form">
        <div className="container">
          <div className="entry-form-grid">
            <EntryForm
              isOpen={isOpen}
              classes={displayClasses}
              rounds={(rounds as Round[]).length > 0 ? rounds as Round[] : [
                { _id: 'r1', season: 2026, roundNumber: 1, slug: { current: '2026-r1' }, title: 'R1 — 개막전', dateStart: '2026-05-18', status: 'entry_open', hasResults: false },
                { _id: 'r2', season: 2026, roundNumber: 2, slug: { current: '2026-r2' }, title: 'R2 — 서머',   dateStart: '2026-07-13', status: 'upcoming',    hasResults: false },
                { _id: 'r3', season: 2026, roundNumber: 3, slug: { current: '2026-r3' }, title: 'R3 — 나이트레이스', dateStart: '2026-09-14', status: 'upcoming', hasResults: false },
                { _id: 'r4', season: 2026, roundNumber: 4, slug: { current: '2026-r4' }, title: 'R4 — 파이널', dateStart: '2026-11-02', status: 'upcoming',    hasResults: false },
              ]}
              tossBaseUrl={settings?.tossPaymentBaseUrl}
            />

            {/* 우측: 안내사항 */}
            <div style={{ display: 'grid', gap: '16px' }}>
              {/* 참가 절차 */}
              <div style={{ background: '#fff', border: '1px solid var(--line)', clipPath: cut, padding: '22px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,var(--red),rgba(230,0,35,.35) 35%,transparent 75%)' }} />
                <h3 style={{ marginBottom: '16px' }}>참가 신청 절차</h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {[
                    { n: '01', icon: 'fa-file-pen',      title: '신청서 작성',         desc: '클래스·라운드·드라이버 정보 입력' },
                    { n: '02', icon: 'fa-mobile-screen', title: '결제 링크 수신',       desc: '카카오/이메일로 토스페이먼츠 링크 발송 (48h 이내)' },
                    { n: '03', icon: 'fa-credit-card',   title: '결제 완료',            desc: '카드·계좌이체·토스 결제' },
                    { n: '04', icon: 'fa-flag-checkered', title: '접수 확정',           desc: '확정 메일 수신 후 출전 준비' },
                  ].map((s, i) => (
                    <div key={i} style={{
                      display: 'grid', gridTemplateColumns: '40px 1fr', gap: '12px', alignItems: 'start',
                      padding: '12px', background: 'var(--surface-2)', border: '1px solid var(--line)',
                      clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)',
                    }}>
                      <div style={{
                        width: '40px', height: '40px', display: 'grid', placeItems: 'center',
                        background: 'rgba(230,0,35,.08)', color: 'var(--red)',
                        border: '1px solid rgba(230,0,35,.18)',
                        clipPath: 'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,0 100%)',
                        fontSize: '.9rem',
                      }}>
                        <i className={`fa-solid ${s.icon}`} />
                      </div>
                      <div>
                        <strong style={{ fontSize: '.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '.7rem', color: 'var(--red)', fontWeight: 900 }}>STEP {s.n}</span>
                          {s.title}
                        </strong>
                        <span style={{ fontSize: '.82rem', color: 'var(--muted)', lineHeight: 1.45, display: 'block', marginTop: '2px' }}>{s.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 주의사항 */}
              <div style={{ background: 'rgba(230,0,35,.04)', border: '1px solid rgba(230,0,35,.16)', borderRadius: '8px', padding: '18px' }}>
                <h3 style={{ fontSize: '.95rem', marginBottom: '12px', color: 'var(--red)' }}>
                  <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '6px' }} />
                  신청 전 확인사항
                </h3>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: '8px' }}>
                  {[
                    '선착순 마감 — 정원 초과 시 대기 처리',
                    '클래스별 차량 기술 규정 사전 확인 필수',
                    '드라이버 라이선스 사본 접수 시 첨부',
                    '결제 완료 후 취소 시 수수료 발생',
                    '부정확한 정보 기재 시 출전 자격 박탈',
                  ].map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '.86rem', color: '#3a434d' }}>
                      <span style={{ width: '8px', height: '8px', background: 'var(--red)', transform: 'skewX(-20deg)', flexShrink: 0, marginTop: '4px' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 문의 */}
              <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '8px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3 style={{ fontSize: '.95rem' }}>
                  <i className="fa-solid fa-headset" style={{ color: 'var(--red)', marginRight: '8px' }} />
                  신청 문의
                </h3>
                {settings?.phone && (
                  <a href={`tel:${settings.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '.9rem', fontWeight: 700, color: 'var(--text)' }}>
                    <i className="fa-solid fa-phone" style={{ color: 'var(--red)' }} />
                    {settings.phone}
                  </a>
                )}
                {settings?.email && (
                  <a href={`mailto:${settings.email}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '.9rem', fontWeight: 700, color: 'var(--text)' }}>
                    <i className="fa-solid fa-envelope" style={{ color: 'var(--red)' }} />
                    {settings.email}
                  </a>
                )}
                {settings?.kakaoChannelUrl && (
                  <a href={settings.kakaoChannelUrl} target="_blank" rel="noopener noreferrer"
                    className="btn btn-secondary" style={{ justifyContent: 'center', fontSize: '.9rem', background: '#FEE500', borderColor: '#FEE500', color: '#111' }}>
                    <i className="fa-solid fa-comment" />
                    카카오 채널 문의
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 참가 자격 ────────────────────────────────────────── */}
      <section className="section" id="gt-eligibility" style={{ background: 'var(--surface-2)' }}>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Eligibility</span>
              <h2>참가 자격</h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '16px' }}>
            {[
              { cls: 'GT1', color: '#e60023', items: ['국내 A등급 이상 레이싱 라이선스', '내구레이스 경험 1시즌 이상', '2인 드라이버 팀 구성 필수', 'FIA 규격 롤케이지 장착 차량'] },
              { cls: 'GT2', color: '#2563eb', items: ['국내 B등급 이상 레이싱 라이선스', '내구레이스 경험 유무 무관', '2인 팀 권장 (1인 가능)', 'B등급 규격 안전장비 필수'] },
              { cls: 'GT3', color: '#b8921e', items: ['국내 C등급 이상 (입문 클래스)', '서킷 주행 경험 1회 이상', '1~2인 자유 구성', 'C등급 규격 안전장비 권장'] },
              { cls: 'DRIFT', color: '#16a34a', items: ['드리프트 특별 라이선스', '공인 드리프트 대회 출전 경험', '차량 개조 규정 준수', '지정 타이어 사용 의무'] },
              { cls: 'BIKE', color: '#a855f7', items: ['이륜차 면허 소지', '서킷 바이크 주행 경험', '레이싱 슈트·헬멧 필수', '650cc 이상 스포츠 바이크'] },
              { cls: 'SUPERCAR', color: '#f97316', items: ['자차 출전 원칙', '차량가액 5,000만원 이상', '기본 레이싱 헬멧·슈트', '강습 이수 또는 경험자 우선'] },
            ].map((item) => (
              <div key={item.cls} style={{ background: '#fff', border: '1px solid var(--line)', clipPath: cut, padding: '20px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: `linear-gradient(90deg,${item.color},${item.color}44 60%,transparent)` }} />
                <span style={{ display: 'inline-block', marginBottom: '10px', padding: '3px 10px', fontSize: '.8rem', fontWeight: 900, background: `${item.color}14`, color: item.color, border: `1px solid ${item.color}38`, clipPath: 'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,0 100%)' }}>{item.cls}</span>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: '7px' }}>
                  {item.items.map((li, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '.88rem', color: '#3a434d' }}>
                      <span style={{ width: '8px', height: '8px', background: item.color, transform: 'skewX(-20deg)', flexShrink: 0, marginTop: '4px' }} />
                      {li}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 규정 다운로드 ────────────────────────────────────── */}
      <section className="section" id="regulations">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Regulations</span>
              <h2>규정 & 서식 자료실</h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '12px' }}>
            {[
              { icon: 'fa-file-pdf', title: '2026 공통 기술 규정',    desc: '전 클래스 공통 차량·안전 기준', badge: 'PDF' },
              { icon: 'fa-file-pdf', title: 'GT1/GT2 클래스 규정',    desc: 'Pro-Am / 아마추어 세부 규정',  badge: 'PDF' },
              { icon: 'fa-file-pdf', title: 'GT3 입문 클래스 규정',   desc: '입문 클래스 특별 규정',        badge: 'PDF' },
              { icon: 'fa-file-pdf', title: '드리프트 KDGP 규정',     desc: '드리프트 클래스 기술 기준',    badge: 'PDF' },
              { icon: 'fa-file-word', title: '참가 신청 서식',         desc: '수기 신청용 워드 서식',        badge: 'DOC' },
              { icon: 'fa-file-pdf', title: '안전장비 기준 가이드',    desc: '헬멧·슈트·HANS 규격 안내',    badge: 'PDF' },
            ].map((doc, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '16px 18px', background: '#fff', border: '1px solid var(--line)',
                clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)',
                cursor: 'pointer', transition: 'box-shadow .2s',
              }}>
                <i className={`fa-regular ${doc.icon}`} style={{ fontSize: '1.6rem', color: 'var(--red)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ display: 'block', fontSize: '.92rem' }}>{doc.title}</strong>
                  <span style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{doc.desc}</span>
                </div>
                <span style={{ fontSize: '.72rem', fontWeight: 900, padding: '2px 7px', background: 'rgba(230,0,35,.08)', color: 'var(--red)', border: '1px solid rgba(230,0,35,.2)', borderRadius: '3px' }}>
                  {doc.badge}
                </span>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '14px', fontSize: '.85rem', color: 'var(--muted)' }}>
            * 규정 PDF는 추후 업로드 예정입니다. 문의는 이메일 또는 카카오 채널을 이용해 주세요.
          </p>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section className="section" id="faq" style={{ background: 'var(--surface-2)' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <div className="section-head">
            <div>
              <span className="eyebrow">FAQ</span>
              <h2>자주 묻는 질문</h2>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            {FAQ.map((item, i) => (
              <details key={i} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '8px', overflow: 'hidden' }}>
                <summary style={{ padding: '18px 22px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <span><span style={{ color: 'var(--red)', marginRight: '10px' }}>Q.</span>{item.q}</span>
                  <i className="fa-solid fa-chevron-down" style={{ fontSize: '.85rem', color: 'var(--muted)', flexShrink: 0 }} />
                </summary>
                <div style={{ padding: '0 22px 18px 22px', borderTop: '1px solid var(--line)', paddingTop: '14px' }}>
                  <p style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: '.95rem' }}>
                    <span style={{ color: 'var(--red)', fontWeight: 900, marginRight: '8px' }}>A.</span>
                    {item.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
