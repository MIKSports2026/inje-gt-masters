// app/(site)/media/video/page.tsx — 영상 목록
import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity.client'
import { VIDEOS_ALL_QUERY } from '@/lib/queries'
import type { Media } from '@/types/sanity'
import PageHero from '@/components/ui/PageHero'
import styles from './VideoPage.module.css'

export const metadata: Metadata = {
  title: 'VIDEO | 인제 GT 마스터즈',
  description: '인제 GT 마스터즈 공식 하이라이트 영상 모음.',
}

/** YouTube URL → 영상 ID 추출 */
function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1).split('?')[0]
    if (u.hostname.includes('youtube.com')) {
      return u.searchParams.get('v') ?? u.pathname.split('/').pop() ?? null
    }
  } catch {}
  return null
}

/** YouTube 썸네일 URL */
function ytThumb(id: string) {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
}

/** 발행일 포맷 */
function fmtDate(iso?: string) {
  if (!iso) return ''
  return iso.slice(0, 10).replace(/-/g, '.')
}

export default async function VideoPage({
  searchParams,
}: {
  searchParams: Promise<{ round?: string }>
}) {
  const { round: roundParam } = await searchParams
  const roundFilter = roundParam ? parseInt(roundParam, 10) : 0   // 0 = 전체

  const videos = await sanityFetch<Media[]>({
    query:     VIDEOS_ALL_QUERY,
    revalidate: 300,
  }).catch(() => [] as Media[])

  const allVideos = videos as Media[]

  // 영상이 연결된 라운드 번호를 오름차순 중복 제거
  const availableRounds = Array.from(
    new Set(
      allVideos
        .map(v => v.relatedRound?.roundNumber)
        .filter((n): n is number => typeof n === 'number')
    )
  ).sort((a, b) => a - b)

  // 라운드 필터 적용
  const displayed = roundFilter
    ? allVideos.filter(v => v.relatedRound?.roundNumber === roundFilter)
    : allVideos

  return (
    <>
      {/* ── 1. PageHero ─────────────────────────────── */}
      <PageHero
        badge="Media"
        title="VIDEO"
        subtitle="인제GT마스터즈 공식 하이라이트 영상"
        breadcrumb={[
          { label: '홈',   href: '/' },
          { label: 'MEDIA', href: '/media/news' },
          { label: 'VIDEO' },
        ]}
      />

      <section className="section" style={{ background: 'var(--bg-carbon)' }}>
        <div className="container">

          {/* ── 2. 라운드 필터 탭 ─────────────────────── */}
          <div className={styles.filterBar}>
            {/* 전체 탭 */}
            <Link
              href="/media/video"
              className={`${styles.filterBtn} ${roundFilter === 0 ? styles.filterBtnActive : ''}`}
            >
              전체
            </Link>

            {/* 영상 있는 라운드만 탭 노출 */}
            {availableRounds.map(rn => (
              <Link
                key={rn}
                href={`/media/video?round=${rn}`}
                className={`${styles.filterBtn} ${roundFilter === rn ? styles.filterBtnActive : ''}`}
              >
                R{String(rn).padStart(2, '0')}
              </Link>
            ))}
          </div>

          {/* ── 3. 영상 그리드 ───────────────────────── */}
          <div className={styles.grid}>
            {displayed.length === 0 ? (
              <div className={styles.empty}>
                <i className={`fa-brands fa-youtube ${styles.emptyIcon}`} />
                <p className={styles.emptyText}>곧 업로드 예정입니다.</p>
                <p className={styles.emptyNote}>
                  {roundFilter ? `R${roundFilter} 영상은 ` : ''}대회 종료 후 순차적으로 업로드됩니다.
                </p>
              </div>
            ) : (
              displayed.map((video, i) => {
                const ytId    = video.youtubeUrl ? extractYouTubeId(video.youtubeUrl) : null
                const thumbUrl = video.youtubeThumbnail
                  ?? (ytId ? ytThumb(ytId) : null)
                const href    = video.youtubeUrl ?? '#'
                const rn      = video.relatedRound?.roundNumber

                return (
                  <a
                    key={video._id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.card}
                    style={{ animationDelay: `${i * 0.07}s` }}
                  >
                    {/* 썸네일 */}
                    <div className={styles.thumb}>
                      {thumbUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={thumbUrl}
                          alt={video.title}
                          className={styles.thumbImg}
                          loading="lazy"
                        />
                      ) : (
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(135deg,#1a1a1a,#0d0d0d)',
                          display: 'grid', placeItems: 'center',
                          color: '#333', fontSize: '2.5rem',
                        }}>
                          <i className="fa-brands fa-youtube" />
                        </div>
                      )}

                      {/* hover 오버레이 */}
                      <div className={styles.overlay} />

                      {/* 재생 아이콘 */}
                      <div className={styles.playIcon}>
                        <div className={styles.playCircle}>
                          <i className="fa-solid fa-play" style={{ marginLeft: '3px' }} />
                        </div>
                      </div>

                      {/* 재생 시간 */}
                      {video.duration && (
                        <span className={styles.duration}>{video.duration}</span>
                      )}
                    </div>

                    {/* 카드 정보 */}
                    <div className={styles.info}>
                      {rn && (
                        <span className={styles.roundBadge}>
                          ROUND {String(rn).padStart(2, '0')}
                        </span>
                      )}
                      <strong className={styles.title}>{video.title}</strong>
                      {video.publishedAt && (
                        <span className={styles.date}>{fmtDate(video.publishedAt)}</span>
                      )}
                    </div>
                  </a>
                )
              })
            )}
          </div>

        </div>
      </section>
    </>
  )
}
