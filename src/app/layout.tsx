import type { Metadata } from 'next'
import Script from 'next/script'
import { TanStackProvider } from '@/tanstack/providers'
import { siteConfig } from '@/lib/site'
import 'nextra-theme-docs/style.css'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  icons: {
    icon: [{ url: '/logo.svg', type: 'image/svg+xml' }],
    shortcut: ['/logo.svg'],
    apple: [{ url: '/logo.svg', type: 'image/svg+xml' }]
  }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const analyticsToken = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN
  const promoLink = 'https://codex.pingchela.xyz/register?aff=5DS5S8J4JTJQ'

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a
          className="playbook-ad-bar"
          href={promoLink}
          target="_blank"
          rel="noopener noreferrer sponsored"
          aria-label="AI 中转站推广链接（新窗口打开）"
        >
          <span>AI 中转站（稳定可靠）：一键接入主流模型</span>
          <span className="playbook-ad-cta">立即注册 ↗</span>
        </a>
        <TanStackProvider>{children}</TanStackProvider>
        {analyticsToken ? (
          <Script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: analyticsToken })}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  )
}
