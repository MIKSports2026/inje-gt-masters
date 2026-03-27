# 인제 GT 마스터즈 — Inje GT Masters
> **도메인**: www.masters-series.kr  
> **스택**: Next.js 14 · Sanity · Vercel · 토스페이먼츠

---

## 📁 프로젝트 구조

```
inje-gt-masters/
├── sanity/
│   └── schemas/
│       ├── index.ts          ← 스키마 전체 export
│       ├── siteSettings.ts   ← 사이트 설정 (싱글턴)
│       ├── round.ts          ← 시즌 라운드
│       ├── classInfo.ts      ← 경기 클래스 6개
│       ├── result.ts         ← 경기 결과
│       ├── post.ts           ← 소식 / 공지
│       ├── media.ts          ← 사진 / 동영상
│       ├── partner.ts        ← 파트너 / 스폰서
│       └── history.ts        ← 대회 역사
├── lib/
│   ├── sanity.client.ts      ← Next.js Sanity 클라이언트
│   └── queries.ts            ← GROQ 쿼리 전체
├── types/
│   └── sanity.ts             ← TypeScript 타입 정의
├── sanity.config.ts          ← Sanity Studio 설정
├── package.json
└── .env.local.example
```

---

## 🗂️ Sanity 스키마 요약

| 스키마 | 타입 | 핵심 |
|---|---|---|
| `siteSettings` | 싱글턴 | SEO·연락처·SNS·로고·배너·서킷 정보 |
| `round` | 컬렉션 | R1~R4 일정·상태·참가신청·결과 연결 |
| `classInfo` | 컬렉션 | GT1/GT2/GT3/DRIFT/BIKE/SUPERCAR 6개 |
| `result` | 컬렉션 | 순위표·챔피언십 포인트·PDF |
| `post` | 컬렉션 | 공지·소식·보도자료·참가안내 |
| `media` | 컬렉션 | 사진앨범·YouTube·업로드 동영상 |
| `partner` | 컬렉션 | 스폰서 등급 7단계·시즌별 계약 |
| `history` | 컬렉션 | 연도별 챔피언·통계·마일스톤 |

---

## 🚀 시작하기

### 1. 의존성 설치
```bash
npx create-next-app@14 . --typescript --tailwind --app --src-dir=no --import-alias="@/*"
npm install next-sanity @sanity/image-url @sanity/icons @sanity/vision sanity sanity-plugin-media @portabletext/react clsx framer-motion
```

### 2. Sanity 프로젝트 생성
```bash
npx sanity init
# → 생성된 projectId 를 .env.local 에 입력
```

### 3. 환경 변수 설정
```bash
cp .env.local.example .env.local
# .env.local 에 실제 값 입력
```

### 4. 개발 서버 실행
```bash
npm run dev      # Next.js: http://localhost:3000
npm run studio   # Sanity Studio: http://localhost:3333
```

### 5. 초기 데이터 입력 순서
1. **사이트 설정** → 슬로건·연락처·SNS 입력
2. **클래스 정보** → GT1~SUPERCAR 6개 생성 (order 1~6)
3. **라운드** → R1~R4 4개 생성 (dateStart·status 설정)
4. **파트너** → 스폰서 로고 업로드
5. **소식** → 참가신청 공지 1건 발행

---

## 📌 2026 시즌 기본 데이터

| 항목 | 값 |
|---|---|
| 서킷 | 강원도 인제스피디움 3.9km |
| 라운드 | R1 05.18 / R2 07.13 / R3 09.14 / R4 11.02 |
| 총 참가 | 107대 · 208명 |
| R1 | 개막전 |
| R2 | 서머 |
| R3 | 나이트레이스 🌙 |
| R4 | 파이널 |

---

## ⏭️ 다음 작업 순서

- [x] **Step 1** — Sanity 스키마 8개
- [ ] **Step 2** — Next.js 14 프로젝트 세팅 + Sanity 연동 (`/studio`, `layout.tsx`, `metadata`)
- [ ] **Step 3** — GNB 컴포넌트 (메가메뉴 + 모바일 아코디언)
- [ ] **Step 4** — 메인 페이지 12개 섹션 컴포넌트
- [ ] **Step 5** — 참가신청 폼 + 토스페이먼츠 연동
- [ ] **Step 6** — SEO 설정 + Vercel 배포
