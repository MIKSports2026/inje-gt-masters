import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import type { Media, Post } from '@/types/sanity'

export default function SectionMedia({ media, posts }: { media: Media[]; posts: Post[] }) {
  const featured = media.find(m => m.mediaType === 'video') ?? media[0]
  const thumbs   = media.filter(m => m !== featured).slice(0, 2)

  return (
    <section className="section" id="media"
      style={{background:'linear-gradient(180deg,var(--surface-2),var(--bg))'}}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Media</span>
            <h2>미디어 — 레이스 현장의 순간들</h2>
          </div>
          <p className="lead">인제 GT 마스터즈의 레이스 하이라이트, 현장 포토, 공식 영상을 모두 확인하세요.</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1.08fr .92fr',gap:'20px'}}>

          {/* 메인 비디오 카드 */}
          <RevealOnScroll>
            <div className="panel" style={{
              minHeight:'360px',position:'relative',overflow:'hidden',
              background:'linear-gradient(120deg,rgba(17,17,17,.3),rgba(17,17,17,.85)),url("https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80") center/cover no-repeat',
              cursor:'pointer',
            }}>
              {/* 재생 버튼 */}
              <div style={{
                position:'absolute',top:'50%',left:'50%',
                transform:'translate(-50%,-60%)',
                width:'72px',height:'72px',
                background:'rgba(230,0,35,.9)',
                borderRadius:'50%',
                display:'grid',placeItems:'center',
                fontSize:'1.4rem',color:'#fff',
                boxShadow:'0 0 0 12px rgba(230,0,35,.2)',
                transition:'.22s ease',
              }}>▶</div>

              {/* 콘텐츠 */}
              <div style={{
                position:'absolute',left:0,right:0,bottom:0,
                padding:'28px',
                background:'linear-gradient(180deg,transparent,rgba(17,17,17,.85))',
                color:'#fff',
              }}>
                <span className="eyebrow" style={{color:'rgba(255,200,210,.9)'}}>
                  {featured?.relatedRound
                    ? `${featured.relatedRound.title} 하이라이트`
                    : '2025 파이널 라운드 하이라이트'}
                </span>
                <h3 style={{
                  color:'#fff',
                  fontSize:'clamp(1.3rem,2.5vw,1.9rem)',
                  marginBottom:'10px',
                }}>
                  {featured?.title ?? '2025 시즌 파이널 — 레이스 풀 하이라이트'}
                </h3>
                <p style={{maxWidth:'520px',opacity:.88,fontSize:'.95rem',lineHeight:1.6}}>
                  인제스피디움에서 펼쳐진 2025 파이널 라운드의 모든 순간.<br/>
                  GT 내구레이스부터 드리프트 배틀까지.
                </p>
              </div>

              {/* 재생 시간 */}
              {featured?.duration && (
                <div style={{
                  position:'absolute',top:'16px',right:'16px',
                  padding:'4px 10px',background:'rgba(0,0,0,.7)',color:'#fff',
                  fontSize:'.82rem',fontWeight:700,borderRadius:'4px',
                }}>
                  {featured.duration}
                </div>
              )}
            </div>
          </RevealOnScroll>

          {/* 오른쪽: 썸네일 2개 */}
          <div style={{display:'grid',gap:'16px'}}>
            {[
              {
                bg:'https://images.unsplash.com/photo-1549399542-7e82138f4a5f?auto=format&fit=crop&w=1200&q=80',
                title:'포토 갤러리',
                sub:'라운드별 현장 사진 아카이브',
                href:'/media',
              },
              {
                bg:'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
                title:'드리프트 KDGP 배틀',
                sub:'2025 시즌 드리프트 현장',
                href:'/media?tag=drift',
              },
            ].map((t,i)=>(
              <RevealOnScroll key={i} delay={(i+1) as 1|2}>
                <Link href={t.href} style={{
                  display:'grid',gridTemplateColumns:'140px 1fr',
                  overflow:'hidden',
                  background:'#fff',border:'1px solid var(--line)',
                  boxShadow:'var(--shadow)',
                  clipPath:'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)',
                  minHeight:'100px',
                }}>
                  <div style={{
                    backgroundImage:`url("${t.bg}")`,
                    backgroundSize:'cover',backgroundPosition:'center',
                    position:'relative',
                  }}>
                    <div style={{position:'absolute',inset:0,background:'rgba(17,17,17,.18)'}} />
                  </div>
                  <div style={{padding:'16px 18px',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                    <strong style={{display:'block',marginBottom:'4px'}}>{t.title}</strong>
                    <span style={{color:'var(--muted)',fontSize:'.9rem'}}>{t.sub}</span>
                    <span style={{marginTop:'8px',fontSize:'.82rem',color:'var(--red)',fontWeight:800}}>
                      보러가기 →
                    </span>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}

            {/* 전체 보기 버튼 */}
            <RevealOnScroll delay={3}>
              <Link href="/media" className="btn btn-secondary" style={{width:'100%',justifyContent:'center'}}>
                <i className="fa-solid fa-images" style={{marginRight:'6px'}} />
                전체 미디어 보기
              </Link>
            </RevealOnScroll>
          </div>

        </div>
      </div>
    </section>
  )
}
