// components/sections/SectionClass.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

const classes = [
  {
    id: 1,
    number: '01',
    name: 'MASTER 1',
    type: 'GT1',
    eligibility: '2,000cc 이하 터보 / 3,800cc 이하 NA',
    image: '',
  },
  {
    id: 2,
    number: '02',
    name: 'MASTER 2',
    type: 'GT2',
    eligibility: '1,600cc 이하 터보 / 2,000cc 이하 NA',
    image: '',
  },
  {
    id: 3,
    number: '03',
    name: 'MASTER N',
    type: 'GTN',
    eligibility: '2,000cc 이하 터보 (현대 N 차량)',
    image: '',
  },
  {
    id: 4,
    number: '04',
    name: 'MASTER 3',
    type: 'GT3',
    eligibility: '1,600cc 이하 NA',
    image: '',
  },
];

export default function SectionClass() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section style={{
      padding: '80px 0',
      backgroundColor: 'var(--bg-carbon, #111111)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* diagonal-bg-pattern */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        background: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02) 2px, transparent 2px, transparent 10px)',
        pointerEvents: 'none',
        opacity: 0.5,
      }} />

      {/* 섹션 헤더 */}
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
        <div style={{
          width: '60px',
          height: '4px',
          backgroundColor: '#E60023',
          transform: 'skewX(-30deg)',
        }} />
      </div>

      {/* 가로 아코디언 */}
      <div style={{
        display: 'flex',
        width: '100%',
        height: '500px',
      }}>
        {classes.map((cls, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={cls.id}
              onClick={() => setActiveIndex(index)}
              style={{
                position: 'relative',
                flex: isActive ? '5' : '0.3',
                transition: 'flex 0.6s cubic-bezier(0.8, 0, 0.2, 1)',
                overflow: 'hidden',
                cursor: 'pointer',
                borderRight: '2px solid #000',
              }}
            >
              {/* image-slice-bg — 레드 오프셋 레이어 */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
                backgroundColor: '#E60023',
                zIndex: 1,
              }} />

              {/* slide-image-cut — 메인 배경 */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
                backgroundColor: '#1a1a1a',
                backgroundImage: cls.image ? `url(${cls.image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 2,
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 10s linear',
              }} />

              {/* 닫힌 패널 — 세로 텍스트 */}
              {!isActive && (
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0,
                  width: '100%', height: '100%',
                  zIndex: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-heading, Oswald)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.5)',
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    transform: 'rotate(180deg)',
                  }}>{cls.name}</span>
                </div>
              )}

              {/* 열린 패널 콘텐츠 */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0,
                  width: '100%', height: '100%',
                  zIndex: 3,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1.2fr',
                  alignItems: 'center',
                }}>
                  {/* 좌측 텍스트 — slide-left 패턴 */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '40px',
                  }}>
                    {/* slanted-tag */}
                    <div style={{
                      backgroundColor: '#333',
                      padding: '4px 16px',
                      transform: 'skewX(-20deg)',
                      marginBottom: '16px',
                      borderLeft: '3px solid #E60023',
                    }}>
                      <span style={{
                        display: 'block',
                        transform: 'skewX(20deg)',
                        fontFamily: 'var(--font-heading, Oswald)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        letterSpacing: '2px',
                        color: '#fff',
                      }}>{cls.type}</span>
                    </div>

                    {/* slide-class-name + slanted-text-block */}
                    <h3 style={{
                      fontFamily: 'var(--font-heading, Oswald)',
                      fontSize: '4.5rem',
                      fontWeight: 900,
                      lineHeight: 1.05,
                      letterSpacing: '-0.04em',
                      textTransform: 'uppercase',
                      color: '#ffffff',
                      margin: '0 0 16px 0',
                      textShadow: '4px 4px 0px #E60023',
                      transform: 'skewX(-10deg)',
                    }}>{cls.name}</h3>

                    {/* meta-line */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      marginBottom: '32px',
                    }}>
                      <span style={{
                        color: '#E60023',
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        fontStyle: 'italic',
                      }}>/</span>
                      <span style={{
                        fontFamily: 'var(--font-heading, Oswald)',
                        color: '#AAAAAA',
                        fontSize: '1.1rem',
                        letterSpacing: '1px',
                        lineHeight: 1.5,
                      }}>{cls.eligibility}</span>
                    </div>

                    {/* schedule-btn */}
                    <Link href="/entry" style={{
                      display: 'inline-block',
                      backgroundColor: '#E60023',
                      color: '#ffffff',
                      padding: '14px 32px',
                      fontFamily: 'var(--font-heading, Oswald)',
                      fontWeight: 900,
                      fontSize: '0.95rem',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      transform: 'skewX(-15deg)',
                    }}>
                      <span style={{ display: 'block', transform: 'skewX(15deg)' }}>
                        VIEW CLASS
                      </span>
                    </Link>
                  </div>

                  {/* 우측 사선 이미지 — image-slice-container 패턴 */}
                  <div style={{
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}>
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      height: '90%',
                      clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0 100%)',
                    }}>
                      {/* 레드 그림자 레이어 */}
                      <div style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: '100%', height: '100%',
                        backgroundColor: '#E60023',
                        transform: 'translateX(-15px)',
                        zIndex: 1,
                      }} />
                      {/* 이미지 레이어 */}
                      <div style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: '100%', height: '100%',
                        backgroundColor: '#111111',
                        zIndex: 2,
                      }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 슬래시 도트 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        paddingTop: '32px',
      }}>
        {classes.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            style={{
              width: index === activeIndex ? '48px' : '24px',
              height: '8px',
              backgroundColor: index === activeIndex
                ? '#E60023'
                : 'rgba(255,255,255,0.2)',
              transform: 'skewX(-30deg)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </section>
  );
}
