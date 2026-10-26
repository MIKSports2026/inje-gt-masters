// lib/season2027.ts — 2027 시즌 공표 일정 (2026-10-11 보도자료 + 2027 CALENDAR 공식 이미지의 라운드 타이틀)
// 2027 라운드 문서를 Sanity에 등록하기 전까지 시즌 캘린더·홈 일정의 단일 기준
import type { SeasonRow } from '@/components/sections/SeasonRows'

const UPCOMING = { label: 'UPCOMING', tone: 'soon' } as const

export const ROUNDS_2027: SeasonRow[] = [
  { key: 'r1', round: 1, date: 'APR 10 – 11', weekdays: 'SAT – SUN', title: '개막전', note: '2027 시즌의 시작', tag: 'START YOUR ENGINE', status: UPCOMING },
  { key: 'r2', round: 2, date: 'MAY 14 – 16', weekdays: 'FRI – SUN', title: '람보르기니 슈퍼 트로페오 동시 개최', note: 'GT 내구레이스와 슈퍼카 원메이크 레이스를 한 라운드에서', tag: 'WE ARE MASTERS', status: UPCOMING },
  { key: 'r3', round: 3, date: 'AUG 14', weekdays: 'SAT', title: '나이트 레이스', note: '해가 진 뒤 조명 아래에서 달리는 레이스', tag: 'SUMMER APEX', status: UPCOMING },
  { key: 'r4', round: 4, date: 'SEP 03 – 04', weekdays: 'FRI – SAT', title: '4시간 레이스', note: '기존 3시간보다 1시간 늘어난 내구 레이스 · 포인트 1.5배', tag: 'FULL STRIKE : 4HOURS', status: UPCOMING },
  { key: 'r5', round: 5, date: 'OCT 16 – 17', weekdays: 'SAT – SUN', title: '최종전', note: '2027 시즌 챔피언 결정', tag: 'THE FINAL STINT', status: UPCOMING },
]
