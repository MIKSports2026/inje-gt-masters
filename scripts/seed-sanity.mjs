// scripts/seed-sanity.mjs
// 목업 데이터를 Sanity에 일괄 입력하는 스크립트
// 실행: node scripts/seed-sanity.mjs

import { createClient } from '@sanity/client'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

// .env.local 직접 파싱 (dotenv 없이)
const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, '..', '.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf-8')
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token:     env.SANITY_API_WRITE_TOKEN,
  useCdn:    false,
})

// ── 헬퍼 ────────────────────────────────────────────────────
async function upsert(doc) {
  // _id 있으면 createOrReplace, 없으면 create
  const result = await client.createOrReplace(doc)
  console.log(`  ✓ ${doc._type}: ${doc._id} (${doc.title ?? doc.name ?? doc.siteName ?? ''})`)
  return result
}

// ── 1. 사이트 설정 (싱글턴) ───────────────────────────────
async function seedSiteSettings() {
  console.log('\n[1] 사이트 설정')
  await upsert({
    _id:   'siteSettings',
    _type: 'siteSettings',
    siteName:        '인제 GT 마스터즈',
    siteNameEn:      'Inje GT Masters',
    slogan:          'Where Legends Begin',
    currentSeason:   2026,
    metaTitle:       '인제 GT 마스터즈 2026 — 공식 홈페이지 | Inje GT Masters',
    metaDescription: '대한민국 정통 GT 내구레이스, 인제 GT 마스터즈. 강원도 인제스피디움 3.9km 서킷, 2026 시즌 연간 4라운드. GT1·GT2·GT3·드리프트·바이크·슈퍼카 참가 신청 접수 중.',
    canonicalUrl:    'https://www.masters-series.kr',
    email:           'info@masters-series.kr',
    phone:           '033-000-0000',
    address:         '강원도 인제군 기린면 상하답로 130',
    isEntryOpen:     true,
    entryNotice:     '2026 시즌 참가 신청 접수중',
    bannerVisible:   false,
    bannerMessage:   '',
    bannerBgColor:   '#DC001A',
    circuitName:     '인제스피디움',
    circuitLength:   3.908,
    circuitLocation: '강원도 인제군 기린면',
    speediumUrl:     'https://www.speedium.co.kr',
  })
}

// ── 2. 라운드 (4개) ─────────────────────────────────────
async function seedRounds() {
  console.log('\n[2] 라운드')
  const rounds = [
    {
      _id: 'round-2026-r1',
      _type: 'round',
      season: 2026,
      roundNumber: 1,
      slug: { _type: 'slug', current: '2026-r1' },
      title: '인제스피디움 개막전',
      titleEn: 'Opening Round',
      subtitle: '2026 인제 GT 마스터즈 R1',
      badge: 'OPENER',
      dateStart: '2026-05-11',
      dateEnd: '2026-05-12',
      status: 'entry_open',
      hasResults: false,
      maxEntries: 107,
    },
    {
      _id: 'round-2026-r2',
      _type: 'round',
      season: 2026,
      roundNumber: 2,
      slug: { _type: 'slug', current: '2026-r2' },
      title: '인제스피디움 서머 라운드',
      titleEn: 'Summer Round',
      subtitle: '2026 인제 GT 마스터즈 R2',
      badge: 'SUMMER',
      dateStart: '2026-07-06',
      dateEnd: '2026-07-07',
      status: 'upcoming',
      hasResults: false,
      maxEntries: 107,
    },
    {
      _id: 'round-2026-r3',
      _type: 'round',
      season: 2026,
      roundNumber: 3,
      slug: { _type: 'slug', current: '2026-r3' },
      title: '인제스피디움 어텀 라운드',
      titleEn: 'Autumn Round',
      subtitle: '2026 인제 GT 마스터즈 R3',
      badge: 'AUTUMN',
      dateStart: '2026-09-07',
      dateEnd: '2026-09-08',
      status: 'upcoming',
      hasResults: false,
      maxEntries: 107,
    },
    {
      _id: 'round-2026-r4',
      _type: 'round',
      season: 2026,
      roundNumber: 4,
      slug: { _type: 'slug', current: '2026-r4' },
      title: '인제스피디움 파이널',
      titleEn: 'Championship Final',
      subtitle: '2026 인제 GT 마스터즈 R4',
      badge: 'CHAMPIONSHIP',
      dateStart: '2026-10-26',
      dateEnd: '2026-10-27',
      status: 'upcoming',
      hasResults: false,
      maxEntries: 107,
    },
  ]
  for (const r of rounds) await upsert(r)
}

// ── 3. 클래스 정보 (6개) ─────────────────────────────────
async function seedClasses() {
  console.log('\n[3] 클래스 정보')
  const classes = [
    {
      _id: 'class-gt1',
      _type: 'classInfo',
      classCode: 'GT1',
      slug: { _type: 'slug', current: 'gt1' },
      order: 1,
      name: 'GT 1',
      nameEn: 'GT1 Pro-Am',
      tagline: 'Pro-Am 내구레이스.',
      accentColor: '#DC001A',
      teamCount: 18,
      driverCount: 36,
      isActive: true,
      isEntryOpen: true,
      entryFeePerRound: 1200000,
      isFeePublic: true,
    },
    {
      _id: 'class-gt2',
      _type: 'classInfo',
      classCode: 'GT2',
      slug: { _type: 'slug', current: 'gt2' },
      order: 2,
      name: 'GT 2',
      nameEn: 'GT2 Amateur',
      tagline: '아마추어 내구레이스.',
      accentColor: '#3b82f6',
      teamCount: 24,
      driverCount: 48,
      isActive: true,
      isEntryOpen: true,
      entryFeePerRound: 900000,
      isFeePublic: true,
    },
    {
      _id: 'class-gt3',
      _type: 'classInfo',
      classCode: 'GT3',
      slug: { _type: 'slug', current: 'gt3' },
      order: 3,
      name: 'GT 3',
      nameEn: 'GT3 Beginner',
      tagline: '입문 내구레이스.',
      accentColor: '#b8921e',
      teamCount: 22,
      driverCount: 26,
      isActive: true,
      isEntryOpen: false,
      entryFeePerRound: 650000,
      isFeePublic: true,
    },
    {
      _id: 'class-drift',
      _type: 'classInfo',
      classCode: 'DRIFT',
      slug: { _type: 'slug', current: 'drift' },
      order: 4,
      name: '드리프트 KDGP',
      nameEn: 'Drift KDGP',
      tagline: 'KDGP 공인 드리프트.',
      accentColor: '#22c55e',
      teamCount: 16,
      driverCount: 16,
      isActive: true,
      isEntryOpen: false,
      entryFeePerRound: 500000,
      isFeePublic: true,
    },
    {
      _id: 'class-bike',
      _type: 'classInfo',
      classCode: 'BIKE',
      slug: { _type: 'slug', current: 'bike' },
      order: 5,
      name: '바이크',
      nameEn: 'Bike Race',
      tagline: '두카티 · 스즈키 바이크.',
      accentColor: '#a855f7',
      teamCount: 15,
      driverCount: 15,
      isActive: true,
      isEntryOpen: false,
      entryFeePerRound: 350000,
      isFeePublic: true,
    },
    {
      _id: 'class-supercar',
      _type: 'classInfo',
      classCode: 'SUPERCAR',
      slug: { _type: 'slug', current: 'supercar' },
      order: 6,
      name: '슈퍼카 챌린지',
      nameEn: 'Supercar Challenge',
      tagline: '고성능 슈퍼카 오픈 챌린지.',
      accentColor: '#f97316',
      teamCount: 12,
      driverCount: 12,
      isActive: true,
      isEntryOpen: true,
      entryFeePerRound: 800000,
      isFeePublic: true,
    },
  ]
  for (const c of classes) await upsert(c)
}

// ── 4. 공지/소식 (5개) ───────────────────────────────────
async function seedPosts() {
  console.log('\n[4] 공지 / 소식')
  const posts = [
    {
      _id: 'post-2026-r1-entry',
      _type: 'post',
      category: 'notice',
      isPinned: true,
      title: '2026 시즌 개막전 R1 참가 신청 접수 시작',
      slug: { _type: 'slug', current: '2026-r1-entry' },
      publishedAt: '2026-03-20T09:00:00.000Z',
      author: '인제 GT 마스터즈 운영사무국',
      excerpt: 'GT1·GT2·슈퍼카 클래스 선착순 접수.',
    },
    {
      _id: 'post-kumho-2026',
      _type: 'post',
      category: 'news',
      isPinned: false,
      title: '금호타이어, 2026 시즌 공식 타이어 파트너 확정',
      slug: { _type: 'slug', current: 'kumho-2026' },
      publishedAt: '2026-01-28T09:00:00.000Z',
      author: '인제 GT 마스터즈 운영사무국',
      excerpt: '금호타이어가 공식 타이어 파트너로 후원 계약을 체결했습니다.',
    },
    {
      _id: 'post-2026-tech-reg',
      _type: 'post',
      category: 'regulation',
      isPinned: false,
      title: '2026 클래스별 차량 기술 규정 업데이트',
      slug: { _type: 'slug', current: '2026-tech-reg' },
      publishedAt: '2026-01-15T09:00:00.000Z',
      author: '인제 GT 마스터즈 운영사무국',
      excerpt: 'GT3 클래스 최저 중량 조정 안내.',
    },
    {
      _id: 'post-2025-final',
      _type: 'post',
      category: 'news',
      isPinned: false,
      title: '2025 파이널 — 역대 최다 107팀 출전 기록',
      slug: { _type: 'slug', current: '2025-final' },
      publishedAt: '2025-11-12T09:00:00.000Z',
      author: '인제 GT 마스터즈 운영사무국',
      excerpt: '역대 최다 참가팀 기록을 달성했습니다.',
    },
    {
      _id: 'post-circuit-2026',
      _type: 'post',
      category: 'news',
      isPinned: false,
      title: '인제스피디움 서킷 정비 완료, 2026 시즌 준비 완료',
      slug: { _type: 'slug', current: 'circuit-2026' },
      publishedAt: '2025-12-20T09:00:00.000Z',
      author: '인제 GT 마스터즈 운영사무국',
      excerpt: '2026 시즌을 위한 서킷 정비가 완료되었습니다.',
    },
  ]
  for (const p of posts) await upsert(p)
}

// ── 5. 파트너 (6개, 로고 없이) ───────────────────────────
async function seedPartners() {
  console.log('\n[5] 파트너 / 스폰서')
  const partners = [
    {
      _id: 'partner-kumho',
      _type: 'partner',
      name: '금호타이어',
      nameEn: 'Kumho Tire',
      slug: { _type: 'slug', current: 'kumho-tire' },
      tier: 'title',
      category: 'tire',
      isActive: true,
      sortOrder: 1,
      contractSeasons: [2026],
    },
    {
      _id: 'partner-speedium',
      _type: 'partner',
      name: '인제스피디움',
      nameEn: 'Inje Speedium',
      slug: { _type: 'slug', current: 'inje-speedium' },
      tier: 'gold',
      category: 'sports',
      isActive: true,
      sortOrder: 1,
      contractSeasons: [2026],
      websiteUrl: 'https://www.speedium.co.kr',
    },
    {
      _id: 'partner-inje-county',
      _type: 'partner',
      name: '인제군',
      nameEn: 'Inje County',
      slug: { _type: 'slug', current: 'inje-county' },
      tier: 'official',
      category: 'public',
      isActive: true,
      sortOrder: 1,
      contractSeasons: [2026],
    },
    {
      _id: 'partner-gangwon',
      _type: 'partner',
      name: '강원특별자치도',
      nameEn: 'Gangwon State',
      slug: { _type: 'slug', current: 'gangwon-state' },
      tier: 'official',
      category: 'public',
      isActive: true,
      sortOrder: 2,
      contractSeasons: [2026],
    },
    {
      _id: 'partner-media-1',
      _type: 'partner',
      name: '미디어 파트너',
      nameEn: 'Media Partner',
      slug: { _type: 'slug', current: 'media-partner-1' },
      tier: 'media',
      category: 'media',
      isActive: true,
      sortOrder: 1,
      contractSeasons: [2026],
    },
    {
      _id: 'partner-sponsor-1',
      _type: 'partner',
      name: '스폰서',
      nameEn: 'Sponsor',
      slug: { _type: 'slug', current: 'sponsor-1' },
      tier: 'supporting',
      category: 'other',
      isActive: true,
      sortOrder: 1,
      contractSeasons: [2026],
    },
  ]
  for (const p of partners) await upsert(p)
}

// ── 메인 ────────────────────────────────────────────────
async function main() {
  console.log('🚀 Sanity 시드 데이터 입력 시작')
  console.log(`   프로젝트: ${env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)
  console.log(`   데이터셋: ${env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'}`)

  try {
    await seedSiteSettings()
    await seedRounds()
    await seedClasses()
    await seedPosts()
    await seedPartners()
    console.log('\n✅ 완료! Sanity Studio에서 확인하세요: http://localhost:3000/studio')
  } catch (err) {
    console.error('\n❌ 오류 발생:', err.message)
    if (err.statusCode === 401 || err.statusCode === 403) {
      console.error('\n⚠️  토큰 권한 부족. Sanity Studio → API → Tokens에서')
      console.error('   Editor 권한 토큰을 새로 발급해 SANITY_API_WRITE_TOKEN으로 .env.local에 추가 후 재실행하세요.')
    }
    process.exit(1)
  }
}

main()
