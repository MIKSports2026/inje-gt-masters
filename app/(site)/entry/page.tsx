// app/(site)/entry/page.tsx — 참가신청 페이지 (3탭 구조)
// R2 접수 오픈 시 ENTRY_CLOSED = false 로 변경하면 기존 폼 복구
const ENTRY_CLOSED = true

export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity.client'
import { SITE_SETTINGS_QUERY, CLASSES_QUERY, ROUNDS_QUERY } from '@/lib/queries'
import type { SiteSettings, ClassInfo, Round } from '@/types/sanity'
import EntryTabs from './EntryTabs'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: 'Register',
  description: '인제 GT 마스터즈 2026 시즌 온라인 참가 신청. Masters 1·Masters 2·Masters N·Masters 3·Masters N-evo 클래스 선착순 접수.',
  openGraph: {
    title: 'Register | 인제 GT 마스터즈 2026',
    description: '2026 시즌 온라인 Register — 신청 후 담당자 검토 및 결제 링크 발송',
  },
}

const FAQ = [
  { q: 'Register 후 취소·환불이 가능한가요?', a: '대회 30일 전까지 전액 환불, 7~29일 전 50%, 7일 이내는 환불이 불가합니다. 취소는 운영 이메일로 접수해 주세요.' },
  { q: '드라이버 2인 교대 규정이 있나요?', a: 'GT1·GT2는 2인 이상 드라이버 교대가 필수입니다. GT3·드리프트·바이크·슈퍼카는 단독 출전도 가능합니다.' },
  { q: '차량은 어떻게 준비하나요?', a: '자차 지참 또는 팀 소속 차량으로 출전합니다. 클래스별 기술 규정 PDF를 반드시 사전에 확인하세요.' },
  { q: '국제 라이선스가 필요한가요?', a: 'GT1은 국내 A등급 이상, GT2·GT3는 B등급 이상이 필요합니다. 드리프트·바이크·슈퍼카는 클래스별 별도 자격 규정을 확인하세요.' },
  { q: '결제는 어떻게 진행되나요?', a: '신청 접수 후 담당자가 내용을 검토하여 1~2 영업일 이내 결제 링크를 이메일로 발송합니다. 토스페이먼츠를 통해 카드·계좌이체·토스로 안전하게 결제할 수 있습니다.' },
]

export default async function EntryPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; round?: string }>
}) {
  const { tab: tabParam, round: roundParam } = await searchParams
  const initialTab = (['apply', 'classes', 'regulations'] as const).find(t => t === tabParam)
  const initialRoundNumber = roundParam ? parseInt(roundParam.replace(/^R/i, ''), 10) || undefined : undefined

  const [settings, classes, rounds] = await Promise.all([
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, useCdn: false }),
    sanityFetch<ClassInfo[]>({ query: CLASSES_QUERY, useCdn: false, revalidate: false }),
    sanityFetch<Round[]>({ query: ROUNDS_QUERY, params: { season: 2026 }, useCdn: false }),
  ]).catch(() => [null, [], []] as [SiteSettings | null, ClassInfo[], Round[]])

  const s = settings as SiteSettings | null
  const isOpen = s?.isEntryOpen ?? true

  return (
    <>
      <PageHero
        image={s?.heroEntry}
        badge={ENTRY_CLOSED ? '접수 마감' : '2026 Season Entry'}
        title="Register"
        subtitle="당신의 도전이 시작되는 곳, 인제 GT 마스터즈."
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          marginTop: '20px', padding: '10px 18px',
          background: ENTRY_CLOSED ? 'rgba(230,0,35,.10)' : (isOpen ? 'rgba(34,197,94,.12)' : 'rgba(230,0,35,.10)'),
          border: `1px solid ${ENTRY_CLOSED ? 'rgba(230,0,35,.3)' : (isOpen ? 'rgba(34,197,94,.3)' : 'rgba(230,0,35,.3)')}`,
          borderRadius: '6px', color: ENTRY_CLOSED ? '#ff6b6b' : (isOpen ? '#4ade80' : '#ff6b6b'),
          fontSize: '.9rem', fontWeight: 800,
        }}>
          <i className={`fa-solid ${ENTRY_CLOSED ? 'fa-ban' : (isOpen ? 'fa-circle-check' : 'fa-clock')}`} />
          {ENTRY_CLOSED ? '1라운드 접수가 마감되었습니다.' : (isOpen ? '현재 Register 접수 중입니다.' : (s?.entryNotice ?? 'Register 일정을 준비 중입니다.'))}
        </div>
      </PageHero>

      {ENTRY_CLOSED ? (
        <section className="max-w-2xl mx-auto px-6 py-20 text-center">
          <div className="border border-[#E60023]/30 bg-[#E60023]/5 rounded-xl p-10">
            <h2 className="font-['Oswald'] text-3xl font-bold text-white tracking-tight mb-4">
              2026 시즌 1라운드 접수 마감
            </h2>
            <p className="text-gray-300 leading-relaxed mb-2">
              1라운드(2026.04.26) 참가 신청이 종료되었습니다.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              2라운드 이후 접수 일정은 추후 별도 공지 예정입니다.
            </p>
            <a
              href="mailto:miksports2026@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E60023] hover:bg-[#cc001f] text-white font-bold rounded-lg transition-colors"
            >
              <i className="fa-solid fa-envelope" />
              운영팀 문의
            </a>
          </div>
        </section>
      ) : (
        <EntryTabs
          isOpen={isOpen}
          classes={classes as ClassInfo[]}
          rounds={rounds as Round[]}
          settings={s}
          faq={FAQ}
          initialTab={initialTab}
          initialRoundNumber={initialRoundNumber}
        />
      )}
    </>
  )
}
