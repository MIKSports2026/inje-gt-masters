// components/ui/NewsCard.tsx — 공통 뉴스 카드 (SectionNews + /media/news 공유)
import Link from 'next/link'
import type { Post } from '@/types/sanity'
import styles from './NewsCard.module.css'

const CAT_LABEL: Record<string, string> = {
  notice: '공지사항', news: '대회소식', press: '보도자료',
  entry:  '참가안내', regulation: '기술규정', event: '이벤트',
}
const CAT_COLOR: Record<string, string> = {
  notice: styles.tagRed,
  press:  styles.tagDark,
}

interface Props {
  post:      Post
  index?:    number
  pinned?:   boolean
  basePath?: string   // 링크 베이스 경로 (기본: /media/news)
}

export default function NewsCard({ post, index = 0, pinned, basePath = '/media/news' }: Props) {
  const imgUrl = post.coverImage?.asset?.url ?? null
  const cat    = CAT_LABEL[post.category] ?? post.category
  const tagCls = CAT_COLOR[post.category] ?? styles.tagGray
  const date   = post.publishedAt?.slice(0, 10).replace(/-/g, '.') ?? ''
  const href   = `${basePath}/${post.slug.current}`

  return (
    <Link
      href={href}
      className={`${styles.card} ${pinned ? styles.pinned : ''}`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* ── 이미지 (16:9 고정) ─────────────────────────── */}
      <div className={styles.imgWrap}>
        {imgUrl ? (
          <div
            className={styles.imgBg}
            style={{ backgroundImage: `url(${imgUrl})` }}
          />
        ) : (
          <div className={styles.imgFallback}>
            <span className={styles.fallbackText}>INJE GT MASTERS</span>
          </div>
        )}
        <div className={styles.imgOverlay} />
        <span className={`${styles.badge} ${tagCls}`}>{cat}</span>
      </div>

      {/* ── 본문 ───────────────────────────────────────── */}
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.cat}>{cat}</span>
          <span className={styles.date}>{date}</span>
        </div>
        <h3 className={styles.title}>{post.title}</h3>
        {post.excerpt && (
          <p className={styles.excerpt}>{post.excerpt}</p>
        )}
        <span className={styles.readMore}>
          READ MORE <span className={styles.readMoreArrow}>→</span>
        </span>
      </div>
    </Link>
  )
}
