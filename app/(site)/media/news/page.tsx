// app/(site)/media/news/page.tsx — 뉴스 카드 그리드 목록
export const dynamic = 'force-dynamic'  // 매 요청마다 서버에서 신선하게 렌더
import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity.client'
import { POSTS_QUERY, POSTS_COUNT_QUERY } from '@/lib/queries'
import type { Post, PostCategory } from '@/types/sanity'
import NewsCard from '@/components/ui/NewsCard'
import styles from './NewsListPage.module.css'

export const metadata: Metadata = {
  title: 'NEWS',
  description: '인제GT마스터즈의 공식 공지사항, 보도자료, 대회 소식을 확인하세요.',
}

const PAGE_SIZE = 6

const TABS = [
  { label: '전체',     value: '' },
  { label: '공지사항', value: 'notice' },
  { label: '보도자료', value: 'press' },
  { label: '대회소식', value: 'news' },
]

export default async function MediaNewsPage({
  searchParams,
}: {
  searchParams: { category?: string; limit?: string }
}) {
  const category = (searchParams.category ?? '') as PostCategory | ''
  const limit    = Math.max(PAGE_SIZE, parseInt(searchParams.limit ?? String(PAGE_SIZE), 10))

  const [posts, totalCount] = await Promise.all([
    sanityFetch<Post[]>({
      query:      POSTS_QUERY,
      params:     { category, start: 0, end: limit },
      revalidate: 60,
      useCdn:     false,
    }),
    sanityFetch<number>({
      query:      POSTS_COUNT_QUERY,
      params:     { category },
      revalidate: 60,
      useCdn:     false,
    }),
  ]).catch(() => [[], 0] as [Post[], number])

  const total        = typeof totalCount === 'number' ? totalCount : 0
  const hasMore      = limit < total
  const pinnedPosts  = category === '' ? (posts as Post[]).filter(p => p.isPinned) : []
  const regularPosts = (posts as Post[]).filter(p => !p.isPinned)
  const moreHref     = `/media/news?${category ? `category=${category}&` : ''}limit=${limit + PAGE_SIZE}`

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
            const href     = tab.value ? `/media/news?category=${tab.value}` : '/media/news'
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
