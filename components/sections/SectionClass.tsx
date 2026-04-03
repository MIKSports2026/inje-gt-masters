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
  },
  {
    id: 2,
    number: '02',
    name: 'MASTER 2',
    type: 'GT2',
    eligibility: '1,600cc 이하 터보 / 2,000cc 이하 NA',
  },
  {
    id: 3,
    number: '03',
    name: 'MASTER N',
    type: 'GTN',
    eligibility: '2,000cc 이하 터보 (현대 N 차량)',
  },
  {
    id: 4,
    number: '04',
    name: 'MASTER 3',
    type: 'GT3',
    eligibility: '1,600cc 이하 NA',
  },
];

export default function SectionClass() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <section className="cls-section">
        {/* diagonal-bg-pattern */}
        <div className="cls-bg-pattern" />

        {/* 섹션 헤더 */}
        <div className="cls-header">
          <h2 className="cls-title">RACE CLASS</h2>
          <div className="cls-red-slash" />
        </div>

        {/* 가로 아코디언 */}
        <div className="cls-accordion">
          {classes.map((cls, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={cls.id}
                className={`cls-panel ${isActive ? 'cls-panel--active' : 'cls-panel--closed'}`}
                onClick={() => setActiveIndex(index)}
              >
                {/* ── 닫힌 패널: 세로 클래스명만 ── */}
                <div className="cls-panel-closed-label">
                  <span>{cls.name}</span>
                </div>

                {/* ── 열린 패널 콘텐츠 ── */}
                <div className="cls-panel-content">
                  {/* 좌측 텍스트 — slide-left */}
                  <div className="cls-slide-left">
                    {/* slanted-tag */}
                    <div className="cls-slanted-tag">
                      <span className="cls-unskew">{cls.type}</span>
                    </div>

                    {/* slide-class-name + slanted-text-block */}
                    <h3 className="cls-class-name">
                      <span className="cls-slanted-text">{cls.name}</span>
                    </h3>

                    {/* meta-line */}
                    <div className="cls-meta">
                      <span className="cls-meta-slash">/</span>
                      <span className="cls-meta-text">{cls.eligibility}</span>
                    </div>

                    {/* 버튼 */}
                    <Link href="/entry" className="cls-btn">
                      <span className="cls-btn-inner">VIEW CLASS</span>
                    </Link>
                  </div>

                  {/* 우측 — image-slice-container (블랙) */}
                  <div className="cls-slide-right">
                    <div className="cls-image-slice-container">
                      <div className="cls-image-slice-bg" />
                      <div className="cls-image-cut" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 슬래시 도트 */}
        <div className="cls-dots">
          {classes.map((_, index) => (
            <button
              key={index}
              className={`cls-dot ${index === activeIndex ? 'cls-dot--active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`클래스 ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <style>{`
        /* ── 섹션 ── */
        .cls-section {
          padding: 80px 0;
          background-color: #111111;
          overflow: hidden;
          position: relative;
        }

        /* diagonal-bg-pattern */
        .cls-bg-pattern {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: repeating-linear-gradient(
            -45deg,
            rgba(255,255,255,0.02),
            rgba(255,255,255,0.02) 2px,
            transparent 2px,
            transparent 10px
          );
          pointer-events: none;
          opacity: 0.5;
        }

        /* ── 헤더 ── */
        .cls-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 40px;
          padding: 0 40px;
          position: relative;
          z-index: 10;
        }
        .cls-title {
          font-family: var(--font-heading, 'Oswald', sans-serif);
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: #ffffff;
          margin: 0;
        }
        .cls-red-slash {
          width: 60px;
          height: 4px;
          background-color: #E60023;
          transform: skewX(-30deg);
        }

        /* ── 가로 아코디언 ── */
        .cls-accordion {
          display: flex;
          width: 100%;
          height: 500px;
          position: relative;
          z-index: 10;
        }

        /* 패널 공통 */
        .cls-panel {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: flex 0.6s cubic-bezier(0.8, 0, 0.2, 1);
          border-right: 1px solid rgba(255,255,255,0.05);
        }

        /* 열린 패널 */
        .cls-panel--active {
          flex: 5;
        }

        /* 닫힌 패널 */
        .cls-panel--closed {
          flex: 0.35;
        }

        /* 닫힌 패널 세로 라벨 */
        .cls-panel-closed-label {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 1;
          transition: opacity 0.3s ease;
          z-index: 5;
        }
        .cls-panel--active .cls-panel-closed-label {
          opacity: 0;
          pointer-events: none;
        }
        .cls-panel-closed-label span {
          font-family: var(--font-heading, 'Oswald', sans-serif);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
        }

        /* 열린 패널 콘텐츠 */
        .cls-panel-content {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          align-items: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.4s ease 0.2s;
        }
        .cls-panel--active .cls-panel-content {
          opacity: 1;
          pointer-events: auto;
        }

        /* ── 좌측 텍스트 (slide-left) ── */
        .cls-slide-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 40px;
          z-index: 10;
        }

        /* slanted-tag */
        .cls-slanted-tag {
          background-color: #333;
          padding: 4px 16px;
          transform: skewX(-20deg);
          margin-bottom: 16px;
          border-left: 3px solid #E60023;
        }
        .cls-unskew {
          display: block;
          transform: skewX(20deg);
          font-family: var(--font-heading, 'Oswald', sans-serif);
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 2px;
          color: #fff;
        }

        /* slide-class-name */
        .cls-class-name {
          font-family: var(--font-heading, 'Oswald', sans-serif);
          font-size: 4.5rem;
          line-height: 1.1;
          margin: 0 0 24px 0;
          font-weight: 900;
          text-transform: uppercase;
        }

        /* slanted-text-block */
        .cls-slanted-text {
          display: inline-block;
          color: #ffffff;
          text-shadow: 4px 4px 0px #E60023;
          transform: skewX(-10deg);
        }

        /* meta-line */
        .cls-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 40px;
        }
        .cls-meta-slash {
          color: #E60023;
          font-size: 1.5rem;
          font-weight: 900;
          font-style: italic;
        }
        .cls-meta-text {
          font-family: var(--font-heading, 'Oswald', sans-serif);
          color: #AAAAAA;
          font-size: 1.1rem;
          letter-spacing: 1px;
        }

        /* 버튼 (schedule-btn) */
        .cls-btn {
          display: inline-block;
          background-color: #E60023;
          color: #ffffff;
          padding: 14px 32px;
          font-family: var(--font-heading, 'Oswald', sans-serif);
          font-weight: 900;
          font-size: 0.95rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          transform: skewX(-15deg);
          transition: background 0.3s ease;
        }
        .cls-btn:hover {
          background-color: #cc001f;
        }
        .cls-btn-inner {
          display: block;
          transform: skewX(15deg);
        }

        /* ── 우측 사선 이미지 (image-slice-container) ── */
        .cls-slide-right {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .cls-image-slice-container {
          position: relative;
          width: 100%;
          height: 90%;
          clip-path: polygon(15% 0, 100% 0, 85% 100%, 0 100%);
        }
        /* 레드 그림자 레이어 */
        .cls-image-slice-bg {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background-color: #E60023;
          transform: translateX(-15px);
          z-index: 1;
        }
        /* 메인 레이어 — 순수 블랙 */
        .cls-image-cut {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background-color: #111111;
          z-index: 2;
        }

        /* ── 슬래시 도트 ── */
        .cls-dots {
          display: flex;
          justify-content: center;
          gap: 16px;
          padding-top: 40px;
          position: relative;
          z-index: 20;
        }
        .cls-dot {
          width: 24px;
          height: 8px;
          background-color: rgba(255,255,255,0.2);
          transform: skewX(-30deg);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .cls-dot--active {
          background-color: #E60023;
          width: 48px;
        }
        .cls-dot:hover {
          background-color: rgba(255,255,255,0.6);
        }

        /* ── 반응형 ── */
        @media (max-width: 992px) {
          .cls-accordion {
            flex-direction: column;
            height: auto;
          }
          .cls-panel--active {
            flex: none;
            height: 400px;
          }
          .cls-panel--closed {
            flex: none;
            height: 56px;
          }
          .cls-panel-closed-label span {
            writing-mode: horizontal-tb;
            transform: none;
          }
          .cls-panel-content {
            grid-template-columns: 1fr;
          }
          .cls-class-name {
            font-size: 3rem;
          }
          .cls-image-slice-container {
            height: 200px;
            clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
          }
        }
      `}</style>
    </>
  );
}
