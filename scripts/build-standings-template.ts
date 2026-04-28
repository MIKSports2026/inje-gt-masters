// scripts/build-standings-template.ts
// 스탠딩 입력용 엑셀 양식 생성 스크립트
// 실행: npx ts-node --skip-project scripts/build-standings-template.ts

import * as XLSX from 'xlsx'
import path from 'path'

const OUTPUT_PATH = path.join(process.cwd(), 'public', 'templates', 'inje-gt-masters_standings_template.xlsx')

// ── 시트 1: 팀스탠딩 ───────────────────────────────────────────
const teamSheet = XLSX.utils.aoa_to_sheet([
  ['클래스', '순위', '차량번호', '팀명', '드라이버', 'R1', 'R2', 'R3', 'R4', 'R5', '합계'],
  ['Masters 1', 1, 5, '오버리미트', '김태환 / 이인용', 28, 0, 0, 0, 0, 28],
  ['⚠️ 위 1행은 예시입니다. 실제 입력 전 반드시 삭제 후 데이터를 입력하세요.'],
])

// ── 시트 2: 드라이버스탠딩 ────────────────────────────────────
const driverSheet = XLSX.utils.aoa_to_sheet([
  ['클래스', '순위', '드라이버', '차량번호', '팀명', 'R1', 'R2', 'R3', 'R4', 'R5', '합계'],
  ['Masters 1', 1, '김태환', 5, '오버리미트', 28, 0, 0, 0, 0, 28],
  ['⚠️ 위 1행은 예시입니다. 실제 입력 전 반드시 삭제 후 데이터를 입력하세요.'],
])

// ── 시트 3: 작성가이드 ────────────────────────────────────────
const guideSheet = XLSX.utils.aoa_to_sheet([
  ['컬럼', '필수', '형식', '설명', '예시'],
  ['클래스', '필수', '텍스트 (정해진 값 사용)', 'Masters 1 / Masters 2 / Masters 3 / Masters N / Masters N-evo', 'Masters 1'],
  ['순위', '필수', '정수 (1 이상)', '시즌 누적 순위. 중복 불가', '1, 2, 3'],
  ['차량번호', '선택', '텍스트', '팀스탠딩: 대표 차량번호', '5, 22, 88A'],
  ['팀명', '필수', '텍스트', '참가 팀 공식 명칭', '오버리미트'],
  ['드라이버', '선택', '텍스트', '팀스탠딩: 슬래시(/) 구분 가능 / 드라이버스탠딩: 단일 드라이버명', '김태환 / 이인용'],
  ['R1', '선택', '정수', '라운드 1 획득 포인트 (미참가 시 0 또는 빈칸)', '28, 0'],
  ['R2', '선택', '정수', '라운드 2 획득 포인트 (미참가 시 0 또는 빈칸)', '25, 0'],
  ['R3', '선택', '정수', '라운드 3 획득 포인트 (미참가 시 0 또는 빈칸)', '20, 0'],
  ['R4', '선택', '정수', '라운드 4 획득 포인트 (미참가 시 0 또는 빈칸)', '18, 0'],
  ['R5', '선택', '정수', '라운드 5 획득 포인트 (미참가 시 0 또는 빈칸)', '15, 0'],
  ['합계', '필수', '정수', 'R1+R2+R3+R4+R5 = 합계 (자동 계산 권장)', '28, 50, 80'],
  ['', '', '', ''],
  ['[검증 규칙]', '', '', ''],
  ['합계 = R1+R2+R3+R4+R5 인지 반드시 확인하세요.', '', '', ''],
  ['사이트에는 합계 및 라운드별 점수가 노출됩니다.', '', '', ''],
])

// ── 워크북 구성 ───────────────────────────────────────────────
const wb = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb, teamSheet,   '팀스탠딩')
XLSX.utils.book_append_sheet(wb, driverSheet, '드라이버스탠딩')
XLSX.utils.book_append_sheet(wb, guideSheet,  '작성가이드')

XLSX.writeFile(wb, OUTPUT_PATH)
console.log(`✅ 스탠딩 양식 생성 완료: ${OUTPUT_PATH}`)
