// app/(site)/media/news/page.tsx — 뉴스 카드 그리드 목록
import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity.client'
import { POSTS_QUERY, POSTS_COUNT_QUERY } from '@/lib/queries'
import type { Post, PostCategory } from '@/types/sanity'
import styles from './NewsListPage.module.css'

export const metadata: Metadata = {
  title: 'NEWS',
  description: '인제GT마스터즈의 공식 공지사항, 보도자료, 대회 소식을 확인하세요.',
}

const PAGE_SIZE = 6

const TABS = [
  { label: '전체',    value: '' },
  { label: '공지사항', value: 'notice' },
  { label: '보도자료', value: 'press' },
  { label: '대회소식', value: 'news' },
]

const TAG_LABELS: Record<string, string> = {
  notice: '공지사항', press: '보도자료', news: '대회소식',
  entry: '참가안내', regulation: '기술규정', event: '이벤트',
}

const TAG_CLS: Record<string, string> = {
  notice: styles.tagRed,
  press:  styles.tagDark,
  news:   styles.tagGray,
}

function fmtDate(iso: string) {
  return iso.slice(0, 10).replace(/-/g, '.')
}

interface NewsCardProps { post: Post; index: number; pinned?: boolean }

function NewsCard({ post, index, pinned }: NewsCardProps) {
  const tagLabel = TAG_LABELS[post.category] ?? post.category
  const tagCls   = TAG_CLS[post.category] ?? styles.tagGray
  const imgUrl   = post.coverImage?.asset?.url ?? null
  const dateStr  = post.publishedAt ? fmtDate(post.publishedAt) : ''

  return (
    <Link
      href={`/media/news/${post.slug.current}`}
      className={`${styles.card} ${pinned ? styles.cardPinned : ''}`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* 이미지 */}
      <div
        className={styles.cardImage}
        style={imgUrl ? { backgroundImage: `url(${imgUrl})` } : undefined}
      >
        {imgUrl ? (
          <div className={styles.cardOverlay} />
        ) : (
          <div className={styles.cardNoImage}>
            <i className="fa-solid fa-newspaper" />
          </div>
        )}
        <span className={`${styles.badge} ${tagCls}`}>{tagLabel}</span>
      </div>

      {/* 텍스트 */}
      <div className={styles.cardContent}>
        <span className={styles.cardDate}>{dateStr}</span>
        <h3 className={styles.cardTitle}>{post.title}</h3>
        {post.excerpt && <p className={styles.cardSummary}>{post.excerpt}</p>}
      </div>
    </Link>
  )
}

export default async function MediaNewsPage({
  searchParams,
}: {
  searchParams: { category?: string; limit?: string }
}) {
  const category = (searchParams.category ?? '') as PostCategory | ''
  const limit    = Math.max(PAGE_SIZE, parseInt(searchParams.limit ?? String(PAGE_SIZE), 10))

  const [posts, totalCount] = await Promise.all([
    sanityFetch<Post[]>({
      query:     POSTS_QUERY,
      params:    { category, start: 0, end: limit },
      revalidate: 300,
    }),
    sanityFetch<number>({
      query:     POSTS_COUNT_QUERY,
      params:    { category },
      revalidate: 300,
    }),
  ]).catch(() => [[], 0] as [Post[], number])

  const displayPosts = posts as Post[]
  const total        = typeof totalCount === 'number' ? totalCount : 0
  const hasMore      = limit < total

  const pinnedPosts  = category === '' ? displayPosts.filter(p => p.isPinned) : []
  const regularPosts = displayPosts.filter(p => !p.isPinned)

  const moreHref = `/media/news?${category ? `category=${category}&` : ''}limit=${limit + PAGE_SIZE}`

  return (
    <div className={styles.wrapper}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className={styles.hero}>
        <div className="container">
          <div className={styles.breadcrumb}>
            인제GT마스터즈 <span>/</span> MEDIA <span>/</span> <strong>NEWS</strong>
          </div>
          <h1 className={styles.title}>NEWS</h1>
          <div className={styles.redSlash} />
          <p className={styles.subtitle}>인제GT마스터즈의 공식 소식</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '40px' }}>

        {/* ── 필터 탭 ──────────────────────────────────── */}
        <div className={styles.filterBar}>
          {TABS.map(tab => {
            const href    = tab.value ? `/media/news?category=${tab.value}` : '/media/news'
            const isActive = category === tab.value
            return (
              <Link
                key={tab.value}
                href={href}
                className={`${styles.filterBtn} ${isActive ? styles.active : ''}`}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>

        {/* ── 고정 공지 ─────────────────────────────────── */}
        {pinnedPosts.length > 0 && (
          <div className={styles.pinnedSection}>
            <div className={styles.pinnedLabel}>
              <span>📌</span> 중요 공지
            </div>
            <div className={styles.grid}>
              {pinnedPosts.map((post, i) => (
                <NewsCard key={post._id} post={post} index={i} pinned />
              ))}
            </div>
          </div>
        )}

        {/* ── 카드 그리드 ───────────────────────────────── */}
        <div className={styles.grid}>
          {regularPosts.length > 0 ? (
            regularPosts.map((post, i) => (
              <NewsCard key={post._id} post={post} index={i} />
            ))
          ) : (
            <div className={styles.empty}>해당 카테고리의 게시글이 없습니다.</div>
          )}
        </div>

        {/* ── 더보기 ───────────────────────────────────── */}
        {hasMore && (
          <div className={styles.loadMore}>
            <Link href={moreHref} className={styles.btnLoadMore}>
              더보기 +
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
