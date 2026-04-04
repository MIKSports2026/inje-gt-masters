// scripts/seed-announcement.mjs — announcementBar 데이터 시딩
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
  const result = await client
    .patch('siteSettings')
    .set({
      announcementBar: {
        isVisible: true,
        text: '🏁 2026 인제 GT 마스터즈 R1 개막전 참가신청 마감 임박! 지금 바로 신청하세요',
        link: '/entry?tab=apply&round=R1',
      },
    })
    .commit()

  console.log('✅ announcementBar 시딩 완료!')
  console.log('   transactionId:', result._rev)

  // 검증
  const doc = await client.fetch(`*[_id == "siteSettings"][0]{ announcementBar }`)
  console.log('   isVisible:', doc.announcementBar?.isVisible)
  console.log('   text:', doc.announcementBar?.text)
  console.log('   link:', doc.announcementBar?.link)
}

main().catch(err => {
  console.error('❌ 에러:', err.message)
  process.exit(1)
})
