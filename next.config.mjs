import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-blog',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true,
  readingTime: true,
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [],
  }
})

export default withNextra({
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mdx'],
  images: {
    unoptimized: true,
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/images/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/:path*`,
      }
    ]
  }
})