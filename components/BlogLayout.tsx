import { CodeWallet } from './CodeWallet'
import { SliderTips } from './SliderTips'
import NextImage from 'next/image'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

// Function to get the base URL for assets
const getBaseUrl = () => {
  // Explicitly check for browser environment
  if (typeof window !== 'undefined') {
    // Force the backend URL in the browser
    return 'http://localhost:3001';
  }
  // On server, use environment variable
  return process.env.BACKEND_URL || 'http://localhost:3001';
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
  let normalized = path.replace(/^\.\//g, '');
  
  // If it starts with 'images/', prefix with '/'
  if (normalized.startsWith('images/') && !normalized.startsWith('/images/')) {
    normalized = `/${normalized}`;
  }
  
  // If it doesn't have any path prefix and doesn't start with http, add /images/
  if (!normalized.startsWith('/') && !normalized.startsWith('http')) {
    normalized = `/images/${normalized}`;
  }
  
  // Handle spaces in image paths
  normalized = normalized.replace(/ /g, '%20');
  
  return normalized;
};

// Component to handle Markdown images
const MarkdownImage = ({ src, alt }: { src: string, alt?: string }) => {
  const baseUrl = getBaseUrl();
  const [imgSrc, setImgSrc] = useState<string>(() => {
    // Make sure we're using an absolute URL with the backend server
    const normalized = normalizeImagePath(src);
    
    // Ensure we have a complete URL with base
    const fullUrl = normalized.startsWith('http') 
      ? normalized 
      : `${baseUrl}${normalized}`;
      
    return fullUrl;
  });
  const [hasRetried, setHasRetried] = useState(false);
  
  // Handle image loading error with one retry
  const handleImageError = () => {
    if (!hasRetried) {
      // Add cache busting parameter on retry
      setImgSrc(`${imgSrc}?retry=${Date.now()}`);
      setHasRetried(true);
    }
  };
  
  return (
    <div className="my-6 flex justify-center">
      <NextImage
        src={imgSrc}
        alt={alt || ''}
        width={800}
        height={450}
        className="rounded-md max-w-full"
        onError={handleImageError}
        priority={!hasRetried} // Prioritize first load attempt
      />
    </div>
  );
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
        if (i % 2 === 0) return segment;
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
  
  // Force content to display after a timeout even if images are slow to load
  useEffect(() => {
    const timer = setTimeout(() => {
      setImagesLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const baseUrl = getBaseUrl();
  const coverImageUrl = coverImage 
    ? `${baseUrl}${normalizeImagePath(coverImage)}`
    : null;

  // Process content to handle image loading and links
  const processContent = (content: React.ReactNode): React.ReactNode => {
    if (typeof content === 'string') {
      return <AutoLinkifyText text={content} />;
    }
    
    if (!React.isValidElement(content)) {
      return content;
    }
    
    // Handle image elements
    if (content.type === 'img') {
      const imgProps = content.props as React.ImgHTMLAttributes<HTMLImageElement>;
      return <MarkdownImage src={imgProps.src || ''} alt={imgProps.alt} />;
    }
    
    // Handle elements with children by recursively processing them
    // Type assertion for content.props
    const props = content.props as { children?: React.ReactNode };
    const children = props.children;
    
    if (!children) {
      return content;
    }
    
    // Use type assertion to help TypeScript understand
    return React.cloneElement(
      content,
      undefined,
      React.Children.map(children, child => 
        processContent(child)
      )
    );
  };

  // Process the children to handle images and auto-link
  const enhancedChildren = React.Children.map(children, child => 
    processContent(child)
  );

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
        
        {/* Content with processed images and links */}
        <div className={`markdown-content transition-opacity duration-500 ${imagesLoaded ? 'opacity-100' : 'opacity-0'}`}>
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