'use client'
import Link from 'next/link'
import type { SiteSettings } from '@/types/sanity'

const CARDS = [
  { icon:'fa-solid fa-calendar-days',  title:'2026 라운드 일정', desc:'개막전부터 파이널까지 전체 라운드 일정을 확인하세요.', href:'/#season' },
  { icon:'fa-solid fa-flag-checkered', title:'참가 신청하기',     desc:'온라인 신청서 작성 후 토스페이먼츠로 빠르게 결제하세요.', href:'/entry' },
  { icon:'fa-solid fa-trophy',         title:'경기 결과',         desc:'2025 파이널 기준 시즌 최종 순위 및 클래스별 결과.', href:'/#results' },
  { icon:'fa-solid fa-camera',         title:'미디어 갤러리',     desc:'레이스 현장 포토·영상·하이라이트 아카이브.', href:'/media' },
]

export default function SectionQuickAccess({ settings }: { settings: SiteSettings | null }) {
  const cut = 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)'
  const redLine = {
    position:'absolute' as const,left:0,top:0,width:'100%',height:'2px',
    background:'linear-gradient(90deg,var(--red),transparent)',
  }

  return (
    <section style={{padding:'0 0 28px'}}>
      <div className="container">
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px'}}>
          {CARDS.map((c,i)=>(
            <Link key={i} href={c.href} style={{
              minHeight:'158px',padding:'20px',
              background:'var(--bg-2)',border:'1px solid var(--line)',
              boxShadow:'var(--shadow)',position:'relative',
              clipPath:cut,
              display:'block',
              transition:'.22s ease',
            }}
            onMouseEnter={e=>(e.currentTarget.style.transform='translateY(-4px)')}
            onMouseLeave={e=>(e.currentTarget.style.transform='')}
            >
              <div style={redLine} />
              {/* 아이콘 */}
              <div style={{
                width:'48px',height:'48px',display:'grid',placeItems:'center',
                color:'var(--red)',fontWeight:900,
                border:'1px solid rgba(230,0,35,.18)',
                background:'rgba(230,0,35,.06)',
                clipPath:'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)',
                marginBottom:'22px',
              }}>
                <i className={c.icon} />
              </div>
              <strong style={{display:'block',marginBottom:'6px',fontSize:'1.05rem'}}>{c.title}</strong>
              <span style={{display:'block',color:'var(--muted)',fontSize:'.92rem',lineHeight:1.4}}>{c.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
