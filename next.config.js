/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // 정적 파일들을 public 폴더로 복사
  async rewrites() {
    return [
      {
        source: '/assets/:path*',
        destination: '/src/assets/:path*',
      },
    ]
  },
}

module.exports = nextConfig 