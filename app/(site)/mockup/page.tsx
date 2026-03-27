// app/(site)/mockup/page.tsx — 디자인 목업 미리보기 (Sanity 데이터 없이 샘플 확인용)
import type { Metadata } from 'next'
import type { SiteSettings, Round, ClassInfo, Post, Media, Partner, History } from '@/types/sanity'

import SectionHero        from '@/components/sections/SectionHero'
import SectionQuickAccess from '@/components/sections/SectionQuickAccess'
import SectionAbout       from '@/components/sections/SectionAbout'
import SectionHistory     from '@/components/sections/SectionHistory'
import SectionSeason      from '@/components/sections/SectionSeason'
import SectionClasses     from '@/components/sections/SectionClasses'
import SectionEntry       from '@/components/sections/SectionEntry'
import SectionResults     from '@/components/sections/SectionResults'
import SectionMedia       from '@/components/sections/SectionMedia'
import SectionPartners    from '@/components/sections/SectionPartners'
import SectionSpeedium    from '@/components/sections/SectionSpeedium'

export const metadata: Metadata = {
  title: '디자인 목업 미리보기',
  robots: { index: false, follow: false },
}

// ── 샘플 데이터 ────────────────────────────────────────────────

const SETTINGS: SiteSettings = {
  siteName: '인제 GT 마스터즈',
  siteNameEn: 'Inje GT Masters',
  slogan: 'Where Legends Begin',
  currentSeason: 2026,
  metaTitle: '인제 GT 마스터즈 2026',
  metaDescription: '대한민국 정통 GT 내구레이스',
  canonicalUrl: 'https://www.masters-series.kr',
  email: 'info@masters-series.kr',
  phone: '033-000-0000',
  isEntryOpen: true,
  entryNotice: '2026 시즌 참가 신청 접수중',
  bannerVisible: false,
  bannerMessage: '',
  circuitName: '인제스피디움',
  circuitLength: 3.908,
  circuitLocation: '강원도 인제군',
}

const ROUNDS: Round[] = [
  { _id:'r1', season:2026, roundNumber:1, slug:{current:'2026-r1'}, title:'R1 — 개막전',       badge:'OPENER',      dateStart:'2026-05-17', dateEnd:'2026-05-18', status:'entry_open', hasResults:false },
  { _id:'r2', season:2026, roundNumber:2, slug:{current:'2026-r2'}, title:'R2 — 서머',          badge:'SUMMER',      dateStart:'2026-07-12', dateEnd:'2026-07-13', status:'upcoming',   hasResults:false },
  { _id:'r3', season:2026, roundNumber:3, slug:{current:'2026-r3'}, title:'R3 — 나이트레이스',  badge:'NIGHT RACE',  dateStart:'2026-09-13', dateEnd:'2026-09-14', status:'upcoming',   hasResults:false },
  { _id:'r4', season:2026, roundNumber:4, slug:{current:'2026-r4'}, title:'R4 — 파이널',        badge:'CHAMPIONSHIP',dateStart:'2026-11-01', dateEnd:'2026-11-02', status:'upcoming',   hasResults:false },
]

const CLASSES: ClassInfo[] = [
  { _id:'1', classCode:'GT1',      slug:{current:'gt1'},      order:1, name:'GT 1',          nameEn:'GT1 Pro-Am',         tagline:'Pro-Am 내구레이스. 최상위 GT 클래스.',         accentColor:'#e60023', teamCount:18, driverCount:36, isActive:true, isEntryOpen:true,  entryFeePerRound:1200000, isFeePublic:true },
  { _id:'2', classCode:'GT2',      slug:{current:'gt2'},      order:2, name:'GT 2',          nameEn:'GT2 Amateur',        tagline:'아마추어 내구레이스. 중급 GT 클래스.',          accentColor:'#2563eb', teamCount:24, driverCount:48, isActive:true, isEntryOpen:true,  entryFeePerRound:900000,  isFeePublic:true },
  { _id:'3', classCode:'GT3',      slug:{current:'gt3'},      order:3, name:'GT 3',          nameEn:'GT3 Beginner',       tagline:'입문 내구레이스. 가장 저렴한 참가 비용.',       accentColor:'#b8921e', teamCount:22, driverCount:26, isActive:true, isEntryOpen:false, entryFeePerRound:650000,  isFeePublic:true },
  { _id:'4', classCode:'DRIFT',    slug:{current:'drift'},    order:4, name:'드리프트 KDGP', nameEn:'Drift KDGP',         tagline:'KDGP 공인 드리프트 공식전.',                   accentColor:'#16a34a', teamCount:16, driverCount:16, isActive:true, isEntryOpen:false, entryFeePerRound:500000,  isFeePublic:true },
  { _id:'5', classCode:'BIKE',     slug:{current:'bike'},     order:5, name:'바이크',         nameEn:'Bike Race',          tagline:'두카티 · 스즈키 바이크 레이스.',               accentColor:'#a855f7', teamCount:15, driverCount:15, isActive:true, isEntryOpen:false, entryFeePerRound:350000,  isFeePublic:true },
  { _id:'6', classCode:'SUPERCAR', slug:{current:'supercar'}, order:6, name:'슈퍼카 챌린지', nameEn:'Supercar Challenge', tagline:'고성능 슈퍼카 중심 오픈 챌린지.',             accentColor:'#f97316', teamCount:12, driverCount:12, isActive:true, isEntryOpen:true,  entryFeePerRound:800000,  isFeePublic:true },
]

const HISTORY: History[] = [
  { _id:'2025', year:2025, edition:'제7회', headline:'역대 최다 107팀 출전 기록 달성', summary:'2025 파이널 라운드에서 역대 최다 107팀이 출전하며 새 기록을 세웠습니다.', isPublished:true,
    stats:[{label:'참가팀',value:'107'},{label:'드라이버',value:'208명'},{label:'관람객',value:'12,400명'}],
    champions:[{classCode:'GT1',teamName:'Apex Racing',driver1:'김민준',driver2:'이서연',carModel:'BMW M4 GT3'},{classCode:'GT2',teamName:'Speedium MS',driver1:'남궁철',driver2:'서민지',carModel:'Porsche 911 GT3 Cup'}] },
  { _id:'2024', year:2024, edition:'제6회', headline:'나이트레이스 최초 도입 성공', summary:'나이트레이스 도입으로 새로운 관람 문화를 만들었습니다.', isPublished:true,
    stats:[{label:'참가팀',value:'92'},{label:'드라이버',value:'184명'},{label:'관람객',value:'10,800명'}],
    champions:[{classCode:'GT1',teamName:'Carbon Speed',driver1:'정현우',driver2:'윤지수',carModel:'Mercedes AMG GT3'}] },
  { _id:'2023', year:2023, edition:'제5회', headline:'드리프트 KDGP 클래스 신설', summary:'KDGP 공인 드리프트 클래스를 신설하여 6개 클래스 체제를 완성했습니다.', isPublished:true,
    stats:[{label:'참가팀',value:'78'},{label:'드라이버',value:'156명'},{label:'관람객',value:'9,200명'}],
    champions:[{classCode:'GT1',teamName:'TurboGT',driver1:'오승민',driver2:'한지원',carModel:'Audi R8 LMS'}] },
  { _id:'2022', year:2022, edition:'제4회', headline:'바이크 클래스 정식 편입', summary:'모터사이클 클래스를 정식 종목으로 편입하며 5클래스 체제로 확대했습니다.', isPublished:true,
    stats:[{label:'참가팀',value:'64'},{label:'드라이버',value:'128명'}], champions:[] },
  { _id:'2021', year:2021, edition:'제3회', headline:'인제스피디움 전용 야간 조명 설치', summary:'나이트레이스를 위한 야간 조명 인프라를 완성했습니다.', isPublished:true,
    stats:[{label:'참가팀',value:'52'},{label:'드라이버',value:'104명'}], champions:[] },
  { _id:'2020', year:2020, edition:'제1회', headline:'인제 GT 마스터즈 창설', summary:'GT1·GT2·GT3 3개 클래스로 시작한 첫 번째 시즌.', isPublished:true,
    stats:[{label:'참가팀',value:'38'},{label:'드라이버',value:'76명'}], champions:[] },
]

const POSTS: Post[] = [
  { _id:'p1', category:'notice', isPinned:true,  title:'2026 시즌 개막전 R1 참가 신청 접수 시작', slug:{current:'2026-r1-entry'}, publishedAt:'2026-03-20', excerpt:'GT1·GT2·슈퍼카 클래스 선착순 접수가 시작되었습니다.' },
  { _id:'p2', category:'news',   isPinned:false, title:'금호타이어, 2026 시즌 공식 타이어 파트너 확정', slug:{current:'kumho-2026'}, publishedAt:'2026-03-15', excerpt:'금호타이어가 2026 시즌 공식 타이어 파트너로 후원 계약을 체결하였습니다.' },
  { _id:'p3', category:'regulation', isPinned:false, title:'2026 클래스별 차량 기술 규정 업데이트', slug:{current:'2026-tech-reg'}, publishedAt:'2026-03-10', excerpt:'GT3 클래스 최저 중량 조정 및 드리프트 타이어 규정 변경사항 안내.' },
  { _id:'p4', category:'news',   isPinned:false, title:'2025 파이널 — 역대 최다 107팀 출전 기록', slug:{current:'2025-final'}, publishedAt:'2025-11-05', excerpt:'2025 시즌 최종 라운드에서 역대 최다 참가팀 기록을 달성했습니다.' },
]

const MEDIA: Media[] = [
  { _id:'v1', mediaType:'video', title:'2025 시즌 파이널 — 레이스 풀 하이라이트', slug:{current:'2025-final-highlight'}, publishedAt:'2025-11-06', youtubeUrl:'https://youtu.be/dQw4w9WgXcQ', youtubeThumbnail:'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration:'14:52', isFeatured:true, isPublished:true },
  { _id:'p1', mediaType:'photoAlbum', title:'2025 나이트레이스 R3 레이스 현장', slug:{current:'2025-r3-photos'}, publishedAt:'2025-09-16', isFeatured:true, isPublished:true, photoCount:118 },
  { _id:'p2', mediaType:'photoAlbum', title:'2025 파이널 시상식', slug:{current:'2025-final-ceremony'}, publishedAt:'2025-11-05', isFeatured:false, isPublished:true, photoCount:42 },
]

const PARTNERS: Partner[] = [
  { _id:'1', name:'인제스피디움', tier:'title',    isActive:true, logo:{asset:{_id:'',url:'',metadata:{lqip:'',dimensions:{width:200,height:80}}}} },
  { _id:'2', name:'금호타이어',   tier:'gold',     isActive:true, logo:{asset:{_id:'',url:'',metadata:{lqip:'',dimensions:{width:200,height:80}}}} },
  { _id:'3', name:'인제군청',     tier:'official', isActive:true, logo:{asset:{_id:'',url:'',metadata:{lqip:'',dimensions:{width:200,height:80}}}} },
  { _id:'4', name:'강원특별자치도',tier:'official', isActive:true, logo:{asset:{_id:'',url:'',metadata:{lqip:'',dimensions:{width:200,height:80}}}} },
  { _id:'5', name:'모터스포츠 코리아', tier:'media', isActive:true, logo:{asset:{_id:'',url:'',metadata:{lqip:'',dimensions:{width:200,height:80}}}} },
]

// ── 목업 페이지 ────────────────────────────────────────────────

export default function MockupPage() {
  const nextRound = ROUNDS[0]

  return (
    <>
      {/* 목업 안내 배너 */}
      <div style={{
        position:'sticky', top:'var(--header-h)', zIndex:200,
        background:'#1a0a00', color:'#fff',
        padding:'10px 0', borderBottom:'2px solid var(--red)',
      }}>
        <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',flexWrap:'wrap'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <span style={{
              padding:'3px 10px', fontSize:'.72rem', fontWeight:900,
              background:'var(--red)', letterSpacing:'.1em', textTransform:'uppercase',
            }}>MOCKUP</span>
            <span style={{fontSize:'.88rem',opacity:.85}}>
              디자인 목업 미리보기 — 샘플 데이터로 레이아웃을 확인하는 페이지입니다.
            </span>
          </div>
          <span style={{fontSize:'.8rem',opacity:.6}}>
            실제 사이트: <a href="/" style={{color:'var(--red)',fontWeight:800}}>/</a>
            &nbsp;·&nbsp;
            스튜디오: <a href="/studio" style={{color:'var(--red)',fontWeight:800}}>/studio</a>
          </span>
        </div>
      </div>

      <SectionHero
        settings={SETTINGS}
        nextRound={nextRound}
        rounds={ROUNDS}
      />
      <SectionQuickAccess settings={SETTINGS} />
      <SectionAbout />
      <SectionHistory history={HISTORY} />
      <SectionSeason rounds={ROUNDS} />
      <SectionClasses classes={CLASSES} />
      <SectionEntry settings={SETTINGS} classes={CLASSES} />
      <SectionResults rounds={ROUNDS} />
      <SectionMedia media={MEDIA} posts={POSTS} />
      <SectionPartners partners={PARTNERS} />
      <SectionSpeedium settings={SETTINGS} />
    </>
  )
}
