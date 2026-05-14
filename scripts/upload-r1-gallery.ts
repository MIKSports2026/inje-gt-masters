/**
 * scripts/upload-r1-gallery.ts
 *
 * 사용법:
 *   npx tsx scripts/upload-r1-gallery.ts <폴더경로> [--round N] [--dry-run]
 *
 *   예: npx tsx scripts/upload-r1-gallery.ts ~/Desktop/R1_gallery
 *       npx tsx scripts/upload-r1-gallery.ts ~/Desktop/R2_gallery --round 2
 *       npx tsx scripts/upload-r1-gallery.ts ~/Desktop/R1_gallery --dry-run
 *
 * 사전 준비:
 *   1. .env.local 에 SANITY_API_WRITE_TOKEN 이 설정되어 있어야 합니다.
 *   2. 업로드할 폴더에 .jpg / .jpeg / .png 이미지만 정리해 두세요.
 *      (하위 폴더는 무시됩니다)
 *   3. Sanity Studio에서 해당 라운드 도큐먼트가 Published 상태인지 확인하세요.
 *
 * 예상 소요 시간:
 *   100장 기준 약 3~8분 (네트워크 속도에 따라 다름, 순차 업로드)
 *
 * R2~R5 재사용:
 *   --round 2 (또는 3, 4, 5) 인자만 바꾸면 됩니다.
 *   슬러그·제목·발행일이 해당 라운드에 맞춰 자동 생성됩니다.
 */

import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import { config as loadEnv } from 'dotenv'
import { createClient } from '@sanity/client'

// ── .env.local 로드 ───────────────────────────────────────────
loadEnv({ path: path.resolve(process.cwd(), '.env.local') })

// ── CLI 인자 파싱 ─────────────────────────────────────────────
const args = process.argv.slice(2)

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  console.log('사용법: npx tsx scripts/upload-r1-gallery.ts <폴더경로> [--round N] [--dry-run]')
  console.log('  예:  npx tsx scripts/upload-r1-gallery.ts ~/Desktop/R1_gallery')
  console.log('  예:  npx tsx scripts/upload-r1-gallery.ts ~/Desktop/R2_gallery --round 2')
  process.exit(0)
}

const folderArg   = args[0]
const folderPath  = folderArg.startsWith('~')
  ? path.join(process.env.HOME ?? '', folderArg.slice(1))
  : path.resolve(folderArg)

const roundIdx = args.indexOf('--round')
const ROUND    = roundIdx !== -1 ? parseInt(args[roundIdx + 1], 10) : 1
const DRY_RUN  = args.includes('--dry-run')
const SEASON   = 2026

if (isNaN(ROUND) || ROUND < 1 || ROUND > 10) {
  console.error('❌ --round 값이 올바르지 않습니다. (1~10)')
  process.exit(1)
}

// ── 환경변수 체크 ─────────────────────────────────────────────
const WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_WRITE_TOKEN

if (!WRITE_TOKEN) {
  console.error('❌ SANITY_API_WRITE_TOKEN 환경변수가 없습니다.')
  console.error('   .env.local 에 SANITY_API_WRITE_TOKEN=sk... 가 설정되어 있는지 확인하세요.')
  process.exit(1)
}

// ── Sanity 클라이언트 ─────────────────────────────────────────
const client = createClient({
  projectId:  'cq465tvw',
  dataset:    'production',
  apiVersion: '2024-01-01',
  token:      WRITE_TOKEN,
  useCdn:     false,
})

// ── 사용자 확인 프롬프트 ──────────────────────────────────────
function askConfirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close()
      resolve(answer.trim().toLowerCase() === 'y')
    })
  })
}

// ── 이미지 파일 스캔 ──────────────────────────────────────────
function scanImages(folder: string): string[] {
  if (!fs.existsSync(folder)) {
    console.error(`❌ 폴더를 찾을 수 없습니다: ${folder}`)
    process.exit(1)
  }
  const entries = fs.readdirSync(folder, { withFileTypes: true })
  const images = entries
    .filter(e => e.isFile() && /\.(jpg|jpeg|png)$/i.test(e.name))
    .map(e => e.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
  return images.map(name => path.join(folder, name))
}

// ── 메인 ─────────────────────────────────────────────────────
async function main() {
  console.log('')
  console.log('══════════════════════════════════════════════════')
  console.log(` 인제 GT 마스터즈 — R${ROUND} 갤러리 업로드 스크립트`)
  if (DRY_RUN) console.log(' 🔍 DRY-RUN 모드 — 실제 업로드/생성 없음')
  console.log('══════════════════════════════════════════════════')
  console.log('')

  // ① 폴더 스캔
  const files = scanImages(folderPath)
  if (files.length === 0) {
    console.error(`❌ 폴더에 이미지 파일(.jpg/.jpeg/.png)이 없습니다: ${folderPath}`)
    process.exit(1)
  }
  console.log(`📁 폴더: ${folderPath}`)
  console.log(`🖼️  총 ${files.length}장의 이미지 발견`)
  console.log('')

  // ② 사용자 확인
  if (!DRY_RUN) {
    const confirmed = await askConfirm(`총 ${files.length}장을 Sanity에 업로드합니다. 계속? [y/N] `)
    if (!confirmed) {
      console.log('취소되었습니다.')
      process.exit(0)
    }
    console.log('')
  }

  // ③ R? 라운드 도큐먼트 조회
  console.log(`🔍 Sanity에서 R${ROUND} 라운드 도큐먼트 조회 중...`)
  const roundDoc = await client.fetch<{ _id: string; dateStart?: string } | null>(
    `*[_type == "round" && season == $season && roundNumber == $roundNumber][0]{ _id, dateStart }`,
    { season: SEASON, roundNumber: ROUND }
  )
  if (!roundDoc) {
    console.error(`❌ Sanity에서 season=${SEASON}, roundNumber=${ROUND}인 round 도큐먼트를 찾을 수 없습니다.`)
    console.error('   Sanity Studio에서 해당 라운드가 Published 상태인지 확인하세요.')
    process.exit(1)
  }
  console.log(`   ✅ 라운드 확인: ${roundDoc._id} (dateStart: ${roundDoc.dateStart ?? '없음'})`)
  console.log('')

  // ④ 중복 슬러그 체크
  const slug = `${SEASON}-r${ROUND}-gallery`
  console.log(`🔍 슬러그 중복 체크: '${slug}'`)
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "media" && slug.current == $slug][0]{ _id }`,
    { slug }
  )
  if (existing) {
    console.error(`❌ 슬러그 '${slug}'인 media 도큐먼트가 이미 존재합니다: ${existing._id}`)
    console.error('   덮어쓰기 방지를 위해 중단합니다. Studio에서 기존 문서를 삭제 후 다시 시도하세요.')
    process.exit(1)
  }
  console.log('   ✅ 중복 없음')
  console.log('')

  if (DRY_RUN) {
    console.log('🔍 [DRY-RUN] 업로드 시뮬레이션:')
    files.forEach((f, i) => {
      console.log(`   [${String(i + 1).padStart(files.length.toString().length, ' ')}/${files.length}] ${path.basename(f)}`)
    })
    console.log('')
    console.log('🔍 [DRY-RUN] 생성될 media 도큐먼트:')
    console.log(`   title: "${SEASON} R${ROUND} 인제 GT 마스터즈 — 사진 갤러리"`)
    console.log(`   slug:  "${slug}"`)
    console.log(`   photos: ${files.length}장`)
    console.log('')
    console.log('✅ DRY-RUN 완료. --dry-run 없이 실행하면 실제 업로드됩니다.')
    return
  }

  // ⑤ 이미지 업로드
  console.log(`⬆️  이미지 업로드 시작...`)
  const uploadedAssets: { _id: string; filename: string }[] = []
  const failedFiles: string[] = []
  const pad = files.length.toString().length

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i]
    const filename = path.basename(filePath)
    process.stdout.write(`   [${String(i + 1).padStart(pad, ' ')}/${files.length}] ${filename} 업로드 중...`)

    try {
      const asset = await client.assets.upload('image', fs.createReadStream(filePath), { filename })
      uploadedAssets.push({ _id: asset._id, filename })
      process.stdout.write(' ✅\n')
    } catch (err) {
      process.stdout.write(' ❌\n')
      failedFiles.push(filename)
    }
  }

  console.log('')
  console.log(`   성공: ${uploadedAssets.length}장 / 실패: ${failedFiles.length}장`)
  if (failedFiles.length > 0) {
    console.log('   실패 파일:')
    failedFiles.forEach(f => console.log(`     - ${f}`))
  }

  if (uploadedAssets.length === 0) {
    console.error('\n❌ 업로드된 이미지가 없습니다. 도큐먼트 생성을 중단합니다.')
    process.exit(1)
  }
  console.log('')

  // ⑥ media 도큐먼트 생성
  const publishedAt = roundDoc.dateStart
    ? `${roundDoc.dateStart}T09:00:00.000Z`
    : `${SEASON}-01-01T09:00:00.000Z`

  const title = `${SEASON} R${ROUND} 인제 GT 마스터즈 — 사진 갤러리`
  const description = `${SEASON} 인제 GT 마스터즈 시즌 ${ROUND}라운드 (R${ROUND}) 공식 사진 모음`

  const photos = uploadedAssets.map((asset, i) => ({
    _key:    `photo-${String(i + 1).padStart(3, '0')}`,
    image:   { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
    alt:     `${SEASON} 인제 GT 마스터즈 R${ROUND} 경기 장면 #${i + 1}`,
    credit:  '',
    caption: '',
  }))

  const mediaDoc = {
    _type:        'media',
    mediaType:    'photoAlbum',
    title,
    slug:         { _type: 'slug', current: slug },
    publishedAt,
    description,
    relatedRound: { _type: 'reference', _ref: roundDoc._id },
    tags:         ['R1', '2026', '갤러리'],
    isFeatured:   true,
    isPublished:  true,
    coverImage:   { _type: 'image', asset: { _type: 'reference', _ref: uploadedAssets[0]._id } },
    photos,
  }

  console.log('📄 media 도큐먼트 생성 중...')
  try {
    const created = await client.create(mediaDoc)

    console.log('')
    console.log('══════════════════════════════════════════════════')
    console.log('🎉 완료!')
    console.log(`   도큐먼트 ID : ${created._id}`)
    console.log(`   업로드 성공 : ${uploadedAssets.length}장`)
    if (failedFiles.length > 0) {
      console.log(`   업로드 실패 : ${failedFiles.length}장`)
    }
    console.log(`   Studio 링크 : https://injegtmasters.com/studio/desk/media-group;media-all;${created._id}`)
    console.log('══════════════════════════════════════════════════')
  } catch (err) {
    console.error('❌ media 도큐먼트 생성 실패:', err)
    console.error(`   이미 업로드된 asset ${uploadedAssets.length}장은 Sanity Media Library에 남아 있습니다.`)
    console.error('   Studio > Media 에서 정리해 주세요.')
    process.exit(1)
  }
}

main().catch(err => {
  console.error('💥 예상치 못한 오류:', err)
  process.exit(1)
})
