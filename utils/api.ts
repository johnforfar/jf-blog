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

/**
 * Fetch a post by slug from the API
 */
export async function fetchPost(slug: string): Promise<{
  content: string;
  frontMatter: PostFrontMatter;
}> {
  const baseUrl = typeof window === 'undefined'
    ? process.env.BACKEND_URL || 'http://localhost:3001'
    : '';
    
  const url = `${baseUrl}/api/posts/${slug}`;
  console.log(`fetchPost - Fetching post: "${slug}" from ${url}`);

  try {
    // Prepare headers for future API key authentication
    const headers: HeadersInit = {
      'Accept': 'application/json, text/plain',
      // Uncomment when API key is implemented
      // 'Authorization': `Bearer ${process.env.API_KEY || ''}`,
    };

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      console.error(`fetchPost - Error: Post "${slug}" not found (${response.status})`);
      throw new Error(`Failed to fetch post "${slug}" (${response.status})`);
    }
    
    const responseText = await response.text();
    
    // First try to parse as JSON
    try {
      // Parse response as JSON
      const parsedData = JSON.parse(responseText);
      console.log(`fetchPost - Response parsed as JSON`);
      
      // Log the FULL structure to debug
      console.log('FULL PARSED DATA:', parsedData);
      
      // Extract content
      const content = typeof parsedData.content === 'string' 
        ? parsedData.content 
        : '';
      
      // The metadata is nested inside a "metadata" object, not at the root level
      const metadataSource = parsedData.metadata || {};
      
      // Create normalized frontmatter from the properly accessed metadata
      const frontMatter = {
        title: metadataSource.title || parsedData.title || slug.replace(/-/g, ' '),
        date: metadataSource.date || parsedData.date || new Date().toISOString().split('T')[0],
        description: metadataSource.summary || metadataSource.description || 
                    parsedData.description || parsedData.summary || 'No description available',
        tags: Array.isArray(metadataSource.tags) ? metadataSource.tags : [],
        categories: Array.isArray(metadataSource.categories) ? metadataSource.categories : [],
        coverImage: metadataSource.coverImage || parsedData.coverImage || null,
        // Include any additional properties
        ...(typeof metadataSource.authors !== 'undefined' ? { authors: metadataSource.authors } : {})
      };
      
      console.log('NORMALIZED DATA:', frontMatter);
      
      return {
        content,
        frontMatter
      };
    } 
    // If not JSON, handle as MDX with frontmatter
    catch {
      console.log(`fetchPost - Response is not JSON, treating as MDX`);
      
      // Process using gray-matter for MDX files
      const { data: frontMatter, content } = matter(responseText);
      
      console.log('MDX PARSING DATA:', {
        title: frontMatter?.title,
        date: frontMatter?.date,
        tags: frontMatter?.tags,
        categories: frontMatter?.categories
      });
      
      // Normalize tags and categories for MDX as well
      let tags = [];
      if (Array.isArray(frontMatter.tags)) {
        tags = frontMatter.tags;
      } else if (typeof frontMatter.tags === 'string') {
        tags = frontMatter.tags.split(',').map((tag: string) => tag.trim());
      }
      
      let categories = [];
      if (Array.isArray(frontMatter.categories)) {
        categories = frontMatter.categories;
      } else if (typeof frontMatter.categories === 'string') {
        categories = frontMatter.categories.split(',').map((cat: string) => cat.trim());
      }
      
      return {
        content,
        frontMatter: {
          ...frontMatter,
          title: frontMatter?.title || slug.replace(/-/g, ' '),
          date: frontMatter?.date || extractDateFromData(frontMatter, slug),
          description: frontMatter?.description || 'No description available',
          tags: tags,
          categories: categories,
          coverImage: frontMatter?.coverImage || null
        }
      };
    }
  } catch (error) {
    console.error(`fetchPost - Error fetching "${slug}":`, error);
    // Return a fallback to prevent the app from crashing
    return {
      content: '',
      frontMatter: {
        title: slug.replace(/-/g, ' '),
        date: new Date().toISOString().split('T')[0],
        description: 'Failed to load post',
        tags: [],
        categories: [],
        coverImage: null
      }
    };
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