import { useState, useEffect, useRef, useCallback } from 'react'
import { getImageUrl, Post } from '../utils/api'
import { calculateReadTime } from '../utils/functions'
import BlogCard from './BlogCard'

export function AllPosts({ posts }: { posts: Post[] }) {
  const [columns, setColumns] = useState(6) // Default columns
  const [visiblePosts, setVisiblePosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const postsPerBatch = 24 // Load this many posts at a time
  const observer = useRef<IntersectionObserver | null>(null)
  const lastPostElementRef = useRef<HTMLDivElement>(null)
  
  // Sort posts in reverse chronological order (newest first)
  const sortedPosts = useCallback(() => {
    return [...posts].sort((a, b) => {
      // Extract dates from posts
      const dateA = a.date ? new Date(a.date).getTime() : 
                   a.slug.match(/^\d{4}-\d{2}-\d{2}/) ? 
                   new Date(a.slug.match(/^\d{4}-\d{2}-\d{2}/)![0]).getTime() : 0;
      
      const dateB = b.date ? new Date(b.date).getTime() : 
                   b.slug.match(/^\d{4}-\d{2}-\d{2}/) ? 
                   new Date(b.slug.match(/^\d{4}-\d{2}-\d{2}/)![0]).getTime() : 0;
      
      // Sort in reverse order (newest first)
      return dateB - dateA;
    });
  }, [posts]);
  
  // Initialize with first batch of posts
  useEffect(() => {
    const chronologicalPosts = sortedPosts();
    setVisiblePosts(chronologicalPosts.slice(0, postsPerBatch));
  }, [posts, sortedPosts, postsPerBatch]);
  
  // Function to load more posts
  const loadMorePosts = useCallback(() => {
    if (loading || visiblePosts.length >= posts.length) return
    
    setLoading(true)
    // Get sorted posts
    const chronologicalPosts = sortedPosts();
    
    // Simulate loading delay
    setTimeout(() => {
      const nextBatch = chronologicalPosts.slice(visiblePosts.length, visiblePosts.length + postsPerBatch)
      setVisiblePosts(prev => [...prev, ...nextBatch])
      setLoading(false)
      console.log(`Loaded ${nextBatch.length} more posts, total now: ${visiblePosts.length + nextBatch.length}`)
    }, 300)
  }, [loading, posts.length, visiblePosts.length, sortedPosts]);
  
  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (loading) return
    
    // Disconnect previous observer if it exists
    if (observer.current) {
      observer.current.disconnect()
    }
    
    // Create new observer
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visiblePosts.length < posts.length) {
        loadMorePosts()
      }
    }, { threshold: 0.5 })
    
    // Observe the sentinel element
    if (lastPostElementRef.current) {
      observer.current.observe(lastPostElementRef.current)
    }
    
    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [loading, loadMorePosts, visiblePosts.length, posts.length])
  
  // Adjust columns based on screen width
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth
      if (width < 640) {
        setColumns(1)
      } else if (width < 768) {
        setColumns(2)
      } else if (width < 1024) {
        setColumns(3)
      } else if (width < 1280) {
        setColumns(4)
      } else if (width < 1536) {
        setColumns(5)
      } else if (width < 1920) {
        setColumns(6) 
      } else if (width < 2560) {
        setColumns(8)
      } else {
        setColumns(10) // Super wide screens get 10 columns
      }
    }
    
    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [])

  // Update the parsePost function with better error handling and logging
  const parsePost = (post: Post) => {
    // Extract date from slug if available
    const dateMatch = post.slug.match(/^\d{4}-\d{2}-\d{2}/);
    const dateStr = dateMatch ? dateMatch[0] : undefined;
    
    // Clean slug to get title
    const cleanSlug = post.slug.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    const title = post.title || cleanSlug.replace(/-/g, ' ');
    
    // Normalize tags - ensure they're always an array
    let tags = post.tags || [];
    if (typeof tags === 'string') {
      // If tags is a string, split it into an array
      tags = tags.split(/[, ]+/).filter(Boolean);
      // Clean up the tags by removing quotes and brackets
      tags = tags.map(tag => tag.replace(/['"[\]]/g, '').trim());
    } else if (Array.isArray(tags)) {
      // Clean up the tags by removing quotes and brackets
      tags = tags.map(tag => typeof tag === 'string' ? tag.replace(/['"[\]]/g, '').trim() : tag);
    } else {
      // If tags is neither a string nor an array, make it an empty array
      tags = [];
    }
    
    // Calculate estimated read time based on summary length if available
    const readTime = post.summary ? calculateReadTime(post.summary) : null;
    
    const parsedPost = {
      ...post,
      title: title.charAt(0).toUpperCase() + title.slice(1),
      date: dateStr || post.date,
      tags: tags,
      readTime: readTime,
    };
    
    return parsedPost;
  };

  return (
    <div className="w-full px-0">
      {/* CSS Grid with auto-fill for responsive, pinterest-style layout */}
      <div 
        className="grid auto-rows-auto gap-4"
        style={{ 
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {visiblePosts.map((post) => {
          const parsedPost = parsePost(post)
          
          return (
            <BlogCard
              key={post.slug}
              title={parsedPost.title || ''}
              shortDescription={parsedPost.summary}
              coverImage={parsedPost.coverImage ? getImageUrl(parsedPost.coverImage) : undefined}
              slug={post.slug}
              date={parsedPost.date}
              readTime={parsedPost.readTime || undefined}
              tags={parsedPost.tags as string[]}
            />
          )
        })}
      </div>
      
      {/* Sentinel element for infinite scrolling - only show if more posts available */}
      {visiblePosts.length < posts.length && (
        <div 
          ref={lastPostElementRef}
          className="flex justify-center items-center py-6 w-full"
        >
          {loading ? (
            <div className="spinner" />
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">Scroll for more posts</div>
          )}
        </div>
      )}
      
      {/* Message when all posts are loaded */}
      {visiblePosts.length >= posts.length && posts.length > postsPerBatch && (
        <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
          That&apos;s all folks !
        </div>
      )}
    </div>
  )
} 