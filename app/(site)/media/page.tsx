// app/(site)/media/page.tsx — 미디어 갤러리 (사진 앨범 + 동영상)
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch } from '@/lib/sanity.client'
import { SITE_SETTINGS_QUERY, PHOTO_ALBUMS_QUERY, VIDEOS_QUERY } from '@/lib/queries'
import type { SiteSettings, Media } from '@/types/sanity'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: '미디어',
  description: '인제 GT 마스터즈 공식 포토 갤러리 및 하이라이트 영상. 박진감 넘치는 레이스 현장을 만나보세요.',
}

const PAGE_SIZE = 12


function getYoutubeId(url?: string) {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&"]+)/)
  return m?.[1] ?? null
}

export default async function MediaPage({
  searchParams,
}: {
  searchParams: { type?: string; round?: string; page?: string }
}) {
  const type  = searchParams.type ?? 'photo'
  const page  = Math.max(1, parseInt(searchParams.page ?? '1', 10))
  const start = (page - 1) * PAGE_SIZE
  const end   = start + PAGE_SIZE

  const [siteSettings, photos, videos] = await Promise.all([
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY }),
    sanityFetch<Media[]>({ query: PHOTO_ALBUMS_QUERY, params: { start, end }, revalidate: 300 }),
    sanityFetch<Media[]>({ query: VIDEOS_QUERY,       params: { start: 0, end: 12 }, revalidate: 300 }),
  ]).catch(() => [null, [], []] as [SiteSettings | null, Media[], Media[]])

  const displayPhotos = photos as Media[]
  const displayVideos = videos as Media[]

  const cut = 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)'

  return (
    <>
      {/* ── 히어로 ─────────────────────────────────────────── */}
      <PageHero
        image={(siteSettings as SiteSettings | null)?.heroMedia}
        badge="Media Gallery"
        title="미디어 갤러리"
        subtitle="레이스의 모든 순간을 담은 공식 포토 & 영상 아카이브"
      />

      {/* ── 탭 전환 ────────────────────────────────────────── */}
      <section style={{ borderBottom: '1px solid var(--line)', background: '#fff', position: 'sticky', top: 'var(--header-h)', zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', gap: '0' }}>
          {[
            { key: 'photo', label: '포토 갤러리', icon: 'fa-images' },
            { key: 'video', label: '동영상',      icon: 'fa-play-circle' },
          ].map(tab => (
            <Link
              key={tab.key}
              href={`/media?type=${tab.key}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '14px 22px', fontWeight: 800, fontSize: '.95rem',
                borderBottom: `3px solid ${type === tab.key ? 'var(--red)' : 'transparent'}`,
                color: type === tab.key ? 'var(--red)' : 'var(--muted)',
                textDecoration: 'none', transition: 'color .2s',
              }}
            >
              <i className={`fa-solid ${tab.icon}`} />
              {tab.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── 포토 갤러리 ──────────────────────────────────── */}
      {type !== 'video' && (
        <section className="section">
          <div className="container">
            {displayPhotos.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
                <i className="fa-solid fa-images" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block', opacity: .3 }} />
                <p>사진 앨범을 준비중입니다.</p>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '16px' }}>
              {displayPhotos.map((album) => (
                <Link key={album._id} href={`/media/${album.slug.current}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{
                    background: '#111', clipPath: cut, overflow: 'hidden',
                    position: 'relative', paddingBottom: '66%',
                    border: '1px solid var(--line)',
                  }}
                  className="media-card"
                  >
                    {/* 커버 이미지 */}
                    {album.coverImage?.asset?.url ? (
                      <Image
                        src={album.coverImage.asset.url}
                        alt={album.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width:768px) 100vw, 33vw"
                        placeholder={album.coverImage.asset.metadata?.lqip ? 'blur' : undefined}
                        blurDataURL={album.coverImage.asset.metadata?.lqip}
                      />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1a1a2e,#16213e)', display: 'grid', placeItems: 'center' }}>
                        <i className="fa-solid fa-camera" style={{ fontSize: '2.5rem', color: 'rgba(255,255,255,.2)' }} />
                      </div>
                    )}

                    {/* 오버레이 */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 40%,rgba(0,0,0,.78))' }} />
                    <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,var(--red),transparent 70%)' }} />

                    {/* 정보 */}
                    <div style={{ position: 'absolute', left: '16px', right: '16px', bottom: '14px', zIndex: 1, color: '#fff' }}>
                      <strong style={{ display: 'block', fontSize: '.95rem', marginBottom: '4px', lineHeight: 1.3 }}>{album.title}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '.78rem', opacity: .75 }}>{album.publishedAt?.slice(0, 10)}</span>
                        {album.photoCount && (
                          <span style={{ fontSize: '.78rem', fontWeight: 800, padding: '2px 8px', background: 'rgba(0,0,0,.5)', borderRadius: '3px' }}>
                            <i className="fa-solid fa-images" style={{ marginRight: '4px' }} />{album.photoCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 동영상 ──────────────────────────────────────── */}
      {type === 'video' && (
        <section className="section">
          <div className="container">
            {displayVideos.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
                <i className="fa-solid fa-play-circle" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block', opacity: .3 }} />
                <p>동영상을 준비중입니다.</p>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '20px' }}>
              {displayVideos.map((video) => {
                const ytId = getYoutubeId(video.youtubeUrl) ?? getYoutubeId(video.youtubeThumbnail)
                const thumb = ytId
                  ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
                  : video.coverImage?.asset?.url

                return (
                  <div key={video._id} style={{ background: '#fff', border: '1px solid var(--line)', clipPath: cut, overflow: 'hidden' }}>
                    {/* 썸네일 */}
                    <a
                      href={video.youtubeUrl ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'block', position: 'relative', paddingBottom: '56.25%', background: '#111', overflow: 'hidden' }}
                    >
                      {thumb ? (
                        <Image src={thumb} alt={video.title} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 50vw" />
                      ) : (
                        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: '#1a1a2e' }}>
                          <i className="fa-brands fa-youtube" style={{ fontSize: '3rem', color: '#e60023' }} />
                        </div>
                      )}
                      {/* 재생 버튼 */}
                      <div style={{
                        position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
                        background: 'rgba(0,0,0,.3)',
                        transition: 'background .2s',
                      }}>
                        <div style={{
                          width: '64px', height: '64px', background: 'rgba(230,0,35,.9)',
                          borderRadius: '50%', display: 'grid', placeItems: 'center',
                          boxShadow: '0 8px 24px rgba(230,0,35,.4)',
                        }}>
                          <i className="fa-solid fa-play" style={{ color: '#fff', fontSize: '1.4rem', marginLeft: '4px' }} />
                        </div>
                      </div>
                      {video.duration && (
                        <span style={{
                          position: 'absolute', right: '10px', bottom: '10px',
                          fontSize: '.8rem', fontWeight: 800, padding: '2px 8px',
                          background: 'rgba(0,0,0,.8)', color: '#fff', borderRadius: '3px',
                        }}>{video.duration}</span>
                      )}
                    </a>

                    {/* 정보 */}
                    <div style={{ padding: '16px' }}>
                      <strong style={{ display: 'block', fontSize: '.96rem', marginBottom: '6px', lineHeight: 1.35 }}>{video.title}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '.82rem', color: 'var(--muted)' }}>{video.publishedAt?.slice(0, 10)}</span>
                        {video.youtubeUrl && (
                          <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: '.82rem', color: 'var(--red)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <i className="fa-brands fa-youtube" />YouTube
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 유튜브 채널 링크 */}
            <div style={{ marginTop: '36px', textAlign: 'center' }}>
              <a
                href="https://youtube.com/@injegtmasters"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ display: 'inline-flex' }}
              >
                <i className="fa-brands fa-youtube" style={{ color: '#e60023' }} />
                공식 유튜브 채널 구독하기
              </a>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
