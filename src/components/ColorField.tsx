'use client'

import { useField } from '@payloadcms/ui'

type Props = { path: string; field?: { label?: string; admin?: { description?: string } } }

// A native colour picker + hex input for the admin. Leaving it blank means
// the page falls back to the selected theme's colour.
export const ColorField = ({ path, field }: Props) => {
  const { value, setValue } = useField<string>({ path })
  const current = value || ''

  return (
    <div className="field-type" style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 13 }}>
        {field?.label || 'Colour'}
      </label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="color"
          value={current || '#ffffff'}
          onChange={(e) => setValue(e.target.value)}
          style={{ width: 46, height: 38, padding: 2, borderRadius: 4, cursor: 'pointer' }}
          aria-label="Pick a colour"
        />
        <input
          type="text"
          value={current}
          placeholder="#ffffff — blank uses theme default"
          onChange={(e) => setValue(e.target.value)}
          style={{ flex: 1 }}
        />
        {current ? (
          <button
            type="button"
            className="btn btn--style-secondary btn--size-small"
            onClick={() => setValue('')}
          >
            Clear
          </button>
        ) : null}
      </div>
      {field?.admin?.description ? (
        <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>{field.admin.description}</div>
      ) : null}
    </div>
  )
}
