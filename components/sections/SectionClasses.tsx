import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import type { ClassInfo } from '@/types/sanity'
import { ENTRY_CLOSED } from '@/lib/config'

export default function SectionClasses({ classes }: { classes: ClassInfo[] }) {
  const list = classes

  return (
    <section className="section" id="classes"
      style={{background:'linear-gradient(180deg,var(--bg-2),var(--bg))'}}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Race Classes</span>
            <h2>6개 클래스로 구성된<br/>인제 GT 마스터즈 공식 종목</h2>
          </div>
          <p className="lead">
            GT 내구레이스부터 드리프트·바이크·슈퍼카까지<br/>
            아마추어부터 프로까지 누구나 도전할 수 있는 열린 구조입니다.
          </p>
        </div>

        {list.length === 0 && (
          <div style={{textAlign:'center',padding:'48px 0',color:'var(--muted)'}}>
            <i className="fa-solid fa-flag-checkered" style={{fontSize:'3rem',opacity:.3,display:'block',marginBottom:'16px'}} />
            <p>클래스 데이터를 준비중입니다.</p>
          </div>
        )}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'}}>
          {list.map((c,i)=>{
            const color = c.accentColor ?? '#e60023'
            return (
              <RevealOnScroll key={c._id} delay={(i%4) as 0|1|2|3}>
                <article className="panel" style={{padding:'24px',height:'100%',display:'flex',flexDirection:'column'}}>
                  {/* 클래스 뱃지 */}
                  <div style={{
                    display:'inline-flex',alignItems:'center',padding:'4px 12px',
                    marginBottom:'14px',fontSize:'.78rem',fontWeight:900,letterSpacing:'.06em',
                    background:`${color}18`,border:`1px solid ${color}38`,color,
                    clipPath:'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)',
                  }}>
                    {c.classCode}
                  </div>

                  <h3 style={{marginBottom:'6px'}}>{c.name}</h3>
                  <p className="muted" style={{fontSize:'.92rem',lineHeight:1.5,flex:1}}>
                    {c.tagline}
                  </p>

                  {/* 통계 */}
                  <div style={{
                    marginTop:'16px',paddingTop:'14px',borderTop:'1px solid var(--line)',
                    display:'flex',alignItems:'center',justifyContent:'space-between',gap:'8px',
                  }}>
                    <div>
                      <strong style={{display:'block',fontSize:'1.6rem',lineHeight:1,fontWeight:950,color}}>{c.teamCount ?? '—'}</strong>
                      <span style={{fontSize:'.8rem',color:'var(--muted)',fontWeight:700}}>팀 참가</span>
                    </div>
                    {c.driverCount && (
                      <div style={{textAlign:'right'}}>
                        <strong style={{display:'block',fontSize:'1.2rem',fontWeight:950}}>{c.driverCount}</strong>
                        <span style={{fontSize:'.8rem',color:'var(--muted)',fontWeight:700}}>드라이버</span>
                      </div>
                    )}
                  </div>

                  {/* 하단 */}
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'14px'}}>
                    {c.isEntryOpen ? (
                      <span style={{
                        padding:'4px 12px',fontSize:'.78rem',fontWeight:900,
                        background:'rgba(34,197,94,.1)',color:'#16a34a',
                        border:'1px solid rgba(34,197,94,.3)',
                        clipPath:'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)',
                        letterSpacing:'.06em',textTransform:'uppercase',
                      }}>접수중</span>
                    ) : (
                      <span style={{fontSize:'.82rem',color:'var(--muted)'}}>접수 예정</span>
                    )}
                    <Link href={`/classes/${c.slug.current}`}
                      style={{fontSize:'.85rem',color,fontWeight:800,display:'flex',alignItems:'center',gap:'4px'}}>
                      자세히 <i className="fa-solid fa-arrow-right" style={{fontSize:'.78rem'}} />
                    </Link>
                  </div>
                </article>
              </RevealOnScroll>
            )
          })}
        </div>

        {/* CTA 배너 */}
        {!ENTRY_CLOSED && (
          <RevealOnScroll style={{
            marginTop:'24px',padding:'24px 28px',
            display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px',flexWrap:'wrap',
            background:'linear-gradient(90deg,rgba(230,0,35,.06),transparent)',
            border:'1px solid rgba(230,0,35,.2)',borderRadius:'8px',
          } as any}>
            <div>
              <strong style={{fontSize:'1.1rem'}}>6개 클래스 Register 접수중</strong>
              <p style={{color:'var(--muted)',fontSize:'.92rem',marginTop:'4px'}}>GT 내구레이스 · 드리프트 · 바이크 · 슈퍼카 챌린지</p>
            </div>
            <Link href="/entry" className="btn btn-primary">
              <i className="fa-solid fa-flag-checkered" /> Register
            </Link>
          </RevealOnScroll>
        )}

      </div>
    </section>
  )
}
