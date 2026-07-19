// lib/sanity-image.ts — Sanity CDN 이미지 URL 빌더

interface BuildUrlOptions {
  width: number
  quality?: number
  hotspot?: { x: number; y: number }
}

export function buildSanityImageUrl(
  baseUrl: string,
  { width, quality = 80, hotspot }: BuildUrlOptions
): string {
  const params = new URLSearchParams({
    w: String(width),
    auto: 'format',
    q: String(quality),
    fit: 'crop',
  })
  if (hotspot) {
    params.set('fp-x', hotspot.x.toFixed(4))
    params.set('fp-y', hotspot.y.toFixed(4))
    params.set('crop', 'focalpoint')
  }
  return `${baseUrl}?${params.toString()}`
}

export function buildHeroSrcSet(
  baseUrl: string,
  hotspot?: { x: number; y: number }
) {
  return {
    mobile: {
      src1x: buildSanityImageUrl(baseUrl, { width: 768,  quality: 75, hotspot }),
      src2x: buildSanityImageUrl(baseUrl, { width: 1536, quality: 75, hotspot }),
    },
    tablet: {
      src1x: buildSanityImageUrl(baseUrl, { width: 1440, quality: 80, hotspot }),
      src2x: buildSanityImageUrl(baseUrl, { width: 2560, quality: 80, hotspot }),
    },
    desktop: {
      // 2560px 이상은 화면상 차이가 거의 없어 상한을 2560/q80으로 제한 (LCP 리소스 경량화)
      src1x: buildSanityImageUrl(baseUrl, { width: 1920, quality: 80, hotspot }),
      src2x: buildSanityImageUrl(baseUrl, { width: 2560, quality: 80, hotspot }),
    },
  }
}
