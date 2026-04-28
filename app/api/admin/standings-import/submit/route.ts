// app/api/admin/standings-import/submit/route.ts — 스탠딩 Sanity 저장
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const SANITY_PROJECT_ID  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const SANITY_DATASET     = 'production'
const SANITY_API_VERSION = '2024-01-01'

const STANDING_TYPES = ['team', 'driver'] as const
type StandingType = (typeof STANDING_TYPES)[number]

interface RoundEntry {
  roundNumber: number
  points:      number
}

interface TeamEntry {
  position:    number
  carNumber?:  string
  teamName:    string
  drivers?:    string
  rounds:      RoundEntry[]
  totalPoints: number
}

interface DriverEntry {
  position:    number
  driverName:  string
  carNumber?:  string
  teamName?:   string
  rounds:      RoundEntry[]
  totalPoints: number
}

type Entry = TeamEntry | DriverEntry

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

// ── 검증 ────────────────────────────────────────────────────
function validateEntries(entries: Entry[], standingType: StandingType, label: string): string | null {
  for (let i = 0; i < entries.length; i++) {
    const e        = entries[i]
    const rowLabel = `${label} 행 ${i + 1}`

    if (!e.position || !Number.isInteger(e.position) || e.position < 1) {
      return `${rowLabel}: position 필수 (1 이상 정수)`
    }
    if (e.totalPoints === undefined || e.totalPoints === null) {
      return `${rowLabel}: totalPoints 필수`
    }
    if (standingType === 'team') {
      if (!(e as TeamEntry).teamName?.trim()) return `${rowLabel}: teamName 필수`
    } else {
      if (!(e as DriverEntry).driverName?.trim()) return `${rowLabel}: driverName 필수`
    }
    if (!Array.isArray(e.rounds)) {
      return `${rowLabel}: rounds 배열 필수`
    }
    for (const rd of e.rounds) {
      if (!Number.isInteger(rd.roundNumber) || rd.roundNumber < 1 || rd.roundNumber > 5) {
        return `${rowLabel}: roundNumber는 1~5 정수`
      }
    }
  }
  return null
}

// ── 정규화 ──────────────────────────────────────────────────
function normalizeEntries(entries: Entry[], standingType: StandingType) {
  return entries.map((e, i) => {
    const rounds = (e.rounds ?? []).map(rd => ({
      _key:        `r${rd.roundNumber}-${i}`,
      roundNumber: rd.roundNumber,
      points:      rd.points ?? 0,
    }))
    const base = {
      _key:        `p${e.position}-${i}`,
      position:    e.position,
      rounds,
      totalPoints: e.totalPoints,
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
}

// ── Sanity 저장 ─────────────────────────────────────────────
async function saveDoc(
  docType:     string,
  documentId:  string,
  classRef:    string,
  season:      number,
  entries:     ReturnType<typeof normalizeEntries>,
  sanityToken: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const now = new Date().toISOString()
  const doc = {
    _type:       docType,
    _id:         documentId,
    season,
    classInfo:   { _type: 'reference', _ref: classRef },
    entries,
    isPublished: true,
    updatedAt:   now,
  }
  try {
    const res = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sanityToken}` },
        body:    JSON.stringify({ mutations: [{ createOrReplace: doc }] }),
      }
    )
    if (!res.ok) {
      const errText = await res.text()
      console.error('Sanity mutate error:', errText)
      return { ok: false, error: `Sanity 저장 실패: ${res.status}` }
    }
    return { ok: true }
  } catch (err) {
    console.error('saveDoc error:', err)
    return { ok: false, error: 'Sanity 저장 중 네트워크 오류' }
  }
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
    standingType: StandingType
    // 단일 모드
    classRef?:  string
    classCode?: string
    entries?:   Entry[]
    // 일괄 모드
    batches?: { classRef: string; classCode: string; entries: Entry[] }[]
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: '잘못된 JSON 형식' }, { status: 400 })
  }

  const { season, standingType } = body

  // ── 공통 필드 검증 ──────────────────────────────────────────
  if (!season || !Number.isInteger(season) || season < 2020) {
    return NextResponse.json({ ok: false, error: 'season 필수 (2020 이상 정수)' }, { status: 400 })
  }
  if (!standingType || !(STANDING_TYPES as readonly string[]).includes(standingType)) {
    return NextResponse.json({ ok: false, error: 'standingType은 team 또는 driver 중 하나' }, { status: 400 })
  }

  const docType = standingType === 'team' ? 'teamStanding' : 'driverStanding'

  // ── 일괄 모드 ────────────────────────────────────────────────
  if (body.batches) {
    const { batches } = body
    if (!Array.isArray(batches) || batches.length === 0) {
      return NextResponse.json({ ok: false, error: 'batches 배열이 비어있습니다' }, { status: 400 })
    }

    for (const batch of batches) {
      if (!batch.classRef) {
        return NextResponse.json({ ok: false, error: 'batch.classRef 필수' }, { status: 400 })
      }
      if (!Array.isArray(batch.entries) || batch.entries.length === 0) {
        return NextResponse.json({ ok: false, error: `${batch.classCode}: entries 비어있습니다` }, { status: 400 })
      }
      const err = validateEntries(batch.entries, standingType, batch.classCode ?? batch.classRef)
      if (err) return NextResponse.json({ ok: false, error: err }, { status: 400 })
    }

    // 순차 저장
    const results: { classCode: string; _id: string; count: number }[] = []
    for (const batch of batches) {
      const safeCode   = (batch.classCode ?? '').toLowerCase().replace(/\s+/g, '-')
      const documentId = `${docType}-${season}-${safeCode}`
      const normalized = normalizeEntries(batch.entries, standingType)
      const result     = await saveDoc(docType, documentId, batch.classRef, season, normalized, sanityToken)
      if (!result.ok) {
        return NextResponse.json(
          { ok: false, error: `${batch.classCode} 저장 실패: ${result.error}`, results },
          { status: 500 }
        )
      }
      results.push({ classCode: batch.classCode ?? safeCode, _id: documentId, count: normalized.length })
    }

    return NextResponse.json({ ok: true, results })
  }

  // ── 단일 모드 ────────────────────────────────────────────────
  const { classRef, classCode, entries } = body

  if (!classRef) {
    return NextResponse.json({ ok: false, error: 'classRef 필수' }, { status: 400 })
  }
  if (!entries || !Array.isArray(entries) || entries.length === 0) {
    return NextResponse.json({ ok: false, error: 'entries 배열이 비어있습니다' }, { status: 400 })
  }

  const validErr = validateEntries(entries, standingType, '행')
  if (validErr) return NextResponse.json({ ok: false, error: validErr }, { status: 400 })

  const safeCode   = (classCode ?? '').toLowerCase().replace(/\s+/g, '-')
  const documentId = `${docType}-${season}-${safeCode}`
  const normalized = normalizeEntries(entries, standingType)

  const result = await saveDoc(docType, documentId, classRef, season, normalized, sanityToken)
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 })
  }
  return NextResponse.json({ ok: true, _id: documentId, count: normalized.length })
}
