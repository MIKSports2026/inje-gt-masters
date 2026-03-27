/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Sanity CDN
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      // Unsplash (개발용 플레이스홀더)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // YouTube 썸네일
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
  // Sanity Studio를 /studio 경로에 임베드하기 위해 필요
  transpilePackages: ['next-sanity', 'sanity-plugin-media'],
}

module.exports = nextConfig
