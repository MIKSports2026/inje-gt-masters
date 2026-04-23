// app/(site)/mockup/page.tsx — v3 디자인 목업 미리보기
import type { Metadata } from 'next'
import type { SiteSettings, Round, ClassInfo, Post, Media, Partner } from '@/types/sanity'

import SectionDDayBanner from '@/components/sections/SectionDDayBanner'
import SectionHero       from '@/components/sections/SectionHero'
import SectionStatsBar   from '@/components/sections/SectionStatsBar'
import SectionTicker     from '@/components/sections/SectionTicker'
import SectionSeason     from '@/components/sections/SectionSeason'
import SectionEntry      from '@/components/sections/SectionEntry'
import SectionBrandStrip from '@/components/sections/SectionBrandStrip'
import SectionResults    from '@/components/sections/SectionResults'
import SectionMedia      from '@/components/sections/SectionMedia'
import SectionSEO        from '@/components/sections/SectionSEO'
import SectionPartners   from '@/components/sections/SectionPartners'

export const metadata: Metadata = {
  title: '디자인 목업 미리보기',
  robots: { index: false, follow: false },
}

// ── 샘플 데이터 ────────────────────────────────────────────────

const SETTINGS: SiteSettings = {
  siteName: '인제 GT 마스터즈', siteNameEn: 'Inje GT Masters',
  slogan: 'Where Legends Begin', currentSeason: 2026,
  metaTitle: '인제 GT 마스터즈 2026', metaDescription: '대한민국 정통 GT 내구레이스',
  canonicalUrl: 'https://www.masters-series.kr',
  email: 'info@masters-series.kr', phone: '033-000-0000',
  isEntryOpen: true, entryNotice: '2026 시즌 참가 신청 접수중',
  bannerVisible: false, bannerMessage: '',
  circuitName: '인제스피디움', circuitLength: 3.908, circuitLocation: '강원도 인제군',
}

const ROUNDS: Round[] = [
  { _id:'r1', season:2026, roundNumber:1, slug:{current:'2026-r1'}, title:'인제스피디움 개막전',      badge:'OPENER',       dateStart:'2026-05-11', dateEnd:'2026-05-12', status:'entry_open', hasResults:false },
  { _id:'r2', season:2026, roundNumber:2, slug:{current:'2026-r2'}, title:'인제스피디움 서머 라운드', badge:'SUMMER',       dateStart:'2026-07-06', dateEnd:'2026-07-07', status:'upcoming',   hasResults:false },
  { _id:'r3', season:2026, roundNumber:3, slug:{current:'2026-r3'}, title:'인제스피디움 어텀 라운드', badge:'AUTUMN',       dateStart:'2026-09-07', dateEnd:'2026-09-08', status:'upcoming',   hasResults:false },
  { _id:'r4', season:2026, roundNumber:4, slug:{current:'2026-r4'}, title:'인제스피디움 파이널',      badge:'CHAMPIONSHIP', dateStart:'2026-10-26', dateEnd:'2026-10-27', status:'upcoming',   hasResults:false },
]

const CLASSES: ClassInfo[] = [
  { _id:'1', classCode:'masters-1',   slug:{current:'masters-1'},   order:1, name:'Masters 1',    nameEn:'Masters 1',     tagline:'2,000cc 이하 터보 / 3,800cc 이하 자연흡기', accentColor:'#DC001A', teamCount:0, driverCount:0, isActive:true, isEntryOpen:false, entryFeePerRound:700000, isFeePublic:true },
  { _id:'2', classCode:'masters-2',   slug:{current:'masters-2'},   order:2, name:'Masters 2',    nameEn:'Masters 2',     tagline:'1,600cc 이하 터보 / 2,000cc 이하 자연흡기', accentColor:'#3b82f6', teamCount:0, driverCount:0, isActive:true, isEntryOpen:false, entryFeePerRound:600000, isFeePublic:true },
  { _id:'3', classCode:'masters-n',   slug:{current:'masters-n'},   order:3, name:'Masters N',    nameEn:'Masters N',     tagline:'2,000cc 이하 터보 (현대 N 차량)',           accentColor:'#b8921e', teamCount:0, driverCount:0, isActive:true, isEntryOpen:false, entryFeePerRound:600000, isFeePublic:true },
  { _id:'4', classCode:'masters-3',   slug:{current:'masters-3'},   order:4, name:'Masters 3',    nameEn:'Masters 3',     tagline:'1,600cc 이하 자연흡기',                     accentColor:'#22c55e', teamCount:0, driverCount:0, isActive:true, isEntryOpen:false, entryFeePerRound:500000, isFeePublic:true },
  { _id:'5', classCode:'masters-n-evo',slug:{current:'masters-n-evo'},order:5,name:'Masters N-evo',nameEn:'Masters N-evo', tagline:'1,600cc 이하 자연흡기',                     accentColor:'#a855f7', teamCount:0, driverCount:0, isActive:true, isEntryOpen:false, entryFeePerRound:500000, isFeePublic:true },
]

const POSTS: Post[] = [
  { _id:'p1', category:'notice',     isPinned:true,  title:'2026 시즌 개막전 R1 참가 신청 접수 시작',          slug:{current:'2026-r1-entry'}, publishedAt:'2026-03-20', excerpt:'GT1·GT2·슈퍼카 클래스 선착순 접수.' },
  { _id:'p2', category:'news',       isPinned:false, title:'금호타이어, 2026 시즌 공식 타이어 파트너 확정',      slug:{current:'kumho-2026'},    publishedAt:'2026-01-28', excerpt:'금호타이어가 공식 타이어 파트너로 후원 계약을 체결.' },
  { _id:'p3', category:'regulation', isPinned:false, title:'2026 클래스별 차량 기술 규정 업데이트',             slug:{current:'2026-tech-reg'}, publishedAt:'2026-01-15', excerpt:'GT3 클래스 최저 중량 조정 안내.' },
  { _id:'p4', category:'news',       isPinned:false, title:'2025 파이널 — 역대 최다 107팀 출전 기록',           slug:{current:'2025-final'},    publishedAt:'2025-11-12', excerpt:'역대 최다 참가팀 기록을 달성했습니다.' },
  { _id:'p5', category:'news',       isPinned:false, title:'인제스피디움 서킷 정비 완료, 2026 시즌 준비 완료', slug:{current:'circuit-2026'},  publishedAt:'2025-12-20', excerpt:'2026 시즌을 위한 서킷 정비가 완료되었습니다.' },
]

const MEDIA: Media[] = [
  { _id:'v1', mediaType:'video',      title:'2025 파이널 라운드 레이스 하이라이트 풀버전', slug:{current:'2025-final-highlight'}, publishedAt:'2025-11-06', youtubeUrl:'https://youtu.be/dQw4w9WgXcQ', youtubeThumbnail:'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration:'14:52', isFeatured:true,  isPublished:true },
  { _id:'p1', mediaType:'photoAlbum', title:'GT1 클래스 그리드 스타트',                   slug:{current:'2025-r4-grid'},        publishedAt:'2025-10-27', isFeatured:true,  isPublished:true, photoCount:88 },
  { _id:'p2', mediaType:'photoAlbum', title:'KDGP 드리프트 배틀',                         slug:{current:'2025-r3-drift'},       publishedAt:'2025-09-08', isFeatured:false, isPublished:true, photoCount:54 },
  { _id:'p3', mediaType:'photoAlbum', title:'파이널 라운드 시상식',                        slug:{current:'2025-final-ceremony'}, publishedAt:'2025-10-27', isFeatured:false, isPublished:true, photoCount:42 },
  { _id:'p4', mediaType:'photoAlbum', title:'바이크 클래스 코너링',                        slug:{current:'2025-r2-bike'},        publishedAt:'2025-07-07', isFeatured:false, isPublished:true, photoCount:36 },
]

const PARTNERS: Partner[] = [
  { _id:'1', name:'금호타이어',     tier:'title',    isActive:true, logo:{asset:{_id:'',url:'',metadata:{lqip:'',dimensions:{width:200,height:80}}}} },
  { _id:'2', name:'인제스피디움',   tier:'gold',     isActive:true, logo:{asset:{_id:'',url:'',metadata:{lqip:'',dimensions:{width:200,height:80}}}} },
  { _id:'3', name:'인제군',         tier:'official', isActive:true, logo:{asset:{_id:'',url:'',metadata:{lqip:'',dimensions:{width:200,height:80}}}} },
  { _id:'4', name:'강원특별자치도', tier:'official', isActive:true, logo:{asset:{_id:'',url:'',metadata:{lqip:'',dimensions:{width:200,height:80}}}} },
  { _id:'5', name:'PARTNER',        tier:'media',    isActive:true, logo:{asset:{_id:'',url:'',metadata:{lqip:'',dimensions:{width:200,height:80}}}} },
  { _id:'6', name:'SPONSOR',        tier:'media',    isActive:true, logo:{asset:{_id:'',url:'',metadata:{lqip:'',dimensions:{width:200,height:80}}}} },
]

// ── 목업 페이지 ────────────────────────────────────────────────

export default function MockupPage() {
  const nextRound  = ROUNDS[0]
  const totalCars  = CLASSES.reduce((a, c) => a + (c.teamCount   ?? 0), 0)
  const totalDrvs  = CLASSES.reduce((a, c) => a + (c.driverCount ?? 0), 0)

  return (
    <>
      {/* 목업 안내 배너 */}
      <div style={{
        position: 'sticky', top: '68px', zIndex: 200,
        background: '#1a0a00', color: '#fff',
        padding: '10px 0', borderBottom: '2px solid var(--red)',
      }}>
        <div className="inner" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px', flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <span style={{ padding:'3px 10px', fontSize:'.72rem', fontWeight:900, background:'var(--red)', letterSpacing:'.1em', textTransform:'uppercase' as const }}>MOCKUP</span>
            <span style={{ fontSize:'.88rem', opacity:.85 }}>디자인 목업 — 샘플 데이터로 레이아웃을 확인하는 페이지입니다.</span>
          </div>
          <span style={{ fontSize:'.8rem', opacity:.6 }}>
            실제 사이트: <a href="/" style={{ color:'var(--red)', fontWeight:800 }}>/</a>
            &nbsp;·&nbsp;
            스튜디오: <a href="/studio" style={{ color:'var(--red)', fontWeight:800 }}>/studio</a>
          </span>
        </div>
      </div>

      <SectionDDayBanner settings={SETTINGS} />
      <SectionHero slides={[]} />
      <SectionStatsBar rounds={4} cars={totalCars} drivers={totalDrvs} classes={6} />
      <SectionTicker />
      <SectionSeason rounds={ROUNDS} />
      <SectionEntry settings={SETTINGS} classes={CLASSES} />
      <SectionBrandStrip />
      <SectionResults rounds={ROUNDS} posts={POSTS} />
      <SectionMedia media={MEDIA} />
      <SectionSEO />
      <SectionPartners partners={PARTNERS} />
    </>
  )
}
