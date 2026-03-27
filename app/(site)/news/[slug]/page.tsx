// app/(site)/news/[slug]/page.tsx — 소식 상세
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { sanityFetch } from '@/lib/sanity.client'
import { POST_DETAIL_QUERY } from '@/lib/queries'
import type { Post, PostCategory } from '@/types/sanity'
import { PortableText } from '@portabletext/react'

const CAT_LABELS: Record<PostCategory, string> = {
  notice: '공지사항', news: '대회소식', press: '보도자료',
  entry: '참가안내', regulation: '기술규정', event: '이벤트',
}
const CAT_COLORS: Record<PostCategory, string> = {
  notice: '#2563eb', news: '#e60023', press: '#7c3aed',
  entry: '#16a34a', regulation: '#b8921e', event: '#f97316',
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await sanityFetch<Post>({ query: POST_DETAIL_QUERY, params: { slug: params.slug }, revalidate: 300 }).catch(() => null)
  if (!post) return { title: '소식' }
  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    openGraph: { title: post.title, description: post.excerpt },
  }
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const post = await sanityFetch<Post>({ query: POST_DETAIL_QUERY, params: { slug: params.slug }, revalidate: 300 }).catch(() => null)

  // Sanity 미연결 시 fallback
  const display: Post = post ?? {
    _id: 'preview',
    category: 'news',
    isPinned: false,
    title: '2026 시즌 개막전 R1 참가 신청 접수 시작',
    slug: { current: params.slug },
    publishedAt: '2026-03-20',
    author: '인제 GT 마스터즈 운영팀',
    excerpt: 'GT1·GT2·슈퍼카 클래스 선착순 접수가 시작되었습니다.',
    body: [],
  }

  const catColor = CAT_COLORS[display.category] ?? '#e60023'
  const catLabel = CAT_LABELS[display.category] ?? display.category
  const cut = 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)'

  return (
    <>
      {/* 히어로 */}
      <section style={{ background: 'linear-gradient(135deg,#111,#1a0008 55%,#0d0d0d)', padding: '52px 0 44px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg,rgba(230,0,35,.04) 0 1px,transparent 1px 60px)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* 브레드크럼 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '.84rem', color: 'rgba(255,255,255,.5)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>홈</Link>
            <span>/</span>
            <Link href="/news" style={{ color: 'inherit', textDecoration: 'none' }}>소식</Link>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,.8)' }}>상세</span>
          </div>
          <span style={{ display: 'inline-block', marginBottom: '14px', padding: '4px 12px', fontSize: '.8rem', fontWeight: 900, background: `${catColor}22`, color: catColor, border: `1px solid ${catColor}44`, clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)' }}>{catLabel}</span>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem,3.5vw,2.8rem)', lineHeight: 1.15, maxWidth: '860px' }}>{display.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '14px', color: 'rgba(255,255,255,.55)', fontSize: '.88rem', flexWrap: 'wrap' }}>
            {display.author && <span><i className="fa-solid fa-user" style={{ marginRight: '6px' }} />{display.author}</span>}
            <span><i className="fa-solid fa-calendar" style={{ marginRight: '6px' }} />{display.publishedAt?.slice(0, 10)}</span>
            {display.isPinned && <span style={{ color: 'var(--red)', fontWeight: 800 }}><i className="fa-solid fa-thumbtack" style={{ marginRight: '4px' }} />고정글</span>}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '860px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '32px', alignItems: 'start' }}>

            {/* 본문 */}
            <div>
              {/* 커버 이미지 */}
              {display.coverImage?.asset?.url && (
                <div style={{ position: 'relative', paddingBottom: '52%', overflow: 'hidden', marginBottom: '28px', clipPath: cut }}>
                  <Image src={display.coverImage.asset.url} alt={display.title} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 600px" />
                </div>
              )}

              {/* 요약 */}
              {display.excerpt && (
                <div style={{ padding: '16px 20px', background: 'rgba(230,0,35,.04)', border: '1px solid rgba(230,0,35,.14)', borderLeft: '3px solid var(--red)', marginBottom: '24px', fontSize: '1.02rem', color: '#3a434d', lineHeight: 1.7 }}>
                  {display.excerpt}
                </div>
              )}

              {/* Portable Text 본문 */}
              {display.body && display.body.length > 0 ? (
                <div className="prose" style={{ fontSize: '1rem', lineHeight: 1.8, color: '#2a353f' }}>
                  <PortableText
                    value={display.body}
                    components={{
                      block: {
                        normal: ({ children }) => <p style={{ marginBottom: '1.2em' }}>{children}</p>,
                        h2: ({ children }) => <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '2em 0 .6em', borderBottom: '2px solid var(--line)', paddingBottom: '.4em' }}>{children}</h2>,
                        h3: ({ children }) => <h3 style={{ fontSize: '1.15rem', fontWeight: 850, margin: '1.6em 0 .5em' }}>{children}</h3>,
                        blockquote: ({ children }) => <blockquote style={{ borderLeft: '3px solid var(--red)', paddingLeft: '16px', margin: '1.5em 0', color: 'var(--muted)', fontStyle: 'italic' }}>{children}</blockquote>,
                      },
                      list: {
                        bullet: ({ children }) => <ul style={{ paddingLeft: '1.2em', marginBottom: '1.2em' }}>{children}</ul>,
                        number: ({ children }) => <ol style={{ paddingLeft: '1.2em', marginBottom: '1.2em' }}>{children}</ol>,
                      },
                      listItem: {
                        bullet: ({ children }) => <li style={{ marginBottom: '.4em', lineHeight: 1.7 }}>{children}</li>,
                        number: ({ children }) => <li style={{ marginBottom: '.4em', lineHeight: 1.7 }}>{children}</li>,
                      },
                      marks: {
                        strong: ({ children }) => <strong style={{ fontWeight: 900 }}>{children}</strong>,
                        link: ({ value, children }) => (
                          <a href={value?.href} target={value?.blank ? '_blank' : undefined} rel="noopener noreferrer" style={{ color: 'var(--red)', fontWeight: 700, textDecoration: 'underline' }}>{children}</a>
                        ),
                      },
                      types: {
                        image: ({ value }) => value?.asset?.url ? (
                          <div style={{ margin: '1.6em 0', position: 'relative', paddingBottom: '56%', overflow: 'hidden', clipPath: cut }}>
                            <Image src={value.asset.url} alt={value.alt ?? ''} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 600px" />
                          </div>
                        ) : null,
                      },
                    }}
                  />
                </div>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)', background: 'var(--surface-2)', borderRadius: '8px' }}>
                  <i className="fa-solid fa-file-lines" style={{ fontSize: '2rem', opacity: .3, display: 'block', marginBottom: '10px' }} />
                  <p>본문이 준비 중입니다.</p>
                </div>
              )}

              {/* 연관 라운드 */}
              {display.relatedRound && (
                <div style={{ marginTop: '28px', padding: '16px 20px', background: '#fff', border: '1px solid var(--line)', clipPath: cut, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,var(--red),transparent 70%)' }} />
                  <span style={{ fontSize: '.8rem', color: 'var(--muted)', fontWeight: 700 }}>연관 라운드</span>
                  <Link href={`/season/${display.relatedRound.slug.current}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontWeight: 800, color: 'var(--red)', fontSize: '.95rem' }}>
                    <i className="fa-solid fa-flag-checkered" />
                    R{display.relatedRound.roundNumber} — {display.relatedRound.title}
                  </Link>
                </div>
              )}

              {/* 목록으로 */}
              <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/news" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--muted)', fontWeight: 700, fontSize: '.9rem', textDecoration: 'none' }}>
                  <i className="fa-solid fa-arrow-left" />목록으로
                </Link>
                <Link href="/entry" className="btn btn-primary" style={{ fontSize: '.9rem', minHeight: '44px' }}>
                  <i className="fa-solid fa-flag-checkered" />참가 신청
                </Link>
              </div>
            </div>

            {/* 사이드바 */}
            <div style={{ display: 'grid', gap: '16px' }}>
              {/* 글 정보 */}
              <div style={{ background: '#fff', border: '1px solid var(--line)', clipPath: cut, padding: '18px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,var(--red),rgba(230,0,35,.35) 35%,transparent 75%)' }} />
                <h3 style={{ fontSize: '.9rem', marginBottom: '12px' }}>게시물 정보</h3>
                <div style={{ display: 'grid', gap: '8px', fontSize: '.85rem' }}>
                  {[
                    { label: '분류', value: catLabel },
                    { label: '작성일', value: display.publishedAt?.slice(0, 10) ?? '—' },
                    { label: '작성자', value: display.author ?? '운영팀' },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--muted)' }}>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* 참가신청 CTA */}
              <div style={{ background: 'linear-gradient(135deg,rgba(230,0,35,.08),rgba(230,0,35,.02))', border: '1px solid rgba(230,0,35,.2)', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
                <i className="fa-solid fa-flag-checkered" style={{ fontSize: '1.8rem', color: 'var(--red)', marginBottom: '10px', display: 'block' }} />
                <strong style={{ display: 'block', marginBottom: '6px' }}>2026 참가 신청</strong>
                <p style={{ fontSize: '.84rem', color: 'var(--muted)', marginBottom: '14px', lineHeight: 1.5 }}>선착순 마감.<br />지금 바로 신청하세요.</p>
                <Link href="/entry" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '.88rem', minHeight: '44px' }}>신청하기</Link>
              </div>

              {/* 카테고리별 이동 */}
              <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '8px', padding: '16px' }}>
                <h3 style={{ fontSize: '.88rem', marginBottom: '10px', color: 'var(--muted)' }}>다른 소식 보기</h3>
                <div style={{ display: 'grid', gap: '6px' }}>
                  {(['notice','news','entry','regulation'] as PostCategory[]).map(cat => (
                    <Link key={cat} href={`/news?category=${cat}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'var(--surface-2)', borderRadius: '4px', fontSize: '.85rem', fontWeight: 700, textDecoration: 'none', color: '#3a434d' }}>
                      <span style={{ width: '8px', height: '8px', background: CAT_COLORS[cat], transform: 'skewX(-20deg)', flexShrink: 0 }} />
                      {CAT_LABELS[cat]}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
