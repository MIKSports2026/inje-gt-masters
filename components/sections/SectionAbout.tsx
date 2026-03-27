import RevealOnScroll from '@/components/ui/RevealOnScroll'

const POINTS = [
  { n:'01', title:'대한민국 대표 GT 내구레이스', desc:'국내 유일의 GT 내구레이스 전문 대회. Pro-Am부터 입문 클래스까지 6개 카테고리 운영.' },
  { n:'02', title:'인제스피디움 3.9km 전용 서킷',  desc:'고저차 88m, 18개 코너의 국내 최고 수준 상설 서킷. 모든 라운드가 인제스피디움에서 진행됩니다.' },
  { n:'03', title:'누구나 도전할 수 있는 열린 무대', desc:'입문 GT3부터 프로 GT1까지 단계별 구조. 드리프트·바이크·슈퍼카 클래스도 함께 운영됩니다.' },
]

const cut12 = 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)'

export default function SectionAbout() {
  return (
    <section className="section" id="about">
      <div className="container">
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',alignItems:'stretch'}}>

          {/* 왼쪽: 텍스트 */}
          <RevealOnScroll className="panel p-28" style={{padding:'28px',display:'flex',flexDirection:'column',justifyContent:'space-between'} as any}>
            <div>
              <span className="eyebrow">About</span>
              <h2>대한민국 정통<br/>GT 내구레이스</h2>
              <p className="lead" style={{marginTop:'16px'}}>
                인제 GT 마스터즈는 강원도 인제스피디움을 무대로 펼쳐지는 대한민국 대표 GT 내구레이스 대회입니다.
                프로 드라이버부터 아마추어·입문자까지 모두가 함께하는 열린 모터스포츠 축제입니다.
              </p>

              <div style={{display:'grid',gap:'14px',marginTop:'24px'}}>
                {POINTS.map(p=>(
                  <div key={p.n} style={{
                    padding:'16px',
                    background:'var(--surface-2)',
                    border:'1px solid var(--line)',
                    display:'grid',gridTemplateColumns:'54px 1fr',gap:'14px',alignItems:'start',
                    clipPath:cut12,
                  }}>
                    <div style={{
                      width:'54px',height:'54px',display:'grid',placeItems:'center',
                      background:'#fff',border:'1px solid var(--line)',
                      color:'var(--red)',fontWeight:900,fontSize:'.9rem',
                      clipPath:cut12,
                    }}>{p.n}</div>
                    <div>
                      <strong style={{display:'block',marginBottom:'4px'}}>{p.title}</strong>
                      <span style={{color:'var(--muted)',fontSize:'.92rem',lineHeight:1.5}}>{p.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 통계 */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginTop:'24px',paddingTop:'24px',borderTop:'1px solid var(--line)'}}>
              {[{v:'2020',l:'창설 연도'},{v:'6+',l:'클래스 종목'},{v:'400+',l:'누적 참가팀'}].map(s=>(
                <div key={s.l} style={{textAlign:'center'}}>
                  <strong style={{display:'block',fontSize:'1.8rem',fontWeight:950,color:'var(--red)',lineHeight:1}}>{s.v}</strong>
                  <span style={{fontSize:'.8rem',color:'var(--muted)',fontWeight:700}}>{s.l}</span>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          {/* 오른쪽: 비주얼 */}
          <RevealOnScroll delay={1} style={{
            minHeight:'480px',position:'relative',overflow:'hidden',color:'#fff',
            clipPath:'polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,0 100%)',
            background:'linear-gradient(120deg,rgba(17,17,17,.16),rgba(17,17,17,.74)),url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1500&q=80") center/cover no-repeat',
            borderRadius:'10px',
          } as any}>
            <div style={{position:'absolute',left:0,top:0,width:'100%',height:'2px',background:'linear-gradient(90deg,rgba(230,0,35,1),rgba(230,0,35,.3),transparent 72%)'}} />
            <div style={{position:'absolute',left:'24px',right:'24px',bottom:'24px'}}>
              <span className="eyebrow" style={{color:'rgba(255,255,255,.8)'}}>Inje GT Masters</span>
              <h3 style={{color:'#fff',fontSize:'clamp(1.3rem,2.5vw,1.9rem)',marginBottom:'10px'}}>
                Where Legends Begin
              </h3>
              <p style={{opacity:.85,fontSize:'.96rem',maxWidth:'380px',lineHeight:1.6}}>
                매 시즌, 새로운 전설이 탄생하는 곳.<br/>
                인제 GT 마스터즈에서 당신의 도전을 시작하세요.
              </p>
            </div>
          </RevealOnScroll>

        </div>
      </div>
    </section>
  )
}
