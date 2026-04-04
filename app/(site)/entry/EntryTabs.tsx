'use client'
// app/(site)/entry/EntryTabs.tsx — 2컬럼 레이아웃 (CSS 파일 분리)
import './entry.css'
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
                ['접수 안내', '선착순으로 마감되며, 정원 초과 시에는 대기 순번으로 안내해 드립니다.'],
                ['차량 확인', '원활한 검차를 위해 클래스별 차량 기술 규정을 미리 확인해 주시기 바랍니다.'],
                ['취소 안내', '결제 완료 후 취소하실 경우 소정의 수수료가 발생할 수 있으니 신중한 결정 부탁드립니다.'],
                ['정보 확인', '정확한 경기 운영을 위해 신청 정보를 다시 한번 확인해 주세요. (정보가 다를 경우 출전이 어려울 수 있습니다.)'],
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
  )
}
