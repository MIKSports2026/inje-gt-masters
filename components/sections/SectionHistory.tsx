import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import type { History } from '@/types/sanity'

export default function SectionHistory({ history }: { history: History[] }) {
  const items = history
  const latest = items[0]
  const cut12 = 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)'

  return (
    <section className="section" id="history"
      style={{background:'linear-gradient(180deg,var(--surface-2),var(--bg))'}}>
      <div className="container">
        <div className="history-grid" style={{display:'grid',gridTemplateColumns:'1.05fr .95fr',gap:'20px',alignItems:'start'}}>

          {/* 왼쪽: 타임라인 */}
          <RevealOnScroll className="panel" style={{padding:'28px'} as any}>
            <span className="eyebrow">History</span>
            <h2 style={{marginBottom:'8px'}}>대회의 역사</h2>
            <p className="lead" style={{marginBottom:'24px'}}>
              2020년 창설부터 현재까지, 인제 GT 마스터즈가 걸어온 발자취.
            </p>

            {items.length === 0 ? (
              <div style={{textAlign:'center',padding:'32px 0',color:'var(--muted)'}}>
                <i className="fa-solid fa-clock-rotate-left" style={{fontSize:'2.5rem',opacity:.3,display:'block',marginBottom:'12px'}} />
                <p style={{fontSize:'.92rem'}}>역사 데이터를 준비중입니다.</p>
              </div>
            ) : (
              <div style={{display:'grid',gap:'12px'}}>
                {items.slice(0,6).map((h,i)=>(
                  <RevealOnScroll key={h._id} delay={(i%3) as 0|1|2|3}
                    style={{
                      padding:'18px',background:'#fff',border:'1px solid var(--line)',
                      display:'grid',gridTemplateColumns:'auto 1fr',gap:'14px',alignItems:'start',
                      clipPath:cut12,
                    } as any}
                  >
                    {/* 연도 뱃지 */}
                    <div style={{
                      minWidth:'72px',minHeight:'44px',padding:'0 14px',
                      display:'inline-flex',alignItems:'center',justifyContent:'center',
                      background:'rgba(230,0,35,.08)',color:'var(--red)',
                      border:'1px solid rgba(230,0,35,.18)',fontWeight:900,
                      clipPath:'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)',
                    }}>
                      {h.year}
                    </div>
                    <div>
                      <strong style={{display:'block',marginBottom:'4px'}}>{h.headline}</strong>
                      {h.summary && <span style={{color:'var(--muted)',fontSize:'.9rem'}}>{h.summary}</span>}
                      {/* 통계 칩 */}
                      {h.stats && h.stats.length > 0 && (
                        <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginTop:'8px'}}>
                          {h.stats.slice(0,3).map((s,j)=>(
                            <span key={j} className="chip" style={{fontSize:'.76rem',minHeight:'28px',padding:'0 10px'}}>
                              {s.label}: {s.value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            )}

            <div style={{marginTop:'20px'}}>
              <Link href="/history" className="btn btn-secondary" style={{fontSize:'.9rem'}}>
                전체 역사 보기
              </Link>
            </div>
          </RevealOnScroll>

          {/* 오른쪽: 비주얼 + 챔피언 */}
          <div style={{display:'grid',gap:'16px'}}>
            <RevealOnScroll delay={1} style={{
              minHeight:'280px',position:'relative',overflow:'hidden',color:'#fff',
              clipPath:'polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,0 100%)',
              background:'linear-gradient(120deg,rgba(17,17,17,.1),rgba(17,17,17,.76)),url("https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1500&q=80") center/cover no-repeat',
              borderRadius:'10px',
            } as any}>
              <div style={{position:'absolute',left:0,top:0,width:'100%',height:'2px',background:'linear-gradient(90deg,rgba(230,0,35,1),rgba(230,0,35,.3),transparent 72%)'}} />
              {latest && (
                <div style={{position:'absolute',left:'24px',right:'24px',bottom:'24px'}}>
                  <span style={{fontSize:'.78rem',fontWeight:900,letterSpacing:'.14em',textTransform:'uppercase',color:'rgba(255,255,255,.7)',display:'block',marginBottom:'6px'}}>{latest.year} {latest.edition ?? 'SEASON'}</span>
                  <h3 style={{color:'#fff',marginBottom:'8px'}}>{latest.headline}</h3>
                  {latest.stats && latest.stats.length > 0 && (
                    <p style={{opacity:.85,fontSize:'.9rem'}}>{latest.stats[0].label}: {latest.stats[0].value}</p>
                  )}
                </div>
              )}
            </RevealOnScroll>

            {/* 최신 시즌 챔피언 패널 */}
            <RevealOnScroll delay={2} className="panel" style={{padding:'22px'} as any}>
              <h3 style={{marginBottom:'16px'}}>
                <i className="fa-solid fa-trophy" style={{color:'var(--red)',marginRight:'8px'}} />
                {latest ? `${latest.year} 시즌 챔피언` : '시즌 챔피언'}
              </h3>
              {latest?.champions && latest.champions.length > 0 ? (
                <div style={{display:'grid',gap:'10px'}}>
                  {latest.champions.map((c,i)=>(
                    <div key={i} style={{
                      display:'flex',alignItems:'center',gap:'12px',
                      padding:'10px 14px',background:'var(--surface-2)',border:'1px solid var(--line)',
                      clipPath:'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)',
                    }}>
                      <span style={{
                        minWidth:'52px',padding:'4px 10px',textAlign:'center',
                        background:'rgba(230,0,35,.08)',color:'var(--red)',
                        border:'1px solid rgba(230,0,35,.18)',fontWeight:900,fontSize:'.78rem',
                        clipPath:'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,0 100%)',
                      }}>{c.classCode}</span>
                      <div style={{minWidth:0}}>
                        <strong style={{display:'block',fontSize:'.92rem'}}>{c.driver1}{c.driver2 ? ` / ${c.driver2}` : ''}</strong>
                        <span style={{color:'var(--muted)',fontSize:'.82rem'}}>{c.teamName}</span>
                      </div>
                      <i className="fa-solid fa-crown" style={{color:'#f59e0b',marginLeft:'auto',flexShrink:0}} />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{textAlign:'center',padding:'20px 0',color:'var(--muted)'}}>
                  <i className="fa-solid fa-trophy" style={{fontSize:'2rem',opacity:.25,display:'block',marginBottom:'10px'}} />
                  <p style={{fontSize:'.88rem'}}>챔피언 데이터를 준비중입니다.</p>
                </div>
              )}
            </RevealOnScroll>
          </div>

        </div>
      </div>
    </section>
  )
}
