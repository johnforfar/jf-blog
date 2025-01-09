import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-blog',
  themeConfig: './theme.config.tsx'
})

const isProduction = process.env.NODE_ENV === 'production'
const basePath = isProduction ? '/jf-blog' : ''

export default withNextra({
  output: 'export',
  basePath,
  images: {
    unoptimized: true,
  },
  assetPrefix: basePath,
})