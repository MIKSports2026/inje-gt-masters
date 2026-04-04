// components/ui/PageHero.tsx — 서브페이지 공통 히어로 (배경 이미지 지원)
import Image from 'next/image'
import Breadcrumb from '@/components/ui/Breadcrumb'
import type { SanityImage } from '@/types/sanity'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface Props {
  image?: SanityImage | null
  badge?: string
  title: string
  subtitle?: string
  breadcrumb?: BreadcrumbItem[]
  children?: React.ReactNode
}

export default function PageHero({ image, badge, title, subtitle, breadcrumb, children }: Props) {
  const imgUrl = image?.asset?.url

  return (
    <section style={{
      background: 'linear-gradient(135deg,#111,#1a0008 55%,#0d0d0d)',
      paddingTop: '192px',
      paddingBottom: '48px',
      position: 'relative',
      overflow: 'hidden',
      minHeight: imgUrl ? '320px' : undefined,
      display: 'flex',
      alignItems: 'flex-end',
    }}>
      {/* 배경 이미지 */}
      {imgUrl && (
        <Image
          src={imgUrl}
          alt=""
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          sizes="100vw"
          priority
        />
      )}
      {/* 오버레이 */}
      <div style={{
        position: 'absolute', inset: 0,
        background: imgUrl
          ? 'linear-gradient(180deg,rgba(0,0,0,.3) 0%,rgba(0,0,0,.7) 100%)'
          : 'transparent',
      }} />
      {/* 사선 패턴 */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(135deg,rgba(230,0,35,.04) 0 1px,transparent 1px 60px)',
        pointerEvents: 'none',
      }} />
      {/* 콘텐츠 */}
      <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {breadcrumb && <Breadcrumb items={breadcrumb} />}
        {badge && <span className="pill">{badge}</span>}
        <h1 style={{
          color: '#fff',
          marginTop: badge ? '10px' : breadcrumb ? '10px' : '0',
          fontSize: 'clamp(2rem,5vw,4.2rem)',
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            color: 'rgba(255,255,255,.65)',
            marginTop: '10px',
            fontSize: 'clamp(.9rem,1.4vw,1.06rem)',
          }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  )
}
