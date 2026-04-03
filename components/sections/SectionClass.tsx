// components/sections/SectionClass.tsx — Diagonal 4-card with red offset
'use client'
import Link from 'next/link'

const CLASSES = [
  { id: 'm1', num: '01', name: 'Master 1', spec: '2,000cc 이하 터보 / 3,800cc 이하 NA' },
  { id: 'm2', num: '02', name: 'Master 2', spec: '1,600cc 이하 터보 / 2,000cc 이하 NA' },
  { id: 'mn', num: '03', name: 'Master N', spec: '2,000cc 이하 터보 (현대 N 차량)' },
  { id: 'm3', num: '04', name: 'Master 3', spec: '1,600cc 이하 NA' },
]

export default function SectionClass() {
  return (
    <section className="cls" id="classes">
      <div className="cls__hd">
        <div>
          <div className="cls__kicker"><span className="cls__kicker-line" />RACE CLASSES</div>
          <h2 className="cls__title">CLASSES</h2>
        </div>
      </div>

      <div className="cls__grid">
        {CLASSES.map((c) => (
          <div key={c.id} className="cls__card">
            <div className="cls__card-red" />
            <div className="cls__card-face">
              <div className="cls__card-bar" />
              <span className="cls__card-watermark">{c.num}</span>
              <div className="cls__card-body">
                <h3 className="cls__card-name">{c.name}</h3>
                <div className="cls__card-divider" />
                <p className="cls__card-spec">{c.spec}</p>
                <Link href="/entry" className="cls__card-link">
                  자세히 보기 →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .cls { background: #0d0d0d; padding: 72px 0 64px; }
        .cls__hd { max-width: 1400px; margin: 0 auto 36px; padding: 0 40px; }
        .cls__kicker {
          font-family: 'Oswald',sans-serif; font-size: .8rem; font-weight: 600;
          letter-spacing: .2em; color: #E60023;
          display: flex; align-items: center; gap: 10px; margin-bottom: 8px;
        }
        .cls__kicker-line { width: 28px; height: 2px; background: #E60023; }
        .cls__title {
          font-family: 'Oswald',sans-serif; font-size: clamp(2rem,4vw,3.2rem);
          font-weight: 900; letter-spacing: -.03em; color: #fff; margin: 0;
        }

        .cls__grid {
          max-width: 1400px; margin: 0 auto; padding: 0 40px;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
        }

        .cls__card { position: relative; height: 400px; }

        /* Red offset */
        .cls__card-red {
          position: absolute; inset: 0;
          background: #E60023; opacity: .2;
          clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%);
          transform: translate(6px, 6px);
          z-index: 1;
          transition: transform .3s ease, opacity .3s ease;
        }
        .cls__card:hover .cls__card-red {
          transform: translate(10px, 10px);
          opacity: .35;
        }

        /* Face */
        .cls__card-face {
          position: relative; z-index: 2;
          width: 100%; height: 100%;
          background: #111;
          clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%);
          overflow: hidden;
          transition: background .3s;
        }
        .cls__card:hover .cls__card-face { background: #151515; }

        .cls__card-bar {
          position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: #E60023; transform: scaleY(0); transform-origin: top;
          transition: transform .35s ease; z-index: 3;
        }
        .cls__card:hover .cls__card-bar { transform: scaleY(1); }

        /* Watermark number */
        .cls__card-watermark {
          position: absolute; top: 16px; right: 24px;
          font-family: 'Oswald',sans-serif; font-size: 8rem; font-weight: 900;
          letter-spacing: -.05em; line-height: 1;
          color: rgba(255,255,255,.04);
          pointer-events: none; user-select: none;
        }

        .cls__card-body {
          position: relative; z-index: 2;
          padding: 0 28px 32px;
          height: 100%; display: flex; flex-direction: column;
          justify-content: flex-end;
        }

        .cls__card-name {
          font-family: 'Oswald',sans-serif;
          font-size: 3.5rem; font-weight: 900;
          letter-spacing: -.04em; color: #fff;
          text-transform: uppercase;
          line-height: .88; margin: 0 0 14px;
          transform: skewX(-6deg);
        }

        .cls__card-divider {
          width: 28px; height: 2px; background: rgba(255,255,255,.06);
          margin-bottom: 14px; transform: skewX(-30deg);
        }

        .cls__card-spec {
          font-family: 'Noto Sans KR',sans-serif; font-size: 1.1rem; font-weight: 500;
          color: rgba(255,255,255,.4); line-height: 1.55;
          margin: 0 0 20px;
        }

        .cls__card-link {
          display: inline-block; align-self: flex-start;
          font-family: 'Oswald',sans-serif; font-size: .72rem; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase; text-decoration: none;
          color: rgba(255,255,255,.25); border: 1px solid rgba(255,255,255,.06);
          padding: 8px 20px; transform: skewX(-15deg);
          transition: all .25s;
        }
        .cls__card:hover .cls__card-link {
          color: #E60023; border-color: rgba(230,0,35,.3);
        }

        /* Mobile */
        @media (max-width: 992px) {
          .cls__grid { grid-template-columns: 1fr 1fr; padding: 0 20px; gap: 14px; }
          .cls__hd { padding: 0 20px; }
          .cls__card { height: 320px; }
          .cls__card-name { font-size: 2.4rem; }
          .cls__card-watermark { font-size: 5rem; }
          .cls__card-spec { font-size: .95rem; }
        }
        @media (max-width: 600px) {
          .cls__grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  )
}
