// app/api/admin/standings-import/preview/route.ts
// 클래스 목록 + 기존 스탠딩 문서 목록 조회
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const SANITY_PROJECT_ID  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const SANITY_DATASET     = 'production'
const SANITY_API_VERSION = '2024-01-01'

function makeToken(password: string) {
  return crypto.createHash('sha256').update(password + ':inje-gt-admin').digest('hex')
}

function isAuthorized(): boolean {
  const cookieStore = cookies()
  const token = cookieStore.get('admin_auth')?.value
  if (!token) return false
  const expected = makeToken(process.env.ADMIN_PASSWORD ?? 'admin1234')
  return token === expected
}

async function sanityQuery<T>(query: string): Promise<T> {
  const url = new URL(
    `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`
  )
  url.searchParams.set('query', query)
  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`)
  const json = await res.json()
  return json.result as T
}

// GET — 클래스 목록 + 기존 스탠딩 문서 목록
export async function GET() {
  if (!isAuthorized()) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  try {
    const [classes, existingStandings] = await Promise.all([
      sanityQuery<{ _id: string; name: string; classCode: string }[]>(
        `*[_type=="classInfo" && isActive==true] | order(order asc) { _id, name, classCode }`
      ),
      sanityQuery<{ _id: string; _type: string; season: number; classCode: string }[]>(
        `*[_type in ["teamStanding","driverStanding"]] | order(season desc) {
          _id, _type, season, "classCode": classInfo->classCode
        }`
      ),
    ])
    return NextResponse.json({ ok: true, classes, existingStandings })
  } catch (err) {
    console.error('Standings preview GET error:', err)
    return NextResponse.json({ ok: false, error: 'sanity_error' }, { status: 500 })
  }
}
