import React from 'react'

// Compact "SR" monogram shown at the top of the admin sidebar nav.
export const Icon = () => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 28,
      height: 28,
      borderRadius: 7,
      background: 'var(--sr-accent)',
      color: '#fff',
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: '0.02em',
    }}
  >
    SR
  </span>
)

export default Icon
