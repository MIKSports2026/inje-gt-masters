'use client'
// app/(site)/entry/EntryTabs.tsx — 신청 폼만 표시 (탭 제거)
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

export default function EntryTabs({ isOpen, classes, rounds, settings, initialRoundNumber }: Props) {
  return (
    <section className="section">
      <div className="container">
        <div className="entry-form-grid">
          <EntryForm isOpen={isOpen} classes={classes} rounds={rounds} initialRoundNumber={initialRoundNumber} />

          {/* 우측: 안내사항 */}
          <div style={{ display: 'grid', gap: '16px' }}>
            {/* 참가 절차 */}
            <div style={{ background: 'var(--bg-carbon-light, #1a1a1a)', border: '1px solid rgba(255,255,255,.06)', padding: '22px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,var(--primary-red, #E60023),rgba(230,0,35,.35) 35%,transparent 75%)' }} />
              <h3 style={{ marginBottom: '16px', fontFamily: "'Oswald',sans-serif", fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>참가 신청 절차</h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                {[
                  { n: '01', title: '신청서 작성', desc: '클래스·라운드·드라이버 정보 입력' },
                  { n: '02', title: '결제 링크 수신', desc: '이메일로 토스페이먼츠 링크 발송 (1~2 영업일)' },
                  { n: '03', title: '결제 완료', desc: '카드·계좌이체·토스 결제' },
                  { n: '04', title: '접수 확정', desc: '확정 메일 수신 후 출전 준비' },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'start', padding: '10px', background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.04)' }}>
                    <span style={{ fontSize: '.7rem', color: 'var(--primary-red)', fontWeight: 900, fontFamily: "'Oswald',sans-serif" }}>STEP {s.n}</span>
                    <div>
                      <strong style={{ fontSize: '.88rem', color: 'var(--text-primary)' }}>{s.title}</strong>
                      <span style={{ display: 'block', fontSize: '.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>{s.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 문의 */}
            <div style={{ background: 'var(--bg-carbon-light, #1a1a1a)', border: '1px solid rgba(255,255,255,.06)', padding: '18px' }}>
              <h3 style={{ fontSize: '.9rem', fontFamily: "'Oswald',sans-serif", fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>신청 문의</h3>
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '.88rem', fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none', marginBottom: 6 }}>
                  <i className="fa-solid fa-phone" style={{ color: 'var(--primary-red)' }} /> {settings.phone}
                </a>
              )}
              {settings?.email && (
                <a href={`mailto:${settings.email}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '.88rem', fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none' }}>
                  <i className="fa-solid fa-envelope" style={{ color: 'var(--primary-red)' }} /> {settings.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
