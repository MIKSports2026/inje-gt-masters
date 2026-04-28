// app/(site)/media/kit/page.tsx — 라운드별 미디어킷
import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity.client'
import { SITE_SETTINGS_QUERY } from '@/lib/queries'
import type { SiteSettings } from '@/types/sanity'
import PageHero from '@/components/ui/PageHero'
import styles from './MediaKitPage.module.css'

export const metadata: Metadata = {
  title: 'PRESS KIT | 인제 GT 마스터즈',
  description: '인제 GT 마스터즈 라운드별 공식 미디어킷, 오피셜 포토, 기록지 자료를 다운로드하세요.',
}

const MEDIA_KIT_QUERY = /* groq */`
  *[_type == "mediaKit" && !(_id in path("drafts.**"))] | order(order asc) {
    _id,
    title,
    isReady,
    "roundNumber": round->roundNumber,
    "roundTitle": round->title,
    "roundDateStart": round->dateStart,
    "mediaKitFileUrl": mediaKitFile.asset->url,
    photoFolderUrl,
    timingPasswordInfo,
    order
  }
`

interface MediaKitItem {
  _id:              string
  title:            string
  isReady:          boolean
  roundNumber?:     number
  roundTitle?:      string
  roundDateStart?:  string
  mediaKitFileUrl?: string
  photoFolderUrl?:  string
  timingPasswordInfo?: string
  order?:           number
}

function formatDate(iso?: string) {
  if (!iso) return ''
  const [, m, d] = iso.split('-')
  return `${parseInt(m)}/${parseInt(d)}`
}

export default async function MediaKitPage() {
  const [settings, items] = await Promise.all([
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, revalidate: 3600 }),
    sanityFetch<MediaKitItem[]>({ query: MEDIA_KIT_QUERY, useCdn: false, revalidate: 0 }),
  ]).catch(() => [null, []] as [SiteSettings | null, MediaKitItem[]])

  const email = (settings as SiteSettings | null)?.email ?? 'media@injegtmasters.com'
  const kitList = (items as MediaKitItem[])

  return (
    <>
      <PageHero
        badge="MEDIA"
        title="PRESS KIT"
        subtitle="라운드별 공식 자료 다운로드"
        breadcrumb={[
          { label: '홈', href: '/' },
          { label: 'MEDIA', href: '/media/news' },
          { label: 'PRESS KIT' },
        ]}
      />

      <section className="section" style={{ background: 'var(--bg-carbon)' }}>
        <div className="container">

          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>ROUND MEDIA KITS</h2>
            <div className={styles.sectionBar} />
          </div>

          {kitList.length === 0 ? (
            /* Sanity에 문서가 하나도 없을 때 안내 */
            <p className={styles.emptyNote}>준비 중입니다. 취재 문의는 아래 이메일로 연락해 주세요.</p>
          ) : (
            <div className={styles.kitGrid}>
              {kitList.map(item => {
                const roundLabel = item.roundNumber
                  ? `R${item.roundNumber} — ${formatDate(item.roundDateStart)} 인제스피디움`
                  : item.title

                return (
                  <div
                    key={item._id}
                    className={`${styles.kitCard} ${item.isReady ? styles.kitCardReady : styles.kitCardPending}`}
                  >
                    {/* 라운드 헤더 */}
                    <div className={styles.cardHeader}>
                      {item.roundNumber && (
                        <span className={styles.roundBadge}>R{item.roundNumber}</span>
                      )}
                      {!item.isReady && (
                        <span className={styles.pendingBadge}>준비 중</span>
                      )}
                    </div>

                    {/* 카드 본문 */}
                    <div className={styles.cardBody}>
                      <strong className={styles.cardTitle}>{roundLabel}</strong>
                      {item.title && item.roundNumber && (
                        <p className={styles.cardDesc}>{item.title}</p>
                      )}
                    </div>

                    {/* 액션 버튼들 */}
                    <div className={styles.cardFooter}>
                      {item.isReady ? (
                        <>
                          {item.mediaKitFileUrl && (
                            <a
                              href={item.mediaKitFileUrl}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.btnDownload}
                            >
                              <i className="fa-solid fa-file-arrow-down" />
                              미디어킷 다운로드
                            </a>
                          )}
                          {item.photoFolderUrl && (
                            <a
                              href={item.photoFolderUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.btnPhoto}
                            >
                              <i className="fa-solid fa-images" />
                              오피셜 포토
                            </a>
                          )}
                          {item.timingPasswordInfo && (
                            <div className={styles.timingInfo}>
                              <i className="fa-solid fa-stopwatch" />
                              <span>{item.timingPasswordInfo}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className={styles.btnUnavailable}>
                          <i className="fa-solid fa-clock" />
                          준비 중
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* 취재 문의 */}
          <div className={styles.sectionHeader} style={{ marginTop: '64px' }}>
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
