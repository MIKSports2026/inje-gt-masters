'use client'
import Link from 'next/link'
import Image from 'next/image'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import type { Partner } from '@/types/sanity'

const TIER_LABEL: Record<string, string> = {
  title:'타이틀 스폰서', presenting:'프레젠팅 스폰서',
  gold:'골드 스폰서', silver:'실버 스폰서',
  official:'공식 파트너', media:'미디어 파트너', supporting:'서포팅 파트너',
}
const TIER_ORDER = ['title','presenting','gold','silver','official','media','supporting']

// 티어별 카드 크기
const TIER_SIZE: Record<string,{h:string;cols:number}> = {
  title:     {h:'110px',cols:1},
  presenting:{h:'90px', cols:2},
  gold:      {h:'80px', cols:3},
  silver:    {h:'70px', cols:4},
  official:  {h:'64px', cols:4},
  media:     {h:'56px', cols:4},
  supporting:{h:'50px', cols:5},
}

export default function SectionPartners({ partners }: { partners: Partner[] }) {
  const list = partners

  // 티어별 그룹핑
  const grouped = TIER_ORDER.reduce<Record<string, Partner[]>>((acc, tier) => {
    const items = list.filter(p => p.tier === tier)
    if (items.length) acc[tier] = items
    return acc
  }, {})

  return (
    <section className="section" id="partners">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Partners / Organization</span>
            <h2>공식 파트너 & 후원사</h2>
          </div>
          <p className="lead">인제 GT 마스터즈를 함께 만드는 공식 파트너와 후원사를 소개합니다.</p>
        </div>

        {list.length === 0 && (
          <div style={{textAlign:'center',padding:'48px 0',color:'var(--muted)'}}>
            <i className="fa-solid fa-handshake" style={{fontSize:'3rem',opacity:.3,display:'block',marginBottom:'16px'}} />
            <p>파트너 정보를 준비중입니다.</p>
          </div>
        )}
        {Object.entries(grouped).map(([tier, items], gi) => {
          const { h, cols } = TIER_SIZE[tier] ?? { h:'64px', cols:4 }
          const label = TIER_LABEL[tier] ?? tier
          return (
            <div key={tier} style={{marginBottom:'24px'}}>
              {/* 티어 레이블 */}
              <div style={{
                display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px',
              }}>
                <span style={{
                  padding:'4px 14px',fontSize:'.75rem',fontWeight:900,
                  letterSpacing:'.1em',textTransform:'uppercase',
                  background:'rgba(230,0,35,.06)',color:'var(--red)',
                  border:'1px solid rgba(230,0,35,.18)',
                  clipPath:'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)',
                }}>{label}</span>
                <div style={{flex:1,height:'1px',background:'var(--line)'}} />
              </div>

              {/* 파트너 카드 그리드 */}
              <div style={{
                display:'grid',
                gridTemplateColumns:`repeat(${cols},1fr)`,
                gap:'12px',
              }}>
                {items.map((p, pi) => (
                  <RevealOnScroll key={p._id} delay={(pi%4) as 0|1|2|3}>
                    <a
                      href={p.websiteUrl ?? '#'}
                      target={p.websiteUrl ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      style={{
                        height:h,
                        display:'flex',alignItems:'center',justifyContent:'center',
                        padding:'12px 20px',
                        background:'#fff',border:'1px solid var(--line)',
                        boxShadow:'var(--shadow)',
                        clipPath:'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)',
                        transition:'.22s ease',
                        position:'relative',
                        overflow:'hidden',
                      }}
                      onMouseEnter={e=>{
                        e.currentTarget.style.borderColor='rgba(230,0,35,.4)'
                        e.currentTarget.style.transform='translateY(-2px)'
                      }}
                      onMouseLeave={e=>{
                        e.currentTarget.style.borderColor='var(--line)'
                        e.currentTarget.style.transform=''
                      }}
                    >
                      {p.logo?.asset?.url ? (
                        <Image
                          src={p.logo.asset.url}
                          alt={p.name}
                          width={160}
                          height={60}
                          style={{objectFit:'contain',maxHeight:'100%',filter:'grayscale(20%)'}}
                        />
                      ) : (
                        <span style={{
                          fontWeight:900,
                          fontSize:tier==='title'?'1.1rem':tier==='presenting'?'1rem':'.9rem',
                          color:'var(--muted)',letterSpacing:'-.02em',
                          textAlign:'center',
                        }}>{p.name}</span>
                      )}
                    </a>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          )
        })}

        {/* 스폰서 문의 */}
        <RevealOnScroll>
          <div style={{
            marginTop:'8px',padding:'20px 24px',
            background:'linear-gradient(135deg,rgba(230,0,35,.04),transparent)',
            border:'1px solid rgba(230,0,35,.16)',borderRadius:'8px',
            display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px',flexWrap:'wrap',
          }}>
            <div>
              <strong style={{display:'block',marginBottom:'4px'}}>스폰서십 문의</strong>
              <span style={{color:'var(--muted)',fontSize:'.9rem'}}>인제 GT 마스터즈의 공식 파트너가 되어 대한민국 모터스포츠와 함께하세요.</span>
            </div>
            <a href="mailto:sponsor@masters-series.kr" className="btn btn-secondary" style={{fontSize:'.9rem'}}>
              <i className="fa-solid fa-envelope" style={{marginRight:'6px'}} />
              스폰서십 문의하기
            </a>
          </div>
        </RevealOnScroll>

      </div>
    </section>
  )
}
