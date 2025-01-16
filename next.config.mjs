import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-blog',
  themeConfig: './theme.config.tsx'
})

export default withNextra({
  images: {
    unoptimized: true,
  }
})