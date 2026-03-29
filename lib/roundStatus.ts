// lib/roundStatus.ts — 라운드 상태 자동 판별 유틸
import type { RoundStatus } from '@/types/sanity'

/**
 * 수동 status가 있으면 우선 적용.
 * 없거나 'upcoming'이면 날짜 기반으로 자동 판별.
 */
export function resolveRoundStatus({
  status,
  dateStart,
  dateEnd,
  entryOpenDate,
  entryCloseDate,
}: {
  status?: RoundStatus
  dateStart?: string
  dateEnd?: string
  entryOpenDate?: string
  entryCloseDate?: string
}): RoundStatus {
  // 수동으로 finished/ongoing 설정된 경우 그대로 사용
  if (status === 'finished' || status === 'ongoing') return status

  const now = new Date()

  // 대회 종료일이 지났으면 finished
  if (dateEnd && new Date(dateEnd + 'T23:59:59') < now) return 'finished'
  if (!dateEnd && dateStart && new Date(dateStart + 'T23:59:59') < now) return 'finished'

  // 대회 시작일이면 ongoing
  if (dateStart && new Date(dateStart) <= now && (!dateEnd || new Date(dateEnd + 'T23:59:59') >= now)) {
    return 'ongoing'
  }

  // 접수 마감일이 지났으면 entry_closed
  if (entryCloseDate && new Date(entryCloseDate) < now) return 'entry_closed'

  // 접수 시작일이 지났으면 entry_open
  if (entryOpenDate && new Date(entryOpenDate) <= now) return 'entry_open'

  // 수동 status가 있으면 사용 (entry_open, entry_closed 등)
  if (status && status !== 'upcoming') return status

  return 'upcoming'
}
