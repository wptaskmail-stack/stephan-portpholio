import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getPageBySlug } from '@/lib/getData'
import { RenderBlocks } from '@/components/RenderBlocks'

// Re-read on each request so admin edits show up immediately.
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug((slug || []).join('/'))
  return { title: page?.title || 'Stephan Rozario' }
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  const page = await getPageBySlug((slug || []).join('/'))

  if (!page) notFound()

  return (
    <article className="page">
      {(page as any).showTitle ? <h1 className="page-title">{page.title}</h1> : null}
      <RenderBlocks blocks={(page.layout as any[]) || []} />
    </article>
  )
}
