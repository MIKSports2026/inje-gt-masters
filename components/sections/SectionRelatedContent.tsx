/**
 * SectionRelatedContent
 * 라운드 상세 페이지 하단에 해당 라운드와 관련된 공지·미디어를 노출.
 * posts, media 모두 비어있으면 null 반환 (섹션 자체 숨김).
 */
import Link  from 'next/link'
import Image from 'next/image'
import SectionHeader from '@/components/ui/SectionHeader'
import type { RelatedPost, RelatedMediaItem } from '@/types/sanity'

// ── 카테고리 라벨 ──────────────────────────────────────────────
const CATEGORY_LABEL: Record<string, string> = {
  notice:     '공지사항',
  news:       '대회소식',
  press:      '보도자료',
  entry:      '참가안내',
  regulation: '규정',
  event:      '이벤트',
}
const getCategoryLabel = (c?: string): string =>
  (c && CATEGORY_LABEL[c]) || '소식'

// ── 날짜 포맷 (YYYY.MM.DD) ────────────────────────────────────
const formatDate = (iso?: string): string => {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

// ── 미디어 링크 판단 ──────────────────────────────────────────
function getMediaHref(item: RelatedMediaItem): { href: string; external: boolean } {
  if (item.mediaType === 'photoAlbum') {
    return { href: `/media/${item.slug.current}`, external: false }
  }
  if (item.mediaType === 'video' && item.youtubeUrl) {
    return { href: item.youtubeUrl, external: true }
  }
  // video(youtubeUrl 없음) 또는 uploadedVideo → 목록 페이지로
  return { href: '/media/video', external: false }
}

// ── 공통 스타일 상수 ──────────────────────────────────────────
const cut = 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)'

const RED_LINE = {
  position: 'absolute' as const,
  left: 0, top: 0, right: 0, height: '2px',
  background: 'linear-gradient(90deg,var(--primary-red,#e60023),transparent 70%)',
}

// ── Props ─────────────────────────────────────────────────────
interface Props {
  roundLabel: string
  posts:      RelatedPost[]
  media:      RelatedMediaItem[]
}

export default function SectionRelatedContent({ roundLabel, posts, media }: Props) {
  // 방어: 필수 필드(_id, slug) 누락 항목 제거
  const validPosts = posts.filter(p => p?._id && p?.slug?.current)
  const validMedia = media.filter(m => m?._id && m?.slug?.current)

  // 둘 다 비어있으면 섹션 자체 숨김
  if (validPosts.length === 0 && validMedia.length === 0) return null

  return (
    <section className="section" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="container">

        <SectionHeader subtitle={`#${roundLabel}`} title="더 많은 소식" />

        {/* ══ 공지 블록 ════════════════════════════════════════ */}
        {validPosts.length > 0 && (
          <div style={{ marginBottom: validMedia.length > 0 ? '48px' : '0' }}>

            {/* 블록 헤더 */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: '20px',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary,#fff)', margin: 0 }}>
                <i className="fa-solid fa-newspaper"
                  style={{ color: 'var(--primary-red,#e60023)', marginRight: '8px' }} />
                관련 공지 / 소식
              </h3>
              <Link href="/news" style={{
                fontSize: '.84rem', fontWeight: 700,
                color: 'var(--primary-red,#e60023)', textDecoration: 'none',
              }}>
                공지 전체 보기 →
              </Link>
            </div>

            {/* 3열 반응형 그리드 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
              gap: '16px',
            }}>
              {validPosts.map(post => {
                const thumb    = post.coverImage?.asset?.url ?? null
                const catLabel = getCategoryLabel(post.category)
                const dateStr  = formatDate(post.publishedAt)

                return (
                  <Link
                    key={post._id}
                    href={`/news/${post.slug.current}`}
                    className="src-card"
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  >
                    <div style={{
                      background: 'var(--bg-2,#111)',
                      border: '1px solid var(--line,rgba(255,255,255,.1))',
                      clipPath: cut, overflow: 'hidden', height: '100%',
                    }}>
                      {/* 썸네일 */}
                      <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#0d0d0d' }}>
                        {thumb ? (
                          <Image
                            src={thumb}
                            alt={post.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
                            loading="lazy"
                          />
                        ) : (
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(135deg,#1a1a1a,#111)',
                            display: 'grid', placeItems: 'center',
                          }}>
                            <i className="fa-solid fa-newspaper"
                              style={{ fontSize: '2rem', color: 'rgba(255,255,255,.15)' }} />
                          </div>
                        )}
                        <div style={RED_LINE} />
                        {/* 카테고리 뱃지 */}
                        <span style={{
                          position: 'absolute', left: '10px', bottom: '10px',
                          fontSize: '.72rem', fontWeight: 900, padding: '2px 8px',
                          background: 'rgba(230,0,35,.85)', color: '#fff',
                          clipPath: 'polygon(0 0,calc(100% - 5px) 0,100% 5px,100% 100%,0 100%)',
                        }}>{catLabel}</span>
                      </div>

                      {/* 텍스트 */}
                      <div style={{ padding: '14px 16px' }}>
                        <strong className="src-clamp2" style={{
                          display: 'block', fontSize: '.95rem', lineHeight: 1.4,
                          color: 'var(--text-primary,#fff)', marginBottom: '6px',
                        }}>{post.title}</strong>
                        {post.excerpt && (
                          <p className="src-clamp2" style={{
                            fontSize: '.83rem', color: 'var(--text-secondary,#aaa)',
                            lineHeight: 1.55, margin: '0 0 8px',
                          }}>{post.excerpt}</p>
                        )}
                        {dateStr && (
                          <span style={{ fontSize: '.78rem', color: 'var(--text-secondary,#aaa)' }}>
                            {dateStr}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* ══ 미디어 블록 ══════════════════════════════════════ */}
        {validMedia.length > 0 && (
          <div>

            {/* 블록 헤더 */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: '20px',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary,#fff)', margin: 0 }}>
                <i className="fa-solid fa-photo-film"
                  style={{ color: 'var(--primary-red,#e60023)', marginRight: '8px' }} />
                관련 미디어
              </h3>
              <Link href="/media" style={{
                fontSize: '.84rem', fontWeight: 700,
                color: 'var(--primary-red,#e60023)', textDecoration: 'none',
              }}>
                미디어 전체 보기 →
              </Link>
            </div>

            {/* 3열 반응형 그리드 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
              gap: '16px',
            }}>
              {validMedia.map(item => {
                const thumb            = item.youtubeThumbnail ?? item.coverImage?.asset?.url ?? null
                const { href, external } = getMediaHref(item)
                const isVideo          = item.mediaType === 'video' || item.mediaType === 'uploadedVideo'
                const dateStr          = formatDate(item.publishedAt)

                const inner = (
                  <div style={{
                    background: 'var(--bg-2,#111)',
                    border: '1px solid var(--line,rgba(255,255,255,.1))',
                    clipPath: cut, overflow: 'hidden',
                  }}>
                    {/* 썸네일 */}
                    <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#0d0d0d' }}>
                      {thumb ? (
                        <Image
                          src={thumb}
                          alt={item.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
                          loading="lazy"
                        />
                      ) : (
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(135deg,#1a1a1a,#111)',
                          display: 'grid', placeItems: 'center',
                        }}>
                          <i
                            className={`fa-solid ${item.mediaType === 'photoAlbum' ? 'fa-camera' : 'fa-play'}`}
                            style={{ fontSize: '2rem', color: 'rgba(255,255,255,.15)' }}
                          />
                        </div>
                      )}
                      <div style={RED_LINE} />

                      {/* 비디오 플레이 오버레이 */}
                      {isVideo && (
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'rgba(0,0,0,.25)',
                          display: 'grid', placeItems: 'center',
                        }}>
                          <div style={{
                            width: '48px', height: '48px',
                            background: 'rgba(230,0,35,.85)',
                            borderRadius: '50%',
                            display: 'grid', placeItems: 'center',
                          }}>
                            <i className="fa-solid fa-play"
                              style={{ color: '#fff', fontSize: '1rem', marginLeft: '3px' }} />
                          </div>
                        </div>
                      )}

                      {/* duration 뱃지 */}
                      {item.duration && (
                        <span style={{
                          position: 'absolute', right: '10px', bottom: '10px',
                          fontSize: '.75rem', fontWeight: 800, padding: '2px 7px',
                          background: 'rgba(0,0,0,.8)', color: '#fff', borderRadius: '3px',
                        }}>{item.duration}</span>
                      )}

                      {/* 외부링크(YouTube) 뱃지 */}
                      {external && (
                        <span style={{
                          position: 'absolute', right: '10px', top: '10px',
                          fontSize: '.7rem', fontWeight: 800, padding: '2px 7px',
                          background: 'rgba(230,0,35,.85)', color: '#fff', borderRadius: '3px',
                          display: 'flex', alignItems: 'center', gap: '4px',
                        }}>
                          <i className="fa-brands fa-youtube" style={{ fontSize: '.8rem' }} />
                          YouTube
                        </span>
                      )}
                    </div>

                    {/* 텍스트 */}
                    <div style={{ padding: '14px 16px' }}>
                      <strong className="src-clamp2" style={{
                        display: 'block', fontSize: '.95rem', lineHeight: 1.4,
                        color: 'var(--text-primary,#fff)', marginBottom: '6px',
                      }}>{item.title}</strong>
                      {dateStr && (
                        <span style={{ fontSize: '.78rem', color: 'var(--text-secondary,#aaa)' }}>
                          {dateStr}
                        </span>
                      )}
                    </div>
                  </div>
                )

                return external ? (
                  <a
                    key={item._id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.title} (새 탭에서 열림)`}
                    className="src-card"
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  >
                    {inner}
                  </a>
                ) : (
                  <Link
                    key={item._id}
                    href={href}
                    className="src-card"
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  >
                    {inner}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* 카드 hover + 2줄 말줄임 */}
        <style>{`
          .src-card { transition: opacity .2s, transform .2s; }
          .src-card:hover { opacity: .88; transform: translateY(-2px); }
          .src-clamp2 {
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        `}</style>

      </div>
    </section>
  )
}
