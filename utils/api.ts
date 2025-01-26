import matter from 'gray-matter'

export interface Post {
  slug: string
  title?: string
  date?: string
  tags?: string[]
  coverImage?: string
  summary?: string
  authors?: string[]
  fullPath: string
}

export async function fetchPost(slug: string) {
  const baseUrl = typeof window === 'undefined'
    ? process.env.BACKEND_URL || 'http://localhost:3001'
    : ''
    
  console.log('fetchPost - Using baseUrl:', baseUrl)
  const url = `${baseUrl}/api/posts/${slug}`
  console.log('fetchPost - Full URL:', url)

  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.error('fetchPost - Error status:', response.status)
      throw new Error('Failed to fetch post')
    }
    
    const source = await response.text()
    const { data: frontMatter, content } = matter(source)
    
    return {
      content,
      frontMatter: {
        title: frontMatter?.title || slug.replace(/-/g, ' '),
        date: frontMatter?.date || new Date().toISOString(),
        description: frontMatter?.description || 'No description available'
      }
    }
  } catch (error) {
    console.error('fetchPost - Error:', error)
    throw error
  }
}

export async function fetchPosts() {
  // For server-side requests, use the full backend URL
  const baseUrl = typeof window === 'undefined'
    ? process.env.BACKEND_URL || 'http://localhost:3001'
    : ''
  
  console.log('fetchPosts - Using baseUrl:', baseUrl)
  const url = `${baseUrl}/api/posts` // Remove proxy from URL
  console.log('fetchPosts - Full URL:', url)

  try {
    const response = await fetch(url)
    console.log('fetchPosts - Response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('fetchPosts - Error response:', errorText)
      throw new Error(`Failed to fetch posts: ${response.status} ${errorText}`)
    }
    
    const posts = await response.json()
    return posts.map((post: Post) => ({
      ...post,
      title: post.title || post.slug.replace(/-/g, ' '),
      date: post.date || new Date().toISOString()
    }))
  } catch (error) {
    console.error('fetchPosts - Fetch error:', error)
    return []
  }
}

export function getImageUrl(imagePath: string) {
  return `/api/images/${imagePath}`
}