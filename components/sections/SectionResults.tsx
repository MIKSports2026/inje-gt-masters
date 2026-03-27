'use client'
import { useState } from 'react'
import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import type { Round } from '@/types/sanity'

const TABS = ['드라이버 순위','팀 순위','클래스별 결과'] as const

export default function SectionResults({ rounds }: { rounds: Round[] }) {
  const [activeTab, setActiveTab] = useState(0)
  const cut12 = 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)'

  return (
    <section className="section" id="results">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Race Information</span>
            <h2>시즌 결과 & 순위</h2>
          </div>
          <p className="lead">
            라운드별 결과 및 챔피언십 포인트 순위입니다.<br/>
            각 라운드 종료 후 업데이트됩니다.
          </p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1.08fr .92fr',gap:'20px',alignItems:'start'}}>

          {/* 왼쪽: 순위표 */}
          <RevealOnScroll className="panel" style={{padding:'24px'} as any}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'12px',flexWrap:'wrap',marginBottom:'4px'}}>
              <h3>챔피언십 스탠딩</h3>
            </div>

            {/* 탭 */}
            <div className="tabs">
              {TABS.map((t,i)=>(
                <button key={i} type="button"
                  className={`tab${activeTab===i?' active':''}`}
                  onClick={()=>setActiveTab(i)}
                >{t}</button>
              ))}
            </div>

            {/* 결과 없음 안내 */}
            <div style={{
              textAlign:'center',padding:'36px 20px',
              background:'var(--surface-2)',border:'1px solid var(--line)',borderRadius:'8px',
              color:'var(--muted)',
            }}>
              <i className="fa-solid fa-chart-bar" style={{fontSize:'2.5rem',opacity:.3,display:'block',marginBottom:'14px'}} />
              <p style={{fontSize:'.92rem',marginBottom:'6px'}}>경기 결과를 준비중입니다.</p>
              <p style={{fontSize:'.84rem'}}>라운드 종료 후 순위가 업데이트됩니다.</p>
            </div>

            <div style={{marginTop:'18px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <Link href="/results" style={{color:'var(--red)',fontWeight:800,fontSize:'.9rem',display:'flex',alignItems:'center',gap:'4px'}}>
                전체 순위 보기 <i className="fa-solid fa-arrow-right" style={{fontSize:'.8rem'}} />
              </Link>
            </div>
          </RevealOnScroll>

          {/* 오른쪽: 라운드 + 뉴스 */}
          <div style={{display:'grid',gap:'16px'}}>

            {/* 라운드 카드 */}
            <RevealOnScroll delay={1} className="panel" style={{padding:'22px'} as any}>
              <h3 style={{marginBottom:'14px'}}>시즌 라운드</h3>
              {rounds.length === 0 ? (
                <div style={{textAlign:'center',padding:'24px 0',color:'var(--muted)'}}>
                  <i className="fa-solid fa-calendar" style={{fontSize:'2rem',opacity:.3,display:'block',marginBottom:'10px'}} />
                  <p style={{fontSize:'.88rem'}}>라운드 일정을 준비중입니다.</p>
                </div>
              ) : (
                <div style={{display:'grid',gap:'8px'}}>
                  {rounds.slice(0,4).map(r=>(
                    <div key={r._id} style={{
                      display:'flex',alignItems:'center',gap:'10px',
                      padding:'10px 12px',
                      background:'var(--surface-2)',border:'1px solid var(--line)',
                      clipPath:'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)',
                    }}>
                      <span style={{
                        width:'36px',height:'36px',display:'grid',placeItems:'center',
                        background:'rgba(230,0,35,.08)',color:'var(--red)',
                        border:'1px solid rgba(230,0,35,.18)',fontWeight:900,fontSize:'.85rem',
                        clipPath:'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,0 100%)',
                        flexShrink:0,
                      }}>R{r.roundNumber}</span>
                      <div style={{flex:1}}>
                        <strong style={{display:'block',fontSize:'.9rem'}}>
                          {r.title}
                          {r.badge && <span style={{marginLeft:'6px',fontSize:'.7rem',padding:'1px 6px',background:'rgba(230,0,35,.1)',color:'var(--red)',borderRadius:'2px'}}>{r.badge}</span>}
                        </strong>
                        <span style={{color:'var(--muted)',fontSize:'.8rem'}}>{r.dateStart} · 인제스피디움</span>
                      </div>
                      {r.status==='entry_open' && (
                        <span style={{fontSize:'.74rem',fontWeight:900,color:'#16a34a',whiteSpace:'nowrap'}}>접수중</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </RevealOnScroll>

            {/* 뉴스 */}
            <RevealOnScroll delay={2} className="panel" style={{padding:'22px'} as any}>
              <h3 style={{marginBottom:'14px'}}>News & Notice</h3>
              <div style={{padding:'24px 0',textAlign:'center',color:'var(--muted)'}}>
                <i className="fa-solid fa-newspaper" style={{fontSize:'2rem',opacity:.3,display:'block',marginBottom:'10px'}} />
                <p style={{fontSize:'.88rem'}}>최신 소식을 준비중입니다.</p>
              </div>
              <Link href="/news" style={{display:'flex',alignItems:'center',gap:'4px',marginTop:'4px',fontSize:'.85rem',color:'var(--red)',fontWeight:800}}>
                전체 소식 보기 <i className="fa-solid fa-arrow-right" style={{fontSize:'.78rem'}} />
              </Link>
            </RevealOnScroll>

          </div>
        </div>
      </div>
    </section>
  )
}
