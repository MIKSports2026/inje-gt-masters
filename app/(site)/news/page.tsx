// app/(site)/news/page.tsx — 소식 / 공지사항 목록
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch } from '@/lib/sanity.client'
import { POSTS_QUERY, POSTS_COUNT_QUERY } from '@/lib/queries'
import type { Post, PostCategory } from '@/types/sanity'

export const metadata: Metadata = {
  title: '소식 & 공지',
  description: '인제 GT 마스터즈 공지사항, 대회 소식, 보도자료, 이벤트 등 최신 정보를 확인하세요.',
}

const PAGE_SIZE = 12

const CATEGORIES: { key: PostCategory | ''; label: string }[] = [
  { key: '',            label: '전체' },
  { key: 'notice',     label: '공지사항' },
  { key: 'news',       label: '대회소식' },
  { key: 'press',      label: '보도자료' },
  { key: 'entry',      label: '참가안내' },
  { key: 'regulation', label: '기술규정' },
  { key: 'event',      label: '이벤트' },
]

const CATEGORY_COLORS: Record<string, string> = {
  notice: '#2563eb', news: '#e60023', press: '#7c3aed',
  entry: '#16a34a', regulation: '#b8921e', event: '#f97316',
}


export default async function NewsPage({
  searchParams,
}: {
  searchParams: { category?: string; page?: string }
}) {
  const category = (searchParams.category ?? '') as PostCategory | ''
  const page     = Math.max(1, parseInt(searchParams.page ?? '1', 10))
  const start    = (page - 1) * PAGE_SIZE
  const end      = start + PAGE_SIZE

  const [posts, totalCount] = await Promise.all([
    sanityFetch<Post[]>({
      query:     POSTS_QUERY,
      params:    { category, start, end },
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
  const totalPages   = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const cut = 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)'

  const buildHref = (params: Record<string, string>) => {
    const p = new URLSearchParams({ ...(category ? { category } : {}), ...(page > 1 ? { page: String(page) } : {}), ...params })
    const s = p.toString()
    return s ? `/news?${s}` : '/news'
  }

  return (
    <>
      {/* ── 히어로 ──────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg,#111,#1a0008 55%,#0d0d0d)',
        padding: '56px 0 48px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg,rgba(230,0,35,.04) 0 1px,transparent 1px 60px)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="pill">News & Notice</span>
          <h1 style={{ color: '#fff', marginTop: '10px', fontSize: 'clamp(2rem,5vw,4.2rem)' }}>소식 & 공지</h1>
          <p style={{ color: 'rgba(255,255,255,.65)', marginTop: '10px', fontSize: 'clamp(.9rem,1.4vw,1.06rem)' }}>
            인제 GT 마스터즈의 최신 소식과 공지사항을 확인하세요.
          </p>
        </div>
      </section>

      {/* ── 카테고리 필터 ──────────────────────────────────── */}
      <section style={{ borderBottom: '1px solid var(--line)', background: 'var(--bg)', position: 'sticky', top: 'var(--header-h)', zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', gap: '8px', padding: '12px 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <Link
              key={cat.key}
              href={buildHref(cat.key ? { category: cat.key, page: '1' } : { page: '1' })}
              style={{
                padding: '7px 16px', fontSize: '.85rem', fontWeight: 800, whiteSpace: 'nowrap',
                background: category === cat.key ? 'var(--red)' : 'var(--bg-2)',
                color:      category === cat.key ? '#fff' : 'var(--text-mid)',
                border:     `1px solid ${category === cat.key ? 'var(--red)' : 'var(--line)'}`,
                clipPath:   'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)',
                textDecoration: 'none', display: 'inline-block',
              }}
            >{cat.label}</Link>
          ))}
        </div>
      </section>

      {/* ── 목록 ───────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          {displayPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
              <i className="fa-solid fa-newspaper" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block', opacity: .3 }} />
              <p>게시물이 없습니다.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0' }}>
              {/* 핀 고정 게시물 */}
              {displayPosts.filter(p => p.isPinned).map(post => (
                <PostRow key={post._id} post={post} cut={cut} pinned />
              ))}
              {/* 일반 게시물 */}
              {displayPosts.filter(p => !p.isPinned).map(post => (
                <PostRow key={post._id} post={post} cut={cut} />
              ))}
            </div>
          )}

          {/* ── 페이지네이션 ── */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '36px' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <Link
                  key={p}
                  href={buildHref({ page: String(p) })}
                  style={{
                    width: '40px', height: '40px', display: 'grid', placeItems: 'center',
                    fontWeight: 800, fontSize: '.9rem',
                    background: p === page ? 'var(--red)' : 'var(--bg-2)',
                    color:      p === page ? '#fff' : 'var(--text-mid)',
                    border:     `1px solid ${p === page ? 'var(--red)' : 'var(--line)'}`,
                    clipPath:   'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)',
                    textDecoration: 'none',
                  }}
                >{p}</Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function PostRow({ post, cut, pinned = false }: { post: Post; cut: string; pinned?: boolean }) {
  const catColor = CATEGORY_COLORS[post.category] ?? 'var(--muted)'
  const catLabel = CATEGORIES.find(c => c.key === post.category)?.label ?? post.category

  return (
    <Link href={`/news/${post.slug.current}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="post-row" style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gap: '16px',
        alignItems: 'center',
        padding: '18px 0',
        borderBottom: '1px solid var(--line)',
        background: pinned ? 'rgba(230,0,35,.02)' : 'transparent',
      }}>
        {/* 카테고리 배지 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '72px' }}>
          <span style={{
            padding: '3px 10px', fontSize: '.75rem', fontWeight: 900,
            background: `${catColor}14`, color: catColor,
            border: `1px solid ${catColor}38`,
            clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)',
            whiteSpace: 'nowrap',
          }}>{catLabel}</span>
          {pinned && (
            <span style={{ fontSize: '.7rem', fontWeight: 900, color: 'var(--red)' }}>
              <i className="fa-solid fa-thumbtack" style={{ marginRight: '3px' }} />핀고정
            </span>
          )}
        </div>

        {/* 제목 + 요약 */}
        <div style={{ minWidth: 0 }}>
          <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {post.title}
          </strong>
          {post.excerpt && (
            <span style={{ fontSize: '.88rem', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
              {post.excerpt}
            </span>
          )}
        </div>

        {/* 날짜 */}
        <span style={{ fontSize: '.82rem', color: 'var(--muted)', whiteSpace: 'nowrap', fontWeight: 700 }}>
          {post.publishedAt?.slice(0, 10)}
        </span>
      </div>
    </Link>
  )
}
