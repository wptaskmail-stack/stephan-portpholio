import type { CollectionConfig } from 'payload'

// Every photo you upload is a Media record. The actual file lives in
// Cloudinary (see the plugin in payload.config.ts); Postgres only stores
// the reference, alt text and caption.
export const Media: CollectionConfig = {
  slug: 'media',
  lockDocuments: false,
  access: {
    read: () => true, // photos are public
  },
  upload: true,
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt text',
      admin: {
        description: 'Short description for accessibility and SEO.',
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
