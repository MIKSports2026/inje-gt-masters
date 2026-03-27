// schemas/partner.ts — 파트너 / 스폰서
import { defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export default defineType({
  name: 'partner',
  title: '파트너 / 스폰서',
  type: 'document',
  icon: UsersIcon,

  fields: [
    /* ── 기본 정보 ─────────────────────────────────────────── */
    defineField({
      name: 'name',
      title: '파트너명',
      type: 'string',
      validation: R => R.required(),
    }),
    defineField({
      name: 'nameEn',
      title: '파트너명 (영문)',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: '슬러그',
      type: 'slug',
      options: { source: 'name' },
    }),

    /* ── 등급 / 업종 ───────────────────────────────────────── */
    defineField({
      name: 'tier',
      title: '스폰서 등급',
      type: 'string',
      options: {
        list: [
          { title: '타이틀 스폰서',   value: 'title' },
          { title: '프레젠팅 스폰서', value: 'presenting' },
          { title: '골드 스폰서',     value: 'gold' },
          { title: '실버 스폰서',     value: 'silver' },
          { title: '공식 파트너',     value: 'official' },
          { title: '미디어 파트너',   value: 'media' },
          { title: '서포팅 파트너',   value: 'supporting' },
        ],
        layout: 'radio',
      },
      initialValue: 'official',
      validation: R => R.required(),
    }),
    defineField({
      name: 'category',
      title: '업종 카테고리',
      type: 'string',
      options: {
        list: [
          { title: '자동차',    value: 'automotive' },
          { title: '타이어',    value: 'tire' },
          { title: '오일/케미컬', value: 'oil' },
          { title: '금융',      value: 'finance' },
          { title: '식음료',    value: 'food' },
          { title: '미디어',    value: 'media' },
          { title: '스포츠/레저', value: 'sports' },
          { title: '기술/IT',   value: 'tech' },
          { title: '공공/지자체', value: 'public' },
          { title: '기타',      value: 'other' },
        ],
      },
    }),

    /* ── 로고 ──────────────────────────────────────────────── */
    defineField({
      name: 'logo',
      title: '로고 (컬러)',
      type: 'image',
      options: { hotspot: false },
      validation: R => R.required(),
    }),
    defineField({
      name: 'logoWhite',
      title: '로고 (화이트 / 어두운 배경용)',
      type: 'image',
      options: { hotspot: false },
    }),

    /* ── 링크 / 계약 ───────────────────────────────────────── */
    defineField({
      name: 'websiteUrl',
      title: '공식 홈페이지 URL',
      type: 'url',
    }),
    defineField({
      name: 'contractSeasons',
      title: '계약 시즌 연도',
      type: 'array',
      of: [{ type: 'number' }],
      description: '예: [2025, 2026] — 해당 연도에만 노출',
      initialValue: [2026],
    }),
    defineField({
      name: 'description',
      title: '파트너 소개 (선택)',
      type: 'text',
      rows: 2,
    }),

    /* ── 표시 제어 ─────────────────────────────────────────── */
    defineField({
      name: 'isActive',
      title: '현재 시즌 노출',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'sortOrder',
      title: '정렬 순서',
      type: 'number',
      initialValue: 100,
      description: '같은 등급 내에서 낮은 숫자가 앞에 표시',
    }),
  ],

  orderings: [
    {
      title: '등급 → 순서',
      name: 'tierOrder',
      by: [
        { field: 'tier',      direction: 'asc' },
        { field: 'sortOrder', direction: 'asc' },
      ],
    },
  ],

  preview: {
    select: {
      title:  'name',
      tier:   'tier',
      media:  'logo',
      active: 'isActive',
    },
    prepare({ title, tier, media, active }: any) {
      const tierLabel: Record<string, string> = {
        title: '타이틀', presenting: '프레젠팅', gold: '골드',
        silver: '실버', official: '공식', media: '미디어', supporting: '서포팅',
      }
      return {
        title:    `${active ? '' : '🔇 '}${title}`,
        subtitle: tierLabel[tier] ?? tier,
        media,
      }
    },
  },
})
