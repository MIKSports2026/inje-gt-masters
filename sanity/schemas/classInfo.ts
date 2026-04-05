// schemas/classInfo.ts — 경기 클래스
import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

export default defineType({
  name: 'classInfo',
  title: '클래스 정보',
  type: 'document',
  icon: TagIcon,

  groups: [
    { name: 'basic',      title: '기본 정보', default: true },
    { name: 'specs',      title: '참가 규모 / 자격' },
    { name: 'regulation', title: '차량 규정' },
    { name: 'entry',      title: '참가비' },
    { name: 'media',      title: '미디어' },
  ],

  fields: [
    /* ── 식별 ──────────────────────────────────────────────── */
    defineField({
      name: 'classCode',
      title: '클래스 코드',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Masters 1',     value: 'masters-1' },
          { title: 'Masters 2',     value: 'masters-2' },
          { title: 'Masters N',     value: 'masters-n' },
          { title: 'Masters N-evo', value: 'masters-n-evo' },
          { title: 'Masters 3',     value: 'masters-3' },
        ],
        layout: 'radio',
      },
      validation: R => R.required(),
    }),
    defineField({
      name: 'slug',
      title: '슬러그',
      type: 'slug',
      group: 'basic',
      options: { source: 'classCode' },
      validation: R => R.required(),
    }),
    defineField({
      name: 'order',
      title: '정렬 순서',
      type: 'number',
      group: 'basic',
      description: '낮을수록 앞에 표시. Masters1=1, Masters2=2, MastersN=3, MastersN-evo=4, Masters3=5',
      validation: R => R.required().integer().min(1),
    }),

    /* ── 명칭 / 디자인 ─────────────────────────────────────── */
    defineField({
      name: 'name',
      title: '클래스명 (한글)',
      type: 'string',
      group: 'basic',
      validation: R => R.required(),
    }),
    defineField({
      name: 'nameEn',
      title: '클래스명 (영문)',
      type: 'string',
      group: 'basic',
    }),
    defineField({
      name: 'tagline',
      title: '태그라인',
      type: 'string',
      group: 'basic',
      description: '예: Pro-Am 최고 기량의 무대',
    }),
    defineField({
      name: 'accentColor',
      title: '강조 색상 (hex)',
      type: 'string',
      group: 'basic',
      description: '카드 상단 컬러바 및 뱃지 색상. 예: #e60023',
      initialValue: '#e60023',
    }),

    /* ── 참가 규모 ─────────────────────────────────────────── */
    defineField({
      name: 'teamCount',
      title: '팀 수',
      type: 'number',
      group: 'specs',
    }),
    defineField({
      name: 'driverCount',
      title: '드라이버 수',
      type: 'number',
      group: 'specs',
    }),
    defineField({
      name: 'carCount',
      title: '경주차 대수',
      type: 'number',
      group: 'specs',
    }),
    defineField({
      name: 'eligibility',
      title: '참가 자격',
      type: 'array',
      group: 'specs',
      of: [{ type: 'block' }],
      description: '라이선스 조건, 차량 규정 요약 등',
    }),
    defineField({
      name: 'features',
      title: '클래스 특징 목록',
      type: 'array',
      group: 'specs',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'icon',  title: 'FA 아이콘 클래스', type: 'string',
            description: '예: fa-solid fa-flag-checkered' }),
          defineField({ name: 'label', title: '항목명', type: 'string' }),
          defineField({ name: 'value', title: '값',    type: 'string' }),
        ],
        preview: { select: { title: 'label', subtitle: 'value' } },
      }],
    }),

    /* ── 차량 규정 ─────────────────────────────────────────── */
    defineField({
      name: 'vehicleRegulations',
      title: '차량 규정 요약',
      type: 'array',
      group: 'regulation',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'regulationPdf',
      title: '규정집 PDF',
      type: 'file',
      group: 'regulation',
      options: { accept: 'application/pdf' },
    }),

    /* ── 참가비 ────────────────────────────────────────────── */
    defineField({
      name: 'entryFeePerRound',
      title: '라운드당 참가비 (원)',
      type: 'number',
      group: 'entry',
    }),
    defineField({
      name: 'entryFeeSeason',
      title: '시즌 풀 참가비 (원)',
      type: 'number',
      group: 'entry',
    }),
    defineField({
      name: 'entryFeeNote',
      title: '참가비 비고',
      type: 'string',
      group: 'entry',
      description: '예: VAT 별도, 차량 운반비 포함 등',
    }),
    defineField({
      name: 'isFeePublic',
      title: '참가비 공개 여부',
      type: 'boolean',
      group: 'entry',
      initialValue: false,
    }),

    /* ── 미디어 ────────────────────────────────────────────── */
    defineField({
      name: 'heroImage',
      title: '클래스 대표 이미지',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
    }),
    defineField({
      name: 'cardImage',
      title: '클래스 카드 이미지',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: '갤러리',
      type: 'array',
      group: 'media',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),

    /* ── 상태 ──────────────────────────────────────────────── */
    defineField({
      name: 'isActive',
      title: '2026 시즌 활성',
      type: 'boolean',
      group: 'basic',
      initialValue: true,
    }),
    defineField({
      name: 'isEntryOpen',
      title: '이 클래스 참가신청 활성',
      type: 'boolean',
      group: 'basic',
      initialValue: false,
    }),
  ],

  orderings: [
    { title: '순서대로', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],

  preview: {
    select: {
      title:  'name',
      code:   'classCode',
      teams:  'teamCount',
      media:  'cardImage',
      active: 'isActive',
    },
    prepare({ title, code, teams, media, active }) {
      return {
        title:    `${active ? '' : '🔇 '}${title}`,
        subtitle: `${code} · ${teams ?? '?'}팀`,
        media,
      }
    },
  },
})
