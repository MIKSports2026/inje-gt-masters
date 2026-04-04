import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import SectionOrgChart from '@/components/sections/SectionOrgChart'

export const metadata: Metadata = {
  title: '조직도 | 인제 GT 마스터즈',
  description: '인제 GT 마스터즈 대회 운영 조직 구성 — 조직위원회, 심사위원회, 경기위원회.',
}

export default function OrganizationPage() {
  return (
    <>
      <PageHero
        badge="Organization"
        title="조직도"
        subtitle="COMMITTEE STRUCTURE — 인제 GT 마스터즈 운영 조직"
        breadcrumb={[
          { label: 'Masters', href: '/masters' },
          { label: '조직도' },
        ]}
      />
      <SectionOrgChart />
    </>
  )
}
