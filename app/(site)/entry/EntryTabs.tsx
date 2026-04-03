'use client'
// app/(site)/entry/EntryTabs.tsx — 3탭 레이아웃 클라이언트 컴포넌트
import { useState, useEffect } from 'react'
import type { SiteSettings, ClassInfo, Round } from '@/types/sanity'
import EntryForm from './EntryForm'

interface Props {
  isOpen:              boolean
  classes:             ClassInfo[]
  rounds:              Round[]
  settings:            SiteSettings | null
  faq:                 { q: string; a: string }[]
  initialTab?:         'apply' | 'classes' | 'regulations'
  initialRoundNumber?: number
}

type Tab = 'apply' | 'classes' | 'regulations'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'apply',       label: '신청하기',     icon: 'fa-flag-checkered' },
  { id: 'classes',     label: '클래스 & 자격', icon: 'fa-trophy' },
  { id: 'regulations', label: '규정 & FAQ',   icon: 'fa-file-lines' },
]

export default function EntryTabs({ isOpen, classes, rounds, settings, faq, initialTab, initialRoundNumber }: Props) {
  const [tab, setTab] = useState<Tab>(initialTab ?? 'apply')
  const cut = 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)'
  const anyRoundOpen = rounds.some(r => r.status === 'entry_open')

  // 클라이언트 사이드 내비게이션 시 URL 파라미터 변경 반영
  useEffect(() => {
    if (initialTab) setTab(initialTab)
  }, [initialTab])

  return (
    <>
      {/* ── 탭 바 ─────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 'var(--header-h)', zIndex: 100,
        background: 'rgba(10,10,10,0.97)',
        borderBottom: '1px solid var(--line)',
        backdropFilter: 'blur(12px)',
      }}>
        <div className="container" style={{ display: 'flex', gap: 0, padding: 0 }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '18px 12px',
                fontFamily: "'Oswald', sans-serif",
                fontSize: 'clamp(14px, 2vw, 17px)',
                fontWeight: tab === t.id ? 600 : 400,
                letterSpacing: '0.5px',
                color: tab === t.id ? 'var(--red)' : 'var(--text-sub)',
                background: 'none',
                border: 'none',
                borderBottom: tab === t.id ? '3px solid var(--red)' : '3px solid transparent',
                marginBottom: '-1px',
                cursor: 'pointer',
                transition: 'all .2s',
                whiteSpace: 'nowrap',
              }}
            >
              <i className={`fa-solid ${t.icon}`} style={{ fontSize: '14px' }} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 탭 1: 신청하기 ────────────────────────────────── */}
      {tab === 'apply' && (
        <section className="section">
          <div className="container">
            <div className="entry-form-grid">
              <EntryForm isOpen={isOpen} classes={classes} rounds={rounds} initialRoundNumber={initialRoundNumber} />

              {/* 우측: 안내사항 */}
              <div style={{ display: 'grid', gap: '16px' }}>
                {/* 참가 절차 */}
                <div style={{ background: 'var(--bg-2)', border: '1px solid var(--line)', clipPath: cut, padding: '22px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,var(--red),rgba(230,0,35,.35) 35%,transparent 75%)' }} />
                  <h3 style={{ marginBottom: '16px' }}>참가 신청 절차</h3>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {[
                      { n: '01', icon: 'fa-file-pen',       title: '신청서 작성',   desc: '클래스·라운드·드라이버 정보 입력' },
                      { n: '02', icon: 'fa-mobile-screen',  title: '결제 링크 수신', desc: '이메일로 토스페이먼츠 링크 발송 (1~2 영업일)' },
                      { n: '03', icon: 'fa-credit-card',    title: '결제 완료',     desc: '카드·계좌이체·토스 결제' },
                      { n: '04', icon: 'fa-flag-checkered', title: '접수 확정',     desc: '확정 메일 수신 후 출전 준비' },
                    ].map((s, i) => (
                      <div key={i} style={{
                        display: 'grid', gridTemplateColumns: '40px 1fr', gap: '12px', alignItems: 'start',
                        padding: '12px', background: 'var(--surface-2)', border: '1px solid var(--line)',
                        clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)',
                      }}>
                        <div style={{ width: '40px', height: '40px', display: 'grid', placeItems: 'center', background: 'rgba(230,0,35,.08)', color: 'var(--red)', border: '1px solid rgba(230,0,35,.18)', clipPath: 'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,0 100%)', fontSize: '.9rem' }}>
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
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '.86rem', color: 'var(--text-mid)' }}>
                        <span style={{ width: '8px', height: '8px', background: 'var(--red)', transform: 'skewX(-20deg)', flexShrink: 0, marginTop: '4px' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 문의 */}
                <div style={{ background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: '8px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h3 style={{ fontSize: '.95rem' }}>
                    <i className="fa-solid fa-headset" style={{ color: 'var(--red)', marginRight: '8px' }} />
                    신청 문의
                  </h3>
                  {settings?.phone && (
                    <a href={`tel:${settings.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '.9rem', fontWeight: 700, color: 'var(--text)', textDecoration: 'none' }}>
                      <i className="fa-solid fa-phone" style={{ color: 'var(--red)' }} />
                      {settings.phone}
                    </a>
                  )}
                  {settings?.email && (
                    <a href={`mailto:${settings.email}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '.9rem', fontWeight: 700, color: 'var(--text)', textDecoration: 'none' }}>
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
      )}

      {/* ── 탭 2: 클래스 & 자격 ──────────────────────────── */}
      {tab === 'classes' && (
        <section className="section">
          <div className="container">

            {/* 헤더 */}
            <div className="section-head">
              <div>
                <span className="eyebrow">Race Classes</span>
                <h2>클래스 & 참가 정보</h2>
              </div>
              <p className="lead">클래스별 참가비, 정원, 접수 현황을 한눈에 확인하세요.</p>
            </div>

            {/* 통합 클래스 카드 그리드 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '16px' }}>
              {classes.map((c) => {
                const color = c.accentColor ?? '#e60023'
                const fee = c.entryFeePerRound
                const openRound = rounds.find(r => r.status === 'entry_open')
                const applyHref = openRound
                  ? `/entry?tab=apply&round=R${openRound.roundNumber}`
                  : '/entry?tab=apply'
                return (
                  <div key={c._id} style={{
                    background: 'var(--bg-2)', border: '1px solid var(--line)',
                    clipPath: cut, position: 'relative', overflow: 'hidden',
                    padding: '22px', display: 'flex', flexDirection: 'column',
                  }}>
                    {/* 상단 컬러 바 */}
                    <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: `linear-gradient(90deg,${color},${color}44 60%,transparent)` }} />

                    {/* 뱃지 + 접수 상태 */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <span style={{ padding: '4px 12px', fontSize: '.8rem', fontWeight: 900, background: `${color}14`, color, border: `1px solid ${color}38`, clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)' }}>
                        {c.classCode}
                      </span>
                      {anyRoundOpen
                        ? <span style={{ fontSize: '.76rem', fontWeight: 900, color: '#16a34a', padding: '3px 10px', background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.25)', borderRadius: '4px', letterSpacing: '.02em' }}>접수중</span>
                        : <span style={{ fontSize: '.76rem', color: 'var(--muted)', padding: '3px 10px', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '4px' }}>준비중</span>
                      }
                    </div>

                    {/* 클래스명 + 설명 */}
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>{c.name}</h3>
                    {c.tagline && (
                      <p style={{ fontSize: '.88rem', color: 'var(--muted)', lineHeight: 1.55, marginBottom: '0', flex: 1 }}>{c.tagline}</p>
                    )}

                    {/* 참가비 + 정원 */}
                    <div style={{ display: 'flex', gap: '0', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--line)' }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ display: 'block', fontSize: '.76rem', color: 'var(--muted)', fontWeight: 600, marginBottom: '4px', letterSpacing: '.04em', textTransform: 'uppercase' as const }}>라운드당 참가비</span>
                        {(c.isFeePublic !== false && fee)
                          ? <strong style={{ fontSize: '1.1rem', color: 'var(--red)', letterSpacing: '-.5px' }}>{fee.toLocaleString()}원</strong>
                          : <span style={{ fontSize: '.9rem', color: 'var(--muted)', fontWeight: 700 }}>문의</span>}
                        {c.entryFeeNote && <span style={{ display: 'block', fontSize: '.76rem', color: 'var(--muted)', marginTop: '2px' }}>{c.entryFeeNote}</span>}
                      </div>
                      {c.teamCount != null && (
                        <div style={{ flex: 1, borderLeft: '1px solid var(--line)', paddingLeft: '16px' }}>
                          <span style={{ display: 'block', fontSize: '.76rem', color: 'var(--muted)', fontWeight: 600, marginBottom: '4px', letterSpacing: '.04em', textTransform: 'uppercase' as const }}>참가 정원</span>
                          <strong style={{ fontSize: '1.1rem', letterSpacing: '-.5px' }}>{c.teamCount}<span style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--muted)', marginLeft: '3px' }}>팀</span></strong>
                        </div>
                      )}
                    </div>

                    {/* 하단 버튼 */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                      <a href={`/classes/${c.slug.current}`} style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                        padding: '10px', fontSize: '.84rem', fontWeight: 700,
                        color, border: `1px solid ${color}44`, background: `${color}08`,
                        textDecoration: 'none',
                        clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)',
                        transition: 'background .2s',
                      }}>
                        자세히 보기 <i className="fa-solid fa-arrow-right" style={{ fontSize: '.75rem' }} />
                      </a>
                      {anyRoundOpen && (
                        <a href={applyHref} style={{
                          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                          padding: '10px', fontSize: '.84rem', fontWeight: 700,
                          color: '#fff', background: color, border: `1px solid ${color}`,
                          textDecoration: 'none',
                          clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)',
                          transition: 'opacity .2s',
                        }}>
                          신청하기 <i className="fa-solid fa-flag-checkered" style={{ fontSize: '.75rem' }} />
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        </section>
      )}

      {/* ── 탭 3: 규정 & FAQ ──────────────────────────────── */}
      {tab === 'regulations' && (
        <section className="section">
          <div className="container">

            {/* 규정 자료실 */}
            <div className="section-head">
              <div>
                <span className="eyebrow">Regulations</span>
                <h2>규정 & 서식 자료실</h2>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '12px', marginBottom: '64px' }}>
              {[
                { icon: 'fa-file-pdf',  title: '2026 공통 기술 규정',  desc: '전 클래스 공통 차량·안전 기준', badge: 'PDF' },
                { icon: 'fa-file-pdf',  title: 'GT1/GT2 클래스 규정',  desc: 'Pro-Am / 아마추어 세부 규정',  badge: 'PDF' },
                { icon: 'fa-file-pdf',  title: 'GT3 입문 클래스 규정', desc: '입문 클래스 특별 규정',        badge: 'PDF' },
                { icon: 'fa-file-pdf',  title: '드리프트 KDGP 규정',   desc: '드리프트 클래스 기술 기준',    badge: 'PDF' },
                { icon: 'fa-file-word', title: '참가 신청 서식',        desc: '수기 신청용 워드 서식',        badge: 'DOC' },
                { icon: 'fa-file-pdf',  title: '안전장비 기준 가이드',  desc: '헬멧·슈트·HANS 규격 안내',    badge: 'PDF' },
              ].map((doc, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', background: 'var(--bg-2)', border: '1px solid var(--line)', clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)', cursor: 'pointer', transition: 'box-shadow .2s' }}>
                  <i className={`fa-regular ${doc.icon}`} style={{ fontSize: '1.6rem', color: 'var(--red)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ display: 'block', fontSize: '.92rem' }}>{doc.title}</strong>
                    <span style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{doc.desc}</span>
                  </div>
                  <span style={{ fontSize: '.72rem', fontWeight: 900, padding: '2px 7px', background: 'rgba(230,0,35,.08)', color: 'var(--red)', border: '1px solid rgba(230,0,35,.2)', borderRadius: '3px' }}>{doc.badge}</span>
                </div>
              ))}
            </div>
            <p style={{ marginTop: '-48px', marginBottom: '64px', fontSize: '.85rem', color: 'var(--muted)' }}>
              * 규정 PDF는 추후 업로드 예정입니다. 문의는 이메일 또는 카카오 채널을 이용해 주세요.
            </p>

            {/* FAQ */}
            <div className="section-head">
              <div>
                <span className="eyebrow">FAQ</span>
                <h2>자주 묻는 질문</h2>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '12px', maxWidth: '860px' }}>
              {faq.map((item, i) => (
                <details key={i} style={{ background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: '8px', overflow: 'hidden' }}>
                  <summary style={{ padding: '18px 22px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <span><span style={{ color: 'var(--red)', marginRight: '10px' }}>Q.</span>{item.q}</span>
                    <i className="fa-solid fa-chevron-down" style={{ fontSize: '.85rem', color: 'var(--muted)', flexShrink: 0 }} />
                  </summary>
                  <div style={{ padding: '14px 22px 18px', borderTop: '1px solid var(--line)' }}>
                    <p style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: '.95rem' }}>
                      <span style={{ color: 'var(--red)', fontWeight: 900, marginRight: '8px' }}>A.</span>
                      {item.a}
                    </p>
                  </div>
                </details>
              ))}
            </div>

            {/* 신청 CTA */}
            <div style={{ marginTop: '48px', textAlign: 'center' }}>
              <button
                onClick={() => setTab('apply')}
                className="btn btn-primary"
                style={{ fontSize: '1rem', padding: '14px 36px' }}
              >
                <i className="fa-solid fa-flag-checkered" />
                지금 신청하기
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
