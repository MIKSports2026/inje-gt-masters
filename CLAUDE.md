# 인제 GT 마스터즈 — CLAUDE.md

## 프로젝트 개요
- 한국 아마추어 모터스포츠 레이싱 이벤트 웹사이트
- URL: https://inje-gt-masters.vercel.app
- Stack: Next.js 14 App Router + Sanity CMS + Vercel

## 브랜치 규칙
- main 브랜치 = 현재 배포 버전 항상 유지
- v2-dark-theme 브랜치 절대 main에 머지 금지

## 작업 규칙
- 한 번에 한 파일만 수정
- 수정 범위 밖 파일은 절대 건드리지 말 것
- 작업 전 반드시 해당 파일 전체 읽기
- 빌드 확인: `npm run build` → 오류 없으면 배포

## 주요 명령어
- 개발 서버: `npm run dev`
- 빌드: `npm run build`
- 배포: `vercel --prod`
- 캐시 클리어 배포: `rm -rf .next && npm run build && vercel --prod --force`

## 코드 규칙
- Tailwind utility classes만 사용 (CSS 파일 신규 생성 금지)
- 'use client' 최소화 — 서버 컴포넌트 우선
- GROQ 쿼리: `gallery[] ${IMAGE}` (이중 중괄호 금지)

## Sanity 규칙
- 클래스 오픈 여부: `round.status === 'entry_open'` 기준만 사용
- `classInfo.isEntryOpen` 사용 금지
- 새 도메인 연결 시 Sanity CORS Origins 등록 필수

## 브랜드
- Primary: Speedium Red #E60023
- Background: Carbon Black #111111
- 헤드라인: Oswald (condensed bold, tight letter-spacing)
- 본문: Noto Sans KR

## 히어로 이미지
- 텍스트/로고 포함된 이미지 — 의도된 디자인
- 코드로 절대 제거 금지
- 교체: Sanity Studio → Site Settings → Hero Image

## 오류 대응
- 404: GROQ 수정 + `vercel --prod`
- 흰 화면: Vercel Deployments 로그 확인
- 스타일 미반영: `rm -rf .next && npm run build`
- Webhook 미반영: `vercel --prod --force`

## Lessons Learned

### 배포
- git push 없이 vercel --prod 하면 GitHub 버전으로 덮어써짐
  → 반드시 git push origin main 먼저

### Sanity
- Draft 상태는 라이브에 반영 안 됨 → Published 상태 확인 필수
- isHidden 필터는 Published 문서에 필드가 있어야 동작

### Next.js
- ISR 캐시가 오래된 데이터 보여줄 때: vercel --prod --force
- 'use client' 남용 시 Naver 봇 크롤링 방해
