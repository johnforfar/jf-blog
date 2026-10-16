import { useEffect } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

// Same pipeline johnforfar.com uses for these posts: markdown + GFM tables + the raw WordPress HTML.

type HastNode = {
  type: string
  tagName?: string
  value?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
}

const textOf = (node: HastNode): string =>
  node.type === 'text' ? node.value || '' : (node.children || []).map(textOf).join('')

// A paragraph that is nothing but a URL (bare or autolinked) -> that URL.
function standaloneUrl(node?: HastNode): string | null {
  const kids = (node?.children || []).filter(c => !(c.type === 'text' && !c.value?.trim()))
  if (kids.length !== 1) return null
  const only = kids[0]
  const text = textOf(only).trim()
  if (only.type === 'text') return /^https?:\/\/\S+$/.test(text) ? text : null
  if (only.tagName === 'a' && text === String(only.properties?.href || '')) return text
  return null
}

const youTubeId = (url: string) =>
  url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([\w-]{11})/)?.[1] ?? null

const isTweet = (url: string) => /^https?:\/\/(www\.)?(twitter|x)\.com\/\w+\/status\/\d+/.test(url)

const sized = (src?: string) =>
  src && src.startsWith('https://cdn.sanity.io/') && !src.includes('?') ? `${src}?w=1600&fit=max&auto=format` : src

type Props = { children?: React.ReactNode }

const components: Components = {
  // Element styles carried over from the old MDX renderer (no typography plugin on this site).
  h1: ({ children }: Props) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
  h2: ({ children }: Props) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
  h3: ({ children }: Props) => <h3 className="text-xl font-bold mt-5 mb-2">{children}</h3>,
  h4: ({ children }: Props) => <h4 className="text-lg font-bold mt-4 mb-2">{children}</h4>,
  ul: ({ children }: Props) => <ul className="list-disc pl-6 my-4">{children}</ul>,
  ol: ({ children }: Props) => <ol className="list-decimal pl-6 my-4">{children}</ol>,
  li: ({ children }: Props) => <li className="mb-1">{children}</li>,
  blockquote: ({ children }: Props) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 my-4 text-gray-700 dark:text-gray-300">{children}</blockquote>
  ),
  code: ({ children }: Props) => <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 text-sm">{children}</code>,
  pre: ({ children }: Props) => <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto my-4 text-sm">{children}</pre>,
  table: ({ children }: Props) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }: Props) => <th className="border-b-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-semibold">{children}</th>,
  td: ({ children }: Props) => <td className="border-b border-gray-200 dark:border-gray-700 px-3 py-2 align-top">{children}</td>,
  figure: ({ children }: Props) => <figure className="my-6">{children}</figure>,
  figcaption: ({ children }: Props) => <figcaption className="text-center text-sm text-gray-500 mt-2">{children}</figcaption>,
  hr: () => <hr className="my-8 border-gray-300 dark:border-gray-700" />,
  p({ node, children }) {
    const url = standaloneUrl(node as HastNode)
    const id = url && youTubeId(url)
    if (id) {
      return (
        <span className="block relative w-full pt-[56.25%] my-6 rounded-lg overflow-hidden">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            title="YouTube video"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </span>
      )
    }
    if (url && /\.(png|jpe?g|gif|webp)(\?.*)?$/i.test(url)) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={url} alt="" loading="lazy" className="rounded-xl mx-auto" />
    }
    if (url && isTweet(url)) {
      return (
        <blockquote className="twitter-tweet" data-dnt="true">
          <a href={url.replace(/\?.*$/, '')}>{url.replace(/\?.*$/, '')}</a>
        </blockquote>
      )
    }
    return <p className="my-4">{children}</p>
  },
  a({ href, children }) {
    return (
      <a href={href} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  },
  img({ src, alt }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={sized(typeof src === 'string' ? src : undefined)} alt={alt || ''} loading="lazy" className="rounded-md mx-auto my-6 max-w-full h-auto" />
  },
}

export default function Markdown({ content }: { content: string }) {
  const hasTweets = /(twitter|x)\.com\/\w+\/status\//.test(content)

  useEffect(() => {
    if (!hasTweets) return
    const w = window as unknown as { twttr?: { widgets?: { load: () => void } } }
    if (w.twttr?.widgets) {
      w.twttr.widgets.load()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    document.body.appendChild(script)
  }, [content, hasTweets])

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
      {content}
    </ReactMarkdown>
  )
}
