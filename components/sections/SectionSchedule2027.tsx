// components/sections/SectionSchedule2027.tsx — Home: 2027 시즌 일정 (행 리스트)
import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import SeasonRows from '@/components/sections/SeasonRows'
import { ROUNDS_2027 } from '@/lib/season2027'

export default function SectionSchedule2027() {
  return (
    <section className="bg-[#0a0a0a] py-16 md:py-20" id="rounds">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <SectionHeader subtitle="2027 SEASON" title="RACE SCHEDULE" />
        <SeasonRows rows={ROUNDS_2027} />
        <div className="mt-8 flex flex-wrap gap-3 justify-end">
          <Link href="/results"
            className="font-['Oswald'] text-sm tracking-[.12em] px-5 py-3 border border-white/30 text-white hover:bg-white hover:text-[#0a0a0a] transition-colors">
            2026 SEASON RESULTS →
          </Link>
          <Link href="/season/2027"
            className="font-['Oswald'] text-sm tracking-[.12em] px-5 py-3 bg-[#E60023] hover:bg-[#c0001d] text-white transition-colors">
            2027 FULL SCHEDULE →
          </Link>
        </div>
      </div>
    </section>
  )
}
