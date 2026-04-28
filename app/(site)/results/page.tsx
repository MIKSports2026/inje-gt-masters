// app/(site)/results/page.tsx — 경기 결과 & 랭킹
import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity.client'
import { SITE_SETTINGS_QUERY, ROUNDS_QUERY } from '@/lib/queries'
import type { SiteSettings, Round } from '@/types/sanity'
import PageHero from '@/components/ui/PageHero'
import ResultsClient from './ResultsClient'
import type { RoundResult, TeamStanding, DriverStanding } from './ResultsClient'

export const metadata: Metadata = {
  title: 'Results',
  description: '인제 GT 마스터즈 2026 시즌 경기 결과, 순위표. 라운드별 결과 및 포인트 현황을 확인하세요.',
}

/** 2026 시즌 공개된 모든 결과 */
const ALL_SEASON_RESULTS_QUERY = /* groq */`
  *[_type == "result" && isPublished == true && round->season == 2026]
  | order(round->roundNumber asc){
    _id, raceType,
    "roundNumber": round->roundNumber,
    "classCode":   classInfo->classCode,
    standings[]{
      position, carNumber, teamName, driver1, driver2, driver3,
      laps, totalTime, gap, fastestLap, points, status
    },
    championshipStandings[]{
      position, carNumber, teamName, driver1, driver2, totalPoints
    }
  }
`

/** 2026 시즌 팀 스탠딩 */
const TEAM_STANDINGS_QUERY = /* groq */`
  *[_type == "teamStanding" && isPublished == true && season == 2026] {
    _id, season,
    "classCode": classInfo->classCode,
    entries[]{ position, carNumber, teamName, drivers, totalPoints }
  }
`

/** 2026 시즌 드라이버 스탠딩 */
const DRIVER_STANDINGS_QUERY = /* groq */`
  *[_type == "driverStanding" && isPublished == true && season == 2026] {
    _id, season,
    "classCode": classInfo->classCode,
    entries[]{ position, driverName, carNumber, teamName, totalPoints }
  }
`

export default async function ResultsPage() {
  const [siteSettings, rounds, allResults, teamStandings, driverStandings] = await Promise.all([
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, useCdn: false }).catch(() => null),
    sanityFetch<Round[]>({ query: ROUNDS_QUERY, params: { season: 2026 }, revalidate: 300, useCdn: false }).catch(() => [] as Round[]),
    sanityFetch<RoundResult[]>({ query: ALL_SEASON_RESULTS_QUERY, revalidate: 300, useCdn: false }).catch(() => [] as RoundResult[]),
    sanityFetch<TeamStanding[]>({ query: TEAM_STANDINGS_QUERY, revalidate: 300, useCdn: false }).catch(() => [] as TeamStanding[]),
    sanityFetch<DriverStanding[]>({ query: DRIVER_STANDINGS_QUERY, revalidate: 300, useCdn: false }).catch(() => [] as DriverStanding[]),
  ])

  return (
    <>
      <PageHero
        image={(siteSettings as SiteSettings | null)?.heroResults}
        badge="SEASON 2026"
        title="RESULTS"
        subtitle="2026 시즌 라운드별 · 누적 결과"
      />

      <section className="section">
        <div className="container">
          <ResultsClient
            rounds={(rounds ?? []) as Round[]}
            allResults={(allResults ?? []) as RoundResult[]}
            teamStandings={(teamStandings ?? []) as TeamStanding[]}
            driverStandings={(driverStandings ?? []) as DriverStanding[]}
          />
        </div>
      </section>
    </>
  )
}
