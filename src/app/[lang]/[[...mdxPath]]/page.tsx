import { importPage } from 'nextra/pages'
import { notFound } from 'next/navigation'
import { useMDXComponents as getMDXComponents } from '../../../../mdx-components'
import { assertLocale, locales } from '@/lib/i18n'
import { getPostsByLocale } from '@/lib/posts'

type PageProps = Readonly<{
  params: Promise<{ mdxPath: string[]; lang: string }>
}>

export async function generateMetadata(props: PageProps) {
  const resolvedParams = await props.params
  const locale = assertLocale(resolvedParams?.lang ?? '')
  const mdxPath = resolvedParams?.mdxPath ?? []

  if (!locale) {
    notFound()
  }

  const { metadata } = await importPage([locale, ...mdxPath])
  return metadata
}

const Wrapper = getMDXComponents().wrapper

export default async function Page(props: PageProps) {
  const resolvedParams = await props.params
  const locale = assertLocale(resolvedParams?.lang ?? '')
  const mdxPath = resolvedParams?.mdxPath ?? []

  if (!locale) {
    notFound()
  }

  const { default: MDXContent, toc, metadata, sourceCode } = await importPage([locale, ...mdxPath])

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={{ mdxPath, lang: locale }} />
    </Wrapper>
  )
}

export async function generateStaticParams() {
  const params: Array<{ lang: string; mdxPath: string[] }> = []

  for (const locale of locales) {
    params.push({ lang: locale, mdxPath: [] })
    params.push({ lang: locale, mdxPath: ['about'] })

    const posts = await getPostsByLocale(locale)
    for (const post of posts) {
      params.push({ lang: locale, mdxPath: ['posts', post.slug] })
    }
  }

  return params
}
