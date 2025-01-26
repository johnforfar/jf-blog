import { SliderTips } from '../components/SliderTips'
import { fetchPosts } from '../utils/api'
import { AllPosts } from '../components/AllPosts'
import Image from 'next/image'
import type { Post } from '../utils/api'

interface HomePageProps {
  initialPosts: Post[]
}

export default function HomePage({ initialPosts }: HomePageProps) {
  return (
    <div>
      <h1>Johnnys Blog</h1>
      <p>Welcome to my blog about code and technology.</p>
      <p>Please click the blog post and then TIP me with code wallet !</p>
      <SliderTips defaultAmount={1.00} minAmount={0.10} maxAmount={10.00} />
      
      <AllPosts posts={initialPosts} />
      
      <div className="mt-8">
        <p>If you would like to run your own blog, please check out the <a href="https://github.com/johnforfar/jf-blog/blob/main/README.md" className="text-blue-500 hover:underline">README</a> for instructions.</p>
        <p>You can fork it and host it for free on GitHub or Vercel !</p>
        <p>Thanks 🫡</p>
        
        <Image 
          src="/pump-kin-meme.jpeg"
          alt="Pumpkin Meme"
          width={500}
          height={300}
          className="mt-4"
        />
      </div>
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