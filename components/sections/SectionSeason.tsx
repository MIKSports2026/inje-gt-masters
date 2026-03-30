'use client'
import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import type { Round } from '@/types/sanity'

const SL: Record<string,{text:string;bg:string;color:string}> = {
  upcoming:     {text:'예정',    bg:'rgba(59,130,246,.08)',  color:'#3b82f6'},
  entry_open:   {text:'접수중',  bg:'rgba(34,197,94,.08)',   color:'#16a34a'},
  entry_closed: {text:'접수마감',bg:'rgba(245,158,11,.08)',  color:'#d97706'},
  ongoing:      {text:'진행중',  bg:'rgba(230,0,35,.08)',    color:'var(--red)'},
  finished:     {text:'종료',   bg:'rgba(107,114,128,.08)', color:'#6b7280'},
}

const cut12 = 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)'

export default function SectionSeason({ rounds }: { rounds: Round[] }) {
  const list = rounds

  return (
    <section className="section" id="season">
      <div className="container">
        <div className="season-grid" style={{display:'grid',gridTemplateColumns:'1.05fr .95fr',gap:'20px',alignItems:'start'}}>

          {/* 왼쪽: 라운드 리스트 */}
          <RevealOnScroll className="panel" style={{padding:'28px'} as any}>
            <span className="eyebrow">Season</span>
            <h2 style={{marginBottom:'8px'}}>2026 시즌 — 연간 4라운드</h2>
            <p className="lead" style={{marginBottom:'24px'}}>
              강원도 인제스피디움에서 펼쳐지는 2026 인제 GT 마스터즈 공식 일정.
            </p>

            {list.length === 0 && (
              <div style={{textAlign:'center',padding:'32px 0',color:'var(--muted)'}}>
                <i className="fa-solid fa-calendar-xmark" style={{fontSize:'2.5rem',opacity:.3,display:'block',marginBottom:'12px'}} />
                <p style={{fontSize:'.92rem'}}>시즌 일정을 준비중입니다.</p>
              </div>
            )}
            <div style={{display:'grid',gap:'14px'}}>
              {list.map((r,i)=>{
                const sl = SL[r.status] ?? SL.upcoming
                return (
                  <RevealOnScroll key={r._id} delay={(i%4) as 0|1|2|3}>
                    <Link href={`/season/${r.slug.current}`} style={{
                      display:'grid',gridTemplateColumns:'auto 1fr auto',gap:'14px',
                      alignItems:'center',padding:'18px',
                      background:'#fff',border:'1px solid var(--line)',
                      clipPath:cut12,transition:'.2s ease',
                      textDecoration:'none',
                    }}
                    onMouseEnter={e=>(e.currentTarget.style.borderColor='rgba(230,0,35,.4)')}
                    onMouseLeave={e=>(e.currentTarget.style.borderColor='var(--line)')}>

                      {/* 라운드 번호 */}
                      <div style={{
                        width:'54px',height:'54px',display:'grid',placeItems:'center',
                        background:'rgba(230,0,35,.08)',color:'var(--red)',
                        border:'1px solid rgba(230,0,35,.18)',fontWeight:900,fontSize:'1.1rem',
                        clipPath:cut12,
                      }}>
                        R{r.roundNumber}
                      </div>

                      <div>
                        <strong style={{display:'block',fontWeight:900}}>
                          {r.dateStart}
                          {r.badge && (
                            <span style={{marginLeft:'8px',fontSize:'.72rem',padding:'2px 8px',background:'rgba(230,0,35,.1)',color:'var(--red)',borderRadius:'3px',fontWeight:900}}>
                              {r.badge}
                            </span>
                          )}
                        </strong>
                        <span style={{display:'block',color:'var(--muted)',fontSize:'.92rem',marginTop:'2px'}}>
                          {r.title} · 인제스피디움
                        </span>
                      </div>

                      <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'6px'}}>
                        <span style={{
                          padding:'4px 12px',fontSize:'.78rem',fontWeight:900,
                          background:sl.bg,color:sl.color,
                          border:`1px solid ${sl.color}33`,
                          clipPath:'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)',
                        }}>{sl.text}</span>
                        {r.hasResults && (
                          <span style={{fontSize:'.8rem',color:'var(--muted)'}}>
                            <i className="fa-solid fa-chart-bar" style={{marginRight:'4px'}} />결과 보기
                          </span>
                        )}
                      </div>
                    </Link>
                  </RevealOnScroll>
                )
              })}
            </div>
          </RevealOnScroll>

          {/* 오른쪽: 비주얼 + 클래스 요약 */}
          <div style={{display:'grid',gap:'16px',position:'sticky',top:'calc(var(--header-h) + 16px)'}}>
            {/* 시즌 비주얼 */}
            <RevealOnScroll delay={1} style={{
              minHeight:'260px',position:'relative',overflow:'hidden',color:'#fff',
              clipPath:'polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,0 100%)',
              background:'linear-gradient(120deg,rgba(17,17,17,.12),rgba(17,17,17,.72)),url("https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1500&q=80") center/cover no-repeat',
              borderRadius:'10px',
            } as any}>
              <div style={{position:'absolute',left:0,top:0,width:'100%',height:'2px',background:'linear-gradient(90deg,rgba(230,0,35,1),rgba(230,0,35,.3),transparent 72%)'}} />
              <div style={{position:'absolute',left:'24px',right:'24px',bottom:'24px'}}>
                <span style={{fontSize:'.78rem',fontWeight:900,letterSpacing:'.14em',textTransform:'uppercase',color:'rgba(255,255,255,.7)',display:'block',marginBottom:'6px'}}>2026 SEASON</span>
                <h3 style={{color:'#fff',marginBottom:'6px'}}>연간 4라운드</h3>
                <p style={{opacity:.85,fontSize:'.9rem'}}>개막전 · 서머 · 나이트레이스 · 파이널</p>
              </div>
            </RevealOnScroll>

            {/* 클래스 & 참가 정보 */}
            <RevealOnScroll delay={2} className="panel" style={{padding:'22px'} as any}>
              <h3 style={{marginBottom:'14px'}}>시즌 안내</h3>
              <div style={{display:'grid',gap:'10px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 14px',background:'var(--surface-2)',border:'1px solid var(--line)',clipPath:'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)'}}>
                  <i className="fa-solid fa-map-location-dot" style={{color:'var(--red)',width:'20px',textAlign:'center'}} />
                  <span style={{fontSize:'.9rem'}}>강원도 인제스피디움 3.9km</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 14px',background:'var(--surface-2)',border:'1px solid var(--line)',clipPath:'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)'}}>
                  <i className="fa-solid fa-flag-checkered" style={{color:'var(--red)',width:'20px',textAlign:'center'}} />
                  <span style={{fontSize:'.9rem'}}>연간 {list.length > 0 ? `${list.length}라운드` : '라운드'} · 6개 클래스</span>
                </div>
              </div>
              <div style={{marginTop:'14px',paddingTop:'14px',borderTop:'1px solid var(--line)'}}>
                <Link href="/season" style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'.85rem',color:'var(--red)',fontWeight:800}}>
                  <i className="fa-solid fa-calendar" /> 전체 일정 보기 →
                </Link>
              </div>
            </RevealOnScroll>
          </div>

        </div>
      </div>
    </section>
  )
}
