/**
 * migrate-related-round.ts
 *
 * 목적: post / media 문서의 단수 relatedRound(reference) 필드를
 *       복수 relatedRounds(array of reference)로 마이그레이션하고
 *       단수 필드를 제거합니다.
 *
 * ⚠️  실행 전 반드시 Sanity Studio에서 데이터 백업(Export)을 먼저 받으세요.
 *     sanity.io/manage → 프로젝트 선택 → Datasets → Export
 *
 * 실행:
 *   SANITY_WRITE_TOKEN=<editor-token> npx tsx scripts/migrate-related-round.ts
 *
 * 토큰 발급:
 *   sanity.io/manage → 프로젝트 → API → Tokens → Add API token
 *   Permission: Editor (쓰기 권한 필요)
 */

import { createClient } from '@sanity/client'

// ── 클라이언트 설정 ───────────────────────────────────────────
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET    ?? 'production'
const API_VER    = '2024-01-01'

const WRITE_TOKEN = process.env.SANITY_WRITE_TOKEN ?? process.env.SANITY_API_READ_TOKEN

if (!WRITE_TOKEN) {
  console.error('❌ SANITY_WRITE_TOKEN 환경변수가 없습니다.')
  console.error('   실행 예시: SANITY_WRITE_TOKEN=sk... npx tsx scripts/migrate-related-round.ts')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset:   DATASET,
  apiVersion: API_VER,
  token:     WRITE_TOKEN,
  useCdn:    false,
})

// ── 마이그레이션 대상 조회 쿼리 ──────────────────────────────
const QUERY = `
  *[_type in ["post", "media"] && defined(relatedRound)]{
    _id, _type,
    relatedRound,
    relatedRounds
  }
`

// ── 메인 ─────────────────────────────────────────────────────
async function migrate() {
  console.log('🔍 relatedRound(단수)가 있는 문서를 조회합니다...')

  const docs = await client.fetch<Array<{
    _id: string
    _type: string
    relatedRound: { _ref: string; _type: string }
    relatedRounds?: Array<{ _key: string; _type: string; _ref: string }>
  }>>(QUERY)

  if (docs.length === 0) {
    console.log('✅ 마이그레이션 대상 문서가 없습니다. 이미 완료됐거나 데이터가 없습니다.')
    return
  }

  console.log(`📄 대상 문서 수: ${docs.length}개`)
  console.log('')

  let success = 0
  let skipped = 0
  let failed  = 0

  for (const doc of docs) {
    const { _id, _type, relatedRound, relatedRounds } = doc
    const newRef = relatedRound._ref

    // 기존 relatedRounds 배열 (없으면 빈 배열)
    const existing: Array<{ _key: string; _type: string; _ref: string }> =
      Array.isArray(relatedRounds) ? relatedRounds : []

    // 이미 포함되어 있으면 스킵
    const alreadyIncluded = existing.some(r => r._ref === newRef)

    let nextRounds: Array<{ _key: string; _type: string; _ref: string }>

    if (alreadyIncluded) {
      // relatedRound._ref가 이미 relatedRounds에 있음 → 단순 unset만
      nextRounds = existing
      skipped++
      console.log(`  ⏭  [${_type}] ${_id} — relatedRound._ref 이미 포함, unset만 진행`)
    } else {
      // append
      nextRounds = [
        ...existing,
        {
          _key:  `migrated-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          _type: 'reference',
          _ref:  newRef,
        },
      ]
    }

    try {
      await client
        .patch(_id)
        .set({ relatedRounds: nextRounds })
        .unset(['relatedRound'])
        .commit()

      success++
      console.log(`  ✅ [${_type}] ${_id} — 완료 (relatedRounds 길이: ${nextRounds.length})`)
    } catch (err) {
      failed++
      console.error(`  ❌ [${_type}] ${_id} — 실패:`, err)
    }
  }

  console.log('')
  console.log('──────────────────────────────────────')
  console.log(`완료: ${success}개 성공 / ${skipped}개 이미 포함(unset만) / ${failed}개 실패`)
  console.log('')
  console.log('🔎 검증 쿼리 (Sanity Vision에서 실행):')
  console.log('   *[_type in ["post","media"] && defined(relatedRound)]._id')
  console.log('   → 빈 배열 []이면 마이그레이션 성공')
}

migrate().catch(err => {
  console.error('💥 예상치 못한 오류:', err)
  process.exit(1)
})
