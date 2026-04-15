// app/(site)/entry/rules/page.tsx — 규정 안내 (서버 컴포넌트)
import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import styles from './RulesPage.module.css'

export const metadata: Metadata = {
  title: '규정 | 인제 GT 마스터즈',
  description: '인제 GT 마스터즈 스포팅 규정, 기술 규정, 페널티 및 포인트 시스템 안내.',
}

const BREADCRUMB = [
  { label: '인제GT마스터즈', href: '/' },
  { label: 'ENTRY', href: '/entry' },
  { label: '규정' },
]

const SECTIONS = [
  {
    num: '01',
    title: 'SPORTING REGULATION',
    subtitle: '180분간의 사투를 지배하기 위한 전략적 가이드라인입니다.',
    rows: [
      { label: '경기 형식', value: '180분 내구레이스 / 인제스피디움 (3.908km)' },
      { label: '의무 피트스톱', value: '3회 (드라이버 교체 필수)' },
      { label: '피트스톱 시간', value: '5분 이상 / 피트레인 입구~출구 계측선 기준' },
      { label: '피트 윈도우', value: '레이스 시작 30분 후 ~ 종료 30분 전' },
      { label: '스타트 방식', value: '롤링 스타트 원칙 / 레이스 디렉터 결정에 따라 스탠딩 스타트 가능' },
      { label: '드라이버 제한', value: '최소 40분 / 최대 80분 (2인 팀 100분) / 1회 스틴트 50분 이하 · 스틴트 후 휴식 30분 필수' },
    ],
  },
  {
    num: '02',
    title: 'TECHNICAL REGULATION',
    subtitle: "'오픈 엔지니어링'의 가치를 실현하면서도 안전과 공정성을 지키기 위한 기준입니다.",
    rows: [
      { label: '공통 타이어', value: '금호타이어 ECSTA V730 (IGMOC 지정 단일 타이어)' },
      { label: 'BoP', value: '주행 데이터 기반 성능 조정 / 최저 지상고 변경 또는 추가 웨이트' },
      { label: '안전벨트', value: 'FIA 8853-2016 규격 6점식 이상' },
      { label: '소화기', value: '3kg 이상, 조수석 발판 고정' },
      { label: '개인 안전 장구', value: '헬멧 · 슈트 · HANS — FIA 공인, 유효기간 내' },
      { label: '롤케이지', value: 'Masters 1: 6점식 이상 의무 / 기타 클래스: 4점식 이상 의무 (6점식 권장)' },
      { label: '소음 규정', value: '최대 100dB (전 클래스 공통)' },
    ],
  },
  {
    num: '03',
    title: 'PENALTY & POINT SYSTEM',
    subtitle: '공정하고 신사적인 레이싱을 위한 장치입니다.',
    rows: [
      { label: '페널티 종류', value: '드라이브스루 · 스톱&고 · 타임 페널티 / 위반 정도에 따라 차등 부과' },
      { label: '누적 벌점', value: '시즌 10점 도달 시 차기 라운드 출전 정지' },
      { label: '결승 포인트', value: '1위 25pt ~ 10위 1pt / 완주 보너스 +3pt 추가' },
      { label: '예선 포인트', value: '1위 3pt · 2위 2pt · 3위 1pt' },
    ],
  },
]

export default function RulesPage() {
  return (
    <>
      <PageHero
        title="RULES & REGULATIONS"
        subtitle="REGULATION: THE RULES OF ENGAGEMENT"
        breadcrumb={BREADCRUMB}
      />
      <div className={styles.wrapper}>
        <div className={styles.diagonalBg} />
        <div className={styles.inner}>
          {SECTIONS.map((section) => (
            <section key={section.num} className={styles.section}>
              <p className={styles.sectionNum}>{section.num}</p>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <p className={styles.sectionSubtitle}>{section.subtitle}</p>
              <div className={styles.specRows}>
                {section.rows.map((row) => (
                  <div key={row.label} className={styles.specRow}>
                    <span className={styles.specRowLabel}>{row.label}</span>
                    <span className={styles.specRowValue}>{row.value}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
