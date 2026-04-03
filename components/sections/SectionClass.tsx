// components/sections/SectionClass.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

const classes = [
  {
    id: 1,
    number: '01',
    name: 'MASTER 1',
    eligibility: '2,000cc 이하 터보 / 3,800cc 이하 NA',
  },
  {
    id: 2,
    number: '02',
    name: 'MASTER 2',
    eligibility: '1,600cc 이하 터보 / 2,000cc 이하 NA',
  },
  {
    id: 3,
    number: '03',
    name: 'MASTER N',
    eligibility: '2,000cc 이하 터보 (현대 N 차량)',
  },
  {
    id: 4,
    number: '04',
    name: 'MASTER 3',
    eligibility: '1,600cc 이하 NA',
  },
];

export default function SectionClass() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section style={{
      padding: '80px 0',
      backgroundColor: 'var(--bg-carbon, #111111)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* 대각선 배경 패턴 — 원본 diagonal-bg-pattern */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        background: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02) 2px, transparent 2px, transparent 10px)',
        pointerEvents: 'none',
        opacity: 0.5,
      }} />

      {/* 섹션 헤더 — 원본 entry-header 패턴 */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '48px',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-heading, Oswald)',
          fontSize: '2rem',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          textTransform: 'uppercase',
          color: '#ffffff',
          margin: 0,
        }}>RACE CLASS</h2>
        {/* 원본 red-slash */}
        <div style={{
          width: '60px',
          height: '4px',
          backgroundColor: '#E60023',
          transform: 'skewX(-30deg)',
        }} />
      </div>

      {/* 4개 카드 그리드 */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '2px',
      }}>
        {classes.map((cls) => (
          <div
            key={cls.id}
            onMouseEnter={() => setHovered(cls.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'relative',
              height: '500px',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            {/* 원본 image-slice-bg — 레드 오프셋 레이어 */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              backgroundColor: '#E60023',
              clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)',
              transform: hovered === cls.id
                ? 'translateX(-12px)'
                : 'translateX(-18px)',
              transition: 'transform 0.4s cubic-bezier(0.8, 0, 0.2, 1)',
              zIndex: 1,
            }} />

            {/* 원본 slide-image-cut — 메인 카드 레이어 */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              backgroundColor: '#1a1a1a',
              clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)',
              zIndex: 2,
              transition: 'transform 0.4s ease',
              transform: hovered === cls.id ? 'scale(1.02)' : 'scale(1)',
            }} />

            {/* 콘텐츠 레이어 */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              zIndex: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '32px 24px',
            }}>
              {/* 원본 slanted-tag 패턴 — 번호 워터마크 */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: 'var(--font-heading, Oswald)',
                fontSize: '8rem',
                fontWeight: 900,
                color: 'rgba(255,255,255,0.06)',
                letterSpacing: '-0.05em',
                lineHeight: 1,
                userSelect: 'none',
              }}>{cls.number}</div>

              {/* 원본 slanted-tag */}
              <div style={{
                display: 'inline-block',
                backgroundColor: '#E60023',
                padding: '4px 14px',
                transform: 'skewX(-20deg)',
                marginBottom: '12px',
                alignSelf: 'flex-start',
              }}>
                <span style={{
                  display: 'block',
                  transform: 'skewX(20deg)',
                  fontFamily: 'var(--font-heading, Oswald)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  letterSpacing: '2px',
                  color: '#fff',
                }}>{cls.number}</span>
              </div>

              {/* 원본 slide-class-name + slanted-text-block */}
              <h3 style={{
                fontFamily: 'var(--font-heading, Oswald)',
                fontSize: '3rem',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                color: '#ffffff',
                margin: '0 0 12px 0',
                textShadow: '3px 3px 0px #E60023',
                transform: 'skewX(-10deg)',
              }}>{cls.name}</h3>

              {/* 원본 meta-line 패턴 */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                marginBottom: '24px',
              }}>
                <span style={{
                  color: '#E60023',
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  lineHeight: 1.4,
                }}>/</span>
                <span style={{
                  fontFamily: 'var(--font-heading, Oswald)',
                  color: '#AAAAAA',
                  fontSize: '0.95rem',
                  letterSpacing: '0.5px',
                  lineHeight: 1.4,
                }}>{cls.eligibility}</span>
              </div>

              {/* 원본 schedule-btn 패턴 */}
              <Link href="/entry" style={{
                display: 'inline-block',
                backgroundColor: 'transparent',
                border: '2px solid #E60023',
                color: '#ffffff',
                padding: '10px 24px',
                fontFamily: 'var(--font-heading, Oswald)',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transform: 'skewX(-15deg)',
                alignSelf: 'flex-start',
                transition: 'background 0.3s ease',
              }}>
                <span style={{ display: 'block', transform: 'skewX(15deg)' }}>
                  VIEW CLASS
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 992px) {
          .cls-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 576px) {
          .cls-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
