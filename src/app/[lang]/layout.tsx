import { Layout, LocaleSwitch, Navbar, ThemeSwitch } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import { notFound } from 'next/navigation'
import { ClientSearch } from '@/components/ClientSearch'
import { assertLocale, localeNames, locales } from '@/lib/i18n'
import { siteConfig } from '@/lib/site'

type LayoutProps = Readonly<{
  children: React.ReactNode
  params: Promise<{ lang: string }>
}>

export default async function LangLayout({ children, params }: LayoutProps) {
  const resolvedParams = await params
  const locale = assertLocale(resolvedParams?.lang ?? '')

  if (!locale) {
    notFound()
  }

  const pageMap = await getPageMap(`/${locale}`)
  return (
    <Layout
      navbar={
        <Navbar
          logo={
            <span>
              <strong>{siteConfig.shortName}</strong> ·{' '}
              {locale === 'zh' ? '组织级 AI 能力建设' : 'AI for Engineering Teams'}
            </span>
          }
          projectLink={siteConfig.repository}
        >
          <LocaleSwitch lite />
          <ThemeSwitch lite />
        </Navbar>
      }
      footer={
        <footer className="playbook-footer-minimal">
          {new Date().getFullYear()} © {siteConfig.name}
        </footer>
      }
      search={<ClientSearch />}
      pageMap={pageMap}
      docsRepositoryBase={siteConfig.repository}
      editLink={locale === 'zh' ? '在 GitHub 上编辑此页' : 'Edit this page on GitHub'}
      sidebar={{
        autoCollapse: true,
        defaultMenuCollapseLevel: 1
      }}
      i18n={[
        { locale: 'zh', name: localeNames.zh },
        { locale: 'en', name: localeNames.en }
      ]}
      toc={{
        backToTop: locale === 'zh' ? '回到顶部' : 'Back to top'
      }}
      copyPageButton={false}
      themeSwitch={{
        dark: locale === 'zh' ? '深色' : 'Dark',
        light: locale === 'zh' ? '浅色' : 'Light',
        system: locale === 'zh' ? '系统' : 'System'
      }}
    >
      {children}
    </Layout>
  )
}

export async function generateStaticParams() {
  return locales.map(lang => ({ lang }))
}
