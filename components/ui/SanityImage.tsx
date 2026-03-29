// components/ui/SanityImage.tsx
'use client'
import Image, { type ImageProps } from 'next/image'
import { urlFor } from '@/lib/sanity.client'
import type { SanityImage as SanityImageType } from '@/types/sanity'

interface Props extends Omit<ImageProps, 'src' | 'alt' | 'width' | 'height' | 'placeholder' | 'blurDataURL'> {
  image:  SanityImageType
  alt?:   string
  width?: number
  height?: number
  fill?:  boolean
}

export default function SanityImage({
  image,
  alt,
  width,
  height,
  fill,
  ...props
}: Props) {
  if (!image?.asset) return null

  const src = urlFor(image)
    .auto('format')
    .fit('crop')
    .url()

  const altText = alt ?? image.alt ?? '이미지'
  const lqip    = image.asset.metadata?.lqip

  if (fill) {
    return (
      <Image
        src={src}
        alt={altText}
        fill
        placeholder={lqip ? 'blur' : 'empty'}
        blurDataURL={lqip}
        {...props}
      />
    )
  }

  const w = width  ?? image.asset.metadata?.dimensions?.width  ?? 800
  const h = height ?? image.asset.metadata?.dimensions?.height ?? 600

  return (
    <Image
      src={src}
      alt={altText}
      width={w}
      height={h}
      placeholder={lqip ? 'blur' : 'empty'}
      blurDataURL={lqip}
      {...props}
    />
  )
}
