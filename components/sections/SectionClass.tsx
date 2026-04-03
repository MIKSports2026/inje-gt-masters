// components/sections/SectionClass.tsx — Class accordion (diagonal design)
'use client'
import { useState } from 'react'
import Link from 'next/link'

const CLASSES = [
  {
    id: 'm1', name: 'Master 1', fee: '700,000',
    spec: '2,000cc 이하 터보 / 3,800cc 이하 NA',
    mods: '서스펜션·브레이크·에어로 자유 개조, 안전 롤케이지 필수',
    rounds: 'R1 ~ R5 전 라운드',
  },
  {
    id: 'm2', name: 'Master 2', fee: '600,000',
    spec: '1,600cc 이하 터보 / 2,000cc 이하 NA',
    mods: '서스펜션·브레이크 개조 허용, 외장 에어로 제한적 허용',
    rounds: 'R1 ~ R5 전 라운드',
  },
  {
    id: 'mn', name: 'Master N', fee: '600,000',
    spec: '2,000cc 이하 터보 (현대 N 차량 전용)',
    mods: 'N 퍼포먼스 파츠 범위 내 개조, 순정 보디 유지',
    rounds: 'R1 ~ R5 전 라운드',
  },
  {
    id: 'm3', name: 'Master 3', fee: '500,000',
    spec: '1,600cc 이하 NA',
    mods: '서스펜션·브레이크 개조만 허용, 외장 순정 유지',
    rounds: 'R1 ~ R5 전 라운드',
  },
]

export default function SectionClass() {
  const [active, setActive] = useState(0)

  return (
    <section className="cls" id="classes">
      <div className="cls__hd">
        <div>
          <div className="cls__kicker"><span className="cls__slash">/</span> RACE CLASSES</div>
          <h2 className="cls__title">CLASS INFO</h2>
        </div>
        <div className="cls__badge">4 CLASSES</div>
      </div>

      <div className="cls__acc">
        {CLASSES.map((c, i) => {
          const isActive = active === i
          return (
            <div
              key={c.id}
              className={`cls__p ${isActive ? 'cls__p--on' : ''}`}
              onClick={() => setActive(i)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') setActive(i) }}
            >
              <div className="cls__p-bar" />

              {/* 닫힘: 클래스명 + 참가비 */}
              <div className="cls__p-closed">
                <span className="cls__p-name">{c.name}</span>
                <span className="cls__p-fee-sm">₩{c.fee}</span>
              </div>

              {/* 열림: 상세 */}
              <div className="cls__p-open">
                <div className="cls__p-head">
                  <span className="cls__p-name-lg">{c.name}</span>
                  <span className="cls__p-fee-lg">₩{c.fee}<span className="cls__p-per">/R</span></span>
                </div>
                <div className="cls__p-divider" />
                <div className="cls__p-rows">
                  <div className="cls__p-row">
                    <span className="cls__p-label">자격조건</span>
                    <span className="cls__p-val">{c.spec}</span>
                  </div>
                  <div className="cls__p-row">
                    <span className="cls__p-label">개조범위</span>
                    <span className="cls__p-val">{c.mods}</span>
                  </div>
                  <div className="cls__p-row">
                    <span className="cls__p-label">참가 라운드</span>
                    <span className="cls__p-val">{c.rounds}</span>
                  </div>
                </div>
                <Link href="/entry" className="cls__p-link" onClick={e => e.stopPropagation()}>
                  참가 신청 →
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        .cls { background: #0d0d0d; padding: 72px 0 64px; }
        .cls__hd {
          max-width: 1400px; margin: 0 auto 32px; padding: 0 40px;
          display: flex; align-items: flex-end; justify-content: space-between;
        }
        .cls__kicker {
          font-family: 'Oswald',sans-serif; font-size: .8rem; font-weight: 600;
          letter-spacing: .2em; color: #E60023;
          display: flex; align-items: center; gap: 8px; margin-bottom: 8px;
        }
        .cls__slash {
          font-size: 1.1rem; font-weight: 300; color: #E60023; opacity: .6;
          transform: skewX(-30deg); display: inline-block;
        }
        .cls__title {
          font-family: 'Oswald',sans-serif; font-size: clamp(1.6rem,3vw,2.4rem);
          font-weight: 700; letter-spacing: .04em; color: #fff; margin: 0;
          transform: skewX(-3deg);
        }
        .cls__badge {
          font-family: 'Oswald',sans-serif; font-size: .8rem; font-weight: 600;
          letter-spacing: .15em; color: rgba(255,255,255,.25);
          border: 1px solid rgba(255,255,255,.08); padding: 5px 14px;
          transform: skewX(-15deg);
        }

        /* Accordion */
        .cls__acc {
          max-width: 1400px; margin: 0 auto; padding: 0 40px;
          display: flex; gap: 2px; height: 320px;
        }
        .cls__p {
          flex: 1; position: relative; overflow: hidden; cursor: pointer;
          background: #111; transition: flex .5s cubic-bezier(.25,1,.5,1);
          display: flex; align-items: stretch;
        }
        .cls__p--on { flex: 5; }

        .cls__p-bar {
          position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: #E60023; transform: scaleY(0); transform-origin: top;
          transition: transform .35s ease .08s; z-index: 2;
        }
        .cls__p--on .cls__p-bar { transform: scaleY(1); }

        /* Closed */
        .cls__p-closed {
          position: absolute; inset: 0; z-index: 1;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
          transition: opacity .25s;
        }
        .cls__p--on .cls__p-closed { opacity: 0; pointer-events: none; }

        .cls__p-name {
          font-family: 'Oswald',sans-serif; font-size: 1.1rem; font-weight: 700;
          letter-spacing: .08em; color: #444; transform: skewX(-10deg);
        }
        .cls__p:hover .cls__p-name { color: #666; }
        .cls__p-fee-sm {
          font-family: 'Oswald',sans-serif; font-size: .65rem; font-weight: 500;
          letter-spacing: .1em; color: #333;
        }

        /* Open */
        .cls__p-open {
          position: relative; z-index: 1; padding: 28px 28px;
          display: flex; flex-direction: column; justify-content: center; width: 100%;
          opacity: 0; transform: translateX(-10px);
          transition: opacity .35s ease .15s, transform .35s ease .15s;
        }
        .cls__p--on .cls__p-open { opacity: 1; transform: translateX(0); }

        .cls__p-head {
          display: flex; align-items: baseline; gap: 14px; margin-bottom: 16px;
        }
        .cls__p-name-lg {
          font-family: 'Oswald',sans-serif; font-size: 1.8rem; font-weight: 700;
          letter-spacing: .06em; color: #fff; transform: skewX(-10deg); line-height: 1;
        }
        .cls__p-fee-lg {
          font-family: 'Oswald',sans-serif; font-size: 1rem; font-weight: 600;
          letter-spacing: .04em; color: #E60023; transform: skewX(-10deg);
        }
        .cls__p-per { font-size: .7rem; color: rgba(255,255,255,.25); margin-left: 1px; }

        .cls__p-divider {
          width: 40px; height: 1px; background: rgba(255,255,255,.08);
          margin-bottom: 16px; transform: skewX(-30deg);
        }

        .cls__p-rows { display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px; }
        .cls__p-row { display: flex; gap: 12px; align-items: flex-start; }
        .cls__p-label {
          font-family: 'Oswald',sans-serif; font-size: .62rem; font-weight: 700;
          letter-spacing: .15em; text-transform: uppercase;
          color: rgba(255,255,255,.3); min-width: 72px; flex-shrink: 0; padding-top: 2px;
        }
        .cls__p-val {
          font-family: 'Noto Sans KR',sans-serif; font-size: .78rem; font-weight: 500;
          color: rgba(255,255,255,.55); line-height: 1.5;
        }

        .cls__p-link {
          display: inline-block; align-self: flex-start;
          font-family: 'Oswald',sans-serif; font-size: .7rem; font-weight: 600;
          letter-spacing: .12em; text-transform: uppercase; text-decoration: none;
          color: #E60023; border: 1px solid rgba(230,0,35,.25);
          padding: 7px 20px; transform: skewX(-15deg);
          transition: all .25s;
        }
        .cls__p-link:hover {
          background: rgba(230,0,35,.08); border-color: #E60023;
          box-shadow: 3px 3px 0 rgba(230,0,35,.15);
        }

        /* Mobile */
        @media (max-width: 900px) {
          .cls__acc { flex-direction: column; height: auto; padding: 0 20px; }
          .cls__p { height: 64px; flex: none !important; transition: height .4s cubic-bezier(.25,1,.5,1); }
          .cls__p--on { height: 280px; }
          .cls__p-closed { flex-direction: row; gap: 14px; }
          .cls__hd { padding: 0 20px; }
        }
      `}</style>
    </section>
  )
}
