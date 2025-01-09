import Link from 'next/link';

const themeConfig = {
  footer: <p>© {new Date().getFullYear()} John Forfar</p>,
  head: ({ title, meta }: { title: string; meta: { description?: string; tag?: string; author?: string } }) => (
    <>
      <title>{title}</title>
      {meta.description && (
        <meta name="description" content={meta.description} />
      )}
      {meta.tag && <meta name="keywords" content={meta.tag} />}
      {meta.author && <meta name="author" content={meta.author} />}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </>
  ),
  readMore: 'Read More →',
  postFooter: (
    <div>
      <Link href="/" className="text-blue-500 hover:underline">Back to Home</Link>
    </div>
  ),
  darkMode: true,
  navs: [
    {
      url: 'https://github.com/johnforfar/jf-blog',
      name: 'GitHub'
    }
  ],
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Johnny\'s Blog'
    }
  },
  basePath: process.env.NODE_ENV === 'production' ? '/jf-blog' : ''
}

export default themeConfig