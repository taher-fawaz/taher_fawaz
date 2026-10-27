'use client'

import { useActionState, useEffect, useRef } from 'react'
import { sendContact, type ContactState, type Field, type FieldError } from '@/app/(site)/[locale]/contact/actions'

type Copy = {
  name: string; email: string; topic: string; message: string; choose: string; send: string; sending: string; privacy: string
  topics: Record<'role' | 'project' | 'collab' | 'other', string>
  errors: Record<'name' | 'email' | 'topic' | 'message' | 'tooLong', string>
  status: Record<'invalid' | 'sent' | 'failed' | 'not-configured' | 'rejected', string>
}

const initial: ContactState = { status: 'idle' }

export function ContactForm({ copy, locale }: { copy: Copy; locale: string }) {
  const [state, action, pending] = useActionState(sendContact, initial)
  const statusRef = useRef<HTMLDivElement>(null)
  const startedRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // After a response, move focus to the first invalid field, or to the status message.
  useEffect(() => {
    if (state.status === 'idle') return
    const firstBad = (['name', 'email', 'topic', 'message'] as Field[]).find((f) => state.errors?.[f])
    if (firstBad) formRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus()
    else statusRef.current?.focus()
  }, [state])

  const msg = (field: Field, err?: FieldError) => (err === 'tooLong' ? copy.errors.tooLong : err ? copy.errors[field] : undefined)
  const v = state.values ?? {}
  const fieldClass = 'min-h-12 w-full rounded-[2px] border border-muted bg-paper px-3 py-2.5 transition-[border-color] duration-150 hover:border-forest aria-[invalid=true]:border-error'

  const err = (field: Field) => {
    const text = msg(field, state.errors?.[field])
    return text ? <p id={`${field}-error`} className="mt-1.5 text-[0.9rem] text-error">{text}</p> : null
  }
  const describedBy = (field: Field) => (state.errors?.[field] ? `${field}-error` : undefined)

  return (
    <form
      ref={formRef}
      action={action}
      noValidate
      className="grid gap-5"
      onFocusCapture={() => {
        if (startedRef.current && !startedRef.current.value) startedRef.current.value = String(Date.now())
      }}
    >
      <input type="hidden" name="locale" value={locale} />
      <input ref={startedRef} type="hidden" name="startedAt" defaultValue="" />
      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div>
        <label htmlFor="cf-name" className="mb-1.5 block font-medium">{copy.name}</label>
        <input id="cf-name" name="name" autoComplete="name" required maxLength={100} defaultValue={v.name} aria-invalid={!!state.errors?.name} aria-describedby={describedBy('name')} className={fieldClass} />
        {err('name')}
      </div>
      <div>
        <label htmlFor="cf-email" className="mb-1.5 block font-medium">{copy.email}</label>
        <input id="cf-email" name="email" type="email" dir="ltr" inputMode="email" autoComplete="email" required maxLength={200} defaultValue={v.email} aria-invalid={!!state.errors?.email} aria-describedby={describedBy('email')} className={`${fieldClass} text-start [html[dir=rtl]_&]:text-right`} />
        {err('email')}
      </div>
      <div>
        <label htmlFor="cf-topic" className="mb-1.5 block font-medium">{copy.topic}</label>
        <select id="cf-topic" name="topic" required defaultValue={v.topic ?? ''} key={v.topic ?? 'empty'} aria-invalid={!!state.errors?.topic} aria-describedby={describedBy('topic')} className={fieldClass}>
          <option value="" disabled>{copy.choose}</option>
          {(Object.keys(copy.topics) as (keyof Copy['topics'])[]).map((t) => (
            <option key={t} value={t}>{copy.topics[t]}</option>
          ))}
        </select>
        {err('topic')}
      </div>
      <div>
        <label htmlFor="cf-message" className="mb-1.5 block font-medium">{copy.message}</label>
        <textarea id="cf-message" name="message" required minLength={20} maxLength={5000} rows={7} defaultValue={v.message} aria-invalid={!!state.errors?.message} aria-describedby={describedBy('message')} className={`${fieldClass} resize-y`} />
        {err('message')}
      </div>
      <p className="text-[0.88rem] text-muted">{copy.privacy}</p>
      <div>
        <button type="submit" className="btn" disabled={pending} aria-disabled={pending}>
          {pending ? copy.sending : copy.send}
        </button>
      </div>
      <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
        {state.status !== 'idle' ? (
          <p className={`border px-4 py-3.5 ${state.status === 'sent' ? 'border-forest' : 'border-error'}`}>{copy.status[state.status]}</p>
        ) : null}
      </div>
    </form>
  )
}
