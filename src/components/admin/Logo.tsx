import React from 'react'

// Wordmark shown as the graphic on the /admin login screen.
// Inline styles use Payload's theme tokens + our --sr-accent so it adapts to
// both light and dark modes (see src/styles/admin.css).
export const Logo = () => (
  <div style={{ textAlign: 'center', lineHeight: 1.1 }}>
    <div
      style={{
        fontSize: 34,
        fontWeight: 600,
        letterSpacing: '0.01em',
        color: 'var(--theme-text)',
      }}
    >
      Stephan&nbsp;Rozario
    </div>
    <div
      style={{
        marginTop: 8,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color: 'var(--sr-accent)',
      }}
    >
      Studio · Admin
    </div>
  </div>
)

export default Logo
