export const locales = ['zh', 'en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeLabels: Record<Locale, string> = {
  zh: '中文',
  en: 'English'
}

export const localeNames: Record<Locale, string> = {
  zh: '简体中文',
  en: 'English'
}

export type UiMessages = {
  home: string
  posts: string
  about: string
  tags: string
  search: string
  searchPlaceholder: string
  emptySearch: string
  emptyPosts: string
  readMore: string
  filteredBy: string
  clearFilter: string
}

export const uiMessages: Record<Locale, UiMessages> = {
  zh: {
    home: '首页',
    posts: '文章',
    about: '关于',
    tags: '标签',
    search: '搜索',
    searchPlaceholder: '按标题、摘要、标签搜索',
    emptySearch: '没有找到匹配内容，请尝试其他关键词。',
    emptyPosts: '暂时还没有文章。',
    readMore: '阅读全文',
    filteredBy: '筛选条件',
    clearFilter: '清除筛选'
  },
  en: {
    home: 'Home',
    posts: 'Posts',
    about: 'About',
    tags: 'Tags',
    search: 'Search',
    searchPlaceholder: 'Search by title, summary or tag',
    emptySearch: 'No matching post found. Try another keyword.',
    emptyPosts: 'No posts yet.',
    readMore: 'Read more',
    filteredBy: 'Filter',
    clearFilter: 'Clear'
  }
}

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export function assertLocale(value: string): Locale | null {
  return isLocale(value) ? value : null
}
