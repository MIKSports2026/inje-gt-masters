// scripts/restore-settings.mjs — siteSettings 이전 버전 복구
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'

const envFile = readFileSync('.env.local', 'utf8')
const env = Object.fromEntries(
  envFile.split('\n').filter(l => l && !l.startsWith('#')).map(l => {
    const i = l.indexOf('=')
    return [l.slice(0, i), l.slice(i + 1)]
  })
)

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = env.SANITY_API_WRITE_TOKEN

const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false })

async function main() {
  // 1. History API로 siteSettings 트랜잭션 목록 조회
  console.log('── siteSettings 트랜잭션 히스토리 조회 ──\n')

  const historyUrl = `https://${projectId}.api.sanity.io/v2024-01-01/data/history/${dataset}/transactions/siteSettings?excludeContent=false`
  const res = await fetch(historyUrl, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    console.log('History API 실패:', res.status, await res.text())
    console.log('\n대안: Sanity Studio에서 직접 복구하겠습니다.')
    await manualRestore()
    return
  }

  // NDJSON 파싱
  const text = await res.text()
  const transactions = text.trim().split('\n').filter(Boolean).map(line => JSON.parse(line))

  console.log(`총 ${transactions.length}개 트랜잭션 발견\n`)

  // 최근 10개 트랜잭션 표시
  const recent = transactions.slice(-10)
  for (const tx of recent) {
    console.log(`  ${tx.id} | ${tx.timestamp} | effects: ${tx.effects?.length ?? 0}`)
  }

  // 마지막(현재) 트랜잭션 = publish-settings.mjs가 만든 것
  // 그 직전 트랜잭션의 문서를 복구
  if (transactions.length < 2) {
    console.log('\n이전 트랜잭션이 없습니다. 수동 복구합니다.')
    await manualRestore()
    return
  }

  // History API의 document endpoint로 특정 시점 문서 조회
  const targetTx = transactions[transactions.length - 2]
  console.log(`\n복구 대상 트랜잭션: ${targetTx.id} (${targetTx.timestamp})`)

  const docUrl = `https://${projectId}.api.sanity.io/v2024-01-01/data/history/${dataset}/documents/siteSettings?revision=${targetTx.id}`
  const docRes = await fetch(docUrl, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!docRes.ok) {
    console.log('문서 복구 API 실패:', docRes.status)
    await manualRestore()
    return
  }

  const docText = await docRes.text()
  const oldDoc = JSON.parse(docText.trim().split('\n')[0])

  console.log('\n── 복구할 문서 내용 ──')
  console.log('  siteName:', oldDoc.siteName)
  console.log('  slogan:', oldDoc.slogan)
  console.log('  currentSeason:', oldDoc.currentSeason)
  console.log('  heroImage:', oldDoc.heroImage ? '설정됨' : '미설정')
  console.log('  필드 수:', Object.keys(oldDoc).filter(k => !k.startsWith('_')).length)

  if (!oldDoc.siteName) {
    console.log('\n이전 버전도 비어있습니다. 수동 복구합니다.')
    await manualRestore()
    return
  }

  // 복구 실행
  const { _id, _rev, _updatedAt, _createdAt, ...fields } = oldDoc

  // heroImage는 현재 설정된 것 유지
  const current = await client.fetch(`*[_id == "siteSettings"][0]{ heroImage }`)
  if (current?.heroImage) {
    fields.heroImage = current.heroImage
  }

  await client.createOrReplace({ _id: 'siteSettings', ...fields })
  console.log('\n✅ siteSettings 복구 완료! (heroImage 유지)')
}

async function manualRestore() {
  console.log('\n── 기본값으로 siteSettings 복구 ──')

  // 현재 문서에서 heroImage 가져오기
  const current = await client.fetch(`*[_id == "siteSettings"][0]`)

  const restored = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: '인제 GT 마스터즈',
    siteNameEn: 'Inje GT Masters',
    slogan: 'Where Legends Begin',
    currentSeason: 2026,
    metaTitle: '인제 GT 마스터즈 2026 — 공식 홈페이지 | Inje GT Masters',
    metaDescription: '대한민국 정통 GT 내구레이스, 인제 GT 마스터즈. 강원도 인제스피디움 3.9km 서킷, 2026 시즌 연간 4라운드. GT1·GT2·GT3·드리프트·바이크·슈퍼카 참가 신청 접수 중.',
    canonicalUrl: 'https://www.masters-series.kr',
    address: '강원도 인제군 기린면 상하답로 130',
    isEntryOpen: current?.isEntryOpen ?? false,
    entryNotice: '2026 시즌 참가신청은 2026년 3월 1일부터 접수됩니다.',
    bannerVisible: current?.bannerVisible ?? false,
    bannerBgColor: '#e60023',
    circuitName: '인제스피디움',
    circuitLength: 3.9,
    circuitLocation: '강원도 인제군 기린면',
    speediumUrl: 'https://www.speedium.co.kr',
    // heroImage 유지
    ...(current?.heroImage ? { heroImage: current.heroImage } : {}),
    // 기존에 설정된 기타 필드 유지
    ...(current?.email ? { email: current.email } : {}),
    ...(current?.phone ? { phone: current.phone } : {}),
    ...(current?.kakaoChannelUrl ? { kakaoChannelUrl: current.kakaoChannelUrl } : {}),
    ...(current?.instagram ? { instagram: current.instagram } : {}),
    ...(current?.youtube ? { youtube: current.youtube } : {}),
    ...(current?.facebook ? { facebook: current.facebook } : {}),
    ...(current?.naverBlog ? { naverBlog: current.naverBlog } : {}),
    ...(current?.logoLight ? { logoLight: current.logoLight } : {}),
    ...(current?.logoDark ? { logoDark: current.logoDark } : {}),
    ...(current?.ogImage ? { ogImage: current.ogImage } : {}),
    ...(current?.tossPaymentBaseUrl ? { tossPaymentBaseUrl: current.tossPaymentBaseUrl } : {}),
    ...(current?.bannerMessage ? { bannerMessage: current.bannerMessage } : {}),
    ...(current?.bannerLinkText ? { bannerLinkText: current.bannerLinkText } : {}),
    ...(current?.bannerLinkUrl ? { bannerLinkUrl: current.bannerLinkUrl } : {}),
    ...(current?.circuitMapEmbedUrl ? { circuitMapEmbedUrl: current.circuitMapEmbedUrl } : {}),
  }

  await client.createOrReplace(restored)

  // 검증
  const verify = await client.fetch(`*[_id == "siteSettings"][0]{ siteName, slogan, currentSeason, heroImage, circuitName }`)
  console.log('\n✅ 복구 완료!')
  console.log('  siteName:', verify.siteName)
  console.log('  slogan:', verify.slogan)
  console.log('  currentSeason:', verify.currentSeason)
  console.log('  heroImage:', verify.heroImage ? '설정됨' : '미설정')
  console.log('  circuitName:', verify.circuitName)
  console.log('\n⚠️  Sanity Studio에서 연락처/SNS, 참가신청 설정 등 확인 필요')
}

main().catch(err => {
  console.error('❌ 에러:', err.message)
  process.exit(1)
})
