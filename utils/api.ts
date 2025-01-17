export async function fetchPost(slug: string) {
  const response = await fetch(`/api/proxy/posts/${slug}`)
  if (!response.ok) throw new Error('Failed to fetch post')
  return response.text()
}

export async function fetchPosts() {
  const response = await fetch(`/api/proxy/posts`)
  if (!response.ok) throw new Error('Failed to fetch posts')
  return response.json()
}

export function getImageUrl(path: string) {
  return `/api/proxy/images/${path}`
} 