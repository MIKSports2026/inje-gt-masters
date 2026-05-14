/**
 * scripts/fix-media-photos-type.ts
 *
 * 기존 media 도큐먼트의 photos[] 아이템 _type을 'photo' → 'object' 로 패치
 *
 * 사용법:
 *   npx tsx scripts/fix-media-photos-type.ts [--dry-run] [--yes]
 *
 * 옵션:
 *   --dry-run   실제 패치 없이 변경 예정 사항만 출력
 *   --yes, -y   확인 프롬프트 건너뜀
 */

import { createClient } from '@sanity/client'
import { config } from 'dotenv'

config({ path: '.env.local' })

const TARGET_DOC_ID = '48pFFXMiVTWIbp8yEy4HRI'
const WRONG_TYPE = 'photo'
const CORRECT_TYPE = 'object'

const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const isYes = args.includes('--yes') || args.includes('-y')

const TOKEN = process.env.SANITY_API_WRITE_TOKEN
if (!TOKEN) {
  console.error('❌ SANITY_API_WRITE_TOKEN 환경변수가 없습니다.')
  console.error('   .env.local 파일을 확인하세요.')
  process.exit(1)
}

const client = createClient({
  projectId: 'cq465tvw',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: TOKEN,
  useCdn: false,
})

async function confirm(question: string): Promise<boolean> {
  if (isYes) {
    console.log('⚠️  --yes 플래그 감지: 확인 프롬프트 건너뜀\n')
    return true
  }

  if (!process.stdin.isTTY) {
    console.error('\n❌ 비대화형 터미널 환경 감지.')
    console.error('   --yes 플래그를 추가해서 다시 실행하세요.')
    console.error('   예: npx tsx scripts/fix-media-photos-type.ts --yes')
    return false
  }

  const readline = await import('node:readline/promises')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  try {
    const answer = await rl.question(question)
    return answer.trim().toLowerCase() === 'y'
  } finally {
    rl.close()
  }
}

async function main() {
  console.log('═'.repeat(55))
  console.log(' media.photos[] _type 패치 스크립트')
  if (isDryRun) console.log(' 🔍 DRY-RUN 모드')
  console.log('═'.repeat(55))
  console.log(`\n 타겟 도큐먼트: ${TARGET_DOC_ID}`)
  console.log(` 변경: _type '${WRONG_TYPE}' → '${CORRECT_TYPE}'\n`)

  // 도큐먼트 조회
  console.log('🔍 도큐먼트 조회 중...')
  const doc = await client.fetch(
    `*[_id == $id][0]{ _id, title, photos[] { _key, _type, image, alt, caption, credit } }`,
    { id: TARGET_DOC_ID },
  )

  if (!doc) {
    console.error(`❌ 도큐먼트를 찾을 수 없습니다: ${TARGET_DOC_ID}`)
    process.exit(1)
  }

  console.log(`   ✓ 도큐먼트 확인: "${doc.title}"`)

  const photos: any[] = doc.photos ?? []
  console.log(`   ✓ photos[] 아이템 수: ${photos.length}개`)

  if (photos.length === 0) {
    console.error('❌ photos[] 배열이 비어 있습니다.')
    process.exit(1)
  }

  if (photos.length !== 100) {
    console.warn(`\n⚠️  photos[] 아이템이 100개가 아닙니다 (현재 ${photos.length}개).`)
    const proceed = await confirm('계속 진행하시겠습니까? [y/N] ')
    if (!proceed) {
      console.log('취소되었습니다.')
      process.exit(0)
    }
  }

  // 첫 3개 현재 상태 출력
  console.log('\n📋 현재 상태 (처음 3개):')
  photos.slice(0, 3).forEach((p, i) => {
    console.log(`   [${i + 1}] _key: ${p._key}`)
    console.log(`        _type: ${p._type ?? '(없음)'}`)
    console.log(`        image._ref: ${p.image?.asset?._ref ?? '(없음)'}`)
  })

  // 수정 대상 집계
  const toFix = photos.filter((p) => p._type === WRONG_TYPE)
  const alreadyCorrect = photos.filter((p) => p._type === CORRECT_TYPE)
  const other = photos.filter((p) => p._type !== WRONG_TYPE && p._type !== CORRECT_TYPE)

  console.log(`\n📊 분석:`)
  console.log(`   수정 필요 (_type: '${WRONG_TYPE}'): ${toFix.length}개`)
  console.log(`   이미 정상 (_type: '${CORRECT_TYPE}'): ${alreadyCorrect.length}개`)
  if (other.length > 0) console.log(`   기타 _type: ${other.length}개`)

  if (toFix.length === 0) {
    console.log('\n✅ 수정이 필요한 아이템이 없습니다. 이미 정상 상태입니다.')
    return
  }

  if (isDryRun) {
    console.log(`\n🔍 DRY-RUN: ${toFix.length}개 아이템의 _type을 '${WRONG_TYPE}' → '${CORRECT_TYPE}'로 변경 예정`)
    console.log('   실제 패치는 --dry-run 없이 재실행하세요.')
    return
  }

  const confirmed = await confirm(
    `\n${toFix.length}개 아이템의 _type을 패치합니다. 계속? [y/N] `,
  )
  if (!confirmed) {
    console.log('취소되었습니다.')
    process.exit(0)
  }

  // photos[] 전체를 _type만 교정한 새 배열로 구성
  const patchedPhotos = photos.map((p) => ({
    ...p,
    _type: p._type === WRONG_TYPE ? CORRECT_TYPE : p._type,
  }))

  console.log('\n📝 패치 중...')
  const result = await client
    .patch(TARGET_DOC_ID)
    .set({ photos: patchedPhotos })
    .commit()

  console.log('\n✅ 패치 완료!')
  console.log(`   도큐먼트 ID: ${result._id}`)
  console.log(`   변경된 아이템: ${toFix.length}개`)
  console.log(
    `   Studio 링크: https://injegtmasters.com/studio/structure/media;${result._id}`,
  )
  console.log('\n   Studio에서 도큐먼트를 새로고침해서 photos[] 확인하세요.')
}

main().catch((err) => {
  console.error('\n❌ 치명적 오류:', err.message)
  if (err.response) console.error('   응답:', err.response.body)
  process.exit(1)
})
