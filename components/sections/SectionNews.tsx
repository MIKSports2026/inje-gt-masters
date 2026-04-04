// components/sections/SectionNews.tsx — 3-column news cards with diagonal clip
'use client'
import Link from 'next/link'
import type { Post } from '@/types/sanity'

interface Props { posts: Post[] }

const CAT_LABEL: Record<string, string> = {
  notice: '공지사항', news: '대회소식', press: '보도자료',
  entry: '참가안내', regulation: '기술규정', event: '이벤트',
}

export default function SectionNews({ posts }: Props) {
  const items = posts.slice(0, 6)

  return (
    <section className="snews" id="news">
      <div className="snews__hd">
        <div>
          <div className="snews__kicker"><span className="snews__kicker-line" />LATEST</div>
          <h2 className="snews__title">NEWS</h2>
        </div>
        <Link href="/news" className="snews__more">
          전체 보기 →
        </Link>
      </div>

      <div className="snews__grid">
        {items.length === 0 ? (
          <div className="snews__empty">소식을 준비중입니다.</div>
        ) : (
          items.map((post) => {
            const imgUrl = post.coverImage?.asset?.url
            const cat = CAT_LABEL[post.category] ?? post.category
            const date = post.publishedAt?.slice(0, 10).replace(/-/g, '.')

            return (
              <Link
                key={post._id}
                href={`/news/${post.slug.current}`}
                className="snews__card"
              >
                {/* 이미지 */}
                <div className="snews__card-img">
                  {imgUrl ? (
                    <div
                      className="snews__card-img-bg"
                      style={{ backgroundImage: `url(${imgUrl})` }}
                    />
                  ) : (
                    <div className="snews__card-img-fb" />
                  )}
                  <div className="snews__card-img-ov" />
                </div>

                {/* 콘텐츠 */}
                <div className="snews__card-body">
                  <div className="snews__card-meta">
                    <span className="snews__card-cat">{cat}</span>
                    <span className="snews__card-date">{date}</span>
                  </div>
                  <h3 className="snews__card-title">{post.title}</h3>
                  {post.excerpt && (
                    <p className="snews__card-excerpt">{post.excerpt}</p>
                  )}
                  <span className="snews__card-link">
                    READ MORE <span className="snews__card-arrow">→</span>
                  </span>
                </div>
              </Link>
            )
          })
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

        /* Card */
        .snews__card {
          background: #1a1a1a; text-decoration: none; color: inherit;
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
          transition: transform .4s cubic-bezier(.25,1,.5,1), box-shadow .4s ease;
          display: flex; flex-direction: column;
        }
        .snews__card:hover {
          transform: translateY(-15px);
          box-shadow: 0 20px 40px rgba(0,0,0,.8);
        }

        /* Image */
        .snews__card-img {
          position: relative; width: 100%; padding-bottom: 56.25%; /* 16:9 */
          overflow: hidden;
        }
        .snews__card-img-bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          transition: transform .6s ease;
        }
        .snews__card:hover .snews__card-img-bg { transform: scale(1.05); }
        .snews__card-img-fb {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #1a1a1a 0%, #0d0005 100%);
        }
        .snews__card-img-ov {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(26,26,26,1) 0%, transparent 50%);
        }

        /* Body */
        .snews__card-body { padding: 20px 24px 28px; flex: 1; display: flex; flex-direction: column; }

        .snews__card-meta {
          display: flex; align-items: center; gap: 12px; margin-bottom: 10px;
        }
        .snews__card-cat {
          font-family: 'Oswald',sans-serif; font-size: .7rem; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase; color: #E60023;
        }
        .snews__card-date {
          font-family: 'Oswald',sans-serif; font-size: .7rem; font-weight: 500;
          letter-spacing: .08em; color: rgba(255,255,255,.25);
        }

        .snews__card-title {
          font-family: 'Oswald',sans-serif; font-size: 1.6rem; font-weight: 700;
          letter-spacing: -.02em; color: #fff; line-height: 1.2;
          margin: 0 0 10px; transition: color .3s ease;
        }
        .snews__card:hover .snews__card-title { color: #E60023; }

        .snews__card-excerpt {
          font-family: 'Noto Sans KR',sans-serif; font-size: .85rem; font-weight: 400;
          color: rgba(255,255,255,.35); line-height: 1.6;
          margin: 0 0 auto; padding-bottom: 16px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }

        .snews__card-link {
          font-family: 'Oswald',sans-serif; font-size: .72rem; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase;
          color: rgba(255,255,255,.3); display: flex; align-items: center; gap: 6px;
          transition: color .2s;
        }
        .snews__card:hover .snews__card-link { color: #E60023; }
        .snews__card-arrow {
          display: inline-block; transition: transform .2s ease;
        }
        .snews__card:hover .snews__card-arrow { transform: translateX(5px); }

        /* Mobile */
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
