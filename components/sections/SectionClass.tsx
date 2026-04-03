// components/sections/SectionClass.tsx — Horizontal accordion (cloned from SectionSeason)
'use client'
import { useState } from 'react'
import Link from 'next/link'

const classes = [
  { id: 1, name: 'MASTER 1', type: 'GT1', eligibility: '2,000cc 이하 터보 / 3,800cc 이하 NA' },
  { id: 2, name: 'MASTER 2', type: 'GT2', eligibility: '1,600cc 이하 터보 / 2,000cc 이하 NA' },
  { id: 3, name: 'MASTER N', type: 'GTN', eligibility: '2,000cc 이하 터보 (현대 N 차량)' },
  { id: 4, name: 'MASTER 3', type: 'GT3', eligibility: '1,600cc 이하 NA' },
]

export default function SectionClass() {
  const [active, setActive] = useState(0)

  return (
    <section className="cls" id="classes">
      <div className="cls__hd">
        <div>
          <div className="cls__kicker"><span className="cls__kicker-line" />RACE CLASSES</div>
          <h2 className="cls__title">CLASS INFO</h2>
        </div>
        <div className="cls__badge">4 CLASSES</div>
      </div>

      <div className="cls__acc">
        {classes.map((cls, i) => {
          const isActive = active === i

          return (
            <div
              key={cls.id}
              className={`cls__p ${isActive ? 'cls__p--on' : ''}`}
              onClick={() => setActive(i)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') setActive(i) }}
            >
              <div className="cls__p-ov" />
              <div className="cls__p-bar" />

              <div className="cls__p-collapsed">
                <span className="cls__p-name">{cls.name}</span>
              </div>

              <div className="cls__p-expanded">
                <div className="cls__p-left">
                  <div className="cls__p-tag">
                    <span className="cls__p-tag-inner">{cls.type}</span>
                  </div>
                  <h3 className="cls__p-title">{cls.name}</h3>
                  <div className="cls__p-meta">
                    <span className="cls__p-slash">/</span>
                    <span className="cls__p-elig">{cls.eligibility}</span>
                  </div>
                  <Link href="/entry" className="cls__p-btn" onClick={e => e.stopPropagation()}>
                    <span className="cls__p-btn-inner">VIEW CLASS</span>
                  </Link>
                </div>

                <div className="cls__p-right">
                  <div className="cls__p-slice">
                    <div className="cls__p-slice-cut" />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        .cls { background: #0a0a0a; padding: 60px 0; position: relative; z-index: 1; }
        .cls__hd {
          max-width: 1400px; margin: 0 auto 32px; padding: 0 40px;
          display: flex; align-items: flex-end; justify-content: space-between;
        }
        .cls__kicker {
          font-family: 'Oswald',sans-serif; font-size: .8rem; font-weight: 600;
          letter-spacing: .2em; color: #E60023; display: flex; align-items: center; gap: 10px;
          margin-bottom: 8px;
        }
        .cls__kicker-line { width: 28px; height: 2px; background: #E60023; }
        .cls__title {
          font-family: 'Oswald',sans-serif; font-size: clamp(2.7rem,5.25vw,4.2rem);
          font-weight: 700; letter-spacing: .04em; color: #fff; line-height: 1; margin: 0;
        }
        .cls__badge {
          font-family: 'Oswald',sans-serif; font-size: .8rem; font-weight: 600;
          letter-spacing: .15em; color: rgba(255,255,255,.25);
          border: 1px solid rgba(255,255,255,.08); padding: 5px 14px;
        }

        .cls__acc {
          max-width: 1400px; margin: 0 auto; padding: 0 40px;
          display: flex; gap: 2px; height: 400px;
        }
        .cls__p {
          flex: 0.35; position: relative; overflow: hidden; cursor: pointer;
          background: #111111; transition: flex .6s cubic-bezier(.8,0,.2,1);
          display: flex; align-items: stretch;
          border: none; outline: none; box-shadow: none;
        }
        .cls__p--on { flex: 5; }

        .cls__p-ov {
          position: absolute; inset: 0;
          background: transparent;
          z-index: 1;
        }
        .cls__p-bar {
          position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: #E60023; transform: scaleY(0); transform-origin: top;
          transition: transform .35s ease .08s; z-index: 3;
        }
        .cls__p--on .cls__p-bar { transform: scaleY(1); }

        .cls__p-collapsed {
          position: absolute; inset: 0; z-index: 2;
          display: flex; align-items: center; justify-content: center;
          transition: opacity .3s;
        }
        .cls__p--on .cls__p-collapsed { opacity: 0; pointer-events: none; }

        .cls__p-name {
          font-family: 'Oswald',sans-serif; font-size: .85rem; font-weight: 700;
          letter-spacing: .15em; text-transform: uppercase;
          color: rgba(255,255,255,.4);
          writing-mode: vertical-rl; text-orientation: mixed;
          transform: rotate(180deg);
        }
        .cls__p:hover .cls__p-name { color: rgba(255,255,255,.6); }

        .cls__p-expanded {
          position: absolute; inset: 0; z-index: 2;
          display: grid; grid-template-columns: 1fr 1.2fr;
          align-items: center;
          opacity: 0; pointer-events: none;
          transition: opacity .4s ease .2s;
        }
        .cls__p--on .cls__p-expanded { opacity: 1; pointer-events: auto; }

        .cls__p-left {
          display: flex; flex-direction: column; align-items: flex-start;
          padding: 40px 40px 40px 48px;
        }

        .cls__p-tag {
          background: #333; padding: 4px 16px;
          transform: skewX(-20deg);
          margin-bottom: 16px; border-left: 3px solid #E60023;
        }
        .cls__p-tag-inner {
          display: block; transform: skewX(20deg);
          font-family: 'Oswald',sans-serif; font-weight: 700;
          font-size: .9rem; letter-spacing: 2px; color: #fff;
        }

        .cls__p-title {
          font-family: 'Oswald',sans-serif; font-size: 4.5rem; font-weight: 900;
          line-height: 1.05; letter-spacing: -.04em; text-transform: uppercase;
          color: #fff; margin: 0 0 16px;
          text-shadow: none;
          transform: skewX(-10deg);
        }

        .cls__p-meta {
          display: flex; align-items: flex-start; gap: 12px;
          margin-bottom: 32px;
        }
        .cls__p-slash {
          color: #E60023; font-size: 1.5rem; font-weight: 900; font-style: italic;
        }
        .cls__p-elig {
          font-family: 'Oswald',sans-serif; color: #aaa;
          font-size: 1.1rem; letter-spacing: 1px; line-height: 1.5;
        }

        .cls__p-btn {
          display: inline-block;
          background: transparent;
          border: 2px solid #E60023;
          color: #ffffff;
          padding: 12px 28px;
          font-family: 'Oswald',sans-serif; font-weight: 700;
          font-size: .95rem; letter-spacing: 2px; text-transform: uppercase;
          text-decoration: none; transform: skewX(-15deg);
          transition: background .2s, box-shadow .2s;
        }
        .cls__p-btn:hover { background: rgba(230,0,35,.1); box-shadow: 4px 4px 0 rgba(230,0,35,.15); }
        .cls__p-btn-inner { display: block; transform: skewX(15deg); }

        .cls__p-right {
          position: relative; height: 100%;
          display: flex; align-items: center; justify-content: flex-end;
        }
        .cls__p-slice {
          position: relative; width: 100%; height: 90%;
          clip-path: polygon(15% 0, 100% 0, 85% 100%, 0 100%);
        }
        .cls__p-slice-cut {
          position: absolute; inset: 0;
          background: #111111;
        }

        @media (max-width: 900px) {
          .cls__acc { flex-direction: column; height: auto; padding: 0 20px; }
          .cls__p { height: 56px; flex: none !important; transition: height .4s cubic-bezier(.25,1,.5,1); }
          .cls__p--on { height: 280px; }
          .cls__p-collapsed { flex-direction: row; }
          .cls__p-name { writing-mode: horizontal-tb; transform: none; }
          .cls__p-expanded { grid-template-columns: 1fr; }
          .cls__p-right { display: none; }
          .cls__p-left { padding: 24px; }
          .cls__p-title { font-size: 2.5rem; }
          .cls__hd { padding: 0 20px; }
        }
      `}</style>
    </section>
  )
}
