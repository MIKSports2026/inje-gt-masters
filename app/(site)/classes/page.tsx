// app/(site)/classes/page.tsx — 클래스 소개 (서버 컴포넌트)
import type { Metadata } from 'next'
import { sanityFetch }  from '@/lib/sanity.client'
import { CLASSES_QUERY } from '@/lib/queries'
import type { ClassInfo } from '@/types/sanity'
import ClassesClient    from './ClassesClient'

export const metadata: Metadata = {
  title: 'RACE CLASSES | 인제 GT 마스터즈',
  description: '인제 GT 마스터즈 2026 시즌 레이스 클래스 소개. MASTERS 1·2·3, MASTERS N, MASTERS N-EVO 클래스를 확인하세요.',
}

export default async function ClassesPage() {
  const classes = await sanityFetch<ClassInfo[]>({
    query:      CLASSES_QUERY,
    revalidate: 3600,
  }).catch(() => [] as ClassInfo[])

  return <ClassesClient classes={classes} />
}
