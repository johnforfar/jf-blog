import { useState } from 'react'
import { getImageUrl } from '../utils/api'
import Image from 'next/image'

interface Post {
  slug: string
  title?: string
  date?: string
  tags?: string[]
  coverImage?: string
  summary?: string
  authors?: string[]
}

export function AllPosts({ posts }: { posts: Post[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 9
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(posts.length / postsPerPage)

  // Parse the post data from the slug
  const parsePost = (post: Post) => {
    const cleanSlug = post.slug.replace(/^\d{4}-\d{2}-\d{2}-/, '')
    const title = cleanSlug.replace(/-/g, ' ')
    const date = post.slug.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || ''
    
    return {
      ...post,
      title: title.charAt(0).toUpperCase() + title.slice(1),
      date: new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPosts.map(post => {
          const parsedPost = parsePost(post)
          const cleanSlug = post.slug.replace(/^\d{4}-\d{2}-\d{2}-/, '')
          return (
            <article key={post.slug} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              {parsedPost.coverImage && (
                <Image 
                  src={getImageUrl(parsedPost.coverImage)}
                  alt={parsedPost.title || ''}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex gap-2 mb-2">
                  {parsedPost.tags?.map(tag => (
                    <span key={tag} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-bold mb-2">
                  <a href={`/${cleanSlug}`} className="hover:text-blue-500">
                    {parsedPost.title}
                  </a>
                </h2>
                <time className="text-sm text-gray-500 dark:text-gray-400">{parsedPost.date}</time>
                {parsedPost.summary && (
                  <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-3">{parsedPost.summary}</p>
                )}
              </div>
            </article>
          )
        })}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === i + 1 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 