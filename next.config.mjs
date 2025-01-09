import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-blog',
  themeConfig: './theme.config.tsx'
})

export default withNextra({
  output: 'export',
  basePath: '/jf-blog',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  assetPrefix: '/jf-blog',
})