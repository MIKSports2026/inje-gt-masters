// components/sections/SectionClass.tsx — Diagonal class cards
'use client'
import Link from 'next/link'

const CLASSES = [
  { id: 'm1', name: 'Master 1', fee: '700,000', spec: '2,000cc 이하 터보 / 3,800cc 이하 NA' },
  { id: 'm2', name: 'Master 2', fee: '600,000', spec: '1,600cc 이하 터보 / 2,000cc 이하 NA' },
  { id: 'mn', name: 'Master N', fee: '600,000', spec: '2,000cc 이하 터보 (현대 N 차량)' },
  { id: 'm3', name: 'Master 3', fee: '500,000', spec: '1,600cc 이하 NA' },
]

export default function SectionClass() {
  return (
    <section className="cls" id="classes">
      <div className="cls__hd">
        <div>
          <div className="cls__kicker"><span className="cls__slash">/</span> RACE CLASSES</div>
          <h2 className="cls__title">CLASS INFO</h2>
        </div>
        <div className="cls__badge">4 CLASSES</div>
      </div>

      <div className="cls__grid">
        {CLASSES.map((c, i) => (
          <div key={c.id} className="cls__card">
            {/* 레드 사선 accent */}
            <div className="cls__card-accent" />
            <div className="cls__card-inner">
              <div className="cls__card-idx">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="cls__card-name">{c.name}</h3>
              <div className="cls__card-fee">
                <span className="cls__card-fee-num">₩{c.fee}</span>
                <span className="cls__card-fee-per">/R</span>
              </div>
              <div className="cls__card-divider" />
              <p className="cls__card-spec">{c.spec}</p>
              <Link href="/entry" className="cls__card-link">
                자세히 보기 →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .cls { background: #0d0d0d; padding: 72px 0 64px; }
        .cls__hd {
          max-width: 1400px; margin: 0 auto 36px; padding: 0 40px;
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

        /* Grid */
        .cls__grid {
          max-width: 1400px; margin: 0 auto; padding: 0 40px;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px;
        }

        /* Card */
        .cls__card {
          position: relative; overflow: hidden;
          background: #111; transition: background .3s;
        }
        .cls__card:hover { background: #161616; }

        .cls__card-accent {
          position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: #E60023;
          transform: scaleY(0); transform-origin: top;
          transition: transform .35s ease;
        }
        .cls__card:hover .cls__card-accent { transform: scaleY(1); }

        .cls__card-inner { padding: 32px 28px; position: relative; }

        .cls__card-idx {
          font-family: 'Oswald',sans-serif; font-size: .65rem; font-weight: 700;
          letter-spacing: .2em; color: rgba(255,255,255,.12);
          margin-bottom: 18px;
        }

        .cls__card-name {
          font-family: 'Oswald',sans-serif;
          font-size: 1.8rem; font-weight: 700;
          letter-spacing: .06em; color: #fff;
          transform: skewX(-10deg);
          margin: 0 0 10px;
          line-height: 1;
        }

        .cls__card-fee {
          display: flex; align-items: baseline; gap: 2px;
          margin-bottom: 18px;
        }
        .cls__card-fee-num {
          font-family: 'Oswald',sans-serif; font-size: 1.1rem; font-weight: 600;
          letter-spacing: .04em; color: #E60023;
          transform: skewX(-10deg); display: inline-block;
        }
        .cls__card-fee-per {
          font-family: 'Oswald',sans-serif; font-size: .7rem; font-weight: 500;
          color: rgba(255,255,255,.25); letter-spacing: .08em;
        }

        .cls__card-divider {
          width: 32px; height: 1px;
          background: rgba(255,255,255,.08);
          margin-bottom: 16px;
          transform: skewX(-30deg);
        }

        .cls__card-spec {
          font-family: 'Noto Sans KR',sans-serif; font-size: .78rem; font-weight: 500;
          color: rgba(255,255,255,.45); line-height: 1.6;
          margin: 0 0 22px;
        }

        .cls__card-link {
          display: inline-block;
          font-family: 'Oswald',sans-serif; font-size: .7rem; font-weight: 600;
          letter-spacing: .12em; text-transform: uppercase; text-decoration: none;
          color: rgba(255,255,255,.3);
          border: 1px solid rgba(255,255,255,.08);
          padding: 7px 18px;
          transform: skewX(-15deg);
          transition: all .25s;
        }
        .cls__card:hover .cls__card-link {
          color: #E60023; border-color: rgba(230,0,35,.3);
        }

        /* Mobile */
        @media (max-width: 992px) {
          .cls__grid { grid-template-columns: 1fr 1fr; padding: 0 20px; }
          .cls__hd { padding: 0 20px; }
        }
        @media (max-width: 600px) {
          .cls__grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  )
}
