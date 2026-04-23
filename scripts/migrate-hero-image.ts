/**
 * 1회성 마이그레이션: siteSettings.heroImage → siteSettings.heroSlides[0]
 * 실행:
 *   1. .env.local에 SANITY_WRITE_TOKEN 설정 (sanity.io/manage → API → Tokens, Editor 권한)
 *   2. npx tsx scripts/migrate-hero-image.ts
 *   3. 실행 후 SANITY_WRITE_TOKEN 즉시 revoke
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const client = createClient({
  projectId: 'cq465tvw',
  dataset: 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01',
})

async function migrate() {
  console.log('[migrate] siteSettings 조회 중...')
  const settings = await client.fetch(
    `*[_type == "siteSettings"][0]{ _id, heroImage, heroSlides }`
  )
  if (!settings) {
    console.error('[migrate] ❌ siteSettings 도큐먼트를 찾을 수 없습니다.')
    process.exit(1)
  }
  if (settings.heroSlides && settings.heroSlides.length > 0) {
    console.log('[migrate] ✅ heroSlides 이미 존재. 마이그레이션 생략.')
    return
  }
  if (!settings.heroImage) {
    console.log('[migrate] ℹ️  heroImage 없음. 마이그레이션 불필요.')
    return
  }
  console.log('[migrate] heroImage → heroSlides[0] 이관 중...')
  const newSlide = {
    _type: 'heroSlide',
    _key: `slide-${Date.now()}`,
    image: settings.heroImage,
    alt: '인제 GT 마스터즈 메인 비주얼',
    isActive: true,
  }
  await client
    .patch(settings._id)
    .set({ heroSlides: [newSlide] })
    .commit()
  console.log('[migrate] ✅ 마이그레이션 완료')
  console.log('[migrate] ⚠️  Studio에서 해당 슬라이드의 alt 텍스트를 정확한 값으로 수정하세요.')
}

migrate().catch((err) => {
  console.error('[migrate] ❌ 오류:', err)
  process.exit(1)
})
