/**
 * migrate-standings-to-rounds.ts
 *
 * 목적: teamStanding / driverStanding 문서의 entries 구조를 변환
 *   기존: { racePoints, finishBonusPoints, qualifyingPoints, totalPoints }
 *   변환: { rounds: [{ roundNumber: 1, points: totalPoints }], totalPoints }
 *         (기존 분해 포인트 필드 제거)
 *
 * ⚠️  실행 전 반드시 Sanity Studio에서 데이터 백업(Export)을 먼저 받으세요.
 *     sanity.io/manage → 프로젝트 선택 → Datasets → Export
 *
 * 실행 (dry-run — 실제 저장 안 함):
 *   SANITY_WRITE_TOKEN=<token> npx tsx scripts/migrate-standings-to-rounds.ts --dry-run
 *
 * 실행 (실제 적용):
 *   SANITY_WRITE_TOKEN=<token> npx tsx scripts/migrate-standings-to-rounds.ts
 *
 * 토큰 발급:
 *   sanity.io/manage → 프로젝트 → API → Tokens → Add API token
 *   Permission: Editor (쓰기 권한 필요)
 */

import { createClient } from '@sanity/client'

// ── 클라이언트 설정 ───────────────────────────────────────────
const PROJECT_ID  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const DATASET     = process.env.NEXT_PUBLIC_SANITY_DATASET    ?? 'production'
const API_VER     = '2024-01-01'

const WRITE_TOKEN = process.env.SANITY_WRITE_TOKEN ?? process.env.SANITY_API_WRITE_TOKEN

const DRY_RUN = process.argv.includes('--dry-run')

if (!WRITE_TOKEN) {
  console.error('❌ SANITY_WRITE_TOKEN 환경변수가 없습니다.')
  console.error('   실행 예시: SANITY_WRITE_TOKEN=sk... npx tsx scripts/migrate-standings-to-rounds.ts')
  process.exit(1)
}

const client = createClient({
  projectId:  PROJECT_ID,
  dataset:    DATASET,
  apiVersion: API_VER,
  token:      WRITE_TOKEN,
  useCdn:     false,
})

// ── 타입 ─────────────────────────────────────────────────────
interface OldEntry {
  _key:               string
  position:           number
  carNumber?:         string
  teamName?:          string
  driverName?:        string
  drivers?:           string
  racePoints?:        number
  finishBonusPoints?: number
  qualifyingPoints?:  number
  totalPoints:        number
  rounds?:            { _key: string; roundNumber: number; points: number }[]
}

interface StandingDoc {
  _id:     string
  _type:   string
  entries: OldEntry[]
}

// ── 변환 함수 ────────────────────────────────────────────────
function transformEntry(e: OldEntry, idx: number): Omit<OldEntry, 'racePoints' | 'finishBonusPoints' | 'qualifyingPoints'> {
  // eslint-disable-next-line no-unused-vars
  const { racePoints, finishBonusPoints, qualifyingPoints, rounds: existingRounds, ...rest } = e

  // 이미 rounds가 있으면 보존, 없으면 R1 = totalPoints로 초기화
  const rounds = existingRounds && existingRounds.length > 0
    ? existingRounds
    : [{ _key: `r1-${idx}`, roundNumber: 1, points: e.totalPoints ?? 0 }]

  return { ...rest, rounds }
}

// ── 메인 ─────────────────────────────────────────────────────
async function migrate() {
  console.log(DRY_RUN ? '🔍 [DRY-RUN] 실제 저장 없이 변환 결과만 확인합니다.' : '🚀 마이그레이션을 시작합니다.')
  console.log('')

  const docs = await client.fetch<StandingDoc[]>(
    `*[_type in ["teamStanding", "driverStanding"]]{ _id, _type, entries[] }`
  )

  if (docs.length === 0) {
    console.log('ℹ️  대상 문서가 없습니다.')
    return
  }

  console.log(`📄 대상 문서: ${docs.length}개`)
  console.log('')

  let successDocs   = 0
  let skippedDocs   = 0
  let failedDocs    = 0
  let totalEntries  = 0

  for (const doc of docs) {
    const entries = doc.entries ?? []
    totalEntries += entries.length

    // 이미 rounds가 있고 분해 포인트가 없으면 스킵
    const alreadyMigrated = entries.every(e => Array.isArray(e.rounds) && e.rounds.length > 0
      && e.racePoints === undefined && e.finishBonusPoints === undefined && e.qualifyingPoints === undefined)

    if (alreadyMigrated) {
      console.log(`  ⏭  [${doc._type}] ${doc._id} — 이미 마이그레이션 완료, 스킵`)
      skippedDocs++
      continue
    }

    const transformed = entries.map((e, i) => transformEntry(e, i))

    // 검증
    const allHaveRounds       = transformed.every(e => Array.isArray(e.rounds) && (e.rounds as any[]).length > 0)
    const totalPointsPreserved = transformed.every((e, i) => e.totalPoints === entries[i].totalPoints)

    console.log(`  📋 [${doc._type}] ${doc._id}`)
    console.log(`     entries: ${entries.length}행 | rounds 추가: ${allHaveRounds ? '✅' : '❌'} | totalPoints 보존: ${totalPointsPreserved ? '✅' : '❌'}`)

    if (DRY_RUN) {
      // dry-run: 첫 번째 entry만 미리보기 출력
      if (transformed.length > 0) {
        const first = transformed[0]
        console.log(`     미리보기(1행): position=${first.position}, totalPoints=${first.totalPoints}, rounds=${JSON.stringify((first as any).rounds)}`)
      }
      successDocs++
      continue
    }

    try {
      await client
        .patch(doc._id)
        .set({ entries: transformed })
        .commit()

      successDocs++
      console.log(`     → 저장 완료`)
    } catch (err) {
      failedDocs++
      console.error(`     → ❌ 저장 실패:`, err)
    }
  }

  console.log('')
  console.log('──────────────────────────────────────────────────')
  if (DRY_RUN) {
    console.log(`[DRY-RUN] 변환 대상: ${successDocs}개 문서 / ${totalEntries}행 entries`)
    console.log('실제 적용하려면 --dry-run 없이 실행하세요.')
  } else {
    console.log(`완료: ${successDocs}개 성공 / ${skippedDocs}개 스킵 / ${failedDocs}개 실패`)
    console.log(`총 변환 entries: ${totalEntries}행`)
    if (failedDocs === 0) {
      console.log('')
      console.log('🔎 검증 쿼리 (Sanity Vision에서 실행):')
      console.log('   *[_type in ["teamStanding","driverStanding"]]{ _id, "entriesCount": count(entries), "hasRounds": entries[0].rounds }')
    }
  }
}

migrate().catch(err => {
  console.error('💥 예상치 못한 오류:', err)
  process.exit(1)
})
