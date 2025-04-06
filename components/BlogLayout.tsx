import { CodeWallet } from './CodeWallet'
import { SliderTips } from './SliderTips'
import { format } from 'date-fns'
import Image from 'next/image'

import React from 'react';

const getBaseUrl = () => {
  return typeof window === 'undefined'
    ? process.env.BACKEND_URL || 'http://localhost:3001'
    : '';
};

interface BlogLayoutProps {
  children: React.ReactNode
  frontMatter: {
    title: string
    date: string
    description: string
    coverImage?: string
  }
}

export default function BlogLayout({ children, frontMatter }: BlogLayoutProps) {
  const title = frontMatter?.title || 'Untitled Post'
  const formattedDate = frontMatter.date 
    ? format(new Date(frontMatter.date), 'MMMM d, yyyy') 
    : ''
  const coverImage = frontMatter.coverImage
  
  // Create image URL for the cover image
  const coverImageUrl = coverImage 
    ? `${getBaseUrl()}/images/${coverImage}`
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="prose lg:prose-xl dark:prose-invert">
        <h1>{title}</h1>
        <div className="text-gray-600 dark:text-gray-400 mb-8">
          {formattedDate}
        </div>
        
        {/* Only show cover image if available */}
        {coverImageUrl && (
          <div className="cover-image-container">
            <Image 
              src={coverImageUrl} 
              alt={title}
              width={1200}
              height={600}
              className="cover-image"
              priority
            />
          </div>
        )}
        
        {children}
        <div className="mt-8">
          <SliderTips defaultAmount={1.00} minAmount={0.10} maxAmount={10.00} />
          <CodeWallet amount={1.00} />
        </div>
      </article>
    </div>
  )
}