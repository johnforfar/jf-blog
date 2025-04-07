import { SliderTips } from '../components/SliderTips'
import { fetchPosts } from '../utils/api'
import { AllPosts } from '../components/AllPosts'
import type { Post } from '../utils/api'
import Link from 'next/link'
import { useMemo } from 'react'

interface HomePageProps {
  initialPosts: Post[]
}

export default function HomePage({ initialPosts }: HomePageProps) {
  // Extract unique categories
  const uniqueCategories = useMemo(() => {
    // Get all categories
    const categories = initialPosts
      .flatMap(post => {
        if (Array.isArray(post.categories)) return post.categories
        if (typeof post.categories === 'string') return [post.categories]
        return []
      })
      .filter(Boolean)
    
    // Make them unique
    return [...new Set(categories)]
  }, [initialPosts])
  
  return (
    <div className="w-full">
      <header className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-4">
        <div className="w-full px-4 max-w-screen-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-6 mb-2">Johnny&apos;s Blog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-3">John Forfar is a Dev Rel in AI, Web3 & Gaming</p>
          
          <div className="flex gap-4 mb-4">
            {/* Twitter - Blue by default, white on hover */}
            <a 
              href="https://x.com/johnforfar" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center text-blue-500 dark:text-blue-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>@johnforfar</span>
            </a>
            
            {/* YouTube - Red by default, white on hover */}
            <a 
              href="https://www.youtube.com/@John-Forfar" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center text-red-600 dark:text-red-500 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>YouTube Channel</span>
            </a>
            
            {/* GitHub - Black/Gray by default, white on hover */}
            <a 
              href="https://github.com/johnforfar" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center text-gray-900 dark:text-gray-200 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </a>
          </div>
          
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg p-4 shadow-md mb-4">
            <p className="text-base mb-2">Welcome to my blog about code and technology.</p>
            <p className="text-base mb-2">Please click the blog post and then TIP me with code wallet !</p>
            <SliderTips defaultAmount={1.00} minAmount={0.10} maxAmount={10.00} />
          </div>
          
          {/* Categories section */}
          <div className="mt-4 mb-3">
            <h3 className="text-base font-semibold mb-2">Categories:</h3>
            <div className="flex flex-wrap gap-2">
              {uniqueCategories.map(category => {
                // Format the category display name
                const displayName = category
                  .split('-')
                  .map(word => {
                    // Special case for AI & NFT
                    if (word.toLowerCase() === 'ai') return 'AI';
                    if (word.toLowerCase() === 'nft') return 'NFT';
                    // Capitalize first letter of each word
                    return word.charAt(0).toUpperCase() + word.slice(1);
                  })
                  .join(' ');
                
                return (
                  <Link 
                    key={`cat-${category}`}
                    href={`/?category=${category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-2 py-1 bg-gradient-to-r from-green-700 to-purple-800 hover:from-green-800 hover:to-purple-900 text-white rounded-md transition-all duration-200 text-sm shadow-sm hover:shadow font-medium"
                  >
                    {displayName}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </header>
      
      <AllPosts posts={initialPosts} />
      
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 pb-8">
        <div className="w-full px-4 max-w-screen-2xl mx-auto text-center">
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-3">John Forfar is a Dev Rel in AI, Web3 & Gaming</p>
          
          <div className="flex gap-4 mb-4 justify-center">
            {/* Twitter - Blue by default, white on hover */}
            <a 
              href="https://x.com/johnforfar" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center text-blue-500 dark:text-blue-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>@johnforfar</span>
            </a>
            
            {/* YouTube - Red by default, white on hover */}
            <a 
              href="https://www.youtube.com/@John-Forfar" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center text-red-600 dark:text-red-500 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>YouTube Channel</span>
            </a>
            
            {/* GitHub - Black/Gray by default, white on hover */}
            <a 
              href="https://github.com/johnforfar" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center text-gray-900 dark:text-gray-200 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </a>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Johnny&apos;s Blog. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  try {
    const posts = await fetchPosts()
    return {
      props: {
        initialPosts: posts || []
      },
      revalidate: 60
    }
  } catch (error) {
    console.error('getStaticProps - Error:', error)
    return {
      props: {
        initialPosts: []
      }
    }
  }
} 