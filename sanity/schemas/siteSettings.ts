// schemas/siteSettings.ts — 사이트 전역 설정 (싱글턴)
import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

export default defineType({
  name: 'siteSettings',
  title: '사이트 설정',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'basic',   title: '기본 정보',    default: true },
    { name: 'seo',     title: 'SEO / OG' },
    { name: 'contact', title: '연락처 / SNS' },
    { name: 'entry',   title: '참가신청 설정' },
    { name: 'banner',  title: '공지 배너' },
    { name: 'circuit', title: '서킷 정보' },
  ],

  fields: [
    /* ── 기본 정보 ───────────────────────────────────────── */
    defineField({
      name: 'siteName',
      title: '사이트명 (한글)',
      type: 'string',
      group: 'basic',
      initialValue: '인제 GT 마스터즈',
      validation: R => R.required(),
    }),
    defineField({
      name: 'siteNameEn',
      title: '사이트명 (영문)',
      type: 'string',
      group: 'basic',
      initialValue: 'Inje GT Masters',
    }),
    defineField({
      name: 'slogan',
      title: '슬로건',
      type: 'string',
      group: 'basic',
      initialValue: 'Where Legends Begin',
    }),
    defineField({
      name: 'currentSeason',
      title: '현재 시즌 연도',
      type: 'number',
      group: 'basic',
      initialValue: 2026,
      validation: R => R.required().integer().min(2020).max(2099),
    }),
    defineField({
      name: 'logoLight',
      title: '로고 (컬러 / 밝은 배경용)',
      type: 'image',
      group: 'basic',
      options: { hotspot: false },
    }),
    defineField({
      name: 'logoDark',
      title: '로고 (흰색 / 어두운 배경용)',
      type: 'image',
      group: 'basic',
      options: { hotspot: false },
    }),

    /* ── 히어로 이미지 ────────────────────────────────────── */
    defineField({
      name: 'heroImage',
      title: '메인 히어로 이미지',
      type: 'image',
      group: 'basic',
      options: { hotspot: true },
      description: '홈페이지 메인 히어로 배경',
      fields: [
        defineField({
          name: 'alt',
          title: '대체 텍스트',
          type: 'string',
          description: '이미지를 설명하는 텍스트 (접근성)',
        }),
      ],
    }),
    defineField({
      name: 'heroImages',
      title: '히어로 슬라이드 이미지 (최대 10장)',
      type: 'array',
      group: 'basic',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: '대체 텍스트',
              type: 'string',
            }),
          ],
        },
      ],
      validation: R => R.max(10),
      description: '5초 간격 자동 롤링. 비어 있으면 heroImage 단일 이미지를 사용합니다.',
    }),
    defineField({
      name: 'heroVideo',
      title: '메인 히어로 배경 영상 URL',
      type: 'url',
      group: 'basic',
      description: '선택사항 — 배경 영상이 있으면 이미지 대신 표시',
    }),
    defineField({
      name: 'heroAbout',
      title: '대회소개 히어로 이미지',
      type: 'image',
      group: 'basic',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroSeason',
      title: '시즌 히어로 이미지',
      type: 'image',
      group: 'basic',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroEntry',
      title: '참가신청 히어로 이미지',
      type: 'image',
      group: 'basic',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroResults',
      title: '경기결과 히어로 이미지',
      type: 'image',
      group: 'basic',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroMedia',
      title: '미디어 히어로 이미지',
      type: 'image',
      group: 'basic',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroCircuit',
      title: '인제스피디움 히어로 이미지',
      type: 'image',
      group: 'basic',
      options: { hotspot: true },
    }),

    /* ── SEO ─────────────────────────────────────────────── */
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
      initialValue: '인제 GT 마스터즈 2026 — 공식 홈페이지 | Inje GT Masters',
      validation: R => R.max(70),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      initialValue:
        '대한민국 정통 GT 내구레이스, 인제 GT 마스터즈. 강원도 인제스피디움 3.9km 서킷, 2026 시즌 5라운드. Masters 1·Masters 2·Masters N·Masters 3·Masters N-evo 참가 신청 접수 중.',
      validation: R => R.max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'OG 이미지 (1200×630)',
      type: 'image',
      group: 'seo',
      options: { hotspot: true },
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      group: 'seo',
      initialValue: 'https://www.masters-series.kr',
    }),

    /* ── 연락처 / SNS ─────────────────────────────────────── */
    defineField({
      name: 'email',
      title: '대표 이메일',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'phone',
      title: '대표 전화',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'kakaoChannelUrl',
      title: '카카오채널 URL',
      type: 'url',
      group: 'contact',
    }),
    defineField({
      name: 'address',
      title: '주소',
      type: 'string',
      group: 'contact',
      initialValue: '강원도 인제군 기린면 상하답로 130',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
      group: 'contact',
    }),
    defineField({
      name: 'youtube',
      title: 'YouTube URL',
      type: 'url',
      group: 'contact',
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook URL',
      type: 'url',
      group: 'contact',
    }),
    defineField({
      name: 'naverBlog',
      title: '네이버 블로그 URL',
      type: 'url',
      group: 'contact',
    }),

    /* ── 참가신청 설정 ────────────────────────────────────── */
    defineField({
      name: 'isEntryOpen',
      title: '참가신청 활성화',
      type: 'boolean',
      group: 'entry',
      initialValue: false,
    }),
    defineField({
      name: 'entryNotice',
      title: '비활성 시 표시 메시지',
      type: 'string',
      group: 'entry',
      initialValue: '2026 시즌 참가신청은 2026년 3월 1일부터 접수됩니다.',
    }),
    defineField({
      name: 'tossPaymentBaseUrl',
      title: '토스페이먼츠 결제 링크 베이스 URL',
      type: 'url',
      group: 'entry',
    }),

    /* ── 공지 배너 ────────────────────────────────────────── */
    defineField({
      name: 'bannerVisible',
      title: '상단 배너 표시',
      type: 'boolean',
      group: 'banner',
      initialValue: false,
    }),
    defineField({
      name: 'bannerMessage',
      title: '배너 메시지',
      type: 'string',
      group: 'banner',
    }),
    defineField({
      name: 'bannerLinkText',
      title: '배너 링크 텍스트',
      type: 'string',
      group: 'banner',
    }),
    defineField({
      name: 'bannerLinkUrl',
      title: '배너 링크 URL',
      type: 'url',
      group: 'banner',
    }),
    defineField({
      name: 'bannerBgColor',
      title: '배너 배경색 (hex)',
      type: 'string',
      group: 'banner',
      initialValue: '#e60023',
    }),

    /* ── 공지 알림 띠 (Announcement Bar) ──────────────────── */
    defineField({
      name: 'announcementBar',
      title: '공지 알림 띠',
      type: 'object',
      group: 'banner',
      fields: [
        defineField({
          name: 'isVisible',
          title: '표시 여부',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'text',
          title: '공지 문구',
          type: 'string',
          description: '상단 알림 띠에 표시할 문구',
        }),
        defineField({
          name: 'link',
          title: '클릭 시 이동 URL',
          type: 'string',
          description: '선택사항 — 입력하면 클릭 가능한 링크로 표시 (예: /entry?tab=apply)',
        }),
      ],
    }),

    /* ── 서킷 정보 ────────────────────────────────────────── */
    defineField({
      name: 'circuitName',
      title: '서킷명',
      type: 'string',
      group: 'circuit',
      initialValue: '인제스피디움',
    }),
    defineField({
      name: 'circuitLength',
      title: '서킷 길이 (km)',
      type: 'number',
      group: 'circuit',
      initialValue: 3.9,
    }),
    defineField({
      name: 'circuitLocation',
      title: '위치',
      type: 'string',
      group: 'circuit',
      initialValue: '강원도 인제군 기린면',
    }),
    defineField({
      name: 'speediumUrl',
      title: '인제스피디움 공식 URL',
      type: 'url',
      group: 'circuit',
      initialValue: 'https://www.speedium.co.kr',
    }),
    defineField({
      name: 'circuitMapEmbedUrl',
      title: '지도 임베드 URL',
      type: 'url',
      group: 'circuit',
    }),
  ],

  preview: {
    select: { title: 'siteName', subtitle: 'slogan' },
  },
})
