#!/usr/bin/env node
// scripts/seed-content-2.mjs — 추가 콘텐츠 시딩 (뉴스 7 + 미디어 4 + 안내 1)
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'

const envRaw = readFileSync(new URL('../.env.local', import.meta.url), 'utf-8')
const env = Object.fromEntries(
  envRaw.split('\n').filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0,i).trim(), l.slice(i+1).trim()] })
)

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// ── 헬퍼 ──────────────────────────────────────────────────
function block(key, text) {
  return {
    _type: 'block', _key: key, style: 'normal', markDefs: [],
    children: [{ _type: 'span', _key: `${key}s`, text, marks: [] }],
  }
}

// ══════════════════════════════════════════════════════════
// [1] post 도큐먼트 — 뉴스/기사 7개
// ══════════════════════════════════════════════════════════
const posts = [
  {
    _id: 'post-brand-renewal',
    _type: 'post',
    category: 'press',
    isPinned: false,
    title: '인제 GT 마스터즈로 명칭 변경 — 브랜드 아이덴티티 전면 개편',
    slug: { _type: 'slug', current: 'brand-renewal-2026' },
    publishedAt: '2026-03-27T09:00:00+09:00',
    author: '인제 GT 마스터즈 운영사무국',
    excerpt: "국내 유일 내구레이스 '인제 마스터즈 시리즈'가 '인제 GT 마스터즈'로 명칭 변경. 슬로건 'Where Legends Begin' 확정.",
    body: [
      block('b1', "국내 유일의 아마추어 내구레이스 시리즈 '인제 마스터즈 시리즈'가 2026 시즌을 맞아 '인제 GT 마스터즈'로 명칭을 변경하고 브랜드 아이덴티티를 전면 개편했습니다."),
      block('b2', "새로운 슬로건 'Where Legends Begin'은 레이서의 근성과 머신의 한계가 만나는 정통 내구레이스로의 도약을 선언하는 의미를 담고 있습니다."),
      block('b3', '공식 홈페이지 전면 개편, 온라인 참가신청 시스템 도입, 시각 아이덴티티 통일 등 브랜드 전반에 걸친 변화가 이루어졌습니다.'),
      block('b4', '출처: https://www.autoracing.co.kr/news/articleView.html?idxno=47579'),
    ],
  },
  {
    _id: 'post-2026-schedule',
    _type: 'post',
    category: 'notice',
    isPinned: true,
    title: '2026 인제 마스터즈 시리즈 일정 발표 — 5라운드·나이트레이스·GTS 신설',
    slug: { _type: 'slug', current: '2026-masters-schedule' },
    publishedAt: '2026-01-05T09:00:00+09:00',
    author: '인제 GT 마스터즈 운영사무국',
    excerpt: '4월 5일 개막전을 시작으로 총 5라운드. 3·4라운드 나이트 레이스. 국내 최초 5시간 내구레이스 도입.',
    body: [
      block('b1', '2026 인제 마스터즈 시리즈(현 인제 GT 마스터즈)의 시즌 일정이 공식 발표되었습니다.'),
      block('b2', '올해 시즌은 총 5라운드로 구성되며, 4월 5일 개막전을 시작으로 11월까지 이어집니다. 3라운드와 4라운드는 나이트 레이스로 개최되어 야간 서킷의 특별한 경험을 제공합니다.'),
      block('b3', '국내 최초 5시간 내구레이스가 도입되며, GTS(GT Sport) 클래스가 신설됩니다. 시즌 종료 후 최초로 시즌 챔피언 종합 시상식이 개최될 예정입니다.'),
      block('b4', '출처: https://www.autoracing.co.kr/news/articleView.html?idxno=46853'),
    ],
  },
  {
    _id: 'post-2025-clean-sweep',
    _type: 'post',
    category: 'news',
    isPinned: false,
    title: '2025 인제 마스터즈 시즌 전승 달성 — 김현석·원대한 역사적 대기록',
    slug: { _type: 'slug', current: '2025-clean-sweep' },
    publishedAt: '2025-10-11T18:00:00+09:00',
    author: '인제 GT 마스터즈 운영사무국',
    excerpt: '김현석·원대한(팀 루트개러지)이 2025 시즌 5전 전승 달성. 인제 마스터즈 역사상 최초 전승 기록.',
    body: [
      block('b1', '김현석·원대한 조(팀 루트개러지)가 2025 인제 마스터즈 시리즈에서 시즌 5전 전승이라는 역사적 대기록을 달성했습니다.'),
      block('b2', '개막전부터 최종전까지 단 한 번도 정상을 내주지 않은 완벽한 시즌으로, 인제 마스터즈 시리즈 창설 이래 최초의 전승 기록입니다.'),
      block('b3', '출처: https://www.autoracing.co.kr/news/articleView.html?idxno=45914'),
    ],
  },
  {
    _id: 'post-2025-opening',
    _type: 'post',
    category: 'news',
    isPinned: false,
    title: '2025 인제 마스터즈 개막 — 국내 첫 300km 내구레이스 도입',
    slug: { _type: 'slug', current: '2025-season-opening' },
    publishedAt: '2025-03-30T18:00:00+09:00',
    author: '인제 GT 마스터즈 운영사무국',
    excerpt: '2025 시즌 개막전, 인제 내구 사상 최초 300km 레이스 도입. 27대 참가, 김현석·원대한 폴 투 피니시.',
    body: [
      block('b1', '2025 인제 마스터즈 시리즈가 개막했습니다. 이번 시즌부터 인제 내구 레이스 사상 최초로 300km 장거리 레이스가 도입되었습니다.'),
      block('b2', '개막전에 27대가 참가했으며, 디펜딩 챔피언 김현석·원대한 조가 폴포지션에서 출발해 피니시까지 선두를 지키는 폴 투 피니시로 시즌 첫 우승을 차지했습니다.'),
      block('b3', '출처: https://raceweek.co.kr/2025-인제-마스터즈-시리즈-개막/'),
    ],
  },
  {
    _id: 'post-2024-finale',
    _type: 'post',
    category: 'news',
    isPinned: false,
    title: '2024 인제 마스터즈 시즌 2 성료 — 참가 규모 2배 성장',
    slug: { _type: 'slug', current: '2024-season-finale' },
    publishedAt: '2024-11-04T18:00:00+09:00',
    author: '인제 GT 마스터즈 운영사무국',
    excerpt: '시즌 누적 경주차 107대·드라이버 208명으로 첫 시즌 대비 2배 성장. 금호타이어 공식 후원, 유튜브 생중계 도입.',
    body: [
      block('b1', '2024 인제 마스터즈 시리즈 시즌 2가 성공적으로 마무리되었습니다.'),
      block('b2', '시즌 누적 경주차 107대, 드라이버 208명이 참가하여 첫 시즌(2023) 대비 2배 이상의 성장을 기록했습니다. 금호타이어가 공식 타이어 후원사로 합류했으며, 유튜브 생중계가 도입되어 팬들에게 더 가까이 다가갔습니다.'),
      block('b3', '출처: https://www.pressian.com/pages/articles/2024110417472769952'),
    ],
  },
  {
    _id: 'post-2024-opening',
    _type: 'post',
    category: 'press',
    isPinned: false,
    title: '2024 인제 마스터즈 시리즈 개막 — 슈퍼카 챌린지·KDGP 첫 도입',
    slug: { _type: 'slug', current: '2024-season-opening' },
    publishedAt: '2024-04-13T09:00:00+09:00',
    author: '인제 GT 마스터즈 운영사무국',
    excerpt: '시즌 포인트제 도입, 금호타이어 공식 후원, 슈퍼카 챌린지 신설, KDGP 드리프트 대회 도입.',
    body: [
      block('b1', '2024 인제 마스터즈 시리즈가 4월 13일 개막했습니다.'),
      block('b2', '이번 시즌부터 시즌 포인트제가 도입되어 연간 챔피언을 선발합니다. 금호타이어가 공식 타이어 후원사로 합류했으며, 슈퍼카 챌린지 클래스가 신설되고 KDGP 드리프트 대회가 병행 개최됩니다.'),
      block('b3', '인제스피디움 유튜브 채널을 통한 생중계도 시작되어 현장에 오지 못하는 팬들도 실시간으로 경기를 관람할 수 있게 되었습니다.'),
      block('b4', '출처: https://www.autoracing.co.kr/news/articleView.html?idxno=41562'),
    ],
  },
  {
    _id: 'post-2023-launch',
    _type: 'post',
    category: 'press',
    isPinned: false,
    title: '인제 마스터즈 시리즈 창설 — 국내 최초 내구레이스 시리즈 출범',
    slug: { _type: 'slug', current: '2023-series-launch' },
    publishedAt: '2023-05-07T09:00:00+09:00',
    author: '인제 GT 마스터즈 운영사무국',
    excerpt: '자동차 내구레이스·바이크·드리프트를 한 자리에서. 모터스포츠 대중화를 목표로 창설.',
    body: [
      block('b1', '2023년 5월, 인제 마스터즈 시리즈가 창설되었습니다. 자동차 내구레이스, 바이크 레이스, 드리프트를 한 자리에서 만날 수 있는 국내 최초의 종합 모터스포츠 시리즈입니다.'),
      block('b2', '모터스포츠의 대중화를 목표로 인제스피디움이 직접 기획·운영하며, 아마추어부터 세미프로까지 누구나 도전할 수 있는 열린 구조로 설계되었습니다.'),
      block('b3', '출처: http://news.bizwatch.co.kr/article/real_estate/2023/05/08/0015'),
    ],
  },
]

// ══════════════════════════════════════════════════════════
// [2] media 도큐먼트 — 영상 4개
// ══════════════════════════════════════════════════════════
const YOUTUBE_CHANNEL = 'https://www.youtube.com/@injespeedium'

const mediaItems = [
  {
    _id: 'media-2025-r4-night',
    _type: 'media',
    mediaType: 'video',
    title: '2025 인제 마스터즈 시리즈 4라운드 나이트레이스 하이라이트',
    slug: { _type: 'slug', current: '2025-r4-night-highlight' },
    publishedAt: '2025-09-20T18:00:00+09:00',
    description: '2025 시즌 4라운드 나이트레이스 하이라이트. 야간 서킷에서 펼쳐진 치열한 내구레이스.',
    youtubeUrl: YOUTUBE_CHANNEL,
    tags: ['r3'],
    isFeatured: true,
    isPublished: true,
    sortOrder: 1,
  },
  {
    _id: 'media-2025-r5-final',
    _type: 'media',
    mediaType: 'video',
    title: '2025 인제 마스터즈 시리즈 최종전 하이라이트',
    slug: { _type: 'slug', current: '2025-r5-final-highlight' },
    publishedAt: '2025-10-11T18:00:00+09:00',
    description: '2025 시즌 최종전(R5) 하이라이트. 김현석·원대한 시즌 전승 달성의 순간.',
    youtubeUrl: YOUTUBE_CHANNEL,
    tags: ['r4'],
    isFeatured: true,
    isPublished: true,
    sortOrder: 2,
  },
  {
    _id: 'media-2024-r1-opening',
    _type: 'media',
    mediaType: 'video',
    title: '2024 인제 마스터즈 시리즈 개막전 하이라이트',
    slug: { _type: 'slug', current: '2024-r1-opening-highlight' },
    publishedAt: '2024-04-13T18:00:00+09:00',
    description: '2024 시즌 개막전 하이라이트. 슈퍼카 챌린지·KDGP 드리프트 첫 도입.',
    youtubeUrl: YOUTUBE_CHANNEL,
    tags: ['r1'],
    isFeatured: false,
    isPublished: true,
    sortOrder: 3,
  },
  {
    _id: 'media-2026-intro',
    _type: 'media',
    mediaType: 'video',
    title: '인제 GT 마스터즈 2026 시즌 소개 영상',
    slug: { _type: 'slug', current: '2026-season-intro' },
    publishedAt: '2026-03-01T09:00:00+09:00',
    description: '2026 인제 GT 마스터즈 시즌 소개. 브랜드 리뉴얼, 새로운 슬로건 "Where Legends Begin".',
    youtubeUrl: YOUTUBE_CHANNEL,
    tags: [],
    isFeatured: true,
    isPublished: true,
    sortOrder: 0,
  },
]

// ══════════════════════════════════════════════════════════
// [3] post 도큐먼트 — 서킷 안내
// ══════════════════════════════════════════════════════════
const circuitPost = {
  _id: 'post-circuit-guide',
  _type: 'post',
  category: 'notice',
  isPinned: false,
  title: '인제스피디움 오시는 길 및 관람 안내',
  slug: { _type: 'slug', current: 'speedium-access-guide' },
  publishedAt: '2026-03-15T09:00:00+09:00',
  author: '인제 GT 마스터즈 운영사무국',
  excerpt: '강원도 인제군 기린면 상하답로 130. 서울양양고속도로 인제IC 이용. FIA 그레이드 2급 국제서킷.',
  body: [
    block('b1', '■ 주소: 강원도 인제군 기린면 상하답로 130 (인제스피디움)'),
    block('b2', '■ 대표전화: 1644-3366'),
    block('b3', '■ 교통안내: 서울양양고속도로 인제IC → 상하답로 방향 약 15분. 서울에서 약 2시간 소요.'),
    block('b4', '■ 서킷 정보: 전장 3.908km, 15개 코너, FIA 그레이드 2급 국제 공인 서킷. 앨런 윌슨(Alan Wilson) 설계.'),
    block('b5', '■ 관람석: 메인 스트레이트 관중석(4,000석), 챔피언스 클럽(VIP 라운지).'),
    block('b6', '■ 숙박: 인제스피디움 리조트 — 4성급 호텔(134실), 콘도(118실) 병설. 대회 기간 특별 요금 적용.'),
    block('b7', '■ 부대시설: 클래식카 박물관, 카팅 트랙, 오프로드 체험장, 레스토랑.'),
  ],
}

// ── 실행 ─────────────────────────────────────────────────────
async function seed() {
  console.log('🏁 추가 시딩 시작...\n')

  const tx = client.transaction()
  const all = [...posts, ...mediaItems, circuitPost]

  for (const doc of all) {
    tx.createOrReplace(doc)
  }

  const result = await tx.commit()
  console.log(`✅ ${result.documentIds.length}개 도큐먼트 생성/업데이트 완료`)
  console.log('   - post (뉴스/기사):', posts.length, '개')
  console.log('   - media (영상):', mediaItems.length, '개')
  console.log('   - post (서킷 안내):', 1, '개')
  console.log(`\n총 ${all.length}개 도큐먼트`)
}

seed().catch(err => {
  console.error('❌ 시딩 실패:', err.message)
  process.exit(1)
})
