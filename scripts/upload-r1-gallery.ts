/**
 * scripts/upload-r1-gallery.ts
 *
 * 인제 GT 마스터즈 라운드별 갤러리 일괄 업로드
 *
 * 사용법:
 *   npx tsx scripts/upload-r1-gallery.ts <folder-path> [options]
 *
 * 옵션:
 *   --round N       라운드 번호 (기본 1, 예: --round 2)
 *   --yes, -y       확인 프롬프트 건너뜀
 *   --dry-run       실제 업로드 없이 검증만 수행
 *
 * 예시:
 *   npx tsx scripts/upload-r1-gallery.ts ~/Desktop/R1_gallery
 *   npx tsx scripts/upload-r1-gallery.ts ~/Desktop/R1_gallery --yes
 *   npx tsx scripts/upload-r1-gallery.ts ~/Desktop/R1_gallery --dry-run
 *   npx tsx scripts/upload-r1-gallery.ts ~/Desktop/R2_gallery --round 2 --yes
 */

import { createClient } from '@sanity/client'
import { readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'
import { config } from 'dotenv'

config({ path: '.env.local' })

const args = process.argv.slice(2)
const folderPath = args.find((a) => !a.startsWith('-'))
const isYes = args.includes('--yes') || args.includes('-y')
const isDryRun = args.includes('--dry-run')

const roundIdx = args.findIndex((a) => a === '--round')
const roundNumber =
  roundIdx >= 0 && args[roundIdx + 1] ? parseInt(args[roundIdx + 1], 10) : 1

if (!folderPath) {
  console.error('❌ 폴더 경로가 필요합니다.')
  console.error(
    '   사용법: npx tsx scripts/upload-r1-gallery.ts <folder-path> [--round N] [--yes] [--dry-run]',
  )
  process.exit(1)
}

if (isNaN(roundNumber) || roundNumber < 1 || roundNumber > 5) {
  console.error('❌ --round 값은 1~5 사이여야 합니다.')
  process.exit(1)
}

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

const SLUG = `2026-r${roundNumber}-gallery`
const TITLE = `2026 R${roundNumber} 인제 GT 마스터즈 — 사진 갤러리`
const DESCRIPTION = `2026 인제 GT 마스터즈 ${roundNumber}라운드 공식 사진 모음`

async function confirmUpload(count: number): Promise<boolean> {
  if (isYes) {
    console.log('⚠️  --yes 플래그 감지: 확인 프롬프트 건너뜀\n')
    return true
  }

  if (!process.stdin.isTTY) {
    console.error('\n❌ 비대화형 터미널 환경 감지.')
    console.error('   --yes 플래그를 추가해서 다시 실행하세요.')
    console.error(
      `   예: npx tsx scripts/upload-r1-gallery.ts ${folderPath} --yes`,
    )
    return false
  }

  const readline = await import('node:readline/promises')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  try {
    const answer = await rl.question(
      `\n총 ${count}장을 Sanity에 업로드합니다. 계속? [y/N] `,
    )
    return answer.trim().toLowerCase() === 'y'
  } finally {
    rl.close()
  }
}

async function main() {
  console.log('═'.repeat(50))
  console.log(` 인제 GT 마스터즈 — R${roundNumber} 갤러리 업로드 스크립트`)
  console.log('═'.repeat(50))

  console.log(`\n📁 폴더: ${folderPath}`)

  let files: string[] = []
  try {
    files = readdirSync(folderPath!)
      .filter((f) => /\.(jpg|jpeg|png)$/i.test(f))
      .sort()
  } catch {
    console.error(`❌ 폴더를 읽을 수 없습니다: ${folderPath}`)
    process.exit(1)
  }

  if (files.length === 0) {
    console.error('❌ 폴더에 이미지 파일이 없습니다.')
    process.exit(1)
  }

  console.log(`🖼️  총 ${files.length}장의 이미지 발견`)

  if (isDryRun) {
    console.log('\n🔍 DRY-RUN 모드: 실제 업로드는 하지 않습니다.\n')
  }

  console.log(`\n🔍 R${roundNumber} round 도큐먼트 조회 중...`)
  const round = await client.fetch(
    `*[_type == "round" && season == 2026 && roundNumber == $rn][0]{ _id, title, dateStart }`,
    { rn: roundNumber },
  )

  if (!round) {
    console.error(
      `❌ R${roundNumber} round 도큐먼트를 찾을 수 없습니다. (season: 2026)`,
    )
    process.exit(1)
  }
  console.log(`   ✓ ${round.title} (${round._id})`)

  console.log(`\n🔍 중복 slug '${SLUG}' 체크 중...`)
  const existing = await client.fetch(
    `*[_type == "media" && slug.current == $slug][0]{ _id, title }`,
    { slug: SLUG },
  )

  if (existing) {
    console.error(
      `\n❌ 이미 동일 slug 도큐먼트 존재: ${existing.title} (${existing._id})`,
    )
    console.error('   덮어쓰기 방지를 위해 중단합니다.')
    console.error(
      '   기존 도큐먼트를 Studio에서 삭제하거나 slug를 변경한 후 재실행하세요.',
    )
    process.exit(1)
  }
  console.log('   ✓ 중복 없음')

  if (isDryRun) {
    console.log('\n📋 업로드 예정 파일 (처음 10개):')
    files.slice(0, 10).forEach((f, i) => console.log(`   ${i + 1}. ${f}`))
    if (files.length > 10) console.log(`   ... 외 ${files.length - 10}개`)
    console.log(
      '\n✅ DRY-RUN 검증 완료. 실제 업로드는 --dry-run 빼고 재실행하세요.',
    )
    return
  }

  const confirmed = await confirmUpload(files.length)
  if (!confirmed) {
    console.log('취소되었습니다.')
    process.exit(0)
  }

  console.log('\n📤 이미지 업로드 시작...\n')

  const uploadedAssets: Array<{ id: string; filename: string }> = []
  const failedFiles: string[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const filePath = join(folderPath!, file)
    const progress = `[${i + 1}/${files.length}]`

    try {
      const stat = statSync(filePath)
      const sizeMB = (stat.size / 1024 / 1024).toFixed(1)
      process.stdout.write(`${progress} ${file} (${sizeMB} MB) ... `)

      const buffer = readFileSync(filePath)
      const asset = await client.assets.upload('image', buffer, {
        filename: file,
        contentType: file.toLowerCase().endsWith('.png')
          ? 'image/png'
          : 'image/jpeg',
      })
      uploadedAssets.push({ id: asset._id, filename: file })
      console.log('✓')
    } catch (err: any) {
      console.log(`❌ ${err.message}`)
      failedFiles.push(file)
    }
  }

  console.log(`\n✅ 업로드 완료: ${uploadedAssets.length}/${files.length}`)
  if (failedFiles.length > 0) {
    console.log(`⚠️  실패 ${failedFiles.length}장:`)
    failedFiles.forEach((f) => console.log(`   - ${f}`))
  }

  if (uploadedAssets.length === 0) {
    console.error('\n❌ 업로드된 asset이 없어 도큐먼트 생성을 중단합니다.')
    process.exit(1)
  }

  console.log('\n📝 media 도큐먼트 생성 중...')

  const publishedAt = round.dateStart || `2026-04-26T09:00:00.000Z`

  const doc = await client.create({
    _type: 'media',
    mediaType: 'photoAlbum',
    title: TITLE,
    slug: { _type: 'slug', current: SLUG },
    publishedAt,
    description: DESCRIPTION,
    relatedRound: { _type: 'reference', _ref: round._id },
    tags: [`R${roundNumber}`, '2026', '갤러리'],
    isFeatured: true,
    isPublished: true,
    coverImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: uploadedAssets[0].id },
    },
    photos: uploadedAssets.map((a, idx) => ({
      _key: `photo-${String(idx + 1).padStart(3, '0')}`,
      _type: 'object',
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: a.id },
      },
      alt: `2026 인제 GT 마스터즈 R${roundNumber} 경기 장면 #${idx + 1}`,
      caption: '',
      credit: '',
    })),
  })

  console.log(`\n✅ 완료!`)
  console.log(`\n   도큐먼트 ID: ${doc._id}`)
  console.log(
    `   Studio 링크: https://injegtmasters.com/studio/structure/media;${doc._id}`,
  )
  console.log(`   프론트 페이지: https://injegtmasters.com/media`)
  console.log('\n   Sanity Webhook이 60초 내 캐시를 갱신합니다.')
}

main().catch((err) => {
  console.error('\n❌ 치명적 오류:', err.message)
  if (err.response) console.error('   응답:', err.response.body)
  process.exit(1)
})
