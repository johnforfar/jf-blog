export default function imageLoader({ src }) {
    const basePath = process.env.NODE_ENV === 'production' ? '/jf-blog' : ''
    return `${basePath}${src}`
  }