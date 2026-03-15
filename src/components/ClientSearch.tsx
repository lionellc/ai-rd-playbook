'use client'

import dynamic from 'next/dynamic'

const Search = dynamic(
  () => import('nextra/components').then(module => module.Search),
  { ssr: false }
)

export function ClientSearch() {
  return <Search />
}
