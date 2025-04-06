import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '../utils/functions'

export interface BlogCardProps {
  title: string
  shortDescription?: string
  coverImage?: string
  slug: string
  date?: string
  readTime?: string
  tags?: string[]
}

export const BlogCard = ({ 
  title, 
  shortDescription, 
  coverImage, 
  slug, 
  date, 
  readTime,
  tags = [] 
}: BlogCardProps) => {
  return (
    <article className="bg-gray-900 overflow-hidden flex flex-col transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl rounded-lg">
      {/* Image at the top with fixed aspect ratio */}
      <Link href={`/${slug}`} className="block w-full h-0 relative pb-[56.25%] overflow-hidden rounded-t-lg">
        {coverImage ? (
          <Image 
            src={coverImage}
            alt={title || ''}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 16vw, 10vw"
            className="absolute top-0 left-0 w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
            style={{ aspectRatio: '16/9' }}
            onError={(e) => {
              console.error('Image load error for:', coverImage);
              e.currentTarget.src = '/placeholder-image.jpg';
            }}
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-800 to-purple-800 flex items-center justify-center">
            <span className="text-xl font-bold text-white">
              {title?.charAt(0) || 'B'}
            </span>
          </div>
        )}
      </Link>
      
      {/* Content area with minimal padding */}
      <div className="px-3 py-2 flex-grow flex flex-col">
        <h2 className="text-sm font-bold mb-0.5 line-clamp-2 text-white">
          <Link href={`/${slug}`} className="hover:text-blue-400 transition-colors">
            {title}
          </Link>
        </h2>
        
        {date && (
          <time className="text-[10px] text-gray-400 mb-1">
            {date.includes('-') ? formatDate(date) : date}
            {readTime && ` | ${readTime}`}
          </time>
        )}
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1">
            {tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] bg-blue-900 text-blue-100 px-1.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {shortDescription && (
          <p className="text-[11px] text-gray-300 line-clamp-2 mb-1">{shortDescription}</p>
        )}
        
        <div className="mt-1">
          <Link 
            href={`/${slug}`} 
            className="inline-flex items-center text-[10px] font-medium text-blue-400 hover:underline"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  )
}

export default BlogCard 