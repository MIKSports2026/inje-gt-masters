import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import type { SiteSettings } from '@/types/sanity'

export default function SectionSpeedium({ settings }: { settings: SiteSettings | null }) {
  const cut = 'polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,0 100%)'

  return (
    <section className="section" id="speedium"
      style={{background:'linear-gradient(180deg,var(--surface-2),var(--bg))'}}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Inje Speedium</span>
            <h2>인제스피디움 — 모든 레이스의 무대</h2>
          </div>
          <p className="lead">
            강원도 인제군 기린면. {settings?.circuitLength ?? 3.9}km, 고저차 88m의 국내 최고 수준 상설 서킷.<br/>
            인제 GT 마스터즈 전 라운드가 이곳에서 열립니다.
          </p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',alignItems:'stretch'}}>

          {/* 왼쪽: 서킷 기본 정보 */}
          <RevealOnScroll className="panel" style={{padding:'28px'} as any}>
            <h3 style={{marginBottom:'18px'}}>서킷 기본 정보</h3>
            <ul className="list">
              {[
                {icon:'fa-solid fa-location-dot',    text:`주소 : ${settings?.address ?? '강원도 인제군 기린면 상하답로 130'}`},
                {icon:'fa-solid fa-road',            text:`서킷 전장 : ${settings?.circuitLength ?? 3.9}km / 고저차 88m`},
                {icon:'fa-solid fa-flag',            text:'코너 수 : 18개 / 국내 최고 수준 상설 서킷'},
                {icon:'fa-solid fa-car',             text:'서울 기준 약 2시간 30분 소요'},
                {icon:'fa-solid fa-eye',             text:'그랜드스탠드 무료 관람'},
                {icon:'fa-solid fa-square-parking',  text:'경기 당일 현장 주차 운영'},
              ].map((item,i)=>(
                <li key={i} style={{display:'flex',alignItems:'flex-start',gap:'12px',padding:'10px 0',borderBottom:'1px solid var(--line)'}}>
                  <i className={`${item.icon}`} style={{color:'var(--red)',marginTop:'2px',flexShrink:0,width:'18px',textAlign:'center'}} />
                  <span style={{fontWeight:700,color:'#24303a',lineHeight:1.5}}>{item.text}</span>
                </li>
              ))}
            </ul>

            {/* 서킷 수치 */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginTop:'20px',paddingTop:'20px',borderTop:'1px solid var(--line)'}}>
              {[
                {v:'3.9km',l:'서킷 전장'},
                {v:'88m',  l:'고저차'},
                {v:'18',   l:'코너'},
              ].map(s=>(
                <div key={s.l} style={{
                  padding:'14px',textAlign:'center',
                  background:'var(--surface-2)',border:'1px solid var(--line)',
                  clipPath:'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)',
                  position:'relative',
                }}>
                  <div style={{position:'absolute',left:0,top:0,right:0,height:'2px',background:'linear-gradient(90deg,var(--red),transparent)'}} />
                  <strong style={{display:'block',fontSize:'1.5rem',fontWeight:950,color:'var(--red)',lineHeight:1}}>{s.v}</strong>
                  <span style={{fontSize:'.78rem',color:'var(--muted)',fontWeight:700,display:'block',marginTop:'4px'}}>{s.l}</span>
                </div>
              ))}
            </div>

            <div style={{marginTop:'20px',display:'flex',gap:'10px',flexWrap:'wrap'}}>
              {settings?.speediumUrl && (
                <a href={settings.speediumUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{fontSize:'.88rem'}}>
                  <i className="fa-solid fa-arrow-up-right-from-square" style={{marginRight:'6px'}} />
                  인제스피디움 공식 홈
                </a>
              )}
              <a href="https://map.naver.com" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{fontSize:'.88rem'}}>
                <i className="fa-solid fa-map-location-dot" style={{marginRight:'6px'}} />
                지도로 보기
              </a>
            </div>
          </RevealOnScroll>

          {/* 오른쪽: 관람 안내 + 서킷 이미지 */}
          <RevealOnScroll delay={1} className="panel" style={{padding:'28px'} as any}>
            <h3 style={{marginBottom:'14px'}}>관람 안내</h3>
            <p className="lead" style={{fontSize:'1rem',marginBottom:'18px'}}>
              메인그랜드스탠드에서 레이스 전 구간 조망 가능.<br/>
              피트레인 투어, 포토존 등 부대행사도 함께 진행됩니다.
            </p>

            {/* 서킷 이미지 */}
            <div style={{
              height:'240px',
              marginBottom:'18px',
              position:'relative',overflow:'hidden',
              clipPath:cut,
              background:'#111',
            }}>
              <div style={{
                position:'absolute',inset:0,
                backgroundImage:'url("https://images.unsplash.com/photo-1511918984145-48de785d4d7f?auto=format&fit=crop&w=1400&q=80")',
                backgroundSize:'cover',backgroundPosition:'center',
              }} />
              <div style={{position:'absolute',inset:0,background:'rgba(17,17,17,.25)'}} />
              <div style={{position:'absolute',left:'16px',bottom:'16px',color:'#fff'}}>
                <strong style={{display:'block',fontSize:'.9rem',fontWeight:900}}>인제스피디움 메인 그랜드스탠드</strong>
                <span style={{fontSize:'.82rem',opacity:.85}}>전 구간 레이스 조망 가능</span>
              </div>
            </div>

            {/* 관람 포인트 */}
            <div style={{display:'grid',gap:'10px'}}>
              {[
                {icon:'fa-solid fa-ticket',       title:'입장료',    desc:'그랜드스탠드 무료 관람 · 피트 투어 별도'},
                {icon:'fa-solid fa-clock',         title:'관람 시간', desc:'레이스 당일 오전 9시 ~ 오후 6시'},
                {icon:'fa-solid fa-utensils',      title:'편의시설',  desc:'푸드트럭 · 관람 편의시설 운영'},
                {icon:'fa-solid fa-camera',        title:'포토존',    desc:'공식 포토존 및 경주차 전시 운영'},
              ].map((item,i)=>(
                <div key={i} style={{
                  display:'flex',alignItems:'flex-start',gap:'12px',
                  padding:'10px 14px',
                  background:'var(--surface-2)',border:'1px solid var(--line)',
                  clipPath:'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)',
                }}>
                  <i className={item.icon} style={{color:'var(--red)',marginTop:'3px',width:'16px',textAlign:'center',flexShrink:0}} />
                  <div>
                    <strong style={{display:'block',fontSize:'.9rem'}}>{item.title}</strong>
                    <span style={{color:'var(--muted)',fontSize:'.84rem'}}>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>

        </div>
      </div>
    </section>
  )
}
