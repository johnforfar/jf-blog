import { CodeWallet } from './CodeWallet'
import { SliderTips } from './SliderTips'
import NextImage from 'next/image'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

interface BlogLayoutProps {
  children: React.ReactNode
  frontMatter: {
    title: string
    date: string
    description: string
    coverImage?: string | null
    categories?: string[]
    tags?: string[]
  }
}

export default function BlogLayout({ children, frontMatter }: BlogLayoutProps) {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  const title = frontMatter?.title || 'Untitled Post'
  const originalDate = frontMatter.date || ''
  const coverImage = frontMatter.coverImage
  const categories = frontMatter.categories || []
  const tags = frontMatter.tags || []
  
  // Force content to display after a timeout even if images are slow to load
  useEffect(() => {
    const timer = setTimeout(() => {
      setImagesLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const coverImageUrl = coverImage ? `${coverImage}?w=1200&auto=format` : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className={`prose lg:prose-xl dark:prose-invert ${!imagesLoaded ? 'min-h-screen' : ''}`}>
        {coverImageUrl && (
          <div className="cover-image-container mb-8">
            <NextImage 
              src={coverImageUrl}
              alt={title}
              width={1200}
              height={600}
              className="cover-image rounded-md"
              priority={true}
              onLoad={() => setImagesLoaded(true)}
              onError={() => {
                console.error(`Failed to load cover image: ${coverImageUrl}`);
                setImagesLoaded(true); // Still show content even if cover fails
              }}
            />
          </div>
        )}
        
        <h1 className="text-4xl font-bold mt-6 mb-2">{title}</h1>
        
        {/* Meta information row - date, tags, categories */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Date */}
          <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
            {originalDate}
          </span>
          
          {/* Divider */}
          <span className="text-gray-400">•</span>
          
          {/* Author */}
          <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
            Author: Johnny
          </span>
          
          {/* Divider + tags (only when the post has tags) */}
          {tags.length > 0 && (
            <>
            <span className="text-gray-400">•</span>

            {/* Tags with label */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium whitespace-nowrap">Tags:</span>
              {tags.map((tag, index) => (
                <Link 
                  key={`tag-${index}`} 
                  href={`/?tag=${tag.toLowerCase().replace(/\s+/g, '-')}`}
                  className="tag-link bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors px-2 py-1 rounded text-sm"
                  style={{ position: 'static', height: 'auto', width: 'auto', padding: '0.25rem 0.5rem', overflow: 'visible' }}
                >
                  #{tag}
                </Link>
              ))}
            </div>

            </>
          )}
          
          {/* Divider before categories */}
          {categories.length > 0 && (
            <span className="text-gray-400">•</span>
          )}
          
          {/* Categories with label */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium whitespace-nowrap">Category:</span>
              {categories.map((category, index) => (
                <Link 
                  key={`cat-${index}`} 
                  href={`/?category=${category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="category-link bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors px-2 py-1 rounded text-sm"
                  style={{ position: 'static', height: 'auto', width: 'auto', padding: '0.25rem 0.5rem', overflow: 'visible' }}
                >
                  {category}
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* Content with processed images and links */}
        <div className={`markdown-content transition-opacity duration-500 ${imagesLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {children}
        </div>
        
        <div className="mt-8">
          <SliderTips defaultAmount={1.00} minAmount={0.10} maxAmount={10.00} />
          <CodeWallet amount={1.00} />
        </div>
      </article>
      
      {/* Back to Blog Link - Moved outside the article */}
      <div className="mt-16 mb-24 relative z-10">
        <hr className="border-t border-gray-300 dark:border-gray-700 mb-8" />
        <div className="text-center">
          <Link 
            href="/" 
            className="text-2xl font-bold hover:text-blue-400 transition-colors text-white bg-gray-800 dark:bg-gray-700 py-4 px-8 rounded-lg shadow-lg inline-block"
          >
            ← Back to Johnny&apos;s Blog
          </Link>
        </div>
      </div>
    </div>
  );
}