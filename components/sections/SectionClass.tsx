// components/sections/SectionClass.tsx — Diagonal 4-card grid
'use client'
import Link from 'next/link'

const CLASSES = [
  { id: 'm1', name: 'Master 1', spec: '2,000cc 이하 터보 / 3,800cc 이하 NA' },
  { id: 'm2', name: 'Master 2', spec: '1,600cc 이하 터보 / 2,000cc 이하 NA' },
  { id: 'mn', name: 'Master N', spec: '2,000cc 이하 터보 (현대 N 차량)' },
  { id: 'm3', name: 'Master 3', spec: '1,600cc 이하 NA' },
]

export default function SectionClass() {
  return (
    <section className="cls" id="classes">
      <div className="cls__hd">
        <div className="cls__kicker"><span className="cls__kicker-line" />RACE CLASSES</div>
        <h2 className="cls__title">CLASSES</h2>
      </div>

      <div className="cls__grid">
        {CLASSES.map((c, i) => (
          <div key={c.id} className="cls__card">
            {/* 사선 accent 상단 */}
            <div className="cls__card-top">
              <div className="cls__card-accent" />
              <div className="cls__card-idx">{String(i + 1).padStart(2, '0')}</div>
            </div>

            <div className="cls__card-body">
              <h3 className="cls__card-name">{c.name}</h3>
              <div className="cls__card-divider" />
              <p className="cls__card-spec">{c.spec}</p>
              <Link href="/entry" className="cls__card-link">
                자세히 보기 →
              </Link>
            </div>

            {/* 호버 레드 바 */}
            <div className="cls__card-bar" />
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
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px;
        }

        .cls__card {
          position: relative; overflow: hidden;
          background: #111; transition: background .3s;
          display: flex; flex-direction: column;
        }
        .cls__card:hover { background: #161616; }

        /* Top accent area */
        .cls__card-top {
          position: relative; height: 100px;
          background: linear-gradient(135deg, #0d0d0d 0%, #1a0008 100%);
          clip-path: polygon(0 0, 100% 0, 100% 70%, 0 100%);
          display: flex; align-items: flex-start; justify-content: flex-end;
          padding: 16px 20px;
        }
        .cls__card-accent {
          position: absolute; left: 0; top: 0; width: 100%; height: 3px;
          background: #E60023;
          transform: scaleX(0); transform-origin: left;
          transition: transform .35s ease;
        }
        .cls__card:hover .cls__card-accent { transform: scaleX(1); }
        .cls__card-idx {
          font-family: 'Oswald',sans-serif; font-size: 3rem; font-weight: 900;
          letter-spacing: -.05em; color: rgba(255,255,255,.04);
          line-height: 1;
        }

        .cls__card-body { padding: 20px 24px 28px; flex: 1; display: flex; flex-direction: column; }

        .cls__card-name {
          font-family: 'Oswald',sans-serif; font-size: clamp(2.2rem, 4vw, 3rem);
          font-weight: 900; letter-spacing: -.04em; color: #fff;
          transform: skewX(-10deg); line-height: .9;
          margin: 0 0 14px;
        }

        .cls__card-divider {
          width: 32px; height: 2px; background: rgba(255,255,255,.06);
          margin-bottom: 14px; transform: skewX(-30deg);
        }

        .cls__card-spec {
          font-family: 'Noto Sans KR',sans-serif; font-size: 1.2rem; font-weight: 500;
          color: rgba(255,255,255,.4); line-height: 1.55;
          margin: 0 0 auto; padding-bottom: 20px;
        }

        .cls__card-link {
          display: inline-block; align-self: flex-start;
          font-family: 'Oswald',sans-serif; font-size: .75rem; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase; text-decoration: none;
          color: rgba(255,255,255,.25); border: 1px solid rgba(255,255,255,.06);
          padding: 8px 22px; transform: skewX(-15deg);
          transition: all .25s;
        }
        .cls__card:hover .cls__card-link {
          color: #E60023; border-color: rgba(230,0,35,.3);
        }

        /* Left bar */
        .cls__card-bar {
          position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: #E60023; transform: scaleY(0); transform-origin: top;
          transition: transform .35s ease; z-index: 2;
        }
        .cls__card:hover .cls__card-bar { transform: scaleY(1); }

        /* Mobile */
        @media (max-width: 992px) {
          .cls__grid { grid-template-columns: 1fr 1fr; padding: 0 20px; }
          .cls__hd { padding: 0 20px; }
          .cls__card-name { font-size: 2rem; }
          .cls__card-spec { font-size: 1rem; }
        }
        @media (max-width: 600px) {
          .cls__grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  )
}
