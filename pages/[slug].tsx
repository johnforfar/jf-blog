import BlogLayout from '../components/BlogLayout'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { fetchPost, fetchPosts } from '../utils/api'
import type { Post } from '../utils/api'
import { CodeWallet } from '../components/CodeWallet'
import { MDXImage } from '../components/MDXImage'

// Add this type for MDX component props
type MDXComponentProps = {
  children?: React.ReactNode;
  [key: string]: unknown;
};

// Updated components with proper typing
const components = {
  // Custom components
  CodeWallet,
  
  // Standard Markdown elements with styling
  h1: (props: MDXComponentProps) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
  h2: (props: MDXComponentProps) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
  h3: (props: MDXComponentProps) => <h3 className="text-xl font-bold mt-5 mb-2" {...props} />,
  h4: (props: MDXComponentProps) => <h4 className="text-lg font-bold mt-4 mb-2" {...props} />,
  p: (props: MDXComponentProps) => <p className="my-4" {...props} />,
  a: (props: MDXComponentProps) => <a className="text-blue-500 hover:underline" {...props} target="_blank" rel="noopener noreferrer" />,
  ul: (props: MDXComponentProps) => <ul className="list-disc pl-6 my-4" {...props} />,
  ol: (props: MDXComponentProps) => <ol className="list-decimal pl-6 my-4" {...props} />,
  li: (props: MDXComponentProps) => <li className="mb-1" {...props} />,
  blockquote: (props: MDXComponentProps) => <blockquote className="border-l-4 border-gray-300 pl-4 my-4 text-gray-700 dark:text-gray-300" {...props} />,
  code: (props: MDXComponentProps) => <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5" {...props} />,
  pre: (props: MDXComponentProps) => <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto my-4" {...props} />,
  img: MDXImage,
}

// Update the frontMatter interface at the top of the file
interface FrontMatter {
  title: string;
  date: string;
  description: string;
  date_gmt?: string;
  summary?: string;
  coverImage?: string;
  tags?: string[];
  categories?: string[];
  [key: string]: unknown;
}

interface PostProps {
  source: MDXRemoteSerializeResult | null
  frontMatter: FrontMatter
  mdxError?: string
  errorContext?: string
}

export default function Post({ source, frontMatter, mdxError, errorContext }: PostProps) {
  if (!frontMatter) {
    return (
      <BlogLayout 
        frontMatter={{
          title: 'Loading...',
          date: new Date().toISOString(),
          description: 'Loading post content'
        }}
      >
        <div>Loading...</div>
      </BlogLayout>
    )
  }

  // Handle MDX parsing errors
  if (mdxError) {
    return (
      <BlogLayout frontMatter={frontMatter}>
        <div className="error-container bg-red-50 dark:bg-red-900 p-4 rounded-md mb-6">
          <h2 className="text-lg font-bold text-red-700 dark:text-red-300 mb-2">Error Loading Post</h2>
          <p className="text-red-600 dark:text-red-200 mb-4">
            There was an error rendering this post content. Please try again later.
          </p>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-red-500 dark:text-red-300">
              Technical Details
            </summary>
            <pre className="mt-2 p-3 bg-red-100 dark:bg-red-950 text-xs overflow-auto rounded">
              {mdxError}
            </pre>
            {errorContext && (
              <div className="mt-2">
                <p className="text-sm text-red-500 dark:text-red-300">Problematic content:</p>
                <pre className="mt-1 p-3 bg-red-100 dark:bg-red-950 text-xs overflow-auto rounded">
                  {errorContext}
                </pre>
              </div>
            )}
          </details>
        </div>
      </BlogLayout>
    )
  }

  // Handle missing source but no explicit error (shouldn't happen, but just in case)
  if (!source) {
    return (
      <BlogLayout frontMatter={frontMatter}>
        <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-md">
          <p className="text-yellow-700 dark:text-yellow-300">
            Post content is unavailable. Please try again later.
          </p>
        </div>
      </BlogLayout>
    )
  }

  return (
    <BlogLayout frontMatter={frontMatter}>
      <div className="mdx-content">
        <MDXRemote {...source} components={components} />
      </div>
    </BlogLayout>
  )
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  if (!params?.slug) {
    console.error('getStaticProps - No slug parameter provided');
    return { notFound: true }
  }

  console.log(`getStaticProps - Attempting to fetch post with slug: "${params.slug}"`);

  try {
    const { content: originalContent, frontMatter } = await fetchPost(params.slug)
    
    if (!originalContent) {
      console.error(`getStaticProps - No content found for: "${params.slug}"`);
      return { notFound: true }
    }

    console.log(`getStaticProps - Successfully fetched post: "${params.slug}"`);

    // Pre-process content to fix common MDX parsing issues
    let content = originalContent;
    
    // Check if content is actually a JSON string and extract content if needed
    if (typeof content === 'string' && content.trim().startsWith('{') && content.trim().endsWith('}')) {
      try {
        const parsedJson = JSON.parse(content);
        if (parsedJson.content) {
          content = parsedJson.content;
          console.log(`getStaticProps - Extracted content from JSON wrapper`);
        }
      } catch (jsonError) {
        console.error(`getStaticProps - Content looks like JSON but failed to parse:`, jsonError);
      }
    }
    
    // Clean up content for MDX processing
    content = content.replace(/\\\_/g, '_'); // Fix escaped underscores
    content = content.replace(/\\(?![\\`*_{}\[\]()<>#+-.!|])/g, ''); // Remove unnecessary escapes
    
    try {
      // Make sure we're using the proper MDX options
      const mdxSource = await serialize(content, {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [],
          rehypePlugins: [],
          format: 'mdx', // Ensure format is set to mdx
          development: process.env.NODE_ENV === 'development'
        },
      })

      // Extract the correct date from frontmatter
      const postDate = frontMatter.date || 
                       (frontMatter.date_gmt ? new Date(frontMatter.date_gmt).toISOString() : null) ||
                       extractDateFromSlug(params.slug);

      console.log('BLOG POST PROPS:', {
        slug: params.slug,
        title: frontMatter.title,
        date: postDate,
        tags: frontMatter.tags,
        categories: frontMatter.categories,
        authors: frontMatter.authors
      });

      return {
        props: {
          source: mdxSource,
          frontMatter: {
            ...frontMatter,
            title: frontMatter.title || params.slug.replace(/-/g, ' '),
            date: postDate,
            description: frontMatter.description || frontMatter.summary || 'No description available'
          }
        }
      }
    } catch (mdxError) {
      // Handle MDX compilation errors
      console.error(`getStaticProps - MDX compilation error:`, mdxError);
      
      // Add more detailed logging
      console.error(`getStaticProps - First 200 characters of problematic content: "${content.substring(0, 200)}..."`);
      
      return {
        props: {
          source: null,
          frontMatter: {
            ...frontMatter,
            title: frontMatter.title || params.slug.replace(/-/g, ' '),
            date: frontMatter.date || extractDateFromSlug(params.slug),
            description: 'Error displaying this post'
          },
          mdxError: mdxError instanceof Error ? mdxError.message : 'Error compiling MDX content',
          errorContext: content.substring(0, 500) || ''
        }
      }
    }
  } catch (error) {
    console.error(`getStaticProps - Error fetching "${params.slug}":`, error);
    return { notFound: true }
  }
}

// Helper function to extract date from slug
function extractDateFromSlug(slug: string) {
  // Try to extract date from slug format like 'yyyy-mm-dd-post-title'
  const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) {
    return dateMatch[1]; // Return the matched date as-is
  }
  
  // If no date in slug, return a default date
  return new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
}

export async function getStaticPaths() {
  try {
    const posts = await fetchPosts()
    console.log(`getStaticPaths - Got ${posts.length} posts`);
    
    const paths = posts.map((post: Post) => {
      // Use the exact slug without any cleaning, but don't log every path
      return { params: { slug: post.slug } }
    })
    
    console.log(`getStaticPaths - Generated ${paths.length} paths`);
    
    return {
      paths,
      fallback: 'blocking'
    }
  } catch (error) {
    console.error('getStaticPaths - Error:', error)
    return {
      paths: [],
      fallback: 'blocking'
    }
  }
}