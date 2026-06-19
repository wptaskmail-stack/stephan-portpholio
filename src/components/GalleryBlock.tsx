'use client'

import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

type Media = { url?: string | null; alt?: string | null }

export function GalleryBlock({
  images,
  columns,
  gap,
}: {
  images: (Media | string)[]
  columns: string
  gap: string
}) {
  const [index, setIndex] = useState(-1)

  // `images` is now a multi-select upload: an array of media docs.
  const pics = (images || [])
    .map((m) => (typeof m === 'object' ? m : null))
    .filter((m): m is Media => !!m && !!m.url)

  const gapPx = gap === 'small' ? 8 : gap === 'large' ? 24 : 14

  return (
    <div className="b-gallery">
      <div
        className="b-gallery-grid"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: gapPx }}
      >
        {pics.map((m, i) => (
          <figure key={i} onClick={() => setIndex(i)}>
            <img src={m.url as string} alt={m.alt || ''} loading="lazy" />
          </figure>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        index={Math.max(index, 0)}
        close={() => setIndex(-1)}
        slides={pics.map((m) => ({ src: m.url as string, alt: m.alt || '' }))}
      />
    </div>
  )
}
