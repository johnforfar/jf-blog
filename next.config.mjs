import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-blog',
  themeConfig: './theme.config.tsx'
})

const basePath = process.env.NODE_ENV === 'production' ? '/jf-blog' : ''

export default withNextra({
  output: 'export',
  basePath,
  images: {
    unoptimized: true,
  },
  assetPrefix: basePath,
  trailingSlash: true
})