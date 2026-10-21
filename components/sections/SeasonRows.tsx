// components/sections/SeasonRows.tsx — 시즌 일정 행 리스트 (2026·2027 Calendar 공용)
import Link from 'next/link'

export interface SeasonRow {
  key: string
  round: number
  date: string          // 예: 'APR 10 – 11'
  weekdays?: string     // 예: 'SAT – SUN'
  title: string
  note?: string
  tag?: string
  status: { label: string; tone: 'open' | 'done' | 'soon' }
  action?: { href: string; label: string; primary?: boolean }
}

const TONE: Record<SeasonRow['status']['tone'], string> = {
  open: 'bg-[#E60023] text-white',
  done: 'border border-white/15 text-white/45',
  soon: 'bg-white/[0.06] text-white/45',
}

export default function SeasonRows({ heading, rows }: { heading?: string; rows: SeasonRow[] }) {
  return (
    <>
      {heading && <div className="flex items-center gap-4 mb-10">
        <h2 className="font-['Oswald'] text-3xl md:text-4xl font-bold text-white tracking-tight whitespace-nowrap">
          {heading}
        </h2>
        <div className="h-[3px] flex-1 bg-gradient-to-r from-[#E60023] to-transparent" />
      </div>}

      <ol className="border-t border-white/10">
        {rows.map(r => (
          <li key={r.key}
            className="grid grid-cols-[auto_1fr] md:grid-cols-[110px_190px_1fr_auto] items-center gap-x-5 gap-y-2 py-6 md:py-7 border-b border-white/10 hover:bg-white/[0.03] transition-colors px-2 md:px-4">

            {/* 라운드 */}
            <div className="row-span-2 md:row-span-1 flex md:block items-center">
              <span className="font-['Oswald'] text-xs tracking-[.2em] text-white/40 block">ROUND</span>
              <span className="font-['Oswald'] text-4xl md:text-5xl font-bold text-[#E60023] leading-none">
                {String(r.round).padStart(2, '0')}
              </span>
            </div>

            {/* 날짜 */}
            <div>
              <div className="font-['Oswald'] text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight">{r.date}</div>
              {r.weekdays && <div className="font-['Oswald'] text-xs tracking-[.18em] text-white/40 mt-1">{r.weekdays}</div>}
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
              {r.note && <p className="text-sm text-white/55 mt-1">{r.note}</p>}
            </div>

            {/* 장소 · 상태 · 버튼 */}
            <div className="col-start-2 md:col-start-auto flex flex-wrap md:flex-col md:items-end items-center gap-3 md:gap-1.5">
              <span className="flex items-center gap-2 font-['Oswald'] text-xs tracking-[.16em] text-white/60">
                <span className="w-1.5 h-1.5 bg-[#E60023] inline-block" />
                INJE SPEEDIUM
              </span>
              <span className={`font-['Oswald'] text-[11px] tracking-[.16em] px-2 py-0.5 ${TONE[r.status.tone]}`}>
                {r.status.label}
              </span>
              {r.action && (
                <Link href={r.action.href}
                  className={`font-['Oswald'] text-xs tracking-[.14em] px-3 py-1.5 mt-0 md:mt-1 transition-colors whitespace-nowrap ${
                    r.action.primary
                      ? 'bg-[#E60023] hover:bg-[#c0001d] text-white'
                      : 'border border-white/30 text-white hover:bg-white hover:text-[#0a0a0a]'
                  }`}>
                  {r.action.label} →
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </>
  )
}
