import React from 'react'
import type { Metadata } from 'next'
import { Fraunces, Hanken_Grotesk } from 'next/font/google'

import './styles.css'
import { getNavigation, getSiteSettings } from '@/lib/getData'
import { Sidebar } from '@/components/Sidebar'

// Distinctive but quiet pairing: a characterful serif for the name,
// a clean grotesque for everything else. Photos stay the focus.
const display = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-display',
  display: 'swap',
})
const sans = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings() as any
  const siteName: string = s?.siteTitle || 'Stephan Rozario'
  const faviconUrl: string | null =
    typeof s?.favicon === 'object' ? (s.favicon?.url ?? null) : null

  return {
    title: {
      default: s?.metaTitle || siteName,
      template: `%s | ${siteName}`,
    },
    description: s?.metaDescription || '',
    icons: faviconUrl ? { icon: faviconUrl, shortcut: faviconUrl } : undefined,
  }
}

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [nav, settings] = await Promise.all([getNavigation(), getSiteSettings()])

  const s = settings as any
  const styleVars: React.CSSProperties = {}
  const v = styleVars as Record<string, string>
  if (s?.sidebarBg) v['--sidebar-bg'] = s.sidebarBg
  if (s?.pageBg) v['--page-bg'] = s.pageBg
  if (s?.menuDividerColor) v['--menu-divider-color'] = s.menuDividerColor
  if (s?.menuDividerHeight) v['--menu-divider-height'] = `${s.menuDividerHeight}px`

  // Admin-chosen fonts (Site settings → Appearance → Typography). 'default' keeps the
  // bundled next/font pairing; any other value is a Google Fonts family name loaded via
  // <link> below and applied by overriding the CSS variables the whole site reads.
  const resolveFont = (sel?: string, custom?: string) =>
    !sel || sel === 'default'
      ? null
      : sel === 'custom'
        ? (custom || '').trim() || null
        : sel
  const headingFont = resolveFont(s?.headingFont, s?.headingFontCustom)
  const bodyFont = resolveFont(s?.bodyFont, s?.bodyFontCustom)
  if (headingFont) v['--font-display'] = `'${headingFont}', Georgia, serif`
  if (bodyFont) v['--font-sans'] = `'${bodyFont}', system-ui, sans-serif`

  const families = Array.from(
    new Set([headingFont, bodyFont].filter(Boolean) as string[]),
  )
  const fontsHref = families.length
    ? `https://fonts.googleapis.com/css2?${families
        .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@400;500;600;700`)
        .join('&')}&display=swap`
    : null

  return (
    // suppressHydrationWarning: browser extensions (Dark Reader, Grammarly, etc.)
    // mutate <html>/<body> attributes before React hydrates. This only relaxes
    // these two elements' own attributes — descendants are still validated.
    <html
      lang="en"
      data-theme={s?.theme || 'light'}
      className={`${display.variable} ${sans.variable}`}
      style={styleVars}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        {fontsHref && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            {/* precedence => React hoists/dedupes this stylesheet deterministically */}
            <link rel="stylesheet" href={fontsHref} precedence="default" />
          </>
        )}
        <div className="layout">
          <Sidebar nav={nav} settings={settings} />
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  )
}
