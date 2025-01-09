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
    </>
  ),
  readMore: 'Read More →',
  postFooter: null,
  darkMode: true,
  navs: [
    {
      url: 'https://github.com/johnforfar/jf-blog',
      name: 'GitHub'
    }
  ]
}

export default themeConfig