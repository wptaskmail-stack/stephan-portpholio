'use client'

import { useState, useEffect, useCallback } from 'react'

type Media = { url?: string | null; alt?: string | null }

type Props = {
  type: 'fixed' | 'slideshow'
  images: (Media | string)[]
  height: 'small' | 'medium' | 'large' | 'full' | 'custom'
  customHeight?: number | null
  width: 'full' | 'contained' | 'custom'
  customWidth?: number | null
  objectFit?: 'cover' | 'contain'
  slideDuration?: number | null
  transition?: 'fade' | 'slide'
  showDots?: boolean
  showArrows?: boolean
}

const HEIGHT_MAP: Record<string, string> = {
  small: '40vh',
  medium: '60vh',
  large: '80vh',
  full: '100vh',
}

export function BannerBlock({
  type,
  images,
  height,
  customHeight,
  width,
  customWidth,
  objectFit = 'cover',
  slideDuration = 5,
  transition = 'fade',
  showDots = true,
  showArrows = true,
}: Props) {
  const slides = (images || [])
    .map((m) => (typeof m === 'object' ? m : null))
    .filter((m): m is Media => !!m && !!m.url)

  const [current, setCurrent] = useState(0)
  const total = slides.length

  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total])

  useEffect(() => {
    if (type !== 'slideshow' || total <= 1) return
    const ms = (slideDuration ?? 5) * 1000
    const id = setInterval(next, ms)
    return () => clearInterval(id)
  }, [type, total, slideDuration, next])

  if (!slides.length) return null

  const heightStyle = height === 'custom' ? `${customHeight || 400}px` : (HEIGHT_MAP[height] || '60vh')
  const maxWidthStyle = width === 'contained' ? '1200px' : width === 'custom' ? `${customWidth || 1200}px` : 'none'

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: maxWidthStyle,
    height: heightStyle,
    overflow: 'hidden',
    margin: maxWidthStyle !== 'none' ? '0 auto' : undefined,
    background: '#111',
  }

  if (type === 'fixed' || total === 1) {
    const img = slides[0]
    return (
      <div className="b-banner" style={containerStyle}>
        <img
          src={img.url as string}
          alt={img.alt || ''}
          style={{ width: '100%', height: '100%', objectFit, display: 'block' }}
        />
      </div>
    )
  }

  // --- slideshow ---
  return (
    <div className="b-banner b-banner-slideshow" style={containerStyle}>

      {/* Slides */}
      {slides.map((img, i) => {
        let slideStyle: React.CSSProperties = {
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }
        if (transition === 'fade') {
          slideStyle = {
            ...slideStyle,
            opacity: i === current ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }
        } else {
          slideStyle = {
            ...slideStyle,
            transform: `translateX(${(i - current) * 100}%)`,
            transition: 'transform 0.6s ease',
          }
        }
        return (
          <div key={i} style={slideStyle}>
            <img
              src={img.url as string}
              alt={img.alt || ''}
              style={{ width: '100%', height: '100%', objectFit, display: 'block' }}
            />
          </div>
        )
      })}

      {/* Arrows */}
      {showArrows && total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous"
            className="b-banner-arrow b-banner-arrow-prev"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="b-banner-arrow b-banner-arrow-next"
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && total > 1 && (
        <div className="b-banner-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className={`b-banner-dot${i === current ? ' active' : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
