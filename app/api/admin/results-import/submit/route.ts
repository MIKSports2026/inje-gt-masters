// app/api/admin/results-import/submit/route.ts — Sanity result 저장
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'cq465tvw'
const SANITY_DATASET = 'production'
const SANITY_API_VERSION = '2024-01-01'

const RACE_TYPES = ['qualifying', 'race1', 'race2', 'race'] as const
const STATUSES = ['classified', 'dnf', 'dns', 'dsq'] as const

type RaceType = (typeof RACE_TYPES)[number]
type Status = (typeof STATUSES)[number]

interface StandingInput {
  position: number
  carNumber?: string
  teamName: string
  driver1: string
  driver2?: string
  carModel?: string
  laps?: number
  totalTime?: string
  gap?: string
  fastestLap?: string
  points?: number
  status?: Status
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
    roundRef: string
    classRef: string
    raceType: RaceType
    standings: StandingInput[]
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: '잘못된 JSON 형식' }, { status: 400 })
  }

  const { roundRef, classRef, raceType, standings } = body

  // ── 기본 필드 검증 ──────────────────────────────────────────
  if (!roundRef) return NextResponse.json({ ok: false, error: 'roundRef 필수', field: 'roundRef' }, { status: 400 })
  if (!classRef) return NextResponse.json({ ok: false, error: 'classRef 필수', field: 'classRef' }, { status: 400 })
  if (!raceType || !(RACE_TYPES as readonly string[]).includes(raceType)) {
    return NextResponse.json({ ok: false, error: `raceType은 ${RACE_TYPES.join(', ')} 중 하나여야 합니다`, field: 'raceType' }, { status: 400 })
  }
  if (!standings || !Array.isArray(standings) || standings.length === 0) {
    return NextResponse.json({ ok: false, error: 'standings 배열이 비어있습니다', field: 'standings' }, { status: 400 })
  }

  // ── standings 각 행 검증 ────────────────────────────────────
  const positionsSeen = new Set<number>()
  for (let i = 0; i < standings.length; i++) {
    const s = standings[i]
    const rowLabel = `행 ${i + 1}`

    if (s.position === undefined || s.position === null) {
      return NextResponse.json({ ok: false, error: `${rowLabel}: position 필수`, field: `standings[${i}].position` }, { status: 400 })
    }
    if (!Number.isInteger(s.position) || s.position < 1) {
      return NextResponse.json({ ok: false, error: `${rowLabel}: position은 1 이상 정수여야 합니다`, field: `standings[${i}].position` }, { status: 400 })
    }
    if (positionsSeen.has(s.position)) {
      return NextResponse.json({ ok: false, error: `position ${s.position} 중복`, field: `standings[${i}].position` }, { status: 400 })
    }
    positionsSeen.add(s.position)

    if (!s.teamName?.trim()) {
      return NextResponse.json({ ok: false, error: `${rowLabel}: teamName 필수`, field: `standings[${i}].teamName` }, { status: 400 })
    }
    if (!s.driver1?.trim()) {
      return NextResponse.json({ ok: false, error: `${rowLabel}: driver1 필수`, field: `standings[${i}].driver1` }, { status: 400 })
    }
    if (s.status && !(STATUSES as readonly string[]).includes(s.status)) {
      return NextResponse.json({ ok: false, error: `${rowLabel}: status는 ${STATUSES.join(', ')} 중 하나여야 합니다`, field: `standings[${i}].status` }, { status: 400 })
    }
  }

  // ── standings에 _key 부여 ───────────────────────────────────
  const normalizedStandings = standings.map((s) => ({
    _key: `p${s.position}`,
    position: s.position,
    ...(s.carNumber !== undefined && s.carNumber !== '' ? { carNumber: s.carNumber } : {}),
    teamName: s.teamName.trim(),
    driver1: s.driver1.trim(),
    ...(s.driver2?.trim() ? { driver2: s.driver2.trim() } : {}),
    ...(s.carModel?.trim() ? { carModel: s.carModel.trim() } : {}),
    ...(s.laps !== undefined && s.laps !== null ? { laps: s.laps } : {}),
    ...(s.totalTime?.trim() ? { totalTime: s.totalTime.trim() } : {}),
    ...(s.gap?.trim() ? { gap: s.gap.trim() } : {}),
    ...(s.fastestLap?.trim() ? { fastestLap: s.fastestLap.trim() } : {}),
    ...(s.points !== undefined && s.points !== null ? { points: s.points } : {}),
    status: s.status ?? 'classified',
  }))

  // ── 기존 문서 조회 ──────────────────────────────────────────
  let existingId: string | null = null
  try {
    const queryUrl = new URL(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`
    )
    const query = `*[_type=="result" && round._ref==$roundRef && classInfo._ref==$classRef && raceType==$raceType][0]{ _id }`
    queryUrl.searchParams.set('query', query)
    queryUrl.searchParams.set('$roundRef', JSON.stringify(roundRef))
    queryUrl.searchParams.set('$classRef', JSON.stringify(classRef))
    queryUrl.searchParams.set('$raceType', JSON.stringify(raceType))

    const qRes = await fetch(queryUrl.toString(), { cache: 'no-store' })
    if (qRes.ok) {
      const qJson = await qRes.json()
      existingId = (qJson.result as { _id: string } | null)?._id ?? null
    }
  } catch (err) {
    console.error('Existing doc query error:', err)
  }

  // ── Sanity Mutation 실행 ────────────────────────────────────
  const now = new Date().toISOString()
  const documentId = existingId ?? `result-${roundRef}-${classRef}-${raceType}`

  const doc = {
    _type: 'result',
    _id: documentId,
    round: { _type: 'reference', _ref: roundRef },
    classInfo: { _type: 'reference', _ref: classRef },
    raceType,
    standings: normalizedStandings,
    publishedAt: now,
    isPublished: false,
  }

  const mutation = existingId
    ? { createOrReplace: doc }
    : { create: doc }

  try {
    const mutateRes = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sanityToken}`,
        },
        body: JSON.stringify({ mutations: [mutation] }),
      }
    )

    if (!mutateRes.ok) {
      const errText = await mutateRes.text()
      console.error('Sanity mutate error:', errText)
      return NextResponse.json({ ok: false, error: `Sanity 저장 실패: ${mutateRes.status}` }, { status: 500 })
    }

    const mutateJson = await mutateRes.json()
    const resultId = (mutateJson.results?.[0]?.id as string | undefined) ?? documentId

    return NextResponse.json({
      ok: true,
      resultId,
      action: existingId ? 'replaced' : 'created',
      standingsCount: normalizedStandings.length,
    })
  } catch (err) {
    console.error('Submit error:', err)
    return NextResponse.json({ ok: false, error: 'Sanity 저장 중 네트워크 오류' }, { status: 500 })
  }
}
