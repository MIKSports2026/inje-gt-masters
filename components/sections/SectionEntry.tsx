'use client'
// components/sections/SectionEntry.tsx — v3 2-col with class image grid
import Link from 'next/link'
import type { SiteSettings, ClassInfo } from '@/types/sanity'
import SectionHeader from '@/components/ui/SectionHeader'

interface Props {
  settings: SiteSettings | null
  classes:  ClassInfo[]
}

const CLASS_COLORS: Record<string, string> = {
  'masters-1': 'var(--red)', 'masters-2': '#3b82f6', 'masters-n': 'var(--gold)',
  'masters-3': '#22c55e', 'masters-n-evo': '#a855f7',
}

export default function SectionEntry({ settings, classes }: Props) {
  const isOpen = settings?.isEntryOpen ?? false

  const steps = [
    { n: '01', t: '온라인 신청서 작성', s: '라운드·종목·팀·드라이버 정보를 입력. 담당자에게 즉시 알림 발송.' },
    { n: '02', t: '결제 링크 수신', s: '토스페이먼츠 결제 링크를 이메일·카카오로 발송. 카드·간편결제 가능.' },
    { n: '03', t: '결제 완료 & 접수 확정', s: '결제 후 접수 확정 이메일 발송. 라운드당 선착순 50팀, 조기 마감 가능.' },
  ]

  return (
    <section className="sec sec-dark" id="entry" aria-labelledby="entry-ttl">
      <div className="inner">
        <div className="entry-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>

          {/* 좌측 */}
          <div>
            <SectionHeader subtitle="JOIN THE RACE" title="ENTRY" />
            <p style={{ fontSize: '18px', lineHeight: 2, color: 'var(--text-mid)', marginBottom: '16px', wordBreak: 'keep-all' }}>
              대한민국에서 가장 오래 달리고, 부담 없이 진짜답게 참여하며, 가장 자유롭게 개조할 수 있는 GT 내구레이스. 아마추어부터 프로까지 — 당신의 한계를 시험하세요.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {['끝까지 달린다', '누구나 도전한다', '한계를 넘는다'].map((txt, i) => (
                <span key={i} style={{
                  fontFamily: "'Barlow Condensed',sans-serif",
                  fontSize: '13px', fontWeight: 800, letterSpacing: '2px',
                  textTransform: 'uppercase' as const,
                  color: 'var(--red)',
                  padding: '4px 12px',
                  border: '1px solid rgba(220,0,26,0.3)',
                  background: 'rgba(220,0,26,0.06)',
                  clipPath: 'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,0 100%)',
                }}>{txt}</span>
              ))}
            </div>
            <p style={{
              fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
              fontSize: '17px', fontWeight: 800,
              color: 'var(--red)', letterSpacing: '0.5px',
              marginBottom: '32px',
            }}>
              끝까지 달린다 · 누구나 도전한다 · 한계를 넘는다
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '36px' }}>
              {steps.map((s, i) => (
                <div key={s.n} style={{
                  display: 'flex', gap: '18px', padding: '18px 0',
                  borderBottom: i < steps.length - 1 ? '1px solid var(--line)' : 'none',
                }}>
                  <div style={{
                    fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
                    fontSize: '32px', fontWeight: 900,
                    color: 'var(--red)', lineHeight: 1, minWidth: '36px',
                  }}>{s.n}</div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>{s.t}</div>
                    <div style={{ fontSize: '18px', color: 'var(--text-sub)', lineHeight: 1.7, wordBreak: 'keep-all' }}>{s.s}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/entry" className="btn-primary-red">
              <i className="fa fa-flag-checkered" />
              {isOpen ? '지금 신청하기' : '참가 신청 페이지'}
            </Link>
          </div>

          {/* 우측 — 클래스 그리드 */}
          <div>
            <div className="sec-ey" style={{ marginBottom: '16px' }}>RACE CLASSES</div>
            {classes.length === 0 ? (
              <div style={{
                padding: '40px', textAlign: 'center', color: 'var(--text-sub)',
                background: 'var(--bg-2)', border: '1px solid var(--line)',
              }}>
                <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '18px', letterSpacing: '2px' }}>
                  클래스 정보를 준비중입니다.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
                {classes.slice(0, 6).map((cls, i) => {
                  const color = cls.accentColor ?? CLASS_COLORS[cls.classCode] ?? 'var(--red)'
                  const imgUrl = (cls as any).heroImage?.asset?.url as string | undefined
                  return (
                    <Link key={cls._id} href={`/classes/${cls.slug.current}`}
                      style={{ position: 'relative', overflow: 'hidden', display: 'block', textDecoration: 'none', cursor: 'pointer' }}>
                      {/* 이미지 or 색상 배경 */}
                      <div style={{
                        width: '100%', aspectRatio: '4/3',
                        backgroundImage: imgUrl ? `url(${imgUrl})` : undefined,
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        backgroundColor: imgUrl ? undefined : 'var(--bg-4)',
                        transition: 'transform 0.5s ease',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
                      />
                      {/* 오버레이 */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                        padding: '16px',
                        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                      }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: color }} />
                        {cls.isEntryOpen && (
                          <div style={{
                            position: 'absolute', top: '10px', right: '10px',
                            fontFamily: "'Barlow Condensed',sans-serif",
                            fontSize: '16.5px', fontWeight: 800, letterSpacing: '2px',
                            textTransform: 'uppercase' as const,
                            padding: '3px 8px', background: 'var(--red)', color: 'white',
                          }}>접수중</div>
                        )}
                        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '22px', letterSpacing: '2.5px', color: 'white' }}>
                          {cls.name}
                        </div>
                        <div style={{ fontSize: '16.5px', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>
                          {cls.nameEn}
                        </div>
                        {cls.teamCount && (
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <span style={{ fontFamily: "'Pretendard Variable',Pretendard,sans-serif", fontSize: '26px', fontWeight: 900, color: 'white', letterSpacing: '-1px', lineHeight: 1 }}>{cls.teamCount}</span>
                            <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.4)' }}>팀</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      
    </section>
  )
}
