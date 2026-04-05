// app/(site)/media/kit/page.tsx — PRESS KIT
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity.client'
import { SITE_SETTINGS_QUERY } from '@/lib/queries'
import type { SiteSettings } from '@/types/sanity'
import PageHero from '@/components/ui/PageHero'
import styles from './MediaKitPage.module.css'

export const metadata: Metadata = {
  title: 'PRESS KIT | 인제 GT 마스터즈',
  description: '인제 GT 마스터즈 공식 로고, 사진, 규정 문서 등 미디어킷을 다운로드하세요.',
}

const MEDIA_KIT_QUERY = /* groq */`
  *[_type == "mediaKit" && isPublic == true] | order(order asc, publishedAt desc) {
    _id, title, description, category,
    file { asset->{ url } },
    thumbnail { asset->{ url } },
    publishedAt
  }
`

interface MediaKitItem {
  _id:          string
  title:        string
  description?: string
  category?:    string
  file?:        { asset?: { url: string } }
  thumbnail?:   { asset?: { url: string } }
  publishedAt?: string
}

const CATEGORY_LABELS: Record<string, string> = {
  logo: '로고', photo: '사진', regulation: '규정문서', press: '보도자료', etc: '기타',
}

const CLASSES = [
  { code: 'Masters 1', color: '#e60023' },
  { code: 'Masters 2', color: '#e60023' },
  { code: 'Masters N', color: '#e60023' },
  { code: 'Masters 3', color: '#e60023' },
]

export default async function MediaKitPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category: categoryParam } = await searchParams
  const category = categoryParam ?? ''

  const [settings, items] = await Promise.all([
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, revalidate: 3600 }),
    sanityFetch<MediaKitItem[]>({ query: MEDIA_KIT_QUERY, revalidate: 3600 }),
  ]).catch(() => [null, []] as [SiteSettings | null, MediaKitItem[]])

  const filtered = category
    ? (items as MediaKitItem[]).filter(i => i.category === category)
    : (items as MediaKitItem[])

  const season      = (settings as SiteSettings | null)?.currentSeason ?? 2026
  const siteName    = (settings as SiteSettings | null)?.siteNameEn ?? 'INJE GT MASTERS'
  const email       = (settings as SiteSettings | null)?.email ?? 'media@injegtmasters.com'

  const CATEGORIES = [
    { key: '',           label: '전체'   },
    { key: 'logo',       label: '로고'   },
    { key: 'photo',      label: '사진'   },
    { key: 'regulation', label: '규정문서' },
    { key: 'press',      label: '보도자료' },
    { key: 'etc',        label: '기타'   },
  ]

  const cut = 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)'

  return (
    <>
      {/* ── 1. PageHero ─────────────────────────────────── */}
      <PageHero
        badge="Media"
        title="PRESS KIT"
        subtitle="공식 로고 · 사진 · 문서를 다운로드하세요."
        breadcrumb={[
          { label: '홈', href: '/' },
          { label: 'MEDIA', href: '/media/news' },
          { label: 'PRESS KIT' },
        ]}
      />

      <section className="section" style={{ background: 'var(--bg-carbon)', paddingBottom: 0 }}>
        <div className="container">

          {/* ── 2. 대회 개요 카드 ───────────────────────── */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>ABOUT THE EVENT</h2>
            <div className={styles.sectionBar} />
          </div>

          <div className={styles.overviewGrid}>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>대회명</span>
              <span className={styles.overviewValue}>{siteName}</span>
            </div>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>시즌</span>
              <span className={styles.overviewValue}>{season} SEASON</span>
            </div>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>개최지</span>
              <span className={styles.overviewValue}>인제스피디움<br /><span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 400 }}>강원도 인제군</span></span>
            </div>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>클래스</span>
              <span className={styles.overviewValue} style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                Masters 1 · 2 · N · N-EVO · 3
              </span>
            </div>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>서킷 길이</span>
              <span className={styles.overviewValue}>4.627 km</span>
            </div>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>공식 홈페이지</span>
              <span className={styles.overviewValue} style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 400, wordBreak: 'break-all' }}>
                injegtmasters.com
              </span>
            </div>
          </div>

          {/* ── 3. 미디어킷 파일 목록 ────────────────────── */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>DOWNLOADS</h2>
            <div className={styles.sectionBar} />
          </div>

          {/* 카테고리 필터 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '4px' }}>
            {CATEGORIES.map(cat => {
              const href     = cat.key ? `/media/kit?category=${cat.key}` : '/media/kit'
              const isActive = category === cat.key
              return (
                <Link
                  key={cat.key}
                  href={href}
                  style={{
                    padding: '7px 16px',
                    fontSize: '.85rem', fontWeight: 800, whiteSpace: 'nowrap',
                    background: isActive ? 'var(--red)' : 'var(--bg-2)',
                    color:      isActive ? '#fff' : 'var(--text-mid)',
                    border:     `1px solid ${isActive ? 'var(--red)' : 'var(--line)'}`,
                    clipPath:   cut,
                    textDecoration: 'none', display: 'inline-block',
                    transition: 'all .2s',
                  }}
                >
                  {cat.label}
                </Link>
              )
            })}
          </div>

          {/* 파일 카드 그리드 */}
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <i className={`fa-solid fa-folder-open ${styles.emptyIcon}`} />
              <p className={styles.emptyText}>등록된 미디어킷 자료가 없습니다.</p>
              <p className={styles.emptyNote}>준비 중입니다. 취재 문의는 아래 이메일로 연락해 주세요.</p>
            </div>
          ) : (
            <div className={styles.kitGrid}>
              {filtered.map(item => (
                <div key={item._id} className={styles.kitCard}>

                  {/* 썸네일 */}
                  <div className={styles.thumbnail}>
                    {item.thumbnail?.asset?.url ? (
                      <Image
                        src={item.thumbnail.asset.url}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className={styles.thumbnailFallback}>
                        <i className="fa-solid fa-file-arrow-down" />
                      </div>
                    )}
                  </div>

                  {/* 카드 본문 */}
                  <div className={styles.cardBody}>
                    {item.category && (
                      <span className={styles.catBadge}>
                        {CATEGORY_LABELS[item.category] ?? item.category}
                      </span>
                    )}
                    <strong className={styles.cardTitle}>{item.title}</strong>
                    {item.description && (
                      <p className={styles.cardDesc}>{item.description}</p>
                    )}
                    {item.publishedAt && (
                      <span className={styles.cardDate}>{item.publishedAt}</span>
                    )}
                  </div>

                  {/* 다운로드 버튼 */}
                  <div className={styles.cardFooter}>
                    {item.file?.asset?.url ? (
                      <a
                        href={item.file.asset.url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.btnDownload}
                      >
                        <i className="fa-solid fa-download" />
                        다운로드
                      </a>
                    ) : (
                      <div className={styles.btnUnavailable}>
                        <i className="fa-solid fa-clock" />
                        준비 중
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* ── 4. 취재 문의 ────────────────────────────── */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>MEDIA INQUIRY</h2>
            <div className={styles.sectionBar} />
          </div>

          <div className={styles.contactSection}>
            <div className={styles.contactText}>
              <h3>취재 문의</h3>
              <p>
                공식 미디어 패스 신청, 보도자료 수령, 취재 허가 등<br />
                미디어 관련 모든 문의는 아래 이메일로 연락 바랍니다.
              </p>
            </div>
            <a href={`mailto:${email}`} className={styles.contactEmail}>
              <i className="fa-solid fa-envelope" />
              {email}
            </a>
          </div>

        </div>
      </section>
    </>
  )
}
