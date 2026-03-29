// components/sections/SectionSeason.tsx — v3 schedule list
import Link from 'next/link'
import type { Round } from '@/types/sanity'

interface Props { rounds: Round[] }

function getStatusClass(status: Round['status']) {
  if (status === 'entry_open') return 'is-open'
  if (status === 'upcoming')   return 'is-soon'
  return ''
}

function getStatusLabel(status: Round['status']) {
  const map: Record<string, string> = {
    entry_open: '접수 중', upcoming: '예정',
    entry_closed: '접수 마감', ongoing: '진행중', finished: '종료',
  }
  return map[status] ?? '미개방'
}

function getStatusStyle(status: Round['status']): React.CSSProperties {
  if (status === 'entry_open') return { background: 'var(--red)', color: 'white' }
  if (status === 'upcoming')   return { background: 'var(--gold-pale)', color: 'var(--gold)', border: '1px solid rgba(192,152,40,0.35)' }
  return { background: 'var(--bg-3)', color: 'var(--text-sub)', border: '1px solid var(--line)' }
}

export default function SectionSeason({ rounds }: Props) {
  return (
    <section className="sec sec-darker" id="schedule" aria-labelledby="sch-ttl">
      <div className="inner">
        <div className="sec-hd">
          <div>
            <div className="sec-ey">2026 SEASON CALENDAR</div>
            <h2 className="sec-ttl" id="sch-ttl">Race Schedule</h2>
          </div>
          <Link href="/season" className="sec-more">전체 일정</Link>
        </div>

        {rounds.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-sub)' }}>
            <i className="fa-solid fa-calendar" style={{ fontSize: '2.5rem', opacity: .25, display: 'block', marginBottom: '14px' }} />
            <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '18px', letterSpacing: '2px' }}>
              2026 시즌 일정을 준비중입니다.
            </p>
          </div>
        ) : (
          <div role="list" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {rounds.map((r) => {
              const dd  = r.dateStart ? new Date(r.dateStart) : null
              const day = dd ? dd.getDate() : '—'
              const mon = dd ? dd.toLocaleDateString('en', { month: 'short' }).toUpperCase() : '—'
              const sc  = getStatusClass(r.status)
              return (
                <Link key={r._id} href={`/season/${r.slug.current}`} role="listitem"
                  className={`sch-row ${sc}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="sch-date">
                    <div className="sch-dd">{day}</div>
                    <div className="sch-mm">{mon}</div>
                  </div>
                  <div className="sch-body">
                    <div className="sch-rnd">Round {String(r.roundNumber).padStart(2,'0')} · 2026</div>
                    <div className="sch-venue">{r.title}</div>
                    <div className="sch-tags">
                      {r.badge && (
                        <span className={`stag ${sc === 'is-open' ? 'stag-red' : sc === 'is-soon' ? 'stag-gold' : 'stag-gray'}`}>
                          {r.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="sch-meta">
                    <div className="sch-rn">R.{String(r.roundNumber).padStart(2,'0')}</div>
                    <div className="sch-rl">{r.badge ?? 'ROUND'}</div>
                  </div>
                  <div className="sch-status">
                    <span className="stts" style={getStatusStyle(r.status)}>
                      {getStatusLabel(r.status)}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
