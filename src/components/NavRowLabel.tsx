'use client'

import { useRowLabel } from '@payloadcms/ui'

// Shows the menu item's label (and type) on each draggable row in the
// admin menu builder, instead of a generic "Item 01".
export const NavRowLabel = () => {
  const { data } = useRowLabel<{ label?: string; type?: string }>()
  const label = data?.label || 'Untitled item'
  const suffix = data?.type === 'dropdown' ? '  ·  dropdown' : ''
  return (
    <span>
      {label}
      {suffix}
    </span>
  )
}
