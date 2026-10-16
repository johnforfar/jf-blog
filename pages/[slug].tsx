import Head from 'next/head'
import BlogLayout from '../components/BlogLayout'
import Markdown from '../components/Markdown'
import { fetchPost, fetchPosts } from '../utils/api'

interface FrontMatter {
  title: string
  date: string
  description: string
  coverImage?: string
  tags?: string[]
  categories?: string[]
}

interface PostProps {
  slug: string
  content: string
  frontMatter: FrontMatter
}

export default function Post({ slug, content, frontMatter }: PostProps) {
  const url = `https://solana.blog/${slug}`
  return (
    <BlogLayout frontMatter={frontMatter}>
      <Head>
        <title>{`${frontMatter.title} | solana.blog`}</title>
        <meta name="description" content={frontMatter.description} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={frontMatter.title} />
        <meta property="og:description" content={frontMatter.description} />
        <meta property="og:url" content={url} />
        {frontMatter.coverImage && <meta property="og:image" content={`${frontMatter.coverImage}?w=1200&h=630&fit=crop`} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Markdown content={content} />
    </BlogLayout>
  )
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug)
  if (!post || !post.content) return { notFound: true, revalidate: 60 }

  const { frontMatter } = post
  return {
    props: {
      slug: params.slug,
      content: post.content,
      frontMatter: {
        ...frontMatter,
        date: frontMatter.date ? frontMatter.date.slice(0, 10) : '',
        coverImage: frontMatter.coverImage || null,
      },
    },
    revalidate: 60,
  }
}

export async function getStaticPaths() {
  const posts = await fetchPosts()
  return {
    paths: posts.map(post => ({ params: { slug: post.slug } })),
    fallback: 'blocking',
  }
}
