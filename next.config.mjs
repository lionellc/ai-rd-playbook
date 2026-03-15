import nextra from 'nextra'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

const withNextra = nextra({
  contentDirBasePath: '/',
  defaultShowCopyCode: true,
  latex: true,
  search: {
    codeblocks: false
  }
})

const nextConfig = withNextra({
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['nextra/components', 'nextra-theme-docs']
  },
  turbopack: {
    root: rootDir
  }
})

export default nextConfig
