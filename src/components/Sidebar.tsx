'use client'

import { useState } from 'react'
import type { ComponentType } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Instagram, Facebook, Twitter, Linkedin, Youtube, Github,
  Mail, Phone, Globe, Rss, Share2, Link as LinkIcon,
  Camera, Image as ImageIcon, Music, Coffee, ExternalLink,
  ChevronDown,
} from 'lucide-react'

type LinkType = 'page' | 'external' | 'dropdown'

type Child = {
  label: string
  type: 'page' | 'external'
  page?: { slug?: string } | string | null
  url?: string | null
}

type Item = Child & {
  type: LinkType
  children?: Child[] | null
}

type Nav = { items?: Item[] | null }

type Settings = {
  siteTitle?: string
  tagline?: string
  socials?: { platform: string; url: string; icon?: string | null; color?: string | null; size?: number | null }[] | null
  copyrightLine1?: string | null
  copyrightLine2?: string | null
}

// Ensure social URLs always have a protocol so they open correctly.
function normaliseUrl(url: string): string {
  if (!url) return '#'
  if (/^(https?:|mailto:|tel:)/i.test(url)) return url
  return `https://${url}`
}

// Build the href for a menu entry from its type.
function hrefFor(entry: Child): string {
  if (entry.type === 'external') return entry.url || '#'
  const page = entry.page
  const slug = typeof page === 'object' && page ? page.slug : undefined
  return slug ? `/${slug}` : '#'
}

const socialIcons: Record<string, ComponentType<{ size?: number }>> = {
  instagram: Instagram,
  facebook: Facebook,
  x: Twitter,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
  mail: Mail,
  email: Mail,
  phone: Phone,
  globe: Globe,
  rss: Rss,
  'share-2': Share2,
  link: LinkIcon,
  camera: Camera,
  image: ImageIcon,
  music: Music,
  coffee: Coffee,
  'external-link': ExternalLink,
}

export function Sidebar({ nav, settings }: { nav: Nav; settings: Settings }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const items = nav?.items || []

  const isActive = (entry: Child) => hrefFor(entry) === pathname

  return (
    <aside className="sidebar">
      <div className="sidebar-head" style={{ width: '100%' }}>
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <div className="brand">{settings?.siteTitle || 'Stephan Rozario'}</div>
          {settings?.tagline ? <div className="tagline">{settings.tagline}</div> : null}
        </Link>
      </div>

      <button
        className="menu-toggle"
        aria-label="Toggle menu"
        onClick={() => setMobileOpen((o) => !o)}
      >
        {mobileOpen ? '\u00d7' : '\u2261'}
      </button>

      <div className={`sidebar-body${mobileOpen ? ' open' : ''}`}>
        <nav className="menu">
          {items.map((item, i) => (
            <div key={i}>
              {item.type === 'dropdown' ? (
                <Dropdown
                  item={item}
                  isActive={isActive}
                  onNavigate={() => setMobileOpen(false)}
                />
              ) : item.type === 'external' ? (
                <a href={hrefFor(item)} target="_blank" rel="noopener noreferrer">
                  {item.label}
                </a>
              ) : (
                <Link
                  href={hrefFor(item)}
                  className={isActive(item) ? 'active' : undefined}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )}
              <hr className="menu-divider" />
            </div>
          ))}
        </nav>

        {settings?.socials?.length ? (
          <div className="socials">
            {settings.socials.map((s, i) => {
              const Icon = socialIcons[s.icon || ''] || socialIcons[s.platform] || Globe
              const iconSize = s.size || 18
              return (
                <a
                  key={i}
                  href={normaliseUrl(s.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  style={s.color ? { color: s.color } : undefined}
                >
                  <Icon size={iconSize} />
                </a>
              )
            })}
          </div>
        ) : null}

        {(settings?.copyrightLine1 || settings?.copyrightLine2) ? (
          <div className="sidebar-copyright">
            {settings.copyrightLine1 ? <span>{settings.copyrightLine1}</span> : null}
            {settings.copyrightLine2 ? <span>{settings.copyrightLine2}</span> : null}
          </div>
        ) : null}
      </div>
    </aside>
  )
}

function Dropdown({
  item,
  isActive,
  onNavigate,
}: {
  item: Item
  isActive: (e: Child) => boolean
  onNavigate: () => void
}) {
  const children = item.children || []
  const hasActiveChild = children.some(isActive)
  // Stay open whenever the visitor is inside this section.
  const [open, setOpen] = useState(hasActiveChild)

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={hasActiveChild ? 'active' : undefined}
        aria-expanded={open}
      >
        <span>{item.label}</span>
        <span className={`chevron${open ? ' open' : ''}`}><ChevronDown size={15} /></span>
      </button>
      {open ? (
        <div className="submenu">
          {children.map((child, i) => {
            const href = hrefFor(child)
            return child.type === 'external' ? (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer">
                {child.label}
              </a>
            ) : (
              <Link
                key={i}
                href={href}
                className={isActive(child) ? 'active' : undefined}
                onClick={onNavigate}
              >
                {child.label}
              </Link>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
