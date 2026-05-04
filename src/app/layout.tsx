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

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
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
