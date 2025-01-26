import { CodeWallet } from './CodeWallet'
import { SliderTips } from './SliderTips'

interface BlogLayoutProps {
  children: React.ReactNode
  frontMatter: {
    title: string
    date: string
    description: string
  }
}

export default function BlogLayout({ children, frontMatter }: BlogLayoutProps) {
  const title = frontMatter?.title || 'Untitled Post'
  const date = frontMatter?.date ? 
    new Date(frontMatter.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) 
    : 'Date not available'
  //const description = frontMatter?.description || 'No description available'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="prose lg:prose-xl dark:prose-invert">
        <h1>{title}</h1>
        <div className="text-gray-600 dark:text-gray-400 mb-8">
          {date}
        </div>
        {children}
        <div className="mt-8">
          <SliderTips defaultAmount={1.00} minAmount={0.10} maxAmount={10.00} />
          <CodeWallet amount={1.00} />
        </div>
      </article>
    </div>
  )
} 