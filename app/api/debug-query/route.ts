import { NextResponse } from 'next/server'
import { sanityFetch } from '@/lib/sanity.client'
import { ROUND_DETAIL_QUERY } from '@/lib/queries'

export async function GET() {
  try {
    const round = await sanityFetch({ query: ROUND_DETAIL_QUERY, params: { slug: '2026-r1' }, revalidate: 0 })
    return NextResponse.json({ ok: true, title: (round as any)?.title, keys: Object.keys(round as any || {}) })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message, stack: err.stack?.substring(0, 500) }, { status: 500 })
  }
}
