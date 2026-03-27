// sanity.config.ts — Sanity Studio 설정
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool }    from '@sanity/vision'
import { schemaTypes }   from './sanity/schemas'

// ── 싱글턴 문서 목록 ──────────────────────────────────────────
const SINGLETONS = new Set(['siteSettings'])

// ── 커스텀 데스크 구조 ─────────────────────────────────────────
const structure = (S: any) =>
  S.list()
    .title('인제 GT 마스터즈')
    .items([

      // ① 싱글턴 — 사이트 설정
      S.listItem()
        .title('⚙️  사이트 설정')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),

      S.divider(),

      // ② 라운드
      S.listItem()
        .title('🏁  라운드')
        .id('round')
        .schemaType('round')
        .child(
          S.documentTypeList('round')
            .title('라운드 목록')
            .defaultOrdering([
              { field: 'season',      direction: 'desc' },
              { field: 'roundNumber', direction: 'asc'  },
            ])
        ),

      // ③ 클래스
      S.listItem()
        .title('🏎️  클래스 정보')
        .id('classInfo')
        .schemaType('classInfo')
        .child(
          S.documentTypeList('classInfo')
            .title('클래스 목록')
            .defaultOrdering([{ field: 'order', direction: 'asc' }])
        ),

      // ④ 경기 결과
      S.listItem()
        .title('🏆  경기 결과')
        .id('result')
        .schemaType('result')
        .child(S.documentTypeList('result').title('결과 목록')),

      S.divider(),

      // ⑤ 소식 / 공지 (카테고리 서브메뉴)
      S.listItem()
        .title('📰  소식 / 공지')
        .id('post-group')
        .child(
          S.list()
            .id('post-list')
            .title('소식 유형')
            .items([
              S.listItem().id('post-notice').title('📌  공지사항').child(
                S.documentTypeList('post').title('공지사항')
                  .filter('_type == "post" && category == "notice"')
              ),
              S.listItem().id('post-news').title('📣  대회소식').child(
                S.documentTypeList('post').title('대회소식')
                  .filter('_type == "post" && category == "news"')
              ),
              S.listItem().id('post-entry').title('📋  참가안내').child(
                S.documentTypeList('post').title('참가안내')
                  .filter('_type == "post" && category == "entry"')
              ),
              S.listItem().id('post-press').title('📰  보도자료').child(
                S.documentTypeList('post').title('보도자료')
                  .filter('_type == "post" && category == "press"')
              ),
              S.listItem().id('post-all').title('📄  전체 글').child(
                S.documentTypeList('post').title('전체 글')
              ),
            ])
        ),

      // ⑥ 미디어 (유형 서브메뉴)
      S.listItem()
        .title('🎥  미디어')
        .id('media-group')
        .child(
          S.list()
            .id('media-list')
            .title('미디어 유형')
            .items([
              S.listItem().id('media-photo').title('📷  사진 앨범').child(
                S.documentTypeList('media').title('사진 앨범')
                  .filter('_type == "media" && mediaType == "photoAlbum"')
              ),
              S.listItem().id('media-video').title('▶️   동영상').child(
                S.documentTypeList('media').title('동영상')
                  .filter('_type == "media" && mediaType in ["video","uploadedVideo"]')
              ),
              S.listItem().id('media-all').title('전체').child(
                S.documentTypeList('media').title('전체 미디어')
              ),
            ])
        ),

      S.divider(),

      // ⑦ 파트너
      S.listItem()
        .title('🤝  파트너 / 스폰서')
        .id('partner')
        .schemaType('partner')
        .child(S.documentTypeList('partner').title('파트너 목록')),

      // ⑧ 역사
      S.listItem()
        .title('📜  대회 역사')
        .id('history')
        .schemaType('history')
        .child(
          S.documentTypeList('history').title('연도별 역사')
            .defaultOrdering([{ field: 'year', direction: 'desc' }])
        ),
    ])

// ── Sanity 설정 ───────────────────────────────────────────────
export default defineConfig({
  name:    'inje-gt-masters',
  title:   '인제 GT 마스터즈',
  basePath: '/studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',

  plugins: [
    structureTool({ structure }),
    visionTool(),   // GROQ 테스트
    // media() — sanity-plugin-media (react-hook-form 호환 이슈, 추후 재활성)
  ],

  schema: {
    types: schemaTypes,
    // 싱글턴은 "새 문서 만들기" 목록에서 제외
    templates: templates =>
      templates.filter(({ schemaType }) => !SINGLETONS.has(schemaType)),
  },

  document: {
    // 싱글턴에서 복제·삭제 액션 제거
    actions: (input, context) =>
      SINGLETONS.has(context.schemaType)
        ? input.filter(({ action }) => action !== 'duplicate' && action !== 'delete')
        : input,
  },
})
