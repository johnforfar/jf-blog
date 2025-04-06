import matter from 'gray-matter'

export interface Post {
  slug: string
  title?: string
  date?: string
  tags?: string[] | string
  coverImage?: string
  summary?: string
  authors?: string[] | string
  fullPath?: string
}

// Define a more comprehensive FrontMatter interface
interface PostFrontMatter {
  title?: string;
  date?: string;
  description?: string;
  date_gmt?: string;
  summary?: string;
  [key: string]: unknown;
}

export async function fetchPost(slug: string): Promise<{
  content: string;
  frontMatter: PostFrontMatter;
}> {
  const baseUrl = typeof window === 'undefined'
    ? process.env.BACKEND_URL || 'http://localhost:3001'
    : ''
    
  const url = `${baseUrl}/api/posts/${slug}`
  console.log(`fetchPost - Fetching post: "${slug}" from ${url}`);

  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.error(`fetchPost - Error: Post "${slug}" not found (${response.status})`);
      throw new Error(`Failed to fetch post "${slug}" (${response.status})`)
    }
    
    const responseText = await response.text()
    
    // Check if response is JSON
    let parsedData;
    let isMDX = false;
    
    try {
      // Try to parse as JSON first
      parsedData = JSON.parse(responseText);
      console.log(`fetchPost - Response parsed as JSON`);
    } catch {
      // If not JSON, assume it's MDX with frontmatter
      isMDX = true;
      console.log(`fetchPost - Response is not JSON, treating as MDX`);
    }
    
    if (!isMDX && parsedData) {
      // It's a JSON object, extract content and frontmatter
      const content = parsedData.content || '';
      
      // Get date from the most reliable source
      const date = parsedData.date || 
                  (parsedData.frontMatter && parsedData.frontMatter.date) || 
                  extractDateFromData(parsedData, slug);
      
      return {
        content,
        frontMatter: {
          title: parsedData.title || (parsedData.frontMatter && parsedData.frontMatter.title) || slug.replace(/-/g, ' '),
          date,
          description: parsedData.description || parsedData.summary || 'No description available'
        }
      }
    } else {
      // Regular MDX processing with gray-matter
      const { data: frontMatter, content } = matter(responseText);
      
      return {
        content,
        frontMatter: {
          title: frontMatter?.title || slug.replace(/-/g, ' '),
          date: frontMatter?.date || extractDateFromData(frontMatter, slug),
          description: frontMatter?.description || 'No description available'
        }
      }
    }
  } catch (error) {
    console.error(`fetchPost - Error fetching "${slug}":`, error);
    throw error;
  }
}

// Helper function to extract date from various sources
interface DateSource {
  date?: string;
  frontMatter?: { date?: string };
  publishedAt?: string;
  [key: string]: unknown;
}

function extractDateFromData(data: DateSource, slug: string): string {
  // Try various date fields
  if (data?.date) return data.date;
  if (data?.frontMatter?.date) return data.frontMatter.date;
  if (data?.publishedAt) return data.publishedAt;
  
  // Try to extract from slug
  const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) return dateMatch[1];
  
  // Default to today's date
  return new Date().toISOString().split('T')[0];
}

export async function fetchPosts() {
  // For server-side requests, use the full backend URL
  const baseUrl = typeof window === 'undefined'
    ? process.env.BACKEND_URL || 'http://localhost:3001'
    : ''
  
  const url = `${baseUrl}/api/posts`;
  console.log('fetchPosts - Fetching posts from API');

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('fetchPosts - Error response:', response.status, errorText.substring(0, 100));
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }
    
    const posts = await response.json();
    console.log(`fetchPosts - Received ${posts.length} posts`);
    
    // Process and enhance the posts
    const processedPosts = posts.map((post: Post) => {
      // Make sure all expected fields exist
      const enhancedPost = {
        ...post,
        title: post.title || post.slug.replace(/-/g, ' '),
        date: post.date || new Date().toISOString(),
        coverImage: post.coverImage || null
      };
      
      return enhancedPost;
    });
    
    return processedPosts;
  } catch (error) {
    console.error('fetchPosts - Fetch error:', error);
    return [];
  }
}

export function getImageUrl(imagePath: string) {
  if (!imagePath || imagePath === '') {
    return '/placeholder-image.jpg';
  }
  
  // Check if the path already contains http:// or https://
  if (imagePath.match(/^https?:\/\//)) {
    return imagePath;
  }
  
  // Extract just the filename from the path
  const imageName = imagePath.replace(/^\.?\/images\//, '').split('/').pop();
  
  const baseUrl = typeof window !== 'undefined'
    ? 'http://localhost:3001'
    : (process.env.BACKEND_URL || 'http://localhost:3001');
  
  const fullUrl = `${baseUrl}/images/${imageName}`;
  
  return fullUrl;
}