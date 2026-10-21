// app/(site)/season/2027/page.tsx — 2027 시즌 캘린더 (공표 일정, 행 리스트형)
// 출처: 2026-10-11 보도자료 「인제 GT 마스터즈, 2027시즌 확 바뀐다」 (/media/news/season-2027)
import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity.client'
import { SITE_SETTINGS_QUERY } from '@/lib/queries'
import type { SiteSettings } from '@/types/sanity'
import PageHero from '@/components/ui/PageHero'
import SeasonRows from '@/components/sections/SeasonRows'
import { ROUNDS_2027 } from '@/lib/season2027'

export const metadata: Metadata = {
  title: '2027 Calendar',
  description: '인제 GT 마스터즈 2027 시즌 라운드 일정 — 4월 10일 개막, 람보르기니 슈퍼 트로페오 동시 개최, 나이트 레이스, 4시간 레이스, 10월 최종전.',
}


export default async function Season2027Page() {
  const settings = await sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY }).catch(() => null)

  return (
    <>
      <PageHero
        image={(settings as SiteSettings | null)?.heroSeason}
        badge="2027 Season"
        title="2027 Calendar"
        subtitle="더 새로워진 레이스로 돌아옵니다"
      >
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/season" className="px-4 py-2 border border-white/20 text-white/70 hover:text-white hover:border-white/50 text-sm font-bold tracking-wide transition-colors">
            2026
          </Link>
          <span className="px-4 py-2 bg-[#E60023] text-white text-sm font-bold tracking-wide">2027</span>
        </div>
      </PageHero>

      <section className="bg-[#0a0a0a] py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <SeasonRows heading="SEASON 2027 SCHEDULE" rows={ROUNDS_2027} />

          <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <p className="text-sm text-white/45 leading-relaxed">
              ※ 2026년 10월 11일 공표 일정 기준이며, 세부 일정과 타임테이블은 추후 공지됩니다.<br className="hidden md:block" />
              참가 신청 일정도 별도로 안내드립니다.
            </p>
            <Link href="/media/news/season-2027"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E60023] hover:bg-[#c0001d] text-white font-bold transition-colors whitespace-nowrap">
              2027 시즌 변경 사항 보기
              <i className="fa-solid fa-arrow-right text-sm" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
