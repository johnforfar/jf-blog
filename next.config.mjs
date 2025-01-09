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
    loader: 'custom',
    loaderFile: './imageLoader.js',
  },
  assetPrefix: basePath,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  }
})