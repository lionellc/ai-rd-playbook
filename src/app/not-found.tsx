import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{ padding: '64px 24px', textAlign: 'center' }}>
      <h1>404</h1>
      <p>页面不存在或已被移动。</p>
      <Link href="/zh">返回首页</Link>
    </main>
  )
}
