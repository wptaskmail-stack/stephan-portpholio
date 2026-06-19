import type { CollectionConfig } from 'payload'

import { pageBlocks } from '../blocks'

const slugify = (val?: string): string =>
  (val || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9/]+/g, '-')
    .replace(/(^-|-$)/g, '')

// A page is now a stack of builder blocks (see src/blocks). The admin
// composes each page freely: text, images, galleries, columns, icon boxes…
export const Pages: CollectionConfig = {
  slug: 'pages',
  // Single-admin site: skip document locking (avoids the payload_locked_documents
  // cleanup queries that fail intermittently on Neon's auto-suspended pooler).
  lockDocuments: false,
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'published'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description:
          'The URL path, e.g. "publish-story" → /publish-story. Leave blank to auto-generate from the title.',
      },
      hooks: {
        beforeValidate: [({ value, data }) => value || slugify(data?.title)],
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      labels: { singular: 'Block', plural: 'Blocks' },
      blocks: pageBlocks,
    },
    {
      name: 'showTitle',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show the page title as an H1 at the top of the content.',
        position: 'sidebar',
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Uncheck to hide this page from the live site.',
        position: 'sidebar',
      },
    },
  ],
}
