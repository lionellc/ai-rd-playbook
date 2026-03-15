import Link from 'next/link'
import { notFound } from 'next/navigation'
import { assertLocale, uiMessages } from '@/lib/i18n'
import { getAllPosts, getPostsByLocale } from '@/lib/posts'

type TagPageProps = Readonly<{
  params: Promise<{ lang: string; tag: string }>
}>

export async function generateStaticParams() {
  const posts = await getAllPosts()
  const seen = new Set<string>()
  const params: Array<{ lang: string; tag: string }> = []

  for (const post of posts) {
    for (const tag of post.tags) {
      const key = `${post.locale}:${tag}`
      if (!seen.has(key)) {
        seen.add(key)
        params.push({ lang: post.locale, tag })
      }
    }
  }

  return params
}

export async function generateMetadata(props: TagPageProps) {
  const resolvedParams = await props.params
  const locale = assertLocale(resolvedParams?.lang ?? '')
  const tag = resolvedParams?.tag ?? ''

  if (!locale) {
    return {}
  }

  return {
    title: `${uiMessages[locale].tags}: ${decodeURIComponent(tag)}`
  }
}

export default async function TagPage(props: TagPageProps) {
  const resolvedParams = await props.params
  const locale = assertLocale(resolvedParams?.lang ?? '')
  const tag = resolvedParams?.tag ?? ''

  if (!locale) {
    notFound()
  }

  const decodedTag = decodeURIComponent(tag)
  const posts = (await getPostsByLocale(locale)).filter(post => post.tags.includes(decodedTag))
  const t = uiMessages[locale]

  return (
    <div data-pagefind-ignore="all">
      <h1>
        {t.tags}: {decodedTag}
      </h1>
      <p style={{ marginBottom: 18 }}>
        <Link href={`/${locale}/posts`}>{t.posts}</Link>
      </p>
      {posts.length === 0 ? <p>{t.emptyPosts}</p> : null}
      {posts.map(post => (
        <article key={post.route} style={{ marginBottom: 16 }}>
          <h3 style={{ marginBottom: 8 }}>
            <Link href={post.route}>{post.title}</Link>
          </h3>
          <p style={{ marginTop: 0, marginBottom: 6 }}>{post.summary}</p>
          <time style={{ opacity: 0.65 }}>{post.date}</time>
        </article>
      ))}
    </div>
  )
}
