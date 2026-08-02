// app/api/admin/results-batch/route.ts — 경기 결과 일괄 등록 (data/results-import.json)
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import resultsData from '@/data/results-import.json'

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const SANITY_DATASET = 'production'
const SANITY_API_VERSION = '2024-01-01'

interface Standing {
  position: number; carNumber?: string; teamName?: string
  driver1?: string; driver2?: string; driver3?: string
  laps?: number; totalTime?: string; gap?: string; fastestLap?: string
  points?: number; status?: string
}
interface ResultSet {
  roundRef: string; classRef: string; classKey?: string
  raceType: string; standings: Standing[]
}

function makeToken(password: string) {
  return crypto.createHash('sha256').update(password + ':inje-gt-admin').digest('hex')
}
function isAuthorized(): boolean {
  const token = cookies().get('admin_auth')?.value
  if (!token) return false
  return token === makeToken(process.env.ADMIN_PASSWORD ?? 'admin1234')
}

const sets = resultsData as ResultSet[]

export async function GET() {
  if (!isAuthorized()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  return NextResponse.json({
    ok: true,
    sets: sets.map(s => ({
      classKey: s.classKey, classRef: s.classRef, raceType: s.raceType, count: s.standings.length,
      docId: `result-${s.roundRef}-${s.classRef}-${s.raceType}`,
    })),
  })
}

export async function POST() {
  if (!isAuthorized()) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const sanityToken = process.env.SANITY_API_WRITE_TOKEN
  if (!sanityToken) return NextResponse.json({ ok: false, error: 'SANITY_API_WRITE_TOKEN 미설정' }, { status: 500 })

  const now = new Date().toISOString()
  const mutations = sets.map(s => {
    const standings = s.standings.map((e, i) => ({ _key: `p${e.position ?? i}`, ...e }))
    return {
      createOrReplace: {
        _type: 'result',
        _id: `result-${s.roundRef}-${s.classRef}-${s.raceType}`,
        round: { _type: 'reference', _ref: s.roundRef },
        classInfo: { _type: 'reference', _ref: s.classRef },
        raceType: s.raceType,
        standings,
        publishedAt: now,
        isPublished: true,
      },
    }
  })

  try {
    const res = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sanityToken}` },
        body: JSON.stringify({ mutations }),
      }
    )
    if (!res.ok) {
      const t = await res.text()
      return NextResponse.json({ ok: false, error: `저장 실패: ${res.status} ${t}` }, { status: 500 })
    }
    return NextResponse.json({
      ok: true,
      created: mutations.length,
      detail: sets.map(s => `${s.classKey} ${s.raceType} (${s.standings.length})`),
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: '저장 중 오류: ' + (err as Error).message }, { status: 500 })
  }
}
