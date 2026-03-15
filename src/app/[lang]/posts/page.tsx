import Link from 'next/link'
import { notFound } from 'next/navigation'
import { assertLocale, uiMessages } from '@/lib/i18n'
import { getPostsByLocale, getTagsByLocale } from '@/lib/posts'

type PostsPageProps = Readonly<{
  params: Promise<{ lang: string }>
}>

export async function generateMetadata(props: PostsPageProps) {
  const resolvedParams = await props.params
  const locale = assertLocale(resolvedParams?.lang ?? '')

  if (!locale) {
    return {}
  }

  return {
    title: uiMessages[locale].posts
  }
}

export default async function PostsPage(props: PostsPageProps) {
  const resolvedParams = await props.params
  const locale = assertLocale(resolvedParams?.lang ?? '')

  if (!locale) {
    notFound()
  }

  const posts = await getPostsByLocale(locale)
  const tags = await getTagsByLocale(locale)
  const t = uiMessages[locale]

  return (
    <div data-pagefind-ignore="all">
      <h1>{t.posts}</h1>

      <p style={{ opacity: 0.75, marginBottom: 16 }}>
        {locale === 'zh'
          ? '当前页面为静态构建结果，全文检索请使用导航栏搜索。'
          : 'This page is statically generated. Use the navbar search for full-text lookup.'}
      </p>

      <div className="not-prose" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {tags.map(item => (
          <Link
            key={item.tag}
            href={`/${locale}/tags/${encodeURIComponent(item.tag)}`}
            className="nextra-tag"
          >
            {item.tag} ({item.count})
          </Link>
        ))}
      </div>

      {posts.length === 0 ? <p>{t.emptyPosts}</p> : null}

      {posts.map(post => (
        <article
          key={post.route}
          style={{
            padding: '18px 20px',
            border: '1px solid rgba(135, 162, 132, 0.25)',
            borderRadius: 16,
            background: 'rgba(255, 255, 255, 0.75)',
            marginBottom: 14
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>
            <Link href={post.route}>{post.title}</Link>
          </h3>
          <time style={{ display: 'block', opacity: 0.6, marginBottom: 10 }}>{post.date}</time>
          <p style={{ marginTop: 0, marginBottom: 10 }}>{post.summary}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {post.tags.map(tag => (
              <Link key={tag} href={`/${locale}/tags/${encodeURIComponent(tag)}`} className="nextra-tag">
                {tag}
              </Link>
            ))}
          </div>
        </article>
      ))}
    </div>
  )
}
