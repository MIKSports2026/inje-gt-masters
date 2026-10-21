// app/(site)/season/page.tsx — 2026 시즌 캘린더 (라운드 일정 행 리스트)
import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity.client'
import { SITE_SETTINGS_QUERY, ROUNDS_QUERY } from '@/lib/queries'
import type { SiteSettings, Round } from '@/types/sanity'
import PageHero from '@/components/ui/PageHero'
import SeasonRows, { type SeasonRow } from '@/components/sections/SeasonRows'
import { ENTRY_CLOSED, ENTRY_CLOSED_TEXT_EN } from '@/lib/config'

// 라운드별 Masters 1 결승 우승팀 (행 설명용)
const M1_WINNERS_QUERY = /* groq */`
  *[_type == "result" && raceType == "race" && classInfo._ref == "class-masters-1" && round->season == $season]{
    "round": round->roundNumber,
    "team": standings[position == 1][0].teamName
  }`

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
const DAYS = ['SUN','MON','TUE','WED','THU','FRI','SAT']

// 'YYYY-MM-DD' 문자열을 서버 시간대와 무관하게 해석
function parseDay(s?: string) {
  const m = s?.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return null
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  return { label: `${MONTHS[mo - 1]} ${String(d).padStart(2, '0')}`, weekday: DAYS[new Date(Date.UTC(y, mo - 1, d)).getUTCDay()] }
}

function toRow(r: Round, winner?: string): SeasonRow {
  const d = parseDay(r.dateStart)
  const st = r.status ?? 'upcoming'
  const n = r.roundNumber
  const title = n === 1 ? '개막전' : n === 5 ? '최종전' : `${n}라운드`
  const status: SeasonRow['status'] =
    st === 'entry_open' ? { label: 'ENTRY OPEN', tone: 'open' }
    : st === 'finished' ? { label: 'COMPLETED', tone: 'done' }
    : st === 'entry_closed' ? { label: 'ENTRY CLOSED', tone: 'done' }
    : st === 'ongoing' ? { label: 'ON TRACK', tone: 'open' }
    : { label: 'UPCOMING', tone: 'soon' }
  const action: SeasonRow['action'] =
    st === 'entry_open' ? { href: `/entry?tab=apply&round=R${n}`, label: 'APPLY NOW', primary: true }
    : st === 'finished' ? { href: `/results?round=${r.slug.current}`, label: 'VIEW RESULTS' }
    : undefined
  return {
    key: r._id, round: n,
    date: d?.label ?? '—',
    weekdays: d?.weekday,
    title,
    note: winner ? `MASTERS 1 우승 · ${winner}` : undefined,
    status, action,
  }
}

export const metadata: Metadata = {
  title: '2026 Calendar',
  description: '인제 GT 마스터즈 2026 시즌 라운드 일정, 클래스 소개, 포인트 시스템, 규정 안내.',
}

export default async function SeasonPage() {
  const [settings, rounds, winners] = await Promise.all([
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY }).catch(() => null),
    sanityFetch<Round[]>({ query: ROUNDS_QUERY, params: { season: 2026 }, revalidate: 300 }).catch(() => [] as Round[]),
    sanityFetch<{ round: number; team?: string }[]>({ query: M1_WINNERS_QUERY, params: { season: 2026 }, revalidate: 300 }).catch(() => []),
  ])

  const winnerByRound = new Map((winners ?? []).map(w => [w.round, w.team]))
  const rows = (rounds as Round[]).map(r => toRow(r, winnerByRound.get(r.roundNumber)))
  // 시즌 전 라운드 종료 → 참가 신청 버튼·CTA 대신 결과 안내
  const seasonOver = (rounds as Round[]).length > 0 && (rounds as Round[]).every(r => r.status === 'finished')
  const closed = ENTRY_CLOSED || seasonOver

  return (
    <>
      {/* ── 히어로 ──────────────────────────────────────────── */}
      <PageHero
        image={(settings as SiteSettings | null)?.heroSeason}
        badge="2026 Season"
        title="2026 Calendar"
        subtitle="레이서의 근성과 머신의 한계가 만나는 곳"
      >
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="px-4 py-2 bg-[#E60023] text-white text-sm font-bold tracking-wide">2026</span>
          <Link href="/season/2027" className="px-4 py-2 border border-white/20 text-white/70 hover:text-white hover:border-white/50 text-sm font-bold tracking-wide transition-colors">
            2027
          </Link>
        </div>
        <div style={{ marginTop: '20px' }}>
          {seasonOver ? (
            <Link href="/results" className="btn btn-primary">
              <i className="fa-solid fa-trophy" />
              2026 SEASON RESULTS
            </Link>
          ) : (
            <Link
              href={ENTRY_CLOSED ? '/season' : '/entry'}
              className="btn btn-primary"
              aria-disabled={ENTRY_CLOSED}
              style={ENTRY_CLOSED ? { pointerEvents: 'none', opacity: 0.5 } : undefined}
            >
              <i className="fa-solid fa-flag-checkered" />
              {ENTRY_CLOSED ? ENTRY_CLOSED_TEXT_EN : '2026 Register'}
            </Link>
          )}
        </div>
      </PageHero>

      {/* ── 라운드 일정 (행 리스트) ───────────────────────── */}
      <section className="bg-[#0a0a0a] py-16 md:py-24" id="schedule">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <SeasonRows heading="SEASON 2026 SCHEDULE" rows={rows} />
        </div>
      </section>


{/* ── CTA ──────────────────────────────────────────────── */}
      {!closed && (
        <section style={{ background: 'linear-gradient(135deg,#111,#1a0008)', padding: '64px 0' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem,3vw,2.6rem)', marginBottom: '14px' }}>Where Legends Begin</h2>
            <p style={{ color: 'rgba(255,255,255,.65)', marginBottom: '28px', fontSize: 'clamp(.9rem,1.4vw,1.06rem)' }}>
              2026 인제 GT 마스터즈 — 지금 참가를 신청하세요.
            </p>
            <div className="btns" style={{ justifyContent: 'center' }}>
              <Link href="/entry" className="btn btn-primary" style={{ fontSize: '1.05rem', minHeight: '56px' }}>
                <i className="fa-solid fa-flag-checkered" />
                Register
              </Link>
              <Link href="/results" className="btn btn-ghost">
                경기 결과 보기
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
