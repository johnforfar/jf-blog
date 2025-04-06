import { CodeWallet } from './CodeWallet'
import { SliderTips } from './SliderTips'
import NextImage from 'next/image'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'

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
    categories?: string[]
    tags?: string[]
  }
}

// Function to normalize image paths
const normalizeImagePath = (path: string): string => {
  if (!path) return '';
  // Remove ./ prefix if present
  let normalized = path.replace(/^\.\/images\//, '');
  // Ensure it has the correct base path
  if (!normalized.startsWith('/') && !normalized.startsWith('http')) {
    normalized = `/images/${normalized}`;
  }
  return normalized;
};

// A simple component to handle auto-linking of URLs
const AutoLinkifyText = ({ text }: { text: string }) => {
  const urlRegex = /(https?:\/\/\S+)/g;
  
  if (!text.match(urlRegex)) {
    return <>{text}</>;
  }
  
  const segments = text.split(urlRegex);
  
  return (
    <>
      {segments.map((segment, i) => {
        // Even segments are normal text, odd segments are URLs
        if (i % 2 === 0) {
          return segment;
        }
        // Return the URL as a link
        return (
          <a 
            key={i} 
            href={segment} 
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {segment}
          </a>
        );
      })}
    </>
  );
};

export default function BlogLayout({ children, frontMatter }: BlogLayoutProps) {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  const title = frontMatter?.title || 'Untitled Post'
  const originalDate = frontMatter.date || ''
  const coverImage = frontMatter.coverImage
  const categories = frontMatter.categories || []
  const tags = frontMatter.tags || []
  
  // Ensure images are properly loaded
  useEffect(() => {
    // Set a timeout to force imagesLoaded to true after 2 seconds
    // This ensures content is visible even if images are slow to load
    const timer = setTimeout(() => {
      setImagesLoaded(true);
    }, 2000);
    
    // Preload cover image if exists
    if (coverImage) {
      const img = new Image();
      img.onload = () => {
        setImagesLoaded(true);
        clearTimeout(timer);
      };
      img.onerror = () => {
        console.error(`Failed to load cover image: ${coverImage}`);
        setImagesLoaded(true);
        clearTimeout(timer);
      };
      img.src = `${getBaseUrl()}/images/${coverImage}`;
    } else {
      setImagesLoaded(true);
      clearTimeout(timer);
    }
    
    return () => clearTimeout(timer);
  }, [coverImage]);
  
  const coverImageUrl = coverImage 
    ? `${getBaseUrl()}/images/${coverImage}`
    : null;

  // Process content to handle image loading
  const processContent = (content: React.ReactNode): React.ReactNode => {
    if (typeof content === 'string') {
      return <AutoLinkifyText text={content} />;
    }
    
    if (React.isValidElement(content)) {
      // Handle image elements specifically
      if (content.type === 'img') {
        // Type assertion for image props
        const imgProps = content.props as React.ImgHTMLAttributes<HTMLImageElement>;
        const src = normalizeImagePath(imgProps.src || '');
        return (
          <NextImage 
            src={`${getBaseUrl()}${src}`}
            alt={imgProps.alt || ''}
            width={800}
            height={450}
            className="w-full rounded-md my-4"
            priority={true}
          />
        );
      }
      
      // Recursively process children
      if (content.props && content.props.children) {
        // Type assertion for children
        const childrenContent = React.Children.toArray(content.props.children);
        if (childrenContent.length > 0) {
          const processedChildren = React.Children.map(childrenContent, child => 
            processContent(child)
          );
          // Clone with type safety
          return React.cloneElement(content, content.props, processedChildren);
        }
      }
    }
    
    return content;
  };

  // Process the children to auto-link and handle images
  const enhancedChildren = React.Children.map(children, child => 
    processContent(child)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="prose lg:prose-xl dark:prose-invert">
        {coverImageUrl && (
          <div className="cover-image-container mb-8">
            <NextImage 
              src={coverImageUrl}
              alt={title}
              width={1200}
              height={600}
              className="cover-image"
              priority={true}
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
        
        {/* Content with auto-linked URLs and handled images */}
        <div className="markdown-content">
          {enhancedChildren}
        </div>
        
        <div className="mt-8">
          <SliderTips defaultAmount={1.00} minAmount={0.10} maxAmount={10.00} />
          <CodeWallet amount={1.00} />
        </div>
      </article>
    </div>
  );
}