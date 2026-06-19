'use client'

import React, { useState, useMemo } from 'react'
import { useField } from '@payloadcms/ui'
import { ICON_MAP, ICON_NAMES } from './iconList'

type Props = { path: string; field?: { label?: string; admin?: { description?: string } } }

export function IconPicker({ path, field }: Props) {
  const { value, setValue } = useField<string>({ path })
  const [search, setSearch] = useState('')

  const q = search.trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!q) return []
    return ICON_NAMES.filter((name) => name.includes(q)).slice(0, 40)
  }, [q])

  const CurrentIcon = value ? ICON_MAP[value] : null

  return (
    <div style={{ fontFamily: 'inherit', marginBottom: 20 }}>
      {field?.label && (
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 13 }}>
          {field.label}
        </label>
      )}

      {/* Current selection */}
      {CurrentIcon && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '5px 10px', background: 'var(--theme-elevation-50,#f3f4f6)', borderRadius: 4, fontSize: 13 }}>
          <CurrentIcon size={16} />
          <span>{value}</span>
          <button type="button" onClick={() => setValue('')} style={{ marginLeft: 4, background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, fontSize: 14, lineHeight: 1 }}>✕</button>
        </div>
      )}

      {/* Search */}
      <input
        type="text"
        placeholder="Search icons… e.g. camera, arrow, heart"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', padding: '7px 10px', marginBottom: 6, border: '1px solid var(--theme-elevation-150,#d1d5db)', borderRadius: 4, fontSize: 13, background: 'var(--theme-input-bg,#fff)', color: 'inherit', boxSizing: 'border-box' }}
      />

      {q && filtered.length === 0 && (
        <p style={{ fontSize: 12, color: 'var(--theme-elevation-500,#6b7280)', margin: '4px 0 0' }}>
          No icons match "{search}"
        </p>
      )}

      {filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: 3, border: '1px solid var(--theme-elevation-150,#d1d5db)', borderRadius: 4, padding: 6, marginTop: 2 }}>
          {filtered.map((name) => {
            const Icon = ICON_MAP[name]
            if (!Icon) return null
            const selected = value === name
            return (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => setValue(name)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 2px 5px', gap: 4, border: selected ? '2px solid #3b82f6' : '1px solid transparent', borderRadius: 4, cursor: 'pointer', background: selected ? '#dbeafe' : 'transparent', color: selected ? '#1d4ed8' : 'inherit', transition: 'background 0.12s' }}
              >
                <Icon size={18} />
                <span style={{ fontSize: 9, textAlign: 'center', lineHeight: 1.2, maxWidth: 68, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {name}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {field?.admin?.description && (
        <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>{field.admin.description}</div>
      )}
    </div>
  )
}
