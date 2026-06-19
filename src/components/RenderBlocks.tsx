import React from 'react'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Star } from 'lucide-react'
import { ICON_MAP } from './iconList'

import { BannerBlock } from './BannerBlock'
import { GalleryBlock } from './GalleryBlock'
import { FormBlock } from './FormBlock'

const getIcon = (name: string): React.ComponentType<{ size?: number }> =>
  ICON_MAP[name] ?? Star

const mediaUrl = (m: any): string | null =>
  m && typeof m === 'object' && m.url ? m.url : null

function hrefForLink(linkType: string, page: any, url?: string): string {
  if (linkType === 'external') return url || '#'
  if (page && typeof page === 'object' && page.slug) return `/${page.slug}`
  return '#'
}

// Optional per-block click-through (see linkFields in src/blocks/index.ts).
// Returns null when the block isn't set to be clickable, so it renders normally.
function blockLink(b: any): { href: string; external: boolean; newTab: boolean } | null {
  const t = b?.linkType
  if (!t || t === 'none') return null
  if (t === 'external') return b.linkUrl ? { href: b.linkUrl, external: true, newTab: !!b.linkNewTab } : null
  if (t === 'page' && b.linkPage && typeof b.linkPage === 'object' && b.linkPage.slug)
    return { href: `/${b.linkPage.slug}`, external: false, newTab: false }
  return null
}

function Clickable({
  link,
  className,
  style,
  children,
}: {
  link: { href: string; external: boolean; newTab: boolean }
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  return link.external ? (
    <a
      className={className}
      style={style}
      href={link.href}
      {...(link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  ) : (
    <Link className={className} style={style} href={link.href}>
      {children}
    </Link>
  )
}

function renderBlock(block: any, key: React.Key): React.ReactNode {
  switch (block.blockType) {
    case 'banner':
      return (
        <BannerBlock
          key={key}
          type={block.type || 'fixed'}
          images={block.images || []}
          height={block.height || 'medium'}
          customHeight={block.customHeight}
          width={block.width || 'full'}
          customWidth={block.customWidth}
          objectFit={block.objectFit || 'cover'}
          slideDuration={block.slideDuration}
          transition={block.transition || 'fade'}
          showDots={block.showDots !== false}
          showArrows={block.showArrows !== false}
        />
      )
    case 'heading': {
      const Tag = (block.level || 'h2') as 'h2' | 'h3' | 'h4'
      const lk = blockLink(block)
      return (
        <Tag key={key} className="b-heading" style={{ textAlign: block.align || 'left' }}>
          {lk ? (
            <Clickable link={lk} className="b-blocklink">
              {block.text}
            </Clickable>
          ) : (
            block.text
          )}
        </Tag>
      )
    }

    case 'text':
      return (
        <div
          key={key}
          className={`b-text ${block.width === 'readable' ? 'b-text--readable' : 'b-text--full'}`}
          style={{ textAlign: block.align || 'left' }}
        >
          {block.content ? <RichText data={block.content} /> : null}
        </div>
      )

    case 'image': {
      const url = mediaUrl(block.image)
      if (!url) return null

      const isCustom = block.width === 'custom'
      const widthClass = isCustom ? '' : `w-${block.width || 'full'}`
      const align = block.align || 'left'

      const figStyle: React.CSSProperties = {}
      if (isCustom && block.customWidth) figStyle.maxWidth = `${block.customWidth}px`
      if (align === 'center') { figStyle.marginLeft = 'auto'; figStyle.marginRight = 'auto' }
      if (align === 'right')  { figStyle.marginLeft = 'auto'; figStyle.marginRight = '0' }

      const imgStyle: React.CSSProperties = {}
      if (block.customHeight) { imgStyle.height = `${block.customHeight}px`; imgStyle.objectFit = 'cover' }

      const lk = blockLink(block)
      const img = <img src={url} alt={block.image?.alt || ''} loading="lazy" style={imgStyle} />
      return (
        <figure key={key} className={`b-image ${widthClass}`} style={figStyle}>
          {lk ? (
            <Clickable link={lk} className="b-blocklink b-image-link">
              {img}
            </Clickable>
          ) : (
            img
          )}
          {block.caption ? <figcaption>{block.caption}</figcaption> : null}
        </figure>
      )
    }

    case 'gallery':
      return (
        <GalleryBlock
          key={key}
          images={block.images || []}
          columns={block.columns || '3'}
          gap={block.gap || 'medium'}
        />
      )

    case 'iconBox': {
      const Icon = getIcon(block.icon || 'star')
      const iconSize = block.iconSize || 28
      const iconColor = block.iconColor || undefined
      const lk = blockLink(block)
      const inner = (
        <>
          <span className="b-iconbox-icon" style={iconColor ? { color: iconColor } : undefined}>
            <Icon size={iconSize} />
          </span>
          {block.heading ? <h3>{block.heading}</h3> : null}
          {block.description ? <p>{block.description}</p> : null}
        </>
      )
      const boxStyle: React.CSSProperties = { textAlign: block.align || 'left' }
      return lk ? (
        <Clickable key={key} link={lk} className="b-iconbox b-blocklink" style={boxStyle}>
          {inner}
        </Clickable>
      ) : (
        <div key={key} className="b-iconbox" style={boxStyle}>
          {inner}
        </div>
      )
    }

    case 'button': {
      const href = hrefForLink(block.linkType, block.page, block.url)
      const cls = `b-button ${block.style === 'solid' ? 'solid' : 'outline'}`
      return block.linkType === 'external' ? (
        <a key={key} className={cls} href={href} target="_blank" rel="noopener noreferrer">
          {block.label}
        </a>
      ) : (
        <Link key={key} className={cls} href={href}>
          {block.label}
        </Link>
      )
    }

    case 'columns': {
      const cols = block.columns || []
      return (
        <div
          key={key}
          className="b-columns"
          style={{ gridTemplateColumns: `repeat(${cols.length || 1}, 1fr)` }}
        >
          {cols.map((col: any, ci: number) => (
            <div key={ci} className="b-column">
              {(col.blocks || []).map((b: any, bi: number) => renderBlock(b, `${ci}-${bi}`))}
            </div>
          ))}
        </div>
      )
    }

    case 'row': {
      const gapMap: Record<string, number> = { none: 0, small: 12, medium: 24, large: 48 }
      const alignMap: Record<string, string> = { top: 'flex-start', center: 'center', bottom: 'flex-end', stretch: 'stretch' }
      const gap = gapMap[block.gap ?? 'medium'] ?? 24
      const align = alignMap[block.verticalAlign ?? 'top'] ?? 'flex-start'
      const cols = block.columns || []
      return (
        <div
          key={key}
          className={`b-row${block.stackOnMobile !== false ? ' stack-mobile' : ''}`}
          style={{ display: 'flex', flexWrap: 'wrap', gap, alignItems: align }}
        >
          {cols.map((col: any, ci: number) => {
            const w = col.width && col.width !== 'auto' ? `${col.width}%` : null
            const colStyle: React.CSSProperties = w
              ? { flex: `0 0 calc(${w} - ${gap / 2}px)`, maxWidth: `calc(${w} - ${gap / 2}px)`, minWidth: 0 }
              : { flex: '1 1 0', minWidth: 0 }
            return (
              <div key={ci} className="b-row-col" style={colStyle}>
                {(col.blocks || []).map((b: any, bi: number) => renderBlock(b, `row-${ci}-${bi}`))}
              </div>
            )
          })}
        </div>
      )
    }

    case 'margin': {
      const px = (n: any) => `${Number(n) || 0}px`
      return (
        <div
          key={key}
          aria-hidden="true"
          className="b-margin"
          style={{
            marginTop: px(block.top),
            marginRight: px(block.right),
            marginBottom: px(block.bottom),
            marginLeft: px(block.left),
          }}
        />
      )
    }

    case 'formBlock':
      return <FormBlock key={key} form={block.form} intro={block.intro} />

    default:
      return null
  }
}

export function RenderBlocks({ blocks }: { blocks: any[] }) {
  if (!blocks?.length) return null
  return <>{blocks.map((b, i) => renderBlock(b, i))}</>
}
