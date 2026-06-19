'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

type FormField = {
  blockType: string
  name?: string
  label?: string
  required?: boolean
  width?: number
  defaultValue?: any
  placeholder?: string
  options?: { label: string; value: string }[]
  message?: any
}

type FormDoc = {
  id: string
  fields?: FormField[]
  submitButtonLabel?: string
  confirmationType?: 'message' | 'redirect'
  confirmationMessage?: any
  redirect?: { url?: string }
}

export function FormBlock({ form, intro }: { form: FormDoc | string | null; intro?: any }) {
  const f = typeof form === 'object' ? form : null
  const [values, setValues] = useState<Record<string, any>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  if (!f) return null
  const fields = f.fields || []
  const set = (name: string, value: any) => setValues((v) => ({ ...v, [name]: value }))

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const submissionData = fields
      .filter((fld) => fld.name && fld.blockType !== 'message')
      .map((fld) => ({
        field: fld.name as string,
        value: String(values[fld.name as string] ?? fld.defaultValue ?? ''),
      }))

    try {
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: f!.id, submissionData }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.errors?.[0]?.message || 'Submission failed')
      }
      if (f!.confirmationType === 'redirect' && f!.redirect?.url) {
        window.location.href = f!.redirect.url
        return
      }
      setStatus('success')
    } catch (err: any) {
      setErrorMsg(err?.message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="b-form b-form-success">
        {f.confirmationMessage ? (
          <RichText data={f.confirmationMessage} />
        ) : (
          <p>Thank you — your message has been sent.</p>
        )}
      </div>
    )
  }

  return (
    <div className="b-form">
      {intro ? (
        <div className="b-form-intro">
          <RichText data={intro} />
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="b-form-fields">
        {fields.map((fld, i) => {
          const name = fld.name || `field-${i}`
          const basis = `calc(${fld.width || 100}% - 9px)`

          if (fld.blockType === 'message') {
            return (
              <div key={i} className="b-form-msg" style={{ flexBasis: '100%' }}>
                {fld.message ? <RichText data={fld.message} /> : null}
              </div>
            )
          }

          if (fld.blockType === 'checkbox') {
            return (
              <label key={i} className="b-form-check" style={{ flexBasis: basis }}>
                <input
                  type="checkbox"
                  checked={!!values[name]}
                  required={fld.required}
                  onChange={(e) => set(name, e.target.checked)}
                />
                <span>
                  {fld.label}
                  {fld.required ? ' *' : ''}
                </span>
              </label>
            )
          }

          return (
            <div key={i} className="b-form-field" style={{ flexBasis: basis }}>
              {fld.label ? (
                <label htmlFor={name}>
                  {fld.label}
                  {fld.required ? ' *' : ''}
                </label>
              ) : null}

              {fld.blockType === 'textarea' ? (
                <textarea
                  id={name}
                  rows={5}
                  required={fld.required}
                  placeholder={fld.placeholder}
                  value={values[name] ?? ''}
                  onChange={(e) => set(name, e.target.value)}
                />
              ) : fld.blockType === 'select' ? (
                <select
                  id={name}
                  required={fld.required}
                  value={values[name] ?? ''}
                  onChange={(e) => set(name, e.target.value)}
                >
                  <option value="">Select…</option>
                  {(fld.options || []).map((o, oi) => (
                    <option key={oi} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={name}
                  required={fld.required}
                  type={fld.blockType === 'email' ? 'email' : fld.blockType === 'number' ? 'number' : 'text'}
                  placeholder={fld.placeholder}
                  value={values[name] ?? ''}
                  onChange={(e) => set(name, e.target.value)}
                />
              )}
            </div>
          )
        })}

        <div style={{ flexBasis: '100%' }}>
          <button type="submit" className="b-button solid" disabled={status === 'loading'}>
            {status === 'loading' ? 'Sending…' : f.submitButtonLabel || 'Send'}
          </button>
          {status === 'error' ? <span className="b-form-error">{errorMsg}</span> : null}
        </div>
      </form>
    </div>
  )
}
