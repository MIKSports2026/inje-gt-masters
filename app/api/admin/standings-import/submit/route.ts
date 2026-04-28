// app/api/admin/standings-import/submit/route.ts — 스탠딩 Sanity 저장
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const SANITY_PROJECT_ID  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const SANITY_DATASET     = 'production'
const SANITY_API_VERSION = '2024-01-01'

const STANDING_TYPES = ['team', 'driver'] as const
type StandingType = (typeof STANDING_TYPES)[number]

interface TeamEntry {
  position:         number
  carNumber?:       string
  teamName:         string
  drivers?:         string
  racePoints:       number
  finishBonusPoints: number
  qualifyingPoints: number
  totalPoints:      number
}

interface DriverEntry {
  position:         number
  driverName:       string
  carNumber?:       string
  teamName?:        string
  racePoints:       number
  finishBonusPoints: number
  qualifyingPoints: number
  totalPoints:      number
}

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

export async function POST(req: Request) {
  if (!isAuthorized()) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const sanityToken = process.env.SANITY_API_WRITE_TOKEN
  if (!sanityToken) {
    return NextResponse.json({ ok: false, error: 'SANITY_API_WRITE_TOKEN 미설정' }, { status: 500 })
  }

  let body: {
    season:       number
    classRef:     string
    classCode:    string
    standingType: StandingType
    entries:      (TeamEntry | DriverEntry)[]
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: '잘못된 JSON 형식' }, { status: 400 })
  }

  const { season, classRef, classCode, standingType, entries } = body

  // ── 기본 필드 검증 ──────────────────────────────────────────
  if (!season || !Number.isInteger(season) || season < 2020) {
    return NextResponse.json({ ok: false, error: 'season 필수 (2020 이상 정수)' }, { status: 400 })
  }
  if (!classRef) {
    return NextResponse.json({ ok: false, error: 'classRef 필수' }, { status: 400 })
  }
  if (!standingType || !(STANDING_TYPES as readonly string[]).includes(standingType)) {
    return NextResponse.json({ ok: false, error: 'standingType은 team 또는 driver 중 하나' }, { status: 400 })
  }
  if (!entries || !Array.isArray(entries) || entries.length === 0) {
    return NextResponse.json({ ok: false, error: 'entries 배열이 비어있습니다' }, { status: 400 })
  }

  // ── entries 각 행 검증 ──────────────────────────────────────
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i]
    const rowLabel = `행 ${i + 1}`

    if (!e.position || !Number.isInteger(e.position) || e.position < 1) {
      return NextResponse.json({ ok: false, error: `${rowLabel}: position 필수 (1 이상 정수)` }, { status: 400 })
    }
    if (e.totalPoints === undefined || e.totalPoints === null) {
      return NextResponse.json({ ok: false, error: `${rowLabel}: totalPoints 필수` }, { status: 400 })
    }

    if (standingType === 'team') {
      const t = e as TeamEntry
      if (!t.teamName?.trim()) {
        return NextResponse.json({ ok: false, error: `${rowLabel}: teamName 필수` }, { status: 400 })
      }
    } else {
      const d = e as DriverEntry
      if (!d.driverName?.trim()) {
        return NextResponse.json({ ok: false, error: `${rowLabel}: driverName 필수` }, { status: 400 })
      }
    }
  }

  // ── entries에 _key 부여 ─────────────────────────────────────
  const normalizedEntries = entries.map((e, i) => {
    const base = {
      _key:             `p${e.position}-${i}`,
      position:         e.position,
      racePoints:       (e as TeamEntry).racePoints       ?? 0,
      finishBonusPoints:(e as TeamEntry).finishBonusPoints ?? 0,
      qualifyingPoints: (e as TeamEntry).qualifyingPoints  ?? 0,
      totalPoints:      e.totalPoints,
    }
    if (standingType === 'team') {
      const t = e as TeamEntry
      return {
        ...base,
        ...(t.carNumber?.trim() ? { carNumber: t.carNumber.trim() } : {}),
        teamName: t.teamName.trim(),
        ...(t.drivers?.trim()   ? { drivers:   t.drivers.trim()   } : {}),
      }
    } else {
      const d = e as DriverEntry
      return {
        ...base,
        driverName: d.driverName.trim(),
        ...(d.carNumber?.trim() ? { carNumber: d.carNumber.trim() } : {}),
        ...(d.teamName?.trim()  ? { teamName:  d.teamName.trim()  } : {}),
      }
    }
  })

  // ── Sanity 저장 ─────────────────────────────────────────────
  const docType   = standingType === 'team' ? 'teamStanding' : 'driverStanding'
  const safeCode  = (classCode ?? '').toLowerCase().replace(/\s+/g, '-')
  const documentId = `${docType}-${season}-${safeCode}`
  const now        = new Date().toISOString()

  const doc = {
    _type:      docType,
    _id:        documentId,
    season,
    classInfo:  { _type: 'reference', _ref: classRef },
    entries:    normalizedEntries,
    isPublished: true,
    updatedAt:   now,
  }

  try {
    const mutateRes = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${sanityToken}`,
        },
        body: JSON.stringify({ mutations: [{ createOrReplace: doc }] }),
      }
    )

    if (!mutateRes.ok) {
      const errText = await mutateRes.text()
      console.error('Sanity mutate error:', errText)
      return NextResponse.json({ ok: false, error: `Sanity 저장 실패: ${mutateRes.status}` }, { status: 500 })
    }

    return NextResponse.json({ ok: true, _id: documentId, count: normalizedEntries.length })
  } catch (err) {
    console.error('Submit error:', err)
    return NextResponse.json({ ok: false, error: 'Sanity 저장 중 네트워크 오류' }, { status: 500 })
  }
}
