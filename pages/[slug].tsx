import BlogLayout from '../components/BlogLayout'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { fetchPost, fetchPosts } from '../utils/api'
import type { Post } from '../utils/api'
import { CodeWallet } from '../components/CodeWallet'

// Add MDX components
const components = {
  CodeWallet
}

interface PostProps {
  source: MDXRemoteSerializeResult
  frontMatter: {
    title: string
    date: string
    description: string
  }
}

export default function Post({ source, frontMatter }: PostProps) {
  if (!source || !frontMatter) {
    return (
      <BlogLayout 
        frontMatter={{
          title: 'Loading...',
          date: new Date().toISOString(),
          description: 'Loading post content'
        }}
      >
        <div>Loading...</div>
      </BlogLayout>
    )
  }

  return (
    <BlogLayout frontMatter={frontMatter}>
      <MDXRemote {...source} components={components} />
    </BlogLayout>
  )
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  if (!params?.slug) {
    return { notFound: true }
  }

  try {
    const { content, frontMatter } = await fetchPost(params.slug)
    
    if (!content) {
      console.error('getStaticProps - No content found for:', params.slug)
      return { notFound: true }
    }

    const mdxSource = await serialize(content, {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
        format: 'mdx'
      }
    })

    return {
      props: {
        source: mdxSource,
        frontMatter: {
          title: frontMatter.title,
          date: frontMatter.date,
          description: frontMatter.description
        }
      }
    }
  } catch (error) {
    console.error('getStaticProps - Error:', error)
    return { notFound: true }
  }
}

export async function getStaticPaths() {
    try {
      const posts = await fetchPosts()
      const paths = posts.map((post: Post) => ({
        params: { slug: post.slug }
      }))
      
      return {
        paths,
        fallback: 'blocking'
      }
    } catch (error) {
      console.error('getStaticPaths - Error:', error)
      return {
        paths: [],
        fallback: 'blocking'
      }
    }
  }