// scripts/cleanup-settings-draft.mjs — 빈 draft 삭제, published 데이터 보존
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'

const envFile = readFileSync('.env.local', 'utf8')
const env = Object.fromEntries(
  envFile.split('\n').filter(l => l && !l.startsWith('#')).map(l => {
    const i = l.indexOf('=')
    return [l.slice(0, i), l.slice(i + 1)]
  })
)

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token:     env.SANITY_API_WRITE_TOKEN,
  useCdn:    false,
})

async function main() {
  // 1. published 문서 조회
  const published = await client.fetch(
    `*[_type == "siteSettings" && !(_id match "drafts.*")][0]`
  )

  console.log('── published 문서 ──')
  if (published) {
    console.log('  _id:', published._id)
    console.log('  siteName:', published.siteName)
    console.log('  slogan:', published.slogan)
    console.log('  currentSeason:', published.currentSeason)
    console.log('  heroImage:', published.heroImage ? `설정됨 (asset: ${published.heroImage.asset?._ref ?? published.heroImage.asset?._id ?? '?'})` : '미설정')
    console.log('  heroVideo:', published.heroVideo ?? '미설정')
    console.log('  isEntryOpen:', published.isEntryOpen)
    console.log('  bannerVisible:', published.bannerVisible)
    const fieldCount = Object.keys(published).filter(k => !k.startsWith('_')).length
    console.log('  총 필드 수:', fieldCount)
  } else {
    console.log('  ❌ published 문서가 없습니다! 작업을 중단합니다.')
    process.exit(1)
  }

  // 2. draft 문서 조회
  const draft = await client.fetch(
    `*[_id == "drafts.siteSettings" || (_type == "siteSettings" && _id match "drafts.*")][0]`
  )

  console.log('\n── draft 문서 ──')
  if (!draft) {
    console.log('  draft가 없습니다. 정리할 것이 없습니다. ✅')
    return
  }

  const draftFields = Object.keys(draft).filter(k => !k.startsWith('_'))
  const publishedFields = Object.keys(published).filter(k => !k.startsWith('_'))

  console.log('  _id:', draft._id)
  console.log('  총 필드 수:', draftFields.length, '(published:', publishedFields.length + ')')
  console.log('  siteName:', draft.siteName ?? '(없음)')
  console.log('  heroImage:', draft.heroImage ? '설정됨' : '미설정')

  // 3. draft가 published보다 필드가 적으면 → 빈 draft로 판단
  if (draftFields.length < publishedFields.length) {
    console.log('\n⚠️  draft 필드가 published보다 적습니다 (빈 draft 의심)')
    console.log('   draft:', draftFields.length, '필드 / published:', publishedFields.length, '필드')
    console.log('🗑️  빈 draft 삭제 중...')

    await client.delete(draft._id)

    console.log('✅ draft 삭제 완료! (', draft._id, ')')
    console.log('   Sanity Studio에서 siteSettings를 열면 published 데이터가 그대로 표시됩니다.')
  } else {
    console.log('\n⚠️  draft가 비어있지 않습니다 (필드 수 동등 이상).')
    console.log('   수동 확인 후 처리하세요.')
  }
}

main().catch(err => {
  console.error('❌ 에러:', err.message)
  process.exit(1)
})
