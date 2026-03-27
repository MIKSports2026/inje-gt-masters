// app/(site)/media/[slug]/page.tsx — 사진 앨범 상세
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch } from '@/lib/sanity.client'
import { PHOTO_ALBUM_DETAIL_QUERY } from '@/lib/queries'
import type { Media } from '@/types/sanity'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const album = await sanityFetch<Media>({ query: PHOTO_ALBUM_DETAIL_QUERY, params: { slug: params.slug }, revalidate: 300 }).catch(() => null)
  return {
    title: album?.title ?? '포토 앨범',
    description: album?.description ?? '인제 GT 마스터즈 공식 포토 갤러리',
  }
}

export default async function MediaDetailPage({ params }: { params: { slug: string } }) {
  const album = await sanityFetch<Media>({ query: PHOTO_ALBUM_DETAIL_QUERY, params: { slug: params.slug }, revalidate: 300 }).catch(() => null)

  const cut = 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)'

  if (!album) {
    // Sanity 미연결 fallback
    return (
      <>
        <section style={{ background: 'linear-gradient(135deg,#111,#1a0008)', padding: '56px 0 48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg,rgba(230,0,35,.04) 0 1px,transparent 1px 60px)', pointerEvents: 'none' }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '.84rem', color: 'rgba(255,255,255,.5)' }}>
              <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>홈</Link>
              <span>/</span>
              <Link href="/media" style={{ color: 'inherit', textDecoration: 'none' }}>미디어</Link>
              <span>/</span>
              <span style={{ color: 'rgba(255,255,255,.8)' }}>앨범</span>
            </div>
            <span className="pill">Photo Album</span>
            <h1 style={{ color: '#fff', marginTop: '10px', fontSize: 'clamp(1.8rem,4vw,3rem)' }}>포토 앨범</h1>
          </div>
        </section>
        <section className="section">
          <div className="container" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
            <i className="fa-solid fa-images" style={{ fontSize: '3rem', opacity: .3, display: 'block', marginBottom: '16px' }} />
            <p style={{ marginBottom: '20px' }}>Sanity CMS 연결 후 사진이 표시됩니다.</p>
            <Link href="/media" className="btn btn-secondary">갤러리로 돌아가기</Link>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      {/* 히어로 */}
      <section style={{ position: 'relative', minHeight: '320px', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
        {album.coverImage?.asset?.url ? (
          <Image src={album.coverImage.asset.url} alt={album.title} fill style={{ objectFit: 'cover' }} sizes="100vw" priority />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#111,#1a0008)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,.1),rgba(0,0,0,.75))' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, paddingBottom: '36px', paddingTop: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', fontSize: '.84rem', color: 'rgba(255,255,255,.5)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>홈</Link>
            <span>/</span>
            <Link href="/media" style={{ color: 'inherit', textDecoration: 'none' }}>미디어</Link>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,.8)' }}>앨범</span>
          </div>
          <span className="pill" style={{ marginBottom: '12px' }}>Photo Album</span>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.6rem,3.5vw,2.8rem)', lineHeight: 1.15 }}>{album.title}</h1>
          <div style={{ display: 'flex', gap: '16px', marginTop: '10px', color: 'rgba(255,255,255,.65)', fontSize: '.88rem', flexWrap: 'wrap' }}>
            <span>{album.publishedAt?.slice(0, 10)}</span>
            {album.photos && <span><i className="fa-solid fa-images" style={{ marginRight: '5px' }} />{album.photos.length}장</span>}
            {album.relatedRound && <span>R{album.relatedRound.roundNumber} — {album.relatedRound.title}</span>}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {album.description && (
            <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '720px', marginBottom: '28px' }}>{album.description}</p>
          )}

          {/* 사진 그리드 */}
          {album.photos && album.photos.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '10px' }}>
              {album.photos.map((photo, i) => (
                <div key={i} style={{ position: 'relative', paddingBottom: '66%', overflow: 'hidden', clipPath: cut, background: '#111', cursor: 'pointer' }}>
                  {photo.image?.asset?.url && (
                    <Image
                      src={photo.image.asset.url}
                      alt={photo.alt ?? photo.caption ?? `사진 ${i + 1}`}
                      fill
                      style={{ objectFit: 'cover', transition: 'transform .3s' }}
                      sizes="(max-width:768px) 100vw, 33vw"
                      placeholder={photo.image.asset.metadata?.lqip ? 'blur' : undefined}
                      blurDataURL={photo.image.asset.metadata?.lqip}
                    />
                  )}
                  {photo.caption && (
                    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '8px 12px', background: 'linear-gradient(180deg,transparent,rgba(0,0,0,.7))', color: '#fff', fontSize: '.8rem' }}>
                      {photo.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)', background: 'var(--surface-2)', borderRadius: '8px' }}>
              <i className="fa-solid fa-images" style={{ fontSize: '3rem', opacity: .3, display: 'block', marginBottom: '12px' }} />
              <p>사진을 준비 중입니다.</p>
            </div>
          )}

          <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/media" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--muted)', fontWeight: 700, fontSize: '.9rem', textDecoration: 'none' }}>
              <i className="fa-solid fa-arrow-left" />갤러리로
            </Link>
            {album.relatedRound?.slug && (
              <Link href={`/season/${album.relatedRound.slug.current}`} className="btn btn-secondary" style={{ fontSize: '.88rem', minHeight: '40px' }}>
                <i className="fa-solid fa-flag-checkered" />라운드 상세
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
