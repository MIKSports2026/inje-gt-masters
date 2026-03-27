import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import type { SiteSettings, ClassInfo } from '@/types/sanity'

const STEPS = [
  {n:'01',icon:'fa-solid fa-file-pen',     title:'온라인 신청서 작성',    desc:'참가 클래스, 드라이버 정보, 차량 제원을 입력합니다.'},
  {n:'02',icon:'fa-solid fa-mobile-screen',title:'결제 링크 수신',        desc:'이메일/카카오로 토스페이먼츠 결제 링크가 발송됩니다.'},
  {n:'03',icon:'fa-solid fa-credit-card',  title:'결제 완료',             desc:'결제 완료 후 접수 확정 메일이 발송됩니다.'},
  {n:'04',icon:'fa-solid fa-flag-checkered',title:'접수 확정 · 출전 준비',desc:'서킷에서 뵙겠습니다. Where Legends Begin.'},
]

export default function SectionEntry({ settings, classes }: { settings: SiteSettings | null, classes: ClassInfo[] }) {
  const isOpen = settings?.isEntryOpen ?? false
  const cut = 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)'

  const classSummary = classes

  return (
    <section className="section" id="entry">
      <div className="container">
        <RevealOnScroll>
          <div className="panel" style={{padding:'28px 32px'}}>

            <div style={{display:'grid',gridTemplateColumns:'1.05fr .95fr',gap:'32px',alignItems:'start'}}>

              {/* 왼쪽: 안내 */}
              <div>
                <span className="eyebrow">Entry Guide</span>
                <h2>참가 신청 —<br/>지금 바로 시작하세요</h2>
                <p className="lead" style={{marginTop:'14px'}}>
                  온라인 신청서 작성 → 결제 링크 수신(토스페이먼츠) → 접수 확정.<br/>
                  라운드당 선착순 마감이니 서두르세요.
                </p>

                {/* 프로세스 스텝 */}
                <div style={{display:'grid',gap:'12px',marginTop:'24px'}}>
                  {STEPS.map((s,i)=>(
                    <div key={i} style={{
                      display:'grid',gridTemplateColumns:'48px 1fr',gap:'14px',alignItems:'start',
                      padding:'14px',background:'var(--surface-2)',border:'1px solid var(--line)',
                      clipPath:'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)',
                    }}>
                      <div style={{
                        width:'48px',height:'48px',display:'grid',placeItems:'center',
                        background:'rgba(230,0,35,.08)',color:'var(--red)',
                        border:'1px solid rgba(230,0,35,.18)',
                        clipPath:'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)',
                      }}>
                        <i className={s.icon} />
                      </div>
                      <div>
                        <strong style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'.95rem'}}>
                          <span style={{fontSize:'.72rem',color:'var(--red)',fontWeight:900}}>STEP {s.n}</span>
                          {s.title}
                        </strong>
                        <span style={{color:'var(--muted)',fontSize:'.88rem',lineHeight:1.5,display:'block',marginTop:'2px'}}>{s.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="btns" style={{marginTop:'22px'}}>
                  {isOpen ? (
                    <Link href="/entry" className="btn btn-primary">
                      <i className="fa-solid fa-flag-checkered" /> 온라인 신청하기
                    </Link>
                  ) : (
                    <div style={{
                      padding:'14px 20px',background:'rgba(230,0,35,.06)',
                      border:'1px solid rgba(230,0,35,.2)',borderRadius:'6px',
                      fontSize:'.92rem',color:'var(--muted)',
                    }}>
                      <i className="fa-solid fa-clock" style={{color:'var(--red)',marginRight:'8px'}} />
                      {settings?.entryNotice ?? '참가신청 일정을 준비중입니다.'}
                    </div>
                  )}
                  <a href="#" className="btn btn-secondary">
                    경기 규정 PDF
                  </a>
                </div>
              </div>

              {/* 오른쪽: 클래스별 접수 현황 */}
              <div style={{
                border:'1px solid var(--line)',
                background:'#fff',padding:'22px',
                clipPath:cut,
                position:'relative',
              }}>
                <div style={{position:'absolute',left:0,top:0,right:0,height:'3px',background:'linear-gradient(90deg,var(--red),rgba(230,0,35,.35) 35%,transparent 75%)'}} />

                <h3 style={{marginBottom:'16px'}}>참가 클래스 & 접수 현황</h3>

                {classSummary.length === 0 && (
                  <div style={{textAlign:'center',padding:'24px 0',color:'var(--muted)'}}>
                    <i className="fa-solid fa-flag" style={{fontSize:'2rem',opacity:.3,display:'block',marginBottom:'10px'}} />
                    <p style={{fontSize:'.88rem'}}>클래스 정보를 준비중입니다.</p>
                  </div>
                )}
                <div style={{display:'grid',gap:'10px'}}>
                  {classSummary.map(c=>{
                    const color = c.accentColor ?? '#e60023'
                    return (
                      <div key={c._id} style={{
                        display:'flex',alignItems:'center',gap:'12px',
                        padding:'12px 14px',
                        background:'var(--surface-2)',border:'1px solid var(--line)',
                        clipPath:'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)',
                      }}>
                        <span style={{
                          minWidth:'52px',padding:'3px 8px',textAlign:'center',
                          background:`${color}14`,color,border:`1px solid ${color}38`,
                          fontWeight:900,fontSize:'.78rem',
                          clipPath:'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,0 100%)',
                        }}>{c.classCode}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <strong style={{display:'block',fontSize:'.9rem',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.name}</strong>
                          {c.teamCount && <span style={{color:'var(--muted)',fontSize:'.8rem'}}>{c.teamCount}팀</span>}
                        </div>
                        {c.isEntryOpen ? (
                          <span style={{
                            padding:'3px 10px',fontSize:'.74rem',fontWeight:900,
                            background:'rgba(34,197,94,.1)',color:'#16a34a',
                            border:'1px solid rgba(34,197,94,.3)',
                            clipPath:'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,0 100%)',
                            whiteSpace:'nowrap',
                          }}>접수중</span>
                        ) : (
                          <span style={{fontSize:'.78rem',color:'var(--muted)',whiteSpace:'nowrap'}}>접수 예정</span>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div style={{marginTop:'18px',paddingTop:'14px',borderTop:'1px solid var(--line)'}}>
                  <Link href="/entry#guide" style={{
                    display:'flex',alignItems:'center',gap:'6px',
                    fontSize:'.85rem',color:'var(--red)',fontWeight:800,
                  }}>
                    <i className="fa-solid fa-circle-info" /> 상세 참가 안내 보기 →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
