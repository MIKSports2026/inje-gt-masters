// app/(site)/media/news/[slug]/page.tsx — 뉴스 상세
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { sanityFetch } from '@/lib/sanity.client'
import { POST_DETAIL_QUERY, POST_PREV_QUERY, POST_NEXT_QUERY } from '@/lib/queries'
import type { Post, PostCategory } from '@/types/sanity'
import styles from './NewsDetailPage.module.css'

const TAG_LABELS: Record<string, string> = {
  notice: '공지사항', press: '보도자료', news: '대회소식',
  entry: '참가안내', regulation: '기술규정', event: '이벤트',
}
const TAG_CLS: Record<string, string> = {
  notice: styles.tagRed,
  press:  styles.tagDark,
  news:   styles.tagGray,
}

type AdjacentPost = { _id: string; title: string; slug: { current: string } } | null

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await sanityFetch<Post>({ query: POST_DETAIL_QUERY, params: { slug: params.slug }, revalidate: 300 }).catch(() => null)
  if (!post) return { title: 'NEWS' }
  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      ...(post.coverImage?.asset?.url ? { images: [post.coverImage.asset.url] } : {}),
    },
  }
}

export default async function MediaNewsDetailPage({ params }: { params: { slug: string } }) {
  const post = await sanityFetch<Post>({
    query:     POST_DETAIL_QUERY,
    params:    { slug: params.slug },
    revalidate: 300,
  }).catch(() => null)

  if (!post) notFound()

  const [prevPost, nextPost] = await Promise.all([
    sanityFetch<AdjacentPost>({ query: POST_PREV_QUERY, params: { publishedAt: post.publishedAt }, revalidate: 300 }),
    sanityFetch<AdjacentPost>({ query: POST_NEXT_QUERY, params: { publishedAt: post.publishedAt }, revalidate: 300 }),
  ]).catch(() => [null, null] as [AdjacentPost, AdjacentPost])

  const tagLabel = TAG_LABELS[post.category] ?? post.category
  const tagCls   = TAG_CLS[post.category]   ?? styles.tagGray
  const dateStr  = post.publishedAt?.slice(0, 10).replace(/-/g, '.') ?? ''

  return (
    <div className={`${styles.wrapper} ${styles.fadeIn}`}>
      <div className="container">
        <div className={styles.article}>

          {/* ── 헤더 ─────────────────────────────────── */}
          <div className={styles.header}>
            <div className={styles.meta}>
              <span className={`${styles.badge} ${tagCls}`}>{tagLabel}</span>
              <span className={styles.date}>{dateStr}</span>
            </div>
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles.divider} />
          </div>

          {/* ── 본문 ─────────────────────────────────── */}
          <div className={styles.content}>

            {/* 커버 이미지 */}
            {post.coverImage?.asset?.url && (
              <div className={styles.contentMedia}>
                <Image
                  src={post.coverImage.asset.url}
                  alt={post.title}
                  width={720}
                  height={405}
                  className={styles.coverImg}
                  priority
                />
              </div>
            )}

            {/* 요약 (excerpt) */}
            {post.excerpt && (
              <div className={styles.excerpt}>
                {post.excerpt}
              </div>
            )}

            {/* 본문 — PortableText 또는 plain text fallback */}
            {post.body && post.body.length > 0 ? (
              <div className={styles.prose}>
                <PortableText
                  value={post.body}
                  components={{
                    block: {
                      normal:     ({ children }) => <p>{children}</p>,
                      h2:         ({ children }) => <h2>{children}</h2>,
                      h3:         ({ children }) => <h3>{children}</h3>,
                      blockquote: ({ children }) => <blockquote>{children}</blockquote>,
                    },
                    list: {
                      bullet: ({ children }) => <ul>{children}</ul>,
                      number: ({ children }) => <ol>{children}</ol>,
                    },
                    listItem: {
                      bullet: ({ children }) => <li>{children}</li>,
                      number: ({ children }) => <li>{children}</li>,
                    },
                    marks: {
                      strong: ({ children }) => <strong>{children}</strong>,
                      link: ({ value, children }) => (
                        <a href={value?.href} target={value?.blank ? '_blank' : undefined} rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                    },
                    types: {
                      // NOTE: PortableTextRenderer.tsx와 동기화 유지 필수
                      // 새 block type 추가 시 두 파일 모두 업데이트할 것
                      // → components/ui/PortableTextRenderer.tsx ↔ 이 파일
                      image: ({ value }) => value?.asset?.url ? (
                        <div style={{ margin: '1.6em 0' }}>
                          <Image
                            src={value.asset.url}
                            alt={value.alt ?? value.caption ?? '이미지'}
                            width={value.asset.metadata?.dimensions?.width ?? 720}
                            height={value.asset.metadata?.dimensions?.height ?? 405}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                            unoptimized
                          />
                        </div>
                      ) : null,
                    },
                  }}
                />
              </div>
            ) : (
              <div className={styles.emptyBody}>본문이 준비 중입니다.</div>
            )}
          </div>

          {/* ── 하단 네비게이션 ───────────────────────── */}
          <div className={styles.footer}>
            <div className={styles.navControls}>

              {/* 이전 글 (더 오래된 글) */}
              {prevPost ? (
                <Link href={`/media/news/${prevPost.slug.current}`} className={styles.navBtn}>
                  <span className={styles.navDir}>← 이전 글</span>
                  <span className={styles.navHead}>{prevPost.title}</span>
                </Link>
              ) : (
                <div className={`${styles.navBtn} ${styles.navDisabled}`}>
                  <span className={styles.navDir}>← 이전 글이 없습니다</span>
                </div>
              )}

              {/* 다음 글 (더 최신 글) */}
              {nextPost ? (
                <Link href={`/media/news/${nextPost.slug.current}`} className={styles.navBtn}>
                  <span className={styles.navDir}>다음 글 →</span>
                  <span className={styles.navHead}>{nextPost.title}</span>
                </Link>
              ) : (
                <div className={`${styles.navBtn} ${styles.navDisabled}`}>
                  <span className={styles.navDir}>다음 글이 없습니다 →</span>
                </div>
              )}
            </div>

            <div className={styles.backWrap}>
              <Link href="/media/news" className={styles.btnBack}>
                ← 목록으로
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
