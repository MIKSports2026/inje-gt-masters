// app/(site)/media/gallery/page.tsx — 사진 갤러리
import type { Metadata } from 'next'
import { redirect }      from 'next/navigation'
import { sanityFetch }   from '@/lib/sanity.client'
import { GALLERY_QUERY } from '@/lib/queries'
import PageHero          from '@/components/ui/PageHero'
import GalleryClient, { type PhotoItem } from './GalleryClient'

export const metadata: Metadata = {
  title: 'GALLERY | 인제 GT 마스터즈',
  description: '인제 GT 마스터즈 공식 사진 갤러리. 박진감 넘치는 레이스 현장을 만나보세요.',
}

interface GalleryAlbum {
  _id:           string
  title:         string
  publishedAt?:  string
  relatedRound?: { roundNumber: number; title: string }
  photos?:       {
    image?: { asset?: { url: string; metadata?: { lqip?: string } } }
    alt?:     string
    caption?: string
    credit?:  string
  }[]
}

export default async function GalleryPage() {
  const albums = await sanityFetch<GalleryAlbum[]>({
    query:     GALLERY_QUERY,
    revalidate: 300,
  }).catch(() => [] as GalleryAlbum[])

  // 사진이 1장도 없으면 /media로 리다이렉트
  const totalPhotos = albums.reduce((acc, a) => acc + (a.photos?.length ?? 0), 0)
  if (totalPhotos === 0) redirect('/media')

  /* ── photos 플래튼 ─────────────────────────────────── */
  const photos: PhotoItem[] = albums.flatMap(album =>
    (album.photos ?? [])
      .filter(p => p.image?.asset?.url)
      .map(p => ({
        url:         p.image!.asset!.url,
        lqip:        p.image?.asset?.metadata?.lqip,
        alt:         p.alt,
        caption:     p.caption,
        credit:      p.credit,
        roundNumber: album.relatedRound?.roundNumber,
        roundTitle:  album.relatedRound?.title,
        albumTitle:  album.title,
      }))
  )

  /* ── 사진 있는 라운드 번호 추출 ─────────────────────── */
  const availableRounds = Array.from(
    new Set(
      photos
        .map(p => p.roundNumber)
        .filter((n): n is number => typeof n === 'number')
    )
  ).sort((a, b) => a - b)

  return (
    <>
      {/* ── PageHero ──────────────────────────────────── */}
      <PageHero
        badge="Media"
        title="GALLERY"
        subtitle="인제GT마스터즈 공식 사진 갤러리"
        breadcrumb={[
          { label: '홈',    href: '/' },
          { label: 'MEDIA', href: '/media/news' },
          { label: 'GALLERY' },
        ]}
      />

      <section className="section" style={{ background: 'var(--bg-carbon)' }}>
        <div className="container">
          <GalleryClient
            photos={photos}
            availableRounds={availableRounds}
          />
        </div>
      </section>
    </>
  )
}
