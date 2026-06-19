import Link from 'next/link'

import { getHomePage, getNavigation, getSiteSettings } from '@/lib/getData'
import { RenderBlocks } from '@/components/RenderBlocks'

export const dynamic = 'force-dynamic'

function firstHref(items: any[]): string | null {
  for (const item of items) {
    if (item.type === 'dropdown' && item.children?.length) {
      for (const c of item.children) {
        if (c.type === 'page' && typeof c.page === 'object' && c.page?.slug)
          return `/${c.page.slug}`
      }
    }
    if (item.type === 'page' && typeof item.page === 'object' && item.page?.slug)
      return `/${item.page.slug}`
  }
  return null
}

export default async function Home() {
  const [page, nav, settings] = await Promise.all([
    getHomePage(),
    getNavigation(),
    getSiteSettings(),
  ])

  // A home page is configured — render it exactly like any other page.
  if (page) {
    return (
      <article className="page">
        {(page as any).showTitle ? <h1 className="page-title">{page.title}</h1> : null}
        <RenderBlocks blocks={(page.layout as any[]) || []} />
      </article>
    )
  }

  // Fallback: no home page set yet — show a simple welcome screen.
  const href = firstHref(nav?.items || [])
  return (
    <section className="text-page">
      <h1>{settings?.siteTitle || 'Stephan Rozario'}</h1>
      <p>{settings?.tagline || 'Photographer'}</p>
      {href ? (
        <p style={{ marginTop: 24 }}>
          <Link href={href} style={{ borderBottom: '1px solid currentColor' }}>
            View work →
          </Link>
        </p>
      ) : (
        <p style={{ marginTop: 24, color: '#8a8a8a' }}>
          Go to <strong>Admin → Site Settings → Home page</strong> to choose which page opens at /.
        </p>
      )}
    </section>
  )
}
