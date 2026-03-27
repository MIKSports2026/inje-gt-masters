// app/studio/[[...tool]]/page.tsx — Sanity Studio 임베드 (/studio)
'use client'
/**
 * Sanity Studio를 Next.js App 안에 임베드합니다.
 * 접근 URL: /studio
 * 프로덕션 배포 시 Vercel 미들웨어로 인증 보호 권장.
 */
import dynamic from 'next/dynamic'
import config from '@/sanity.config'

// SSR 완전 비활성 (Sanity Studio는 클라이언트 전용)
const NextStudio = dynamic(
  () => import('next-sanity/studio').then(mod => mod.NextStudio),
  { ssr: false }
)

export default function StudioPage() {
  return <NextStudio config={config} />
}
