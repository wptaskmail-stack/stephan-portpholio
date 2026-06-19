import path from 'path'
import { fileURLToPath } from 'url'

import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { payloadCloudinaryPlugin } from '@jhb.software/payload-cloudinary-plugin'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Navigation } from './globals/Navigation'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // The collection used to log in to /admin
  admin: {
    user: Users.slug,
    // Custom admin theme: warm light + dark modes with the site terracotta accent.
    css: path.resolve(dirname, 'styles/admin.css'),
    meta: {
      title: 'Stephan Rozario Studio',
      titleSuffix: ' — Stephan Rozario',
    },
    components: {
      // Login wordmark + nav monogram + welcome line.
      graphics: {
        Logo: '@/components/admin/Logo#Logo',
        Icon: '@/components/admin/Icon#Icon',
      },
      beforeLogin: ['@/components/admin/BeforeLogin#BeforeLogin'],
    },
  },

  // Content types. Pages is first so it's the default view in the admin.
  // The Form Builder plugin adds `forms` and `form-submissions` automatically.
  collections: [Pages, Media, Users],

  // Site-wide singletons: the menu and basic site settings.
  globals: [Navigation, SiteSettings],

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // Email is only wired up when SMTP env vars are present. Without them,
  // form submissions are still saved and visible in the admin — they just
  // won't be emailed out.
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromName: 'Stephan Rozario',
        defaultFromAddress: process.env.SMTP_FROM || 'no-reply@stephanrozario.com',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        },
      })
    : undefined,

  // Neon (or any Postgres). On Vercel use the POOLED connection string.
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      max: 10,
      // Close idle clients quickly so we never reuse one Neon has already
      // dropped after auto-suspend (cause of "Connection terminated unexpectedly").
      idleTimeoutMillis: 10_000,
      // Allow time for Neon's cold start on the first query after a suspend.
      connectionTimeoutMillis: 15_000,
      allowExitOnIdle: true,
      keepAlive: true,
    },
  }),

  plugins: [
    // Build contact (and other) forms in the admin; submissions are stored.
    formBuilderPlugin({
      fields: {
        text: true,
        textarea: true,
        email: true,
        select: true,
        checkbox: true,
        number: true,
        message: true,
        payment: false,
      },
      formOverrides: { admin: { group: 'Content' }, lockDocuments: false },
      formSubmissionOverrides: { admin: { group: 'Content' }, lockDocuments: false },
    }),

    // Photos uploaded in the admin go straight to Cloudinary.
    payloadCloudinaryPlugin({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
      credentials: {
        apiKey: process.env.CLOUDINARY_API_KEY || '',
        apiSecret: process.env.CLOUDINARY_API_SECRET || '',
      },
      collections: {
        media: { disablePayloadAccessControl: true },
      },
      folder: 'stephan-portfolio',
    }),
  ],
})
