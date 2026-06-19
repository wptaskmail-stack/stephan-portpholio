import React from 'react'

// One-line welcome rendered above the login form (admin.components.beforeLogin).
export const BeforeLogin = () => (
  <p
    style={{
      textAlign: 'center',
      margin: '0 0 18px',
      color: 'var(--theme-elevation-500)',
      fontSize: 14,
    }}
  >
    Welcome back — sign in to manage your portfolio.
  </p>
)

export default BeforeLogin
