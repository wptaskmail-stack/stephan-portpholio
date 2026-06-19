import type { CollectionConfig } from 'payload'

// The login for the admin panel. The first user is created when you
// first open /admin. Add more editors here later if needed.
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  lockDocuments: false,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
}
