// sanity/schemas/mediaKit.ts — 미디어킷 (라운드별 + 기존 호환)
export default {
  name: 'mediaKit',
  title: 'Media Kit (라운드별)',
  type: 'document',
  fields: [
    /* ── 라운드 연결 (신규) ─────────────────────────────── */
    {
      name: 'round',
      title: '라운드',
      type: 'reference',
      to: [{ type: 'round' }],
      description: '해당 라운드를 선택하세요.',
    },

    /* ── 기본 정보 ────────────────────────────────────────*/
    {
      name: 'title',
      title: '제목',
      type: 'string',
      description: '예: 2026 인제 GT 마스터즈 1라운드 미디어킷 v1',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: '설명',
      type: 'text',
    },

    /* ── 공개 여부 ────────────────────────────────────────*/
    {
      name: 'isReady',
      title: '공개 여부',
      type: 'boolean',
      description: 'OFF면 "준비 중"으로 표시됩니다. 자료가 준비되면 ON으로 설정하세요.',
      initialValue: false,
    },
    {
      name: 'isPublic',
      title: '공개 여부 (구버전 호환)',
      type: 'boolean',
      hidden: true,
      initialValue: true,
    },

    /* ── 파일 / 링크 (신규) ──────────────────────────────*/
    {
      name: 'mediaKitFile',
      title: '미디어킷 파일',
      type: 'file',
      options: { accept: '.docx,.pdf,.zip' },
      description: '워드(.docx), PDF, ZIP 파일 업로드',
    },
    {
      name: 'photoFolderUrl',
      title: '오피셜 포토 (외부 링크)',
      type: 'url',
      description: '구글 드라이브 등 외부 폴더 URL',
    },
    {
      name: 'timingPasswordInfo',
      title: '기록지 안내',
      type: 'string',
      description: '예: Sportity App (Event Password: injegt2026)',
    },

    /* ── 기존 파일 필드 (호환 유지) ──────────────────────*/
    {
      name: 'file',
      title: '첨부파일 (구버전 호환)',
      type: 'file',
      options: { accept: '.pdf,.zip,.png,.jpg,.ai,.eps' },
      hidden: true,
    },
    {
      name: 'thumbnail',
      title: '썸네일 (구버전 호환)',
      type: 'image',
      hidden: true,
    },

    /* ── 분류 (구버전 호환) ──────────────────────────────*/
    {
      name: 'category',
      title: '카테고리 (구버전 호환)',
      type: 'string',
      hidden: true,
      options: {
        list: [
          { title: '로고',     value: 'logo'       },
          { title: '사진',     value: 'photo'      },
          { title: '규정문서', value: 'regulation' },
          { title: '보도자료', value: 'press'      },
          { title: '기타',     value: 'etc'        },
        ],
      },
    },
    {
      name: 'publishedAt',
      title: '공개일 (구버전 호환)',
      type: 'date',
      hidden: true,
    },

    /* ── 정렬 ─────────────────────────────────────────── */
    {
      name: 'order',
      title: '정렬 순서',
      type: 'number',
      description: 'R1=1, R2=2, ...',
    },
  ],

  preview: {
    select: {
      title:       'title',
      roundNumber: 'round.roundNumber',
      roundTitle:  'round.title',
      isReady:     'isReady',
    },
    prepare({ title, roundNumber, roundTitle, isReady }: any) {
      const roundLabel = roundNumber ? `R${roundNumber} ${roundTitle ?? ''}`.trim() : ''
      return {
        title:    title || (roundLabel ? `${roundLabel} 미디어킷` : '미디어킷'),
        subtitle: isReady ? '✅ 공개' : '⏳ 준비 중',
      }
    },
  },
}
