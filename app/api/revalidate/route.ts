import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

type WebhookPayload = { _type?: string }

/**
 * Called by a Sanity webhook on publish/unpublish. Verifies the signature with
 * SANITY_REVALIDATE_SECRET, then expires the cache tag for the changed document type.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) return NextResponse.json({ message: 'Revalidation secret is not configured' }, { status: 500 })
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(req, secret, true)
    if (!isValidSignature) return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
    if (!body?._type) return NextResponse.json({ message: 'Missing document type' }, { status: 400 })
    revalidateTag(body._type, { expire: 0 })
    return NextResponse.json({ revalidated: [body._type] })
  } catch (err) {
    console.error('Revalidate webhook failed', err)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}
