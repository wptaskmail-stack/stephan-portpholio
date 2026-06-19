import type { GlobalConfig } from 'payload'

// The menu builder. Drag items to reorder. A "Dropdown" item (like
// Portfolio) holds child items that appear in its expanding menu.
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  lockDocuments: false,
  access: {
    read: () => true,
  },
  admin: {
    description: 'Build the left-hand menu. Drag rows to reorder.',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Menu item', plural: 'Menu items' },
      admin: {
        components: {
          RowLabel: '@/components/NavRowLabel#NavRowLabel',
        },
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          defaultValue: 'page',
          options: [
            { label: 'Link to a page', value: 'page' },
            { label: 'External link', value: 'external' },
            { label: 'Dropdown (parent with sub-pages)', value: 'dropdown' },
          ],
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          admin: { condition: (_, s) => s?.type === 'page' },
        },
        {
          name: 'url',
          type: 'text',
          admin: { condition: (_, s) => s?.type === 'external' },
        },
        {
          // Sub-pages shown when this dropdown is expanded (e.g. under Portfolio).
          name: 'children',
          type: 'array',
          labels: { singular: 'Sub-page', plural: 'Sub-pages' },
          admin: { condition: (_, s) => s?.type === 'dropdown' },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'type',
              type: 'select',
              defaultValue: 'page',
              options: [
                { label: 'Link to a page', value: 'page' },
                { label: 'External link', value: 'external' },
              ],
            },
            {
              name: 'page',
              type: 'relationship',
              relationTo: 'pages',
              admin: { condition: (_, s) => s?.type === 'page' },
            },
            {
              name: 'url',
              type: 'text',
              admin: { condition: (_, s) => s?.type === 'external' },
            },
          ],
        },
      ],
    },
  ],
}
