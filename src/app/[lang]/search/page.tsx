import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ClientSearch } from '@/components/ClientSearch'
import { assertLocale, uiMessages } from '@/lib/i18n'
import { getPostsByLocale } from '@/lib/posts'

type SearchPageProps = Readonly<{
  params: Promise<{ lang: string }>
}>

export async function generateMetadata(props: SearchPageProps) {
  const resolvedParams = await props.params
  const locale = assertLocale(resolvedParams?.lang ?? '')

  if (!locale) {
    return {}
  }

  return {
    title: uiMessages[locale].search
  }
}

export default async function SearchPage(props: SearchPageProps) {
  const resolvedParams = await props.params
  const locale = assertLocale(resolvedParams?.lang ?? '')

  if (!locale) {
    notFound()
  }

  const posts = await getPostsByLocale(locale)

  return (
    <div data-pagefind-ignore="all">
      <h1>{uiMessages[locale].search}</h1>
      <p style={{ marginBottom: 16, opacity: 0.75 }}>
        {locale === 'zh'
          ? '搜索基于静态索引，可直接使用下方输入框。'
          : 'Search runs on a static index and works directly in the input below.'}
      </p>

      <div className="not-prose" style={{ marginBottom: 28 }}>
        <ClientSearch />
      </div>

      <h2 style={{ marginBottom: 12 }}>{locale === 'zh' ? '最新文章' : 'Latest posts'}</h2>
      {posts.length === 0 ? (
        <p>{uiMessages[locale].emptyPosts}</p>
      ) : (
        posts.map(post => (
          <article key={post.route} style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 8 }}>
              <Link href={post.route}>{post.title}</Link>
            </h3>
            <p style={{ marginTop: 0, marginBottom: 6 }}>{post.summary}</p>
            <time style={{ opacity: 0.65 }}>{post.date}</time>
          </article>
        ))
      )}

      <p style={{ marginTop: 24 }}>
        <Link href={`/${locale}/posts`}>{uiMessages[locale].posts}</Link>
      </p>
    </div>
  )
}
