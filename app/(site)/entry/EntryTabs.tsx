'use client'
// app/(site)/entry/EntryTabs.tsx — 소스 디자인 적용 (2컬럼 레이아웃)
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
    <>
      <section className="app-section">
        <div className="app-wrap">
          {/* 좌측: 안내 */}
          <div className="app-info">
            <div className="app-info__header">
              <h2 className="app-info__title">2026 SEASON <span style={{ color: 'var(--primary-red)' }}>ENTRY</span></h2>
              <div className="app-info__slash" />
            </div>
            <h3 className="app-info__slogan">당신의 도전이 시작되는 곳,<br/>INJE GT MASTERS.</h3>
            <p className="app-info__desc">
              강원도 인제스피디움을 배경으로 펼쳐지는 아마추어 레이서들의 열정의 무대. 2026 시즌도 더욱 뜨겁게 달립니다.
            </p>

            <div className="app-info__guide">
              <h4 className="app-info__guide-title">신청 전 필수 확인사항</h4>
              <ul className="app-info__guide-list">
                {[
                  ['선착순 마감', '정원 초과 시 대기 처리됩니다.'],
                  ['차량 기술 규정', '클래스별 사전 확인 필수.'],
                  ['라이선스 사본', '드라이버 접수 시 첨부 필요.'],
                  ['취소 시 수수료', '결제 완료 후 취소 시 수수료 발생.'],
                  ['정보 기재 주의', '부정확한 정보 기재 시 출전 자격 박탈.'],
                ].map(([title, desc], i) => (
                  <li key={i}>
                    <span className="app-info__guide-icon">✓</span>
                    <span><strong>{title}</strong> — {desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="app-info__security">
              <span style={{ color: 'var(--primary-red)', fontSize: '1.2rem' }}>🛡</span>
              <div>
                <strong>SECURE REGISTRATION</strong>
                <span>제출하신 정보는 2026 시즌 운영 목적으로만 안전하게 보관됩니다.</span>
              </div>
            </div>

            {/* 문의 */}
            {(settings?.phone || settings?.email) && (
              <div className="app-info__contact">
                {settings.phone && <a href={`tel:${settings.phone}`}>{settings.phone}</a>}
                {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
              </div>
            )}
          </div>

          {/* 우측: 폼 */}
          <div className="app-form-col">
            <EntryForm isOpen={isOpen} classes={classes} rounds={rounds} initialRoundNumber={initialRoundNumber} />
          </div>
        </div>
      </section>

      <style>{`
        .app-section {
          background: radial-gradient(circle at 10% 20%, #111 0%, var(--bg-carbon, #0a0a0a) 100%);
          min-height: calc(100vh - 80px);
          padding: 60px 0 100px;
          border-top: 1px solid rgba(255,255,255,.05);
        }
        .app-wrap {
          max-width: 1300px; margin: 0 auto; padding: 0 24px;
          display: flex; gap: 60px; align-items: flex-start;
        }

        /* Left */
        .app-info { flex: 1; position: sticky; top: 100px; }
        .app-info__header { margin-bottom: 30px; }
        .app-info__title {
          font-family: var(--font-heading, 'Oswald'); font-size: 3.5rem; font-weight: 900;
          color: var(--text-primary, #fff); line-height: 1; margin: 0 0 8px;
        }
        .app-info__slash { width: 80px; height: 4px; background: var(--primary-red, #E60023); }
        .app-info__slogan {
          font-family: 'Noto Sans KR', sans-serif; font-size: 1.8rem; font-weight: 700;
          color: #ddd; line-height: 1.4; margin-bottom: 20px;
        }
        .app-info__desc {
          font-size: 1rem; color: var(--text-secondary, #aaa);
          line-height: 1.6; margin-bottom: 40px; max-width: 80%;
        }

        .app-info__guide {
          background: rgba(26,26,26,.5);
          border: 1px solid rgba(255,255,255,.05);
          border-left: 3px solid var(--primary-red);
          padding: 30px; margin-bottom: 30px;
        }
        .app-info__guide-title {
          font-family: 'Noto Sans KR', sans-serif; font-size: 1.2rem; font-weight: 700;
          color: #fff; margin: 0 0 20px;
        }
        .app-info__guide-list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 15px;
        }
        .app-info__guide-list li {
          display: flex; align-items: flex-start; gap: 12px;
          color: #ccc; font-size: .95rem; line-height: 1.5;
        }
        .app-info__guide-list li strong { color: #fff; }
        .app-info__guide-icon { color: var(--primary-red); flex-shrink: 0; margin-top: 2px; }

        .app-info__security {
          display: flex; align-items: center; gap: 15px;
          padding: 20px; background: rgba(0,0,0,.3);
          border: 1px dashed rgba(255,255,255,.1); margin-bottom: 20px;
        }
        .app-info__security strong {
          font-family: var(--font-heading); letter-spacing: 1px; color: #fff;
          display: block; margin-bottom: 4px;
        }
        .app-info__security span { font-size: .85rem; color: #888; }

        .app-info__contact {
          display: flex; flex-direction: column; gap: 6px;
        }
        .app-info__contact a {
          font-size: .88rem; font-weight: 700; color: var(--text-primary); text-decoration: none;
        }

        /* Right */
        .app-form-col { flex: 1.2; }

        @media (max-width: 992px) {
          .app-wrap { flex-direction: column; gap: 40px; }
          .app-info { position: static; }
          .app-info__title { font-size: 2.5rem; }
          .app-info__slogan { font-size: 1.3rem; }
          .app-info__desc { max-width: 100%; }
        }
      `}</style>
    </>
  )
}
