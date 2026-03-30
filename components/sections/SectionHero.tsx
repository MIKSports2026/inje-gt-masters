'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { SiteSettings, Round } from '@/types/sanity'

interface Props {
  settings:  SiteSettings | null
  nextRound: Round | null
  rounds:    Round[]
}

function useCountdown(target?: string) {
  const calc = () => {
    if (!target) return null
    const diff = new Date(target).getTime() - Date.now()
    if (diff <= 0) return null
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    }
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  })
  return t
}

const SL: Record<string,{text:string;color:string}> = {
  upcoming:     {text:'예정',    color:'#3b82f6'},
  entry_open:   {text:'접수중',  color:'#22c55e'},
  entry_closed: {text:'접수마감',color:'#f59e0b'},
  ongoing:      {text:'진행중',  color:'#e60023'},
  finished:     {text:'종료',   color:'#6b7280'},
}

export default function SectionHero({ settings, nextRound }: Props) {
  const cd = useCountdown(nextRound?.dateStart)
  const metrics = [
    {v:'107',l:'경주차',  s:'2026 시즌'},
    {v:'208',l:'드라이버',s:'남녀 통합'},
    {v:'4',  l:'라운드',  s:'연간 일정'},
  ]

  /* 공통 스타일 */
  const panel = {
    border:'1px solid var(--line)',
    borderRadius:'10px',
    overflow:'hidden' as const,
    position:'relative' as const,
  }
  const redLine = {
    position:'absolute' as const,left:0,top:0,right:0,height:'2px',
    background:'linear-gradient(90deg,var(--red),transparent 72%)',
  }
  const cutSm = 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)'
  const cutMd = 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)'

  return (
    <section style={{padding:'18px 0 28px'}}>
      <div className="container">
        <div className="hero-grid" style={{
          display:'grid',
          gridTemplateColumns:'1.02fr .98fr',
          gap:'20px',
          minHeight:'calc(100vh - var(--header-h) - 28px)',
          alignItems:'stretch',
        }}>

          {/* ── 왼쪽 카피 ──────────────────────────────────── */}
          <div style={{
            ...panel,
            padding:'clamp(24px,4vw,48px)',
            background:'linear-gradient(135deg,rgba(230,0,35,.06),transparent 28%),linear-gradient(180deg,#fff,#f3f6f8)',
            display:'flex',flexDirection:'column',justifyContent:'space-between',
          }}>
            {/* 모서리 장식 */}
            <div style={{position:'absolute',right:0,top:0,width:0,height:0,borderStyle:'solid',borderWidth:'0 48px 48px 0',borderColor:'transparent var(--red) transparent transparent',opacity:.18}} />

            <div>
              {/* 키커 */}
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',marginBottom:'20px',flexWrap:'wrap'}}>
                <span className="pill">2026 SEASON</span>
                {nextRound && (
                  <span className="chip">
                    <i className="fa-solid fa-calendar-days" style={{color:'var(--red)',marginRight:'6px'}} />
                    Next: {nextRound.dateStart}
                  </span>
                )}
              </div>

              <p style={{fontSize:'clamp(1.02rem,1.8vw,1.34rem)',fontWeight:850,color:'#1f2831',marginBottom:'8px',letterSpacing:'.06em',textTransform:'uppercase'}}>
                {settings?.slogan ?? 'Where Legends Begin'}
              </p>
              <h1>인제<br/>GT<br/>마스터즈</h1>
              <p className="lead" style={{marginTop:'16px'}}>
                강원도 인제스피디움 3.9km 서킷.<br/>
                GT 내구레이스부터 드리프트·바이크·슈퍼카까지<br/>
                대한민국 최고의 모터스포츠 무대.
              </p>
            </div>

            {/* 카운트다운 */}
            {nextRound && (
              <div style={{margin:'24px 0'}}>
                <p style={{fontSize:'.78rem',fontWeight:900,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted)',marginBottom:'10px'}}>
                  <i className="fa-solid fa-stopwatch" style={{color:'var(--red)',marginRight:'6px'}} />
                  {nextRound.title} — D-DAY
                </p>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px'}}>
                  {cd ? (
                    [{v:cd.days,l:'DAYS'},{v:cd.hours,l:'HRS'},{v:cd.minutes,l:'MIN'},{v:cd.seconds,l:'SEC'}].map(({v,l})=>(
                      <div key={l} style={{background:'#fff',border:'1px solid var(--line)',padding:'12px 8px',textAlign:'center',clipPath:cutSm,position:'relative'}}>
                        <div style={redLine} />
                        <strong style={{display:'block',fontFamily:"'Barlow Condensed',sans-serif",fontSize:'clamp(1.4rem,2.5vw,2rem)',lineHeight:1,letterSpacing:'2px',fontWeight:900,fontVariantNumeric:'tabular-nums'}}>
                          {String(v).padStart(2,'0')}
                        </strong>
                        <span style={{fontSize:'.72rem',fontWeight:900,letterSpacing:'.1em',color:'var(--muted)'}}>{l}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{gridColumn:'1/-1',textAlign:'center',color:'var(--muted)',padding:'16px',fontSize:'.9rem'}}>
                      레이스 당일입니다!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 메트릭 */}
            <div className="hero-metrics" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px'}}>
              {metrics.map(m=>(
                <div key={m.l} style={{minHeight:'100px',padding:'16px',background:'#fff',border:'1px solid var(--line)',position:'relative',clipPath:cutMd}}>
                  <div style={redLine} />
                  <strong style={{display:'block',fontSize:'clamp(1.5rem,2.5vw,2.2rem)',lineHeight:1,letterSpacing:'-.04em',marginBottom:'10px',fontWeight:950}}>{m.v}</strong>
                  <span style={{display:'block',color:'var(--muted)',fontSize:'.85rem',fontWeight:700}}>{m.l}</span>
                  <span style={{display:'block',color:'var(--muted)',fontSize:'.78rem'}}>{m.s}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="btns" style={{marginTop:'22px'}}>
              <Link href="/entry" className="btn btn-primary">
                <i className="fa-solid fa-flag-checkered" /> 참가 신청하기
              </Link>
              <Link href="/#season" className="btn btn-secondary">
                2026 시즌 보기
              </Link>
            </div>
          </div>

          {/* ── 오른쪽 비주얼 ──────────────────────────────── */}
          <div style={{display:'grid',gridTemplateRows:'1fr auto',gap:'18px'}}>

            {/* 메인 KV */}
            <div style={{
              minHeight:'490px',position:'relative',overflow:'hidden',
              background:'linear-gradient(120deg,rgba(17,17,17,.18),rgba(17,17,17,.76)),linear-gradient(135deg,#393939,#111)',
              clipPath:'polygon(0 0,calc(100% - 26px) 0,100% 26px,100% 100%,0 100%)',
            }}>
              <div style={{
                position:'absolute',inset:0,
                backgroundImage:`url("${settings?.heroImage?.asset?.url ?? nextRound?.heroImage?.asset?.url ?? 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80'}")`,
                backgroundSize:'cover',backgroundPosition:'center',
                transform:'scale(1.05)',
                animation:'heroZoom 12s ease-in-out infinite alternate',
              }} />
              {/* 레드 라인 효과 */}
              <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent 0 86%,rgba(230,0,35,.28) 86% 87%,transparent 87% 100%)',mixBlendMode:'screen',opacity:.9}} />

              {/* 오버레이 */}
              <div style={{
                position:'absolute',left:0,right:0,bottom:0,zIndex:1,
                padding:'22px',display:'flex',alignItems:'end',justifyContent:'space-between',gap:'12px',
                background:'linear-gradient(180deg,transparent,rgba(17,17,17,.76))',
                color:'#fff',
              }}>
                <div>
                  <strong style={{display:'block',fontSize:'1.06rem',fontWeight:900}}>
                    {nextRound ? `${nextRound.season} R${nextRound.roundNumber} — ${nextRound.title}` : '인제스피디움 3.9km'}
                    {nextRound?.badge && <span style={{marginLeft:'8px',fontSize:'.72rem',padding:'2px 8px',background:'rgba(230,0,35,.7)',borderRadius:'3px'}}>{nextRound.badge}</span>}
                  </strong>
                  <span style={{display:'block',opacity:.84,fontSize:'.92rem'}}>
                    {nextRound ? `${nextRound.dateStart} · 인제스피디움` : '강원도 인제군 기린면'}
                  </span>
                </div>
                {nextRound && (
                  <span style={{padding:'6px 12px',fontSize:'.78rem',fontWeight:900,color:'#fff',background:SL[nextRound.status]?.color??'#3b82f6',clipPath:'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)'}}>
                    {SL[nextRound.status]?.text}
                  </span>
                )}
              </div>
            </div>

            {/* 미니 KV 2개 */}
            <div className="hero-mini-kv" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'18px'}}>
              {[
                {bg:'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80',t:'6개 클래스',s:'GT1·GT2·GT3·DRIFT·BIKE·SUPER',href:'/#classes'},
                {bg:'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&w=800&q=80',t:'참가 신청',s:'온라인 접수 · 토스페이먼츠',href:'/entry'},
              ].map((m,i)=>(
                <Link key={i} href={m.href} style={{
                  minHeight:'190px',position:'relative',overflow:'hidden',
                  background:'#222',border:'1px solid var(--line)',boxShadow:'var(--shadow)',
                  clipPath:'polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,0 100%)',
                  display:'block',
                }}>
                  <div style={{position:'absolute',inset:0,backgroundImage:`url("${m.bg}")`,backgroundSize:'cover',backgroundPosition:'center'}} />
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(17,17,17,.08),rgba(17,17,17,.76))'}} />
                  <div style={{position:'absolute',left:0,top:0,width:'100%',height:'2px',background:'linear-gradient(90deg,var(--red),transparent 70%)'}} />
                  <div style={{position:'absolute',left:'16px',right:'16px',bottom:'16px',zIndex:1,color:'#fff'}}>
                    <strong style={{display:'block',fontSize:'1rem',fontWeight:900}}>{m.t}</strong>
                    <span style={{display:'block',opacity:.84,fontSize:'.88rem'}}>{m.s}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
