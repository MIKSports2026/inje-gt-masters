#!/usr/bin/env node
// scripts/seed-content.mjs — 초기 콘텐츠 시딩 스크립트
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'

// .env.local에서 직접 파싱
const envRaw = readFileSync(new URL('../.env.local', import.meta.url), 'utf-8')
const env = Object.fromEntries(
  envRaw.split('\n').filter(l => l && !l.startsWith('#')).map(l => l.split('=').map(s => s.trim()))
)

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// ── [1] history 도큐먼트 5개 ─────────────────────────────────
const histories = [
  {
    _id: 'history-2013',
    _type: 'history',
    year: 2013,
    headline: '인제스피디움 개장',
    summary: 'FIA 그레이드 2급 국제 공인 서킷으로 강원도 인제에 개장. 전장 3.908km, 15개 코너, 앨런 윌슨(Alan Wilson) 설계. 국내 최고 수준의 모터스포츠 인프라 구축.',
    stats: [
      { _key: 's1', label: '서킷 길이', value: '3.908km' },
      { _key: 's2', label: '코너 수', value: '15개' },
      { _key: 's3', label: 'FIA 등급', value: 'Grade 2' },
    ],
    isPublished: true,
  },
  {
    _id: 'history-2023',
    _type: 'history',
    year: 2023,
    edition: '시즌 1',
    headline: '인제 마스터즈 시리즈 창설',
    summary: '아마추어 모터스포츠 대중화를 위한 종합 플랫폼 출범. GT 내구레이스, 드리프트, 바이크 대회를 하나의 브랜드 아래 통합 운영. 첫 시즌 3라운드 개최.',
    stats: [
      { _key: 's1', label: '라운드', value: '3라운드' },
      { _key: 's2', label: '참가팀', value: '64팀' },
      { _key: 's3', label: '클래스', value: '4개' },
    ],
    isPublished: true,
  },
  {
    _id: 'history-2024',
    _type: 'history',
    year: 2024,
    edition: '시즌 2',
    headline: '금호타이어 공식 후원, 포인트 제도 도입',
    summary: '금호타이어 타이틀 스폰서 확보. 시즌 포인트 제도를 도입하여 연간 챔피언 선발 체계 확립. 슈퍼카 챌린지 클래스 신설로 6개 클래스 체계 완성.',
    stats: [
      { _key: 's1', label: '라운드', value: '4라운드' },
      { _key: 's2', label: '참가팀', value: '87팀' },
      { _key: 's3', label: '클래스', value: '6개' },
    ],
    isPublished: true,
  },
  {
    _id: 'history-2025',
    _type: 'history',
    year: 2025,
    edition: '시즌 3',
    headline: '300km 내구 레이스 도입',
    summary: '파이널 라운드에 300km 장거리 내구 레이스 형식 최초 도입. 바이크 대회 독립 분리 운영으로 전문성 강화. 참가팀 100팀 돌파.',
    stats: [
      { _key: 's1', label: '라운드', value: '4라운드' },
      { _key: 's2', label: '참가팀', value: '107팀' },
      { _key: 's3', label: '드라이버', value: '153명' },
    ],
    isPublished: true,
  },
  {
    _id: 'history-2026',
    _type: 'history',
    year: 2026,
    edition: '시즌 4',
    headline: '인제 GT 마스터즈 브랜드 리뉴얼',
    summary: '"인제 GT 마스터즈"로 브랜드 리뉴얼. 슬로건 "Where Legends Begin" 확정. 공식 홈페이지 전면 개편, 온라인 참가신청 시스템 도입.',
    stats: [
      { _key: 's1', label: '라운드', value: '4라운드' },
      { _key: 's2', label: '목표 참가', value: '120팀' },
      { _key: 's3', label: '클래스', value: '6개' },
    ],
    isPublished: true,
  },
]

// ── [2] partner 도큐먼트 2개 ─────────────────────────────────
const partners = [
  {
    _id: 'partner-kumho',
    _type: 'partner',
    name: '금호타이어',
    nameEn: 'Kumho Tire',
    slug: { _type: 'slug', current: 'kumho-tire' },
    tier: 'title',
    category: 'tire',
    websiteUrl: 'https://www.kumhotire.com',
    contractSeasons: [2024, 2025, 2026],
    description: '인제 GT 마스터즈 공식 타이어 후원사. 모든 클래스에 금호타이어 ECSTA 시리즈 공급.',
    isActive: true,
    sortOrder: 1,
  },
  {
    _id: 'partner-inje',
    _type: 'partner',
    name: '인제군',
    nameEn: 'Inje County',
    slug: { _type: 'slug', current: 'inje-county' },
    tier: 'official',
    category: 'public',
    websiteUrl: 'https://www.inje.go.kr',
    contractSeasons: [2023, 2024, 2025, 2026],
    description: '강원도 인제군 공식 후원. 인제스피디움 소재 지자체로서 대회 운영 전반 지원.',
    isActive: true,
    sortOrder: 2,
  },
]

// ── [3] post 도큐먼트 1개 ────────────────────────────────────
const posts = [
  {
    _id: 'post-2026-season-announce',
    _type: 'post',
    category: 'notice',
    isPinned: true,
    title: '2026 인제 GT 마스터즈 시즌 일정 발표',
    slug: { _type: 'slug', current: '2026-season-schedule' },
    publishedAt: '2026-03-01T09:00:00+09:00',
    author: '인제 GT 마스터즈 운영사무국',
    excerpt: '2026 시즌 총 4라운드 일정이 확정되었습니다. 5월 개막전을 시작으로 10월 파이널까지 인제스피디움에서 펼쳐집니다.',
    body: [
      {
        _type: 'block',
        _key: 'b1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 's1',
            text: '2026 인제 GT 마스터즈의 시즌 일정이 공식 발표되었습니다.',
            marks: [],
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'b2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 's2',
            text: '올해 시즌은 총 4라운드로 구성되며, 5월 11일 개막전을 시작으로 7월 서머 라운드, 9월 어텀 라운드, 10월 파이널까지 이어집니다. 모든 대회는 강원도 인제스피디움 국제서킷(3.908km)에서 개최됩니다.',
            marks: [],
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'b3',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 's3',
            text: 'GT1, GT2, GT3, 드리프트 KDGP, 바이크, 슈퍼카 챌린지 6개 클래스에서 참가 신청을 받고 있으며, R1 개막전 접수가 현재 진행 중입니다. 참가 신청은 공식 홈페이지에서 온라인으로 가능합니다.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
  },
]

// ── 실행 ─────────────────────────────────────────────────────
async function seed() {
  console.log('🏁 시딩 시작...\n')

  const tx = client.transaction()

  for (const doc of [...histories, ...partners, ...posts]) {
    tx.createOrReplace(doc)
  }

  const result = await tx.commit()
  console.log(`✅ ${result.documentIds.length}개 도큐먼트 생성/업데이트 완료`)
  console.log('   - history:', histories.length, '개')
  console.log('   - partner:', partners.length, '개')
  console.log('   - post:', posts.length, '개')
}

seed().catch(err => {
  console.error('❌ 시딩 실패:', err.message)
  process.exit(1)
})
