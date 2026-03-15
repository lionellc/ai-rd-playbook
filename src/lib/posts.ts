import fs from 'node:fs/promises'
import path from 'node:path'
import { cache } from 'react'
import matter from 'gray-matter'
import { locales, type Locale } from '@/lib/i18n'

const postsRoot = path.join(process.cwd(), 'src', 'content')

type RawFrontMatter = {
  title?: string
  date?: string | Date
  summary?: string
  description?: string
  tags?: string[]
}

export type PostItem = {
  slug: string
  locale: Locale
  title: string
  date: string
  summary: string
  tags: string[]
  route: string
  contentText: string
}

function normalizeText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[>#*_\-\[\]()/!]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function isPostFile(fileName: string): boolean {
  return fileName.endsWith('.mdx') && !fileName.startsWith('_') && fileName !== 'index.mdx'
}

async function readPost(locale: Locale, fileName: string): Promise<PostItem | null> {
  const fullPath = path.join(postsRoot, locale, 'posts', fileName)
  const source = await fs.readFile(fullPath, 'utf-8')
  const { data, content } = matter(source)
  const frontMatter = data as RawFrontMatter
  const slug = fileName.replace(/\.mdx$/, '')

  if (!frontMatter.title || !frontMatter.date) {
    return null
  }

  const normalizedDate =
    frontMatter.date instanceof Date
      ? frontMatter.date.toISOString().slice(0, 10)
      : String(frontMatter.date)

  return {
    slug,
    locale,
    title: frontMatter.title,
    date: normalizedDate,
    summary: frontMatter.summary ?? frontMatter.description ?? '',
    tags: Array.isArray(frontMatter.tags) ? frontMatter.tags : [],
    route: `/${locale}/posts/${slug}`,
    contentText: normalizeText(content)
  }
}

export const getPostsByLocale = cache(async (locale: Locale): Promise<PostItem[]> => {
  const localeDir = path.join(postsRoot, locale, 'posts')
  let files: string[] = []

  try {
    files = await fs.readdir(localeDir)
  } catch {
    return []
  }

  const posts = await Promise.all(
    files.filter(isPostFile).map(async fileName => {
      try {
        return await readPost(locale, fileName)
      } catch {
        return null
      }
    })
  )

  return posts
    .filter((post): post is PostItem => post !== null)
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))
})

export const getAllPosts = cache(async (): Promise<PostItem[]> => {
  const all = await Promise.all(locales.map(locale => getPostsByLocale(locale)))
  return all.flat()
})

export async function getTagsByLocale(locale: Locale): Promise<Array<{ tag: string; count: number }>> {
  const posts = await getPostsByLocale(locale)
  const counter = new Map<string, number>()

  for (const post of posts) {
    for (const tag of post.tags) {
      counter.set(tag, (counter.get(tag) ?? 0) + 1)
    }
  }

  return [...counter.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

export async function getPostBySlug(locale: Locale, slug: string): Promise<PostItem | null> {
  const posts = await getPostsByLocale(locale)
  return posts.find(post => post.slug === slug) ?? null
}

export function filterPosts(posts: PostItem[], query: string): PostItem[] {
  const keyword = query.trim().toLowerCase()
  if (!keyword) return posts

  return posts.filter(post => {
    const haystack = `${post.title}\n${post.summary}\n${post.tags.join(' ')}\n${post.contentText}`.toLowerCase()
    return haystack.includes(keyword)
  })
}
