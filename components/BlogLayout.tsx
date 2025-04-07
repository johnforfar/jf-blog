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

// Add this component for handling YouTube embeds
const YouTubeEmbed = ({ videoId }: { videoId: string }) => {
  return (
    <div className="relative w-full pt-[56.25%] my-6 rounded-lg overflow-hidden shadow-lg">
      <iframe 
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player" 
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen
      ></iframe>
    </div>
  );
};

// Add this component for handling Twitter/X embeds
const TwitterEmbed = ({ tweetUrl }: { tweetUrl: string }) => {
  useEffect(() => {
    // Load Twitter widget script
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  return (
    <div className="twitter-embed my-6">
      <blockquote className="twitter-tweet" data-dnt="true">
        <a href={tweetUrl}></a>
      </blockquote>
    </div>
  );
};

// Function to extract YouTube video ID
const getYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Function to check if a string is a standalone URL
const isStandaloneUrl = (text: string): boolean => {
  const trimmed = text.trim();
  const urlRegex = /^(https?:\/\/[^\s]+)$/;
  return urlRegex.test(trimmed);
};

// Add this function to detect and transform embeddable URLs
// This function is used for handling raw HTML content with embeddable links
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const processEmbeds = (content: string): React.ReactNode => {
  // Check if content is a string (raw HTML)
  if (typeof content !== 'string') return content;
  
  // Match Twitter/X post URLs
  const twitterRegex = /https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/[0-9]+/g;
  
  // Match YouTube video URLs (both youtube.com and youtu.be formats)
  const youtubeRegex = /https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]+/g;
  
  // Find all Twitter/X links
  const twitterMatches = content.match(twitterRegex);
  
  // Find all YouTube links
  const youtubeMatches = content.match(youtubeRegex);
  
  let processedContent = content;
  
  // Replace Twitter/X links with embeds
  if (twitterMatches) {
    twitterMatches.forEach(url => {
      // Create Twitter embed HTML
      const tweetEmbed = `<div class="twitter-embed my-4">
        <blockquote class="twitter-tweet" data-dnt="true">
          <a href="${url}"></a>
        </blockquote>
        <script async src="https://platform.twitter.com/widgets.js"></script>
      </div>`;
      
      // Replace the URL with the embed code
      processedContent = processedContent.replace(url, tweetEmbed);
    });
  }
  
  // Replace YouTube links with embeds
  if (youtubeMatches) {
    youtubeMatches.forEach(url => {
      // Extract video ID
      let videoId = '';
      if (url.includes('youtube.com')) {
        videoId = new URL(url).searchParams.get('v') || '';
      } else if (url.includes('youtu.be')) {
        videoId = url.split('/').pop() || '';
      }
      
      if (videoId) {
        // Create YouTube embed HTML
        const youtubeEmbed = `<div class="youtube-embed my-4">
          <iframe 
            width="100%" 
            height="315" 
            src="https://www.youtube.com/embed/${videoId}" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
          ></iframe>
        </div>`;
        
        // Replace the URL with the embed code
        processedContent = processedContent.replace(url, youtubeEmbed);
      }
    });
  }
  
  // Convert the processed string to React elements
  // This uses dangerouslySetInnerHTML, but it's controlled since we're only 
  // changing specific URLs to trusted embed code
  return <div dangerouslySetInnerHTML={{ __html: processedContent }} />;
};

// Then update your processContent function to use these components
const processContent = (content: React.ReactNode): React.ReactNode => {
  if (typeof content === 'string') {
    // Check if this is a standalone YouTube URL
    if (isStandaloneUrl(content)) {
      // Handle YouTube URLs
      if (content.includes('youtube.com/watch') || content.includes('youtu.be/')) {
        const videoId = getYouTubeVideoId(content);
        if (videoId) {
          return <YouTubeEmbed videoId={videoId} />;
        }
      }
      
      // Handle Twitter/X URLs
      if (content.includes('twitter.com/') || content.includes('x.com/')) {
        // Check if it's a tweet URL with status in it
        if (content.includes('/status/')) {
          return <TwitterEmbed tweetUrl={content} />;
        }
      }
    }
    
    // Otherwise process as normal text with auto-linkify
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
          
          {/* Author */}
          <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
            Author: Johnny
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