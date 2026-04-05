// components/sections/SectionNews.tsx — 메인 뉴스 섹션
'use client'
import Link from 'next/link'
import type { Post } from '@/types/sanity'
import NewsCard from '@/components/ui/NewsCard'

interface Props { posts: Post[] }

export default function SectionNews({ posts }: Props) {
  const items = posts.slice(0, 6)

  return (
    <section className="snews" id="news">
      <div className="snews__hd">
        <div>
          <div className="snews__kicker"><span className="snews__kicker-line" />LATEST</div>
          <h2 className="snews__title">NEWS</h2>
        </div>
        <Link href="/media/news" className="snews__more">
          전체 보기 →
        </Link>
      </div>

      <div className="snews__grid">
        {items.length === 0 ? (
          <div className="snews__empty">소식을 준비중입니다.</div>
        ) : (
          items.map((post, i) => (
            <NewsCard key={post._id} post={post} index={i} />
          ))
        )}
      </div>

      <style>{`
        .snews { background: #0a0a0a; padding: 72px 0 64px; }
        .snews__hd {
          max-width: 1400px; margin: 0 auto 36px; padding: 0 40px;
          display: flex; align-items: flex-end; justify-content: space-between;
        }
        .snews__kicker {
          font-family: 'Oswald',sans-serif; font-size: 1.2rem; font-weight: 600;
          letter-spacing: .2em; color: #E60023;
          display: flex; align-items: center; gap: 10px; margin-bottom: 8px;
        }
        .snews__kicker-line { width: 28px; height: 2px; background: #E60023; }
        .snews__title {
          font-family: 'Oswald',sans-serif; font-size: clamp(1.62rem,3.15vw,2.52rem);
          font-weight: 900; letter-spacing: -.03em; color: #fff; margin: 0;
        }
        .snews__more {
          font-family: 'Oswald',sans-serif; font-size: .8rem; font-weight: 600;
          letter-spacing: .12em; text-transform: uppercase; text-decoration: none;
          color: rgba(255,255,255,.3); transition: color .2s;
        }
        .snews__more:hover { color: #E60023; }

        .snews__grid {
          max-width: 1400px; margin: 0 auto; padding: 0 40px;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
        }
        .snews__empty {
          grid-column: 1 / -1; text-align: center; padding: 60px 0;
          font-family: 'Oswald',sans-serif; font-size: 1rem;
          color: rgba(255,255,255,.25); letter-spacing: .1em;
        }

        @media (max-width: 992px) {
          .snews__grid { grid-template-columns: 1fr 1fr; padding: 0 20px; }
          .snews__hd { padding: 0 20px; }
        }
        @media (max-width: 600px) {
          .snews__grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  )
}
