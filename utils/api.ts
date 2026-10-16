// Posts come from the same Sanity dataset as johnforfar.com.
// A post shows on solana.blog when its `sites` array contains "solana".

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 's0xx4glh'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'johnforfar-com'
const SITE = process.env.BLOG_SITE || 'solana'

export interface Post {
  slug: string
  title?: string
  date?: string
  tags?: string[] | string
  categories?: string[] | string
  coverImage?: string | null
  summary?: string
  authors?: string[] | string
  fullPath?: string
}

interface PostFrontMatter {
  title: string
  date: string
  description: string
  tags: string[]
  categories: string[]
  coverImage: string | null
  [key: string]: unknown
}

async function query<T>(groq: string, params: Record<string, string> = {}): Promise<T> {
  const search = new URLSearchParams({ query: groq })
  for (const [k, v] of Object.entries(params)) search.set(`$${k}`, JSON.stringify(v))
  const res = await fetch(`https://${PROJECT_ID}.apicdn.sanity.io/v2023-05-03/data/query/${DATASET}?${search}`)
  if (!res.ok) throw new Error(`Sanity query failed (${res.status})`)
  return (await res.json()).result
}

const POST_FIELDS = `
  "slug": slug.current,
  title,
  "date": publishedAt,
  "categories": categories[]->title,
  "coverImage": mainImage.asset->url,
  "markdown": body[0].children[0].text
`

// Bodies are stored as one block of raw markdown (same as johnforfar.com reads them).
interface RawPost {
  slug: string
  title: string
  date: string
  categories: string[] | null
  coverImage: string | null
  markdown: string | null
}

function summarize(markdown: string | null, length = 220): string {
  const plain = (markdown || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*_`>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return plain.length > length ? `${plain.slice(0, length).trimEnd()}…` : plain
}

export async function fetchPost(slug: string): Promise<{ content: string; frontMatter: PostFrontMatter } | null> {
  const post = await query<RawPost | null>(
    `*[_type == "post" && slug.current == $slug && $site in sites && !(_id in path("drafts.**"))][0]{${POST_FIELDS}}`,
    { slug, site: SITE },
  )
  if (!post) return null
  const categories = post.categories || []
  return {
    content: post.markdown || '',
    frontMatter: {
      title: post.title,
      date: post.date,
      description: summarize(post.markdown, 160),
      tags: [],
      categories,
      coverImage: post.coverImage,
    },
  }
}

export async function fetchPosts(): Promise<Post[]> {
  try {
    const posts = await query<RawPost[]>(
      `*[_type == "post" && $site in sites && !(_id in path("drafts.**"))] | order(publishedAt desc){${POST_FIELDS}}`,
      { site: SITE },
    )
    return posts.map(({ markdown, categories, ...post }) => ({
      ...post,
      categories: categories || [],
      tags: categories || [],
      summary: summarize(markdown),
    }))
  } catch (error) {
    console.error('fetchPosts - Sanity error:', error)
    return []
  }
}

export function getImageUrl(imagePath: string) {
  return imagePath || null
}
