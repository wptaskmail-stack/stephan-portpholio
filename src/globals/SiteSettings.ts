import type { GlobalConfig } from 'payload'

// Shared font picker list for the Typography settings. Each `value` is the exact
// Google Fonts family name so the frontend can use it directly (see layout.tsx);
// 'default' keeps the bundled theme pairing, 'custom' reveals a free-text field.
const FONT_OPTIONS = [
  { label: 'Default (theme pairing)', value: 'default' },
  // Serif / display
  { label: 'Playfair Display (serif)', value: 'Playfair Display' },
  { label: 'Cormorant Garamond (serif)', value: 'Cormorant Garamond' },
  { label: 'Lora (serif)', value: 'Lora' },
  { label: 'Merriweather (serif)', value: 'Merriweather' },
  { label: 'EB Garamond (serif)', value: 'EB Garamond' },
  { label: 'Libre Baskerville (serif)', value: 'Libre Baskerville' },
  { label: 'Fraunces (serif)', value: 'Fraunces' },
  // Sans-serif
  { label: 'Inter (sans)', value: 'Inter' },
  { label: 'Poppins (sans)', value: 'Poppins' },
  { label: 'Montserrat (sans)', value: 'Montserrat' },
  { label: 'Work Sans (sans)', value: 'Work Sans' },
  { label: 'DM Sans (sans)', value: 'DM Sans' },
  { label: 'Roboto (sans)', value: 'Roboto' },
  { label: 'Oswald (condensed)', value: 'Oswald' },
  { label: 'Custom (enter a Google font)', value: 'custom' },
]

// Basic site-wide settings shown in the sidebar header and footer.
// Fields are organised into tabs purely for admin UX — the data shape is flat,
// so getSiteSettings() and the frontend read every field by its name unchanged.
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  lockDocuments: false,
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Branding',
          description: 'Site name, tagline, favicon and the home page.',
          fields: [
            {
              name: 'siteTitle',
              type: 'text',
              defaultValue: 'Stephan Rozario',
              admin: {
                description: 'Displayed in the sidebar and used as the default browser tab title.',
              },
            },
            {
              name: 'tagline',
              type: 'text',
              defaultValue: 'Photographer',
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              label: 'Favicon',
              admin: {
                description:
                  'Browser tab icon. Use a square PNG or SVG, ideally 64×64 px or larger.',
              },
            },
            {
              name: 'homePage',
              type: 'relationship',
              relationTo: 'pages',
              label: 'Home page',
              admin: {
                description: 'The page shown when visitors hit the root URL (/).',
              },
            },
          ],
        },
        {
          label: 'SEO',
          description: 'Defaults for the browser tab title and search engine results.',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              label: 'SEO title',
              admin: {
                description:
                  'Overrides Site Title in the browser tab and search results. Leave blank to use Site Title.',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              label: 'Meta description',
              admin: {
                description: 'Default description shown in search engine results.',
              },
            },
          ],
        },
        {
          label: 'Appearance',
          description: 'Theme, background colours and menu styling.',
          fields: [
            {
              name: 'theme',
              type: 'select',
              defaultValue: 'light',
              admin: {
                description: 'Switch the whole site look. Applied instantly.',
              },
              options: [
                { label: 'Light — editorial', value: 'light' },
                { label: 'Warm — minimal', value: 'warm' },
                { label: 'Dark', value: 'dark' },
              ],
            },
            {
              type: 'collapsible',
              label: 'Background colours',
              admin: { initCollapsed: false },
              fields: [
                {
                  name: 'sidebarBg',
                  type: 'text',
                  label: 'Sidebar background colour',
                  admin: {
                    description: 'Optional. Overrides the theme colour for the sidebar.',
                    components: { Field: '@/components/ColorField#ColorField' },
                  },
                },
                {
                  name: 'pageBg',
                  type: 'text',
                  label: 'Page background colour',
                  admin: {
                    description: 'Optional. Overrides the theme colour for the content area.',
                    components: { Field: '@/components/ColorField#ColorField' },
                  },
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Menu styling',
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'menuDividerHeight',
                  type: 'number',
                  label: 'Menu divider height (px)',
                  defaultValue: 1,
                  admin: { description: 'Thickness of the line between each menu item.' },
                },
                {
                  name: 'menuDividerColor',
                  type: 'text',
                  label: 'Menu divider colour',
                  admin: {
                    description: 'Leave blank to use the theme line colour.',
                    components: { Field: '@/components/ColorField#ColorField' },
                  },
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Typography',
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'headingFont',
                  type: 'select',
                  defaultValue: 'default',
                  label: 'Title / heading font',
                  admin: {
                    description: 'Used for the site name, page titles and headings.',
                  },
                  options: FONT_OPTIONS,
                },
                {
                  name: 'headingFontCustom',
                  type: 'text',
                  label: 'Custom heading font (Google Fonts name)',
                  admin: {
                    condition: (_, s) => s?.headingFont === 'custom',
                    description: 'Exact Google Fonts family name, e.g. "Playfair Display".',
                  },
                },
                {
                  name: 'bodyFont',
                  type: 'select',
                  defaultValue: 'default',
                  label: 'Paragraph / body font',
                  admin: {
                    description: 'Used for body text and most of the interface.',
                  },
                  options: FONT_OPTIONS,
                },
                {
                  name: 'bodyFontCustom',
                  type: 'text',
                  label: 'Custom body font (Google Fonts name)',
                  admin: {
                    condition: (_, s) => s?.bodyFont === 'custom',
                    description: 'Exact Google Fonts family name, e.g. "Inter".',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Social links',
          description: 'Icons shown in the sidebar. Drag to reorder.',
          fields: [
            {
              name: 'socials',
              type: 'array',
              labels: { singular: 'Social link', plural: 'Social links' },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'X / Twitter', value: 'x' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'GitHub', value: 'github' },
                    { label: 'Email', value: 'mail' },
                    { label: 'Phone', value: 'phone' },
                    { label: 'Website', value: 'globe' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: {
                    description:
                      'Full URL including https:// e.g. https://www.instagram.com/yourhandle — or mailto:you@example.com for email.',
                  },
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icon (overrides platform default)',
                  admin: {
                    description: 'Leave blank to use the platform icon.',
                    components: { Field: '@/components/IconPicker#IconPicker' },
                  },
                },
                {
                  name: 'color',
                  type: 'text',
                  label: 'Icon colour',
                  admin: {
                    description: 'Optional hex colour e.g. #E1306C. Leave blank to inherit.',
                    components: { Field: '@/components/ColorField#ColorField' },
                  },
                },
                {
                  name: 'size',
                  type: 'number',
                  label: 'Icon size (px)',
                  defaultValue: 18,
                  admin: { description: 'Default is 18 px.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Footer',
          description: 'Copyright lines shown at the bottom of the sidebar.',
          fields: [
            {
              name: 'copyrightLine1',
              type: 'text',
              label: 'Copyright — line 1',
              defaultValue: '© 2025 Stephan Rozario',
            },
            {
              name: 'copyrightLine2',
              type: 'text',
              label: 'Copyright — line 2',
              defaultValue: 'All rights reserved.',
            },
          ],
        },
      ],
    },
  ],
}
