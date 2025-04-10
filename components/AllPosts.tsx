import { useState, useEffect, useRef, useCallback } from 'react'
import { getImageUrl, Post } from '../utils/api'
import { calculateReadTime } from '../utils/functions'
import BlogCard from './BlogCard'
import { useRouter } from 'next/router'

export function AllPosts({ 
  posts,
  parentFilter = null // Add default value to make it optional
}: { 
  posts: Post[],
  parentFilter?: string | null  // Add the optional prop with the right type
}) {
  const router = useRouter()
  const { tag, category } = router.query
  const [columns, setColumns] = useState(6) // Default columns
  const [visiblePosts, setVisiblePosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const postsPerBatch = 24 // Load this many posts at a time
  const observer = useRef<IntersectionObserver | null>(null)
  const lastPostElementRef = useRef<HTMLDivElement>(null)
  
  // Sort filtered posts in reverse chronological order (newest first)
  const sortFiltered = useCallback((postsToSort: Post[]) => {
    return [...postsToSort].sort((a, b) => {
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
  }, []);
  
  // Apply filters based on URL parameters
  useEffect(() => {
    const filterPosts = () => {
      // Start with all posts
      let filtered = [...posts]
      
      // Filter by tag if present
      if (tag && typeof tag === 'string') {
        const normalizedTag = tag.toLowerCase().replace(/\s+/g, '-')
        filtered = filtered.filter(post => {
          // Ensure tags is an array and normalize them for comparison
          const postTags = Array.isArray(post.tags) 
            ? post.tags 
            : typeof post.tags === 'string' 
              ? [post.tags] 
              : []
              
          return postTags.some(t => 
            (typeof t === 'string' && t.toLowerCase().replace(/\s+/g, '-') === normalizedTag)
          )
        })
      }
      
      // Filter by category if present
      if (category && typeof category === 'string') {
        const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-')
        filtered = filtered.filter(post => {
          // Ensure categories is an array and normalize them for comparison
          const postCategories = Array.isArray(post.categories) 
            ? post.categories 
            : typeof post.categories === 'string' 
              ? [post.categories] 
              : []
              
          return postCategories.some((c: string) => 
            (typeof c === 'string' && c.toLowerCase().replace(/\s+/g, '-') === normalizedCategory)
          )
        })
      }
      
      // Apply parent filter if present
      if (parentFilter) {
        filtered = filtered.filter(post => {
          // Get categories from the post
          const postCategories = Array.isArray(post.categories) 
            ? post.categories 
            : typeof post.categories === 'string' 
              ? [post.categories] 
              : []
          
          // Check if any category matches the parent filter criteria
          return postCategories.some(c => {
            if (typeof c !== 'string') return false;
            const lowerCategory = c.toLowerCase();
            
            switch(parentFilter) {
              case 'solana':
                return lowerCategory.includes('solana');
              case 'ai':
                return lowerCategory.startsWith('ai') || 
                       lowerCategory.startsWith('ai-') || 
                       lowerCategory.endsWith('-ai');
              case 'ethereum':
                return lowerCategory.includes('eth') || 
                       lowerCategory.includes('evm') || 
                       lowerCategory.includes('ethereum');
              case 'gaming':
                return lowerCategory.includes('game') || 
                       lowerCategory.includes('gaming') || 
                       lowerCategory.includes('metaverse');
              default:
                return false;
            }
          });
        });
      }
      
      // Update filtered posts
      setFilteredPosts(filtered)
      
      // Reset visible posts when filters change
      const chronologicalPosts = sortFiltered(filtered)
      setVisiblePosts(chronologicalPosts.slice(0, postsPerBatch))
    }
    
    filterPosts()
    // Add router.query and parentFilter to the dependency array
  }, [posts, tag, category, parentFilter, sortFiltered])
    
  // Sort posts in reverse chronological order (newest first)
  const sortedPosts = useCallback(() => {
    return sortFiltered(filteredPosts);
  }, [filteredPosts, sortFiltered]);
  
  // Function to load more posts
  const loadMorePosts = useCallback(() => {
    if (loading || visiblePosts.length >= filteredPosts.length) return
    
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
  }, [loading, filteredPosts.length, visiblePosts.length, sortedPosts]);
  
  // Update observer to watch filtered post count
  useEffect(() => {
    if (loading) return
    
    // Disconnect previous observer if it exists
    if (observer.current) {
      observer.current.disconnect()
    }
    
    // Create new observer
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visiblePosts.length < filteredPosts.length) {
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
  }, [loading, loadMorePosts, visiblePosts.length, filteredPosts.length])
  
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
      {/* Display filter information if filtering is active */}
      {(tag || category) && (
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold mb-2">
            {tag && <span>Posts tagged with <span className="text-blue-600 dark:text-blue-400">#{tag}</span></span>}
            {category && <span>Posts in category <span className="text-blue-600 dark:text-blue-400">{category}</span></span>}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
          </p>
          <button 
            className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            onClick={() => router.push('/')}
          >
            Clear filters
          </button>
        </div>
      )}

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
              coverImage={parsedPost.coverImage ? getImageUrl(parsedPost.coverImage) ?? undefined : undefined}
              slug={post.slug}
              date={parsedPost.date || undefined}
              readTime={parsedPost.readTime || undefined}
              tags={parsedPost.tags as string[]}
            />
          )
        })}
      </div>
      
      {/* Sentinel element for infinite scrolling - only show if more posts available */}
      {visiblePosts.length < filteredPosts.length && (
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
      {visiblePosts.length >= filteredPosts.length && filteredPosts.length > 0 && (
        <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
          That&apos;s all folks !
        </div>
      )}

      {/* No results message */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No posts found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            No posts match the current filter criteria.
          </p>
        </div>
      )}
    </div>
  )
} 