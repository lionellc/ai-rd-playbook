import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const siteConfig = {
  name: 'AI R&D Playbook',
  description: '企业研发场景下 AI 落地实践与方法论。',
  siteUrl: 'https://blog.pnpm.ai'
}

const locales = ['zh', 'en']
const staticPaths = ['', '/about/', '/posts/', '/search/']

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function isValidDate(value) {
  return Number.isFinite(new Date(value).getTime())
}

async function readPostsByLocale(locale, contentRoot) {
  const postsDir = path.join(contentRoot, locale, 'posts')
  let files = []

  try {
    files = await fs.readdir(postsDir)
  } catch {
    return []
  }

  const posts = []
  for (const fileName of files) {
    if (!fileName.endsWith('.mdx') || fileName.startsWith('_')) {
      continue
    }

    const source = await fs.readFile(path.join(postsDir, fileName), 'utf8')
    const parsed = matter(source)
    const slug = fileName.replace(/\.mdx$/, '')
    const title = parsed.data.title ? String(parsed.data.title) : ''
    const summary = parsed.data.summary
      ? String(parsed.data.summary)
      : parsed.data.description
        ? String(parsed.data.description)
        : ''
    const date = parsed.data.date ? String(parsed.data.date) : ''
    const tags = Array.isArray(parsed.data.tags) ? parsed.data.tags.map(String) : []

    if (!title || !date || !isValidDate(date)) {
      continue
    }

    posts.push({
      locale,
      slug,
      title,
      summary,
      tags,
      date,
      route: `/${locale}/posts/${slug}/`
    })
  }

  return posts.sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))
}

function withBaseUrl(route) {
  const normalizedRoute = route.startsWith('/') ? route : `/${route}`
  return `${siteConfig.siteUrl}${normalizedRoute}`
}

async function writeSitemap(posts, publicDir) {
  const now = new Date().toISOString()
  const tagRoutes = []
  const seenTags = new Set()

  for (const post of posts) {
    for (const tag of post.tags) {
      const key = `${post.locale}:${tag}`
      if (seenTags.has(key)) {
        continue
      }
      seenTags.add(key)
      tagRoutes.push({
        route: `/${post.locale}/tags/${encodeURIComponent(tag)}/`,
        lastModified: now
      })
    }
  }

  const staticEntries = locales.flatMap(locale =>
    staticPaths.map(route => ({
      route: `/${locale}${route}`,
      lastModified: now
    }))
  )

  const dynamicEntries = posts.map(post => ({
    route: post.route,
    lastModified: new Date(post.date).toISOString()
  }))

  const entries = [
    { route: '/', lastModified: now },
    ...staticEntries,
    ...dynamicEntries,
    ...tagRoutes
  ]

  const body = entries
    .map(
      item => `  <url>
    <loc>${escapeXml(withBaseUrl(item.route))}</loc>
    <lastmod>${item.lastModified}</lastmod>
  </url>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`

  await fs.writeFile(path.join(publicDir, 'sitemap.xml'), xml, 'utf8')
}

async function writeRss(posts, publicDir) {
  const items = posts
    .map(post => {
      const link = withBaseUrl(post.route)
      return `<item>
  <title><![CDATA[${post.title}]]></title>
  <description><![CDATA[${post.summary}]]></description>
  <link>${escapeXml(link)}</link>
  <guid isPermaLink="true">${escapeXml(link)}</guid>
  <pubDate>${new Date(post.date).toUTCString()}</pubDate>
</item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(siteConfig.name)}</title>
  <link>${escapeXml(siteConfig.siteUrl)}</link>
  <description>${escapeXml(siteConfig.description)}</description>
  <language>en-US</language>
${items}
</channel>
</rss>
`

  await fs.writeFile(path.join(publicDir, 'rss.xml'), xml, 'utf8')
}

async function writeRobots(publicDir) {
  const robots = `User-agent: *
Allow: /

Sitemap: ${siteConfig.siteUrl}/sitemap.xml
`

  await fs.writeFile(path.join(publicDir, 'robots.txt'), robots, 'utf8')
}

async function main() {
  const root = process.cwd()
  const contentRoot = path.join(root, 'src', 'content')
  const publicDir = path.join(root, 'public')

  const postsByLocale = await Promise.all(locales.map(locale => readPostsByLocale(locale, contentRoot)))
  const posts = postsByLocale.flat()

  await fs.mkdir(publicDir, { recursive: true })
  await Promise.all([writeSitemap(posts, publicDir), writeRss(posts, publicDir), writeRobots(publicDir)])

  console.log(`[meta] 生成完成: ${posts.length} 篇文章, 输出目录 ${publicDir}`)
}

main().catch(error => {
  console.error('[meta] 生成失败:', error)
  process.exit(1)
})
