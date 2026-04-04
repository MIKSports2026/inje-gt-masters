#!/usr/bin/env node
// scripts/seed-content-3.mjs — classInfo 5 + round 4 + FAQ 1 시딩
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'

const envRaw = readFileSync(new URL('../.env.local', import.meta.url), 'utf-8')
const env = Object.fromEntries(
  envRaw.split('\n').filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0,i).trim(), l.slice(i+1).trim()] })
)

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token:     env.SANITY_API_WRITE_TOKEN,
  useCdn:    false,
})

function block(key, text) {
  return {
    _type: 'block', _key: key, style: 'normal', markDefs: [],
    children: [{ _type: 'span', _key: `${key}s`, text, marks: [] }],
  }
}

function boldBlock(key, text) {
  return {
    _type: 'block', _key: key, style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `${key}s`, text, marks: ['strong'] }],
  }
}

// ══════════════════════════════════════════════════════════
// [1] classInfo 5개
// ══════════════════════════════════════════════════════════
const classes = [
  {
    _id: 'class-ingt1',
    _type: 'classInfo',
    classCode: 'GT1',
    slug: { _type: 'slug', current: 'ingt1' },
    order: 1,
    name: 'INGT1',
    nameEn: 'INGT1',
    tagline: '최상위 클래스 — 고성능 개조 차량',
    accentColor: '#e60023',
    teamCount: 18,
    driverCount: 36,
    carCount: 18,
    features: [
      { _key: 'f1', icon: 'fa-solid fa-trophy', label: '레벨', value: 'PRO' },
      { _key: 'f2', icon: 'fa-solid fa-car-side', label: '차량', value: '고성능 튜닝 차량' },
      { _key: 'f3', icon: 'fa-solid fa-clock', label: '레이스', value: '내구 레이스' },
      { _key: 'f4', icon: 'fa-solid fa-users', label: '드라이버', value: '1~3명/팀' },
    ],
    entryFeePerRound: 1500000,
    entryFeeSeason: 5000000,
    entryFeeNote: 'VAT 별도',
    isFeePublic: true,
    isActive: true,
    isEntryOpen: true,
  },
  {
    _id: 'class-ingt2',
    _type: 'classInfo',
    classCode: 'GT2',
    slug: { _type: 'slug', current: 'ingt2' },
    order: 2,
    name: 'INGT2',
    nameEn: 'INGT2',
    tagline: '중급 퍼포먼스 클래스',
    accentColor: '#2563eb',
    teamCount: 24,
    driverCount: 48,
    carCount: 24,
    features: [
      { _key: 'f1', icon: 'fa-solid fa-gauge-high', label: '레벨', value: 'AMATEUR' },
      { _key: 'f2', icon: 'fa-solid fa-car-side', label: '차량', value: '준수한 튜닝 차량' },
      { _key: 'f3', icon: 'fa-solid fa-clock', label: '레이스', value: '내구 레이스' },
      { _key: 'f4', icon: 'fa-solid fa-users', label: '드라이버', value: '1~3명/팀' },
    ],
    entryFeePerRound: 1200000,
    entryFeeSeason: 4000000,
    entryFeeNote: 'VAT 별도',
    isFeePublic: true,
    isActive: true,
    isEntryOpen: true,
  },
  {
    _id: 'class-ingt3',
    _type: 'classInfo',
    classCode: 'GT3',
    slug: { _type: 'slug', current: 'ingt3' },
    order: 3,
    name: 'INGT3',
    nameEn: 'INGT3',
    tagline: '입문 클래스 — 누구나 도전 가능',
    accentColor: '#16a34a',
    teamCount: 30,
    driverCount: 55,
    carCount: 30,
    features: [
      { _key: 'f1', icon: 'fa-solid fa-graduation-cap', label: '레벨', value: 'BEGINNER' },
      { _key: 'f2', icon: 'fa-solid fa-car', label: '차량', value: '일반/경량 튜닝 차량' },
      { _key: 'f3', icon: 'fa-solid fa-clock', label: '레이스', value: '내구 레이스' },
      { _key: 'f4', icon: 'fa-solid fa-users', label: '드라이버', value: '1~3명/팀' },
    ],
    entryFeePerRound: 900000,
    entryFeeSeason: 3000000,
    entryFeeNote: 'VAT 별도',
    isFeePublic: true,
    isActive: true,
    isEntryOpen: true,
  },
  {
    _id: 'class-gts',
    _type: 'classInfo',
    classCode: 'SUPERCAR',
    slug: { _type: 'slug', current: 'gts' },
    order: 4,
    name: 'GTS',
    nameEn: 'GTS',
    tagline: '2026 신설 — 슈퍼카 클래스',
    accentColor: '#f59e0b',
    teamCount: 10,
    driverCount: 20,
    carCount: 10,
    features: [
      { _key: 'f1', icon: 'fa-solid fa-trophy', label: '레벨', value: 'PRO' },
      { _key: 'f2', icon: 'fa-solid fa-car-burst', label: '차량', value: '슈퍼카 / GT3·GT4' },
      { _key: 'f3', icon: 'fa-solid fa-star', label: '상태', value: '2026 신설' },
      { _key: 'f4', icon: 'fa-solid fa-users', label: '드라이버', value: '1~2명/팀' },
    ],
    entryFeePerRound: 2000000,
    entryFeeSeason: 7000000,
    entryFeeNote: 'VAT 별도',
    isFeePublic: true,
    isActive: true,
    isEntryOpen: true,
  },
  {
    _id: 'class-ingt2n',
    _type: 'classInfo',
    classCode: 'GT2',
    slug: { _type: 'slug', current: 'ingt2n' },
    order: 5,
    name: 'INGT2N',
    nameEn: 'INGT2N',
    tagline: 'N 퍼포먼스 클래스',
    accentColor: '#0074e4',
    teamCount: 15,
    driverCount: 30,
    carCount: 15,
    features: [
      { _key: 'f1', icon: 'fa-solid fa-gauge-high', label: '레벨', value: 'AMATEUR' },
      { _key: 'f2', icon: 'fa-solid fa-n', label: '차량', value: '현대 N 시리즈' },
      { _key: 'f3', icon: 'fa-solid fa-clock', label: '레이스', value: '내구 레이스' },
      { _key: 'f4', icon: 'fa-solid fa-users', label: '드라이버', value: '1~3명/팀' },
    ],
    entryFeePerRound: 1200000,
    entryFeeSeason: 4000000,
    entryFeeNote: 'VAT 별도',
    isFeePublic: true,
    isActive: true,
    isEntryOpen: true,
  },
]

// ══════════════════════════════════════════════════════════
// [2] round 4개
// ══════════════════════════════════════════════════════════
const rounds = [
  {
    _id: 'round-2026-r1',
    _type: 'round',
    season: 2026,
    roundNumber: 1,
    slug: { _type: 'slug', current: '2026-r1' },
    title: '인제스피디움 개막전',
    titleEn: 'Inje Speedium Opening Round',
    subtitle: '2026 인제 GT 마스터즈 R1',
    campaignCopy: 'PUSH YOUR LIMIT — 전설의 시작',
    badge: 'OPENING',
    dateStart: '2026-05-11',
    dateEnd: '2026-05-11',
    status: 'entry_open',
    entryOpenDate: '2026-03-20T00:00:00+09:00',
    entryCloseDate: '2026-05-04T23:59:59+09:00',
    maxEntries: 60,
    entryFeeNote: '클래스별 참가비 상이 — VAT 별도',
    schedule: [
      {
        _key: 'd1',
        day: '2026-05-11',
        sessions: [
          { _key: 's1', type: 'practice', label: '자유 연습', startTime: '08:00', endTime: '09:30' },
          { _key: 's2', type: 'qualifying', label: '공식 예선', startTime: '10:00', endTime: '11:00' },
          { _key: 's3', type: 'race', label: '결승 내구 레이스', startTime: '13:00', endTime: '16:00' },
        ],
      },
    ],
    hasResults: false,
  },
  {
    _id: 'round-2026-r2',
    _type: 'round',
    season: 2026,
    roundNumber: 2,
    slug: { _type: 'slug', current: '2026-r2' },
    title: '인제스피디움 서머 라운드',
    titleEn: 'Inje Speedium Summer Round',
    subtitle: '2026 인제 GT 마스터즈 R2',
    campaignCopy: '한여름의 열기를 넘어라',
    badge: 'SUMMER',
    dateStart: '2026-07-06',
    dateEnd: '2026-07-06',
    status: 'upcoming',
    maxEntries: 60,
    schedule: [
      {
        _key: 'd1',
        day: '2026-07-06',
        sessions: [
          { _key: 's1', type: 'practice', label: '자유 연습', startTime: '08:00', endTime: '09:30' },
          { _key: 's2', type: 'qualifying', label: '공식 예선', startTime: '10:00', endTime: '11:00' },
          { _key: 's3', type: 'race', label: '결승 내구 레이스', startTime: '13:00', endTime: '16:00' },
        ],
      },
    ],
    hasResults: false,
  },
  {
    _id: 'round-2026-r3',
    _type: 'round',
    season: 2026,
    roundNumber: 3,
    slug: { _type: 'slug', current: '2026-r3' },
    title: '인제스피디움 어텀 라운드',
    titleEn: 'Inje Speedium Autumn Round',
    subtitle: '2026 인제 GT 마스터즈 R3',
    campaignCopy: '가을 바람 속, 끝까지 달린다',
    badge: 'NIGHT RACE',
    dateStart: '2026-09-07',
    dateEnd: '2026-09-07',
    status: 'upcoming',
    maxEntries: 60,
    schedule: [
      {
        _key: 'd1',
        day: '2026-09-07',
        sessions: [
          { _key: 's1', type: 'practice', label: '자유 연습', startTime: '14:00', endTime: '15:30' },
          { _key: 's2', type: 'qualifying', label: '공식 예선', startTime: '16:00', endTime: '17:00' },
          { _key: 's3', type: 'race', label: '결승 나이트 레이스', startTime: '18:30', endTime: '21:30' },
        ],
      },
    ],
    hasResults: false,
  },
  {
    _id: 'round-2026-r4',
    _type: 'round',
    season: 2026,
    roundNumber: 4,
    slug: { _type: 'slug', current: '2026-r4' },
    title: '인제스피디움 파이널',
    titleEn: 'Inje Speedium Championship Final',
    subtitle: '2026 인제 GT 마스터즈 R4',
    campaignCopy: '마지막 랩, 전설이 완성된다',
    badge: 'CHAMPIONSHIP',
    dateStart: '2026-10-26',
    dateEnd: '2026-10-26',
    status: 'upcoming',
    maxEntries: 70,
    schedule: [
      {
        _key: 'd1',
        day: '2026-10-26',
        sessions: [
          { _key: 's1', type: 'practice', label: '자유 연습', startTime: '14:00', endTime: '15:30' },
          { _key: 's2', type: 'qualifying', label: '공식 예선', startTime: '16:00', endTime: '17:00' },
          { _key: 's3', type: 'race', label: '결승 나이트 레이스', startTime: '18:30', endTime: '22:00' },
        ],
      },
    ],
    hasResults: false,
  },
]

// ══════════════════════════════════════════════════════════
// [3] post — FAQ
// ══════════════════════════════════════════════════════════
const faqPost = {
  _id: 'post-faq',
  _type: 'post',
  category: 'notice',
  isPinned: true,
  title: '자주 묻는 질문 (FAQ)',
  slug: { _type: 'slug', current: 'faq' },
  publishedAt: '2026-03-10T09:00:00+09:00',
  author: '인제 GT 마스터즈 운영사무국',
  excerpt: '참가 자격, 경주차 준비, 드라이버 인원, 피트스톱 규정, 공식 타이어, 참가 신청 방법 등 자주 묻는 질문을 정리했습니다.',
  body: [
    block('q1', 'Q. 참가 자격은 어떻게 되나요?'),
    block('a1', 'A. 유효한 자동차 운전면허증을 보유한 만 18세 이상이면 누구나 참가 신청 가능합니다. 별도의 레이싱 라이선스는 필요하지 않으며, 아마추어 레이서도 참가할 수 있습니다.'),
    block('q2', 'Q. 경주차는 직접 준비해야 하나요?'),
    block('a2', 'A. 네, 참가자가 직접 경주차를 준비해야 합니다. 차량은 각 클래스별 기술 규정을 충족해야 하며, 안전 장비(롤케이지, 안전벨트, 소화기 등)를 갖춰야 합니다.'),
    block('q3', 'Q. 한 팀에 드라이버가 몇 명까지 가능한가요?'),
    block('a3', 'A. 경주차 1대에 최대 3명의 드라이버가 교대로 참가할 수 있습니다. 예선에서는 모든 참가 드라이버가 1랩 이상 주행해야 합니다.'),
    block('q4', 'Q. 피트스톱 규정이 있나요?'),
    block('a4', 'A. 네, 결승 레이스 중 의무 피트스톱이 있습니다. 피트스톱 시간 동안 주유, 타이어 교체, 드라이버 교대, 차량 냉각이 가능합니다.'),
    block('q5', 'Q. 공식 타이어가 지정되어 있나요?'),
    block('a5', 'A. 금호타이어 엑스타(ECSTA) V730이 공식 지정 타이어입니다. 모든 인제 내구 참가 차량은 해당 타이어를 장착해야 합니다.'),
    block('q6', 'Q. 참가 신청은 어떻게 하나요?'),
    block('a6', 'A. 본 사이트 ENTRY 메뉴에서 온라인으로 신청하실 수 있습니다. 신청 후 운영팀 검토를 거쳐 결제 링크가 발송됩니다.'),
    block('q7', 'Q. 관람은 무료인가요?'),
    block('a7', 'A. 인제스피디움 입장료를 별도로 확인하시기 바랍니다. 대표전화: 1644-3366'),
  ],
}

// ── 실행 ─────────────────────────────────────────────────────
async function seed() {
  console.log('🏁 시딩 시작 (classInfo + round + FAQ)...\n')

  const tx = client.transaction()
  const all = [...classes, ...rounds, faqPost]

  for (const doc of all) tx.createOrReplace(doc)

  const result = await tx.commit()
  console.log(`✅ ${result.documentIds.length}개 도큐먼트 생성/업데이트 완료`)
  console.log('   - classInfo:', classes.length, '개')
  console.log('   - round:', rounds.length, '개')
  console.log('   - post (FAQ):', 1, '개')
  console.log(`\n총 ${all.length}개`)
}

seed().catch(err => {
  console.error('❌ 시딩 실패:', err.message)
  process.exit(1)
})
