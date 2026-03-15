import Link from 'next/link'
import Script from 'next/script'
import { defaultLocale } from '@/lib/i18n'

export default function RootPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem',
        textAlign: 'center'
      }}
    >
      <div>
        <h1 style={{ marginBottom: 8 }}>AI Playbook</h1>
        <p style={{ marginTop: 0, opacity: 0.7 }}>
          {defaultLocale === 'en' ? 'Redirecting to English...' : '正在跳转到中文...'}
        </p>
        <p style={{ marginTop: 16 }}>
          <Link href="/en">English</Link> · <Link href="/zh">简体中文</Link>
        </p>
      </div>

      <Script id="root-locale-redirect" strategy="afterInteractive">
        {`window.location.replace('/${defaultLocale}/')`}
      </Script>
    </main>
  )
}
