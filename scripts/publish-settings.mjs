// scripts/publish-settings.mjs — siteSettings draft → published 강제 퍼블리시
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'

// .env.local 직접 파싱
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
  // 1. draft 문서 조회
  const draft = await client.fetch(
    `*[_id == "drafts.siteSettings" || (_type == "siteSettings" && _id match "drafts.*")][0]`
  )

  if (!draft) {
    // draft가 없으면 published 문서 확인
    const published = await client.fetch(`*[_type == "siteSettings" && !(_id match "drafts.*")][0]`)
    if (published) {
      console.log('✅ siteSettings는 이미 published 상태입니다.')
      console.log('   _id:', published._id)
      console.log('   heroImage:', published.heroImage ? '설정됨' : '미설정')
    } else {
      console.log('❌ siteSettings 문서가 존재하지 않습니다.')
    }
    return
  }

  console.log('📋 draft 문서 발견:', draft._id)
  console.log('   heroImage:', draft.heroImage ? '설정됨' : '미설정')

  // 2. published ID 결정
  const publishedId = draft._id.replace(/^drafts\./, '')

  // 3. transaction: draft → published로 복사 후 draft 삭제
  const tx = client.transaction()
  const { _id, _rev, _updatedAt, _createdAt, ...fields } = draft
  tx.createOrReplace({ _id: publishedId, _type: 'siteSettings', ...fields })
  tx.delete(draft._id)

  const result = await tx.commit()
  console.log('✅ siteSettings publish 완료!')
  console.log('   published _id:', publishedId)
  console.log('   transactionId:', result.transactionId)
}

main().catch(err => {
  console.error('❌ 에러:', err.message)
  process.exit(1)
})
