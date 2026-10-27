'use server'

import { headers } from 'next/headers'

export type Field = 'name' | 'email' | 'topic' | 'message'
export type FieldError = 'required' | 'invalid' | 'tooShort' | 'tooLong'
export type ContactState = {
  status: 'idle' | 'invalid' | 'sent' | 'failed' | 'not-configured' | 'rejected'
  errors?: Partial<Record<Field, FieldError>>
  values?: Partial<Record<Field, string>>
}

const TOPICS = ['role', 'project', 'collab', 'other'] as const
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const MIN_FILL_MS = 2500

const str = (v: FormDataEntryValue | null) => (typeof v === 'string' ? v.trim() : '')

export async function sendContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  const values = { name: str(form.get('name')), email: str(form.get('email')), topic: str(form.get('topic')), message: str(form.get('message')) }

  // Basic spam defence, part 1: a hidden honeypot field that people never see.
  if (str(form.get('website'))) return { status: 'rejected', values }

  const errors: ContactState['errors'] = {}
  if (!values.name) errors.name = 'required'
  else if (values.name.length > 100) errors.name = 'tooLong'
  if (!values.email) errors.email = 'required'
  else if (values.email.length > 200 || !EMAIL.test(values.email)) errors.email = 'invalid'
  if (!(TOPICS as readonly string[]).includes(values.topic)) errors.topic = 'required'
  if (values.message.length < 20) errors.message = 'tooShort'
  else if (values.message.length > 5000) errors.message = 'tooLong'
  if (Object.keys(errors).length) return { status: 'invalid', errors, values }

  // Part 2: a complete, valid message filled in faster than a person can type is treated as automated.
  const startedAt = Number(str(form.get('startedAt')))
  if (startedAt && Date.now() - startedAt < MIN_FILL_MS) return { status: 'rejected', values }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL
  // Never pretend to have sent anything when delivery is not set up.
  if (!apiKey || !to || !from) return { status: 'not-configured', values }

  const h = await headers()
  const text = [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Topic: ${values.topic}`,
    `Page language: ${str(form.get('locale')) || 'unknown'}`,
    `User agent: ${h.get('user-agent') ?? 'unknown'}`,
    '',
    values.message,
  ].join('\n')

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: values.email, subject: `Website contact (${values.topic}): ${values.name}`.slice(0, 150), text }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) {
      console.error('Contact form: email provider returned', res.status)
      return { status: 'failed', values }
    }
    return { status: 'sent' }
  } catch (err) {
    console.error('Contact form: email request failed', err instanceof Error ? err.message : err)
    return { status: 'failed', values }
  }
}
