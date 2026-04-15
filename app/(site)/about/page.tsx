// app/(site)/about/page.tsx — What's INJE GT Masters
import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import styles from './AboutPage.module.css'

export const metadata: Metadata = {
  title: "What's INJE GT Masters | 인제 GT 마스터즈",
  description: '대한민국 정통 내구레이스의 자부심, 인제 GT 마스터즈 대회 소개.',
}

const BREADCRUMB = [
  { label: '인제GT마스터즈', href: '/' },
  { label: 'INJE GT MASTERS', href: '/history' },
  { label: "What's INJE GT Masters" },
]

const SECTIONS = [
  {
    label: 'ABOUT THE SERIES',
    title: "WHAT'S INJE GT MASTERS",
    body: [
      '인제GT마스터즈(INJE GT MASTERS)는 대한민국 모터스포츠의 성지인 인제스피디움에서 펼쳐지는 국내 유일의 정통 내구레이스 시리즈입니다.',
      '획일화된 규격의 레이스를 넘어 드라이버의 근성과 머신의 한계가 맞물려 돌아가는 진정한 승부의 장을 지향합니다.',
    ],
  },
  {
    label: 'CORE CONCEPT',
    title: 'UNSTOPPABLE SYNERGY',
    body: [
      "레이스는 단순히 속도만을 겨루는 게임이 아닙니다. 인제GT마스터즈의 핵심 철학은 '인간(레이서)의 의지'와 '기계(머신)의 퍼포먼스'가 하나로 결합되는 '멈출 수 없는 시너지(Unstoppable Synergy)'에 있습니다.",
      '180분이라는 극한의 시간 동안 드라이버와 미케닉, 그리고 머신이 만들어내는 완벽한 호흡은 단순한 경기를 넘어 하나의 전설을 완성합니다.',
    ],
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="WHAT'S INJE GT MASTERS"
        subtitle='대한민국 정통 내구레이스의 자부심, "전설이 시작되는 곳"'
        breadcrumb={BREADCRUMB}
      />
      <div className={styles.wrapper}>
        <div className={styles.diagonalBg} />
        <div className={styles.inner}>
          {SECTIONS.map((section) => (
            <section key={section.label} className={styles.section}>
              <p className={styles.sectionLabel}>{section.label}</p>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <div className={styles.sectionBody}>
                {section.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
