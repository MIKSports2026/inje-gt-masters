// components/sections/SectionHero.tsx — v4 Cinematic Hero
import Image from 'next/image'
import type { SiteSettings, Round } from '@/types/sanity'

interface Props {
  settings:  SiteSettings | null
  nextRound: Round | null
  rounds:    Round[]
}

export default function SectionHero({ settings, nextRound }: Props) {
  const heroImg = settings?.heroImage?.asset?.url
  const heroAlt = settings?.heroImage?.alt ?? '인제 GT 마스터즈'

  const dd = nextRound?.dateStart ? new Date(nextRound.dateStart) : null
  const dateStr = dd
    ? `${dd.getFullYear()}.${String(dd.getMonth() + 1).padStart(2, '0')}.${String(dd.getDate()).padStart(2, '0')}`
    : null

  return (
    <section aria-label="메인 히어로" style={{
      position: 'relative',
      height: '100vh',
      minHeight: '760px',
      overflow: 'hidden',
      background: '#070707',
    }}>
      {/* 배경 이미지 */}
      {heroImg ? (
        <Image
          src={heroImg} alt={heroAlt} fill priority sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center', transform: 'scale(1.01)' }}
        />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #0b0b0b 0%, #181818 40%, #1a0008 100%)',
        }} />
      )}

      {/* 그라데이션 오버레이 */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: [
          'linear-gradient(to right, rgba(0,0,0,.62) 0%, rgba(0,0,0,.22) 34%, rgba(0,0,0,.05) 58%, rgba(0,0,0,.24) 100%)',
          'linear-gradient(to top, rgba(0,0,0,.62) 0%, rgba(0,0,0,.14) 28%, rgba(0,0,0,0) 48%)',
        ].join(', '),
        backgroundBlendMode: 'multiply',
      }} />
      {/* 개별 하단 그라데이션 보정 */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(to top, rgba(0,0,0,.62) 0%, rgba(0,0,0,.14) 28%, rgba(0,0,0,0) 48%)',
      }} />

      {/* 좌하단 카피 블록 */}
      <div className="hero-copy" style={{
        position: 'absolute',
        left: '48px',
        bottom: '54px',
        zIndex: 2,
      }}>
        {/* kicker */}
        <div style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: '12px',
          letterSpacing: '.28em',
          color: 'rgba(255,255,255,.72)',
          textTransform: 'uppercase' as const,
          marginBottom: '10px',
        }}>
          2026 CHAMPIONSHIP
        </div>

        {/* title */}
        <h1 className="hero-title" style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: '72px',
          lineHeight: .95,
          fontWeight: 700,
          letterSpacing: '.02em',
          color: 'rgba(255,255,255,.92)',
          margin: 0,
          textTransform: 'uppercase' as const,
        }}>
          INJE GT<br />MASTERS
        </h1>

        {/* meta chips */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginTop: '18px',
        }}>
          <MetaChip label="PLACE" value="INJE SPEEDIUM" />
          <MetaChip label="CLASS" value="Master 1 · Master 2 · Master N · Master 3" />
        </div>
      </div>

      {/* 우하단 사이드 패널 */}
      {nextRound && (
        <div className="hero-side" style={{
          position: 'absolute',
          right: '48px',
          bottom: '54px',
          width: '220px',
          zIndex: 2,
          borderTop: '1px solid rgba(200,25,33,.88)',
          background: 'linear-gradient(to bottom, rgba(0,0,0,.34), rgba(0,0,0,.14))',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          padding: '16px 16px 15px',
          textAlign: 'right' as const,
        }}>
          {/* label */}
          <div style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: '11px',
            letterSpacing: '.26em',
            color: 'rgba(255,255,255,.44)',
            textTransform: 'uppercase' as const,
            marginBottom: '8px',
          }}>
            NEXT EVENT
          </div>
          {/* round number */}
          <div style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: '34px',
            fontWeight: 700,
            color: 'rgba(255,255,255,.94)',
            lineHeight: 1,
          }}>
            R{String(nextRound.roundNumber).padStart(2, '0')}
          </div>
          {/* desc */}
          <div style={{
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: '12px',
            lineHeight: 1.55,
            color: 'rgba(255,255,255,.64)',
            marginTop: '8px',
          }}>
            {nextRound.title}
            {dateStr && <><br />{dateStr}</>}
          </div>
        </div>
      )}

      {/* 반응형 */}
      <style>{`
        @media (max-width: 768px) {
          .hero-title { font-size: 40px !important; }
          .hero-copy { left: 20px !important; right: 20px !important; bottom: 26px !important; }
          .hero-side {
            right: 20px !important; left: 20px !important; bottom: 138px !important;
            width: auto !important; text-align: left !important;
          }
        }
      `}</style>
    </section>
  )
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      border: '1px solid rgba(255,255,255,.14)',
      background: 'rgba(7,7,7,.24)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      padding: '6px 12px',
      display: 'inline-flex',
      alignItems: 'center',
    }}>
      <strong style={{
        fontFamily: "'Oswald', sans-serif",
        fontSize: '13px',
        fontWeight: 600,
        letterSpacing: '.08em',
        color: 'rgba(255,255,255,.95)',
        marginRight: '7px',
      }}>
        {label}
      </strong>
      <span style={{
        fontFamily: "'Noto Sans KR', sans-serif",
        fontSize: '12px',
        color: 'rgba(255,255,255,.76)',
      }}>
        {value}
      </span>
    </div>
  )
}
