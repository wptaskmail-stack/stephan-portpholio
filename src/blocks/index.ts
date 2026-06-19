import type { Block, Field } from 'payload'

// Each block is a "widget" the admin can stack on a page. The frontend has a
// matching renderer for every slug here (see src/components/RenderBlocks.tsx).

// Reusable OPTIONAL link group. Spread into a block to make it clickable: when
// "Clickable?" is left on "Not clickable" the block renders normally; otherwise
// it links to a page or an external URL. Field names are distinct from the
// Button block's so the two never get confused. See RenderBlocks `blockLink()`.
const linkFields: Field[] = [
  {
    type: 'collapsible',
    label: 'Link (make clickable)',
    admin: { initCollapsed: true },
    fields: [
      {
        name: 'linkType',
        type: 'select',
        defaultValue: 'none',
        label: 'Clickable?',
        options: [
          { label: 'Not clickable', value: 'none' },
          { label: 'Link to a page', value: 'page' },
          { label: 'External URL', value: 'external' },
        ],
      },
      {
        name: 'linkPage',
        type: 'relationship',
        relationTo: 'pages',
        label: 'Page',
        admin: { condition: (_, s) => s?.linkType === 'page' },
      },
      {
        name: 'linkUrl',
        type: 'text',
        label: 'External URL',
        admin: { condition: (_, s) => s?.linkType === 'external' },
      },
      {
        name: 'linkNewTab',
        type: 'checkbox',
        label: 'Open in new tab',
        admin: { condition: (_, s) => s?.linkType === 'external' },
      },
    ],
  },
]

export const Banner: Block = {
  slug: 'banner',
  interfaceName: 'BannerBlock',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'fixed',
      label: 'Banner type',
      options: [
        { label: 'Fixed (single image)', value: 'fixed' },
        { label: 'Slideshow', value: 'slideshow' },
      ],
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      label: 'Images',
    },
    // --- height ---
    {
      name: 'height',
      type: 'select',
      defaultValue: 'medium',
      label: 'Height',
      options: [
        { label: 'Small  — 40 vh', value: 'small' },
        { label: 'Medium — 60 vh', value: 'medium' },
        { label: 'Large  — 80 vh', value: 'large' },
        { label: 'Full screen — 100 vh', value: 'full' },
        { label: 'Custom (px)', value: 'custom' },
      ],
    },
    {
      name: 'customHeight',
      type: 'number',
      label: 'Custom height (px)',
      admin: { condition: (_, s) => s?.height === 'custom' },
    },
    // --- width ---
    {
      name: 'width',
      type: 'select',
      defaultValue: 'full',
      label: 'Width',
      options: [
        { label: 'Full width', value: 'full' },
        { label: 'Contained (max 1200 px)', value: 'contained' },
        { label: 'Custom (px)', value: 'custom' },
      ],
    },
    {
      name: 'customWidth',
      type: 'number',
      label: 'Custom width (px)',
      admin: { condition: (_, s) => s?.width === 'custom' },
    },
    // --- image fit ---
    {
      name: 'objectFit',
      type: 'select',
      defaultValue: 'cover',
      label: 'Image fit',
      options: [
        { label: 'Cover (fill & crop)', value: 'cover' },
        { label: 'Contain (show whole image)', value: 'contain' },
      ],
    },
    // --- slideshow options (shown only when type = slideshow) ---
    {
      name: 'slideDuration',
      type: 'number',
      label: 'Slide duration (seconds)',
      defaultValue: 5,
      admin: {
        condition: (_, s) => s?.type === 'slideshow',
        description: 'How long each image is displayed before moving to the next.',
      },
    },
    {
      name: 'transition',
      type: 'select',
      defaultValue: 'fade',
      label: 'Transition',
      admin: { condition: (_, s) => s?.type === 'slideshow' },
      options: [
        { label: 'Fade', value: 'fade' },
        { label: 'Slide', value: 'slide' },
      ],
    },
    {
      name: 'showDots',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show navigation dots',
      admin: { condition: (_, s) => s?.type === 'slideshow' },
    },
    {
      name: 'showArrows',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show prev / next arrows',
      admin: { condition: (_, s) => s?.type === 'slideshow' },
    },
  ],
}

export const Heading: Block = {
  slug: 'heading',
  interfaceName: 'HeadingBlock',
  fields: [
    { name: 'text', type: 'text', required: true },
    {
      name: 'level',
      type: 'select',
      defaultValue: 'h2',
      options: [
        { label: 'Large (H2)', value: 'h2' },
        { label: 'Medium (H3)', value: 'h3' },
        { label: 'Small (H4)', value: 'h4' },
      ],
    },
    {
      name: 'align',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
      ],
    },
    ...linkFields,
  ],
}

export const Text: Block = {
  slug: 'text',
  interfaceName: 'TextBlock',
  fields: [
    { name: 'content', type: 'richText' },
    {
      name: 'align',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
      ],
    },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'full',
      options: [
        { label: 'Full width', value: 'full' },
        { label: 'Readable (narrow)', value: 'readable' },
      ],
    },
  ],
}

export const ImageBlock: Block = {
  slug: 'image',
  interfaceName: 'ImageBlock',
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text' },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'full',
      options: [
        { label: 'Full width', value: 'full' },
        { label: 'Large (~780px)', value: 'large' },
        { label: 'Medium (~480px)', value: 'medium' },
        { label: 'Custom', value: 'custom' },
      ],
    },
    {
      name: 'customWidth',
      type: 'number',
      label: 'Custom width (px)',
      admin: {
        condition: (_, s) => s?.width === 'custom',
        description: 'Width in pixels',
      },
    },
    {
      name: 'customHeight',
      type: 'number',
      label: 'Height (px)',
      admin: { description: 'Leave empty for natural image height' },
    },
    {
      name: 'align',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    ...linkFields,
  ],
}

export const Gallery: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  fields: [
    {
      // hasMany upload = pick/upload many images at once, drag to reorder.
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
        { label: '4 columns', value: '4' },
      ],
    },
    {
      name: 'gap',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
      ],
    },
  ],
}


export const IconBox: Block = {
  slug: 'iconBox',
  interfaceName: 'IconBoxBlock',
  fields: [
    {
      name: 'icon',
      type: 'text',
      defaultValue: 'star',
      admin: {
        components: { Field: '@/components/IconPicker#IconPicker' },
      },
    },
    {
      name: 'iconSize',
      type: 'number',
      label: 'Icon size (px)',
      defaultValue: 28,
      admin: { description: 'Default is 28px.' },
    },
    {
      name: 'iconColor',
      type: 'text',
      label: 'Icon colour',
      admin: {
        description: 'Hex colour e.g. #a8553a. Leave blank to use the accent colour.',
        components: { Field: '@/components/ColorField#ColorField' },
      },
    },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'align',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
      ],
    },
    ...linkFields,
  ],
}

export const Button: Block = {
  slug: 'button',
  interfaceName: 'ButtonBlock',
  fields: [
    { name: 'label', type: 'text', required: true },
    {
      name: 'linkType',
      type: 'select',
      defaultValue: 'page',
      options: [
        { label: 'Link to a page', value: 'page' },
        { label: 'External URL', value: 'external' },
      ],
    },
    {
      name: 'page',
      type: 'relationship',
      relationTo: 'pages',
      admin: { condition: (_, s) => s?.linkType === 'page' },
    },
    {
      name: 'url',
      type: 'text',
      admin: { condition: (_, s) => s?.linkType === 'external' },
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'outline',
      options: [
        { label: 'Outline', value: 'outline' },
        { label: 'Solid', value: 'solid' },
      ],
    },
  ],
}

// Spacer: drop anywhere to add empty space. Each side is a margin in px.
// Defined before Columns/Row because their inner block lists reference it.
export const Margin: Block = {
  slug: 'margin',
  interfaceName: 'MarginBlock',
  labels: { singular: 'Margin / spacer', plural: 'Margins / spacers' },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'top', type: 'number', label: 'Top (px)', defaultValue: 24 },
        { name: 'right', type: 'number', label: 'Right (px)', defaultValue: 0 },
        { name: 'bottom', type: 'number', label: 'Bottom (px)', defaultValue: 0 },
        { name: 'left', type: 'number', label: 'Left (px)', defaultValue: 0 },
      ],
    },
  ],
}

// Containers: 1–4 columns, each holding its own stack of simple blocks.
// (Gallery and nested Columns are kept top-level to keep the UI sane.)
export const Columns: Block = {
  slug: 'columns',
  interfaceName: 'ColumnsBlock',
  fields: [
    {
      name: 'columns',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      labels: { singular: 'Column', plural: 'Columns' },
      fields: [
        {
          name: 'blocks',
          type: 'blocks',
          blocks: [Heading, Text, ImageBlock, IconBox, Button, Margin],
        },
      ],
    },
  ],
}

export const Row: Block = {
  slug: 'row',
  interfaceName: 'RowBlock',
  labels: { singular: 'Row', plural: 'Rows' },
  fields: [
    {
      name: 'gap',
      type: 'select',
      defaultValue: 'medium',
      label: 'Column gap',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
      ],
    },
    {
      name: 'verticalAlign',
      type: 'select',
      defaultValue: 'top',
      label: 'Vertical alignment',
      options: [
        { label: 'Top', value: 'top' },
        { label: 'Center', value: 'center' },
        { label: 'Bottom', value: 'bottom' },
        { label: 'Stretch', value: 'stretch' },
      ],
    },
    {
      name: 'stackOnMobile',
      type: 'checkbox',
      defaultValue: true,
      label: 'Stack columns on mobile',
    },
    {
      name: 'columns',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      labels: { singular: 'Column', plural: 'Columns' },
      fields: [
        {
          name: 'width',
          type: 'select',
          defaultValue: 'auto',
          label: 'Column width',
          options: [
            { label: 'Auto (equal share)', value: 'auto' },
            { label: '1/6', value: '16' },
            { label: '1/4', value: '25' },
            { label: '1/3', value: '33' },
            { label: '5/12', value: '41' },
            { label: '1/2', value: '50' },
            { label: '7/12', value: '58' },
            { label: '2/3', value: '66' },
            { label: '3/4', value: '75' },
            { label: '5/6', value: '83' },
            { label: 'Full', value: '100' },
          ],
        },
        {
          name: 'blocks',
          type: 'blocks',
          blocks: [Heading, Text, ImageBlock, Gallery, IconBox, Button, Margin],
        },
      ],
    },
  ],
}

// Drops an admin-built form (from the Form Builder) onto a page.
export const FormBlock: Block = {
  slug: 'formBlock',
  interfaceName: 'FormBlockType',
  labels: { singular: 'Form', plural: 'Forms' },
  fields: [
    { name: 'form', type: 'relationship', relationTo: 'forms', required: true },
    { name: 'intro', type: 'richText' },
  ],
}

// The full set offered on a page.
export const pageBlocks: Block[] = [Banner, Heading, Text, ImageBlock, Gallery, IconBox, Button, Columns, Row, Margin, FormBlock]
