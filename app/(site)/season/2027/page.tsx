// app/(site)/season/2027/page.tsx — 2027 시즌 캘린더 (공표 일정, 행 리스트형)
// 출처: 2026-10-11 보도자료 「인제 GT 마스터즈, 2027시즌 확 바뀐다」 (/media/news/season-2027)
import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity.client'
import { SITE_SETTINGS_QUERY } from '@/lib/queries'
import type { SiteSettings } from '@/types/sanity'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: '2027 Calendar',
  description: '인제 GT 마스터즈 2027 시즌 라운드 일정 — 4월 10일 개막, 람보르기니 슈퍼 트로페오 동시 개최, 나이트 레이스, 4시간 레이스, 10월 최종전.',
}

interface Round2027 {
  round: number
  month: string
  days: string
  weekdays: string
  title: string
  note: string
  tag?: string
}

const ROUNDS_2027: Round2027[] = [
  { round: 1, month: 'APR', days: '10 – 11', weekdays: 'SAT – SUN', title: '개막전', note: '2027 시즌의 시작' },
  { round: 2, month: 'MAY', days: '14 – 16', weekdays: 'FRI – SUN', title: '람보르기니 슈퍼 트로페오 동시 개최', note: 'GT 내구레이스와 슈퍼카 원메이크 레이스를 한 라운드에서', tag: 'SUPER TROFEO' },
  { round: 3, month: 'AUG', days: '14', weekdays: 'SAT', title: '나이트 레이스', note: '해가 진 뒤 조명 아래에서 달리는 레이스', tag: 'NIGHT' },
  { round: 4, month: 'SEP', days: '03 – 04', weekdays: 'FRI – SAT', title: '4시간 레이스', note: '기존 3시간보다 1시간 늘어난 내구 레이스', tag: '4 HOURS' },
  { round: 5, month: 'OCT', days: '16 – 17', weekdays: 'SAT – SUN', title: '최종전', note: '2027 시즌 챔피언 결정', tag: 'FINAL' },
]

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

          <div className="flex items-center gap-4 mb-10">
            <h2 className="font-['Oswald'] text-3xl md:text-4xl font-bold text-white tracking-tight whitespace-nowrap">
              SEASON 2027 SCHEDULE
            </h2>
            <div className="h-[3px] flex-1 bg-gradient-to-r from-[#E60023] to-transparent" />
          </div>

          <ol className="border-t border-white/10">
            {ROUNDS_2027.map(r => (
              <li key={r.round}
                className="group grid grid-cols-[auto_1fr] md:grid-cols-[110px_190px_1fr_auto] items-center gap-x-5 gap-y-2 py-6 md:py-7 border-b border-white/10 hover:bg-white/[0.03] transition-colors px-2 md:px-4">

                {/* 라운드 */}
                <div className="row-span-2 md:row-span-1 flex md:block items-center">
                  <span className="font-['Oswald'] text-xs tracking-[.2em] text-white/40 block">ROUND</span>
                  <span className="font-['Oswald'] text-4xl md:text-5xl font-bold text-[#E60023] leading-none">
                    {String(r.round).padStart(2, '0')}
                  </span>
                </div>

                {/* 날짜 */}
                <div>
                  <div className="font-['Oswald'] text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight">
                    {r.month} {r.days}
                  </div>
                  <div className="font-['Oswald'] text-xs tracking-[.18em] text-white/40 mt-1">{r.weekdays}</div>
                </div>

                {/* 내용 */}
                <div className="col-start-2 md:col-start-auto min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg md:text-xl font-bold text-white">{r.title}</h3>
                    {r.tag && (
                      <span className="font-['Oswald'] text-[11px] tracking-[.14em] px-2 py-0.5 border border-[#E60023]/60 text-[#ff4d6a]">
                        {r.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/55 mt-1">{r.note}</p>
                </div>

                {/* 장소 · 상태 */}
                <div className="col-start-2 md:col-start-auto flex md:flex-col md:items-end items-center gap-3 md:gap-1.5">
                  <span className="flex items-center gap-2 font-['Oswald'] text-xs tracking-[.16em] text-white/60">
                    <span className="w-1.5 h-1.5 bg-[#E60023] inline-block" />
                    INJE SPEEDIUM
                  </span>
                  <span className="font-['Oswald'] text-[11px] tracking-[.16em] text-white/45 bg-white/[0.06] px-2 py-0.5">
                    UPCOMING
                  </span>
                </div>
              </li>
            ))}
          </ol>

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
