// app/(site)/media/kit/page.tsx — 미디어킷 다운로드
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch } from '@/lib/sanity.client'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: '미디어킷 | 인제 GT 마스터즈',
  description: '인제 GT 마스터즈 공식 로고, 사진, 규정 문서 등 미디어킷을 다운로드하세요.',
}

const MEDIA_KIT_QUERY = `
  *[_type == "mediaKit" && isPublic == true] | order(order asc) {
    _id, title, description, category,
    file { asset->{ url } },
    thumbnail { asset->{ url } },
    publishedAt
  }
`

interface MediaKitItem {
  _id: string
  title: string
  description?: string
  category?: string
  file?: { asset?: { url: string } }
  thumbnail?: { asset?: { url: string } }
  publishedAt?: string
}

const CATEGORIES = [
  { key: '',           label: '전체'   },
  { key: 'logo',       label: '로고'   },
  { key: 'photo',      label: '사진'   },
  { key: 'regulation', label: '규정문서' },
  { key: 'press',      label: '보도자료' },
  { key: 'etc',        label: '기타'   },
]

const CATEGORY_LABELS: Record<string, string> = {
  logo: '로고', photo: '사진', regulation: '규정문서', press: '보도자료', etc: '기타',
}

export default async function MediaKitPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category: categoryParam } = await searchParams
  const category = categoryParam ?? ''

  const items = await sanityFetch<MediaKitItem[]>({
    query: MEDIA_KIT_QUERY,
    revalidate: 3600,
  }).catch(() => [] as MediaKitItem[])

  const filtered = category
    ? items.filter(item => item.category === category)
    : items

  const cut = 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)'

  const buildHref = (cat: string) => cat ? `/media/kit?category=${cat}` : '/media/kit'

  return (
    <>
      <PageHero
        badge="Media Kit"
        title="미디어킷"
        subtitle="공식 로고 · 사진 · 문서를 다운로드하세요."
      />

      {/* 카테고리 탭 */}
      <section style={{ borderBottom: '1px solid var(--line)', background: 'var(--bg)', position: 'sticky', top: 'var(--header-h)', zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', gap: '8px', padding: '12px 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <Link
              key={cat.key}
              href={buildHref(cat.key)}
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

      {/* 목록 */}
      <section className="section">
        <div className="container">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)' }}>
              <i className="fa-solid fa-folder-open" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block', opacity: .3 }} />
              <p>등록된 미디어킷 자료가 없습니다.</p>
              <p style={{ fontSize: '.88rem', marginTop: '8px' }}>준비 중입니다. 문의: 운영팀 이메일</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '16px' }}>
              {filtered.map(item => (
                <div key={item._id} style={{
                  background: 'var(--bg-2)', border: '1px solid var(--line)',
                  clipPath: cut, display: 'flex', flexDirection: 'column', position: 'relative',
                }}>
                  {/* 썸네일 */}
                  <div style={{ position: 'relative', aspectRatio: '16/9', background: 'var(--bg-4)', overflow: 'hidden' }}>
                    {item.thumbnail?.asset?.url ? (
                      <Image
                        src={item.thumbnail.asset.url}
                        alt={item.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 260px"
                      />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--muted)', opacity: .4 }}>
                        <i className="fa-solid fa-file-arrow-down" style={{ fontSize: '2rem' }} />
                      </div>
                    )}
                  </div>

                  {/* 정보 */}
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {item.category && (
                      <span style={{
                        display: 'inline-block', marginBottom: '8px',
                        padding: '3px 10px', fontSize: '.75rem', fontWeight: 900,
                        background: 'rgba(230,0,35,.08)', color: 'var(--red)',
                        border: '1px solid rgba(230,0,35,.2)',
                        clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)',
                      }}>
                        {CATEGORY_LABELS[item.category] ?? item.category}
                      </span>
                    )}
                    <strong style={{ fontSize: '.95rem', marginBottom: '6px', display: 'block' }}>{item.title}</strong>
                    {item.description && (
                      <p style={{ fontSize: '.85rem', color: 'var(--muted)', lineHeight: 1.6, flex: 1 }}>{item.description}</p>
                    )}
                    {item.publishedAt && (
                      <span style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: '8px', display: 'block' }}>
                        {item.publishedAt}
                      </span>
                    )}
                  </div>

                  {/* 다운로드 버튼 */}
                  <div style={{ padding: '0 16px 16px' }}>
                    {item.file?.asset?.url ? (
                      <a
                        href={item.file.asset.url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                          padding: '10px 16px', width: '100%',
                          background: 'var(--red)', color: '#fff',
                          fontWeight: 800, fontSize: '.85rem', letterSpacing: '.04em',
                          textDecoration: 'none',
                          clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)',
                          transition: 'opacity .2s',
                        }}
                      >
                        <i className="fa-solid fa-download" />
                        다운로드
                      </a>
                    ) : (
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '10px 16px',
                        background: 'var(--bg-4)', color: 'var(--muted)',
                        fontSize: '.85rem',
                        clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)',
                      }}>
                        준비 중
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
