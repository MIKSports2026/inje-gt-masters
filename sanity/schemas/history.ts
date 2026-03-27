// schemas/history.ts — 대회 역사 (연도별)
import { defineField, defineType } from 'sanity'
import { BookIcon } from '@sanity/icons'

export default defineType({
  name: 'history',
  title: '대회 역사',
  type: 'document',
  icon: BookIcon,

  groups: [
    { name: 'basic',     title: '기본 정보', default: true },
    { name: 'champions', title: '챔피언' },
    { name: 'content',   title: '상세 내용' },
    { name: 'media',     title: '미디어' },
  ],

  fields: [
    /* ── 연도 ──────────────────────────────────────────────── */
    defineField({
      name: 'year',
      title: '연도',
      type: 'number',
      group: 'basic',
      validation: R => R.required().integer().min(2000).max(2099),
    }),
    defineField({
      name: 'edition',
      title: '회차 레이블',
      type: 'string',
      group: 'basic',
      description: '예: 제1회',
    }),
    defineField({
      name: 'headline',
      title: '헤드라인 (한 줄 요약)',
      type: 'string',
      group: 'basic',
      validation: R => R.required().max(80),
    }),
    defineField({
      name: 'summary',
      title: '요약 설명',
      type: 'text',
      rows: 3,
      group: 'basic',
    }),

    /* ── 주요 통계 ─────────────────────────────────────────── */
    defineField({
      name: 'stats',
      title: '주요 통계',
      type: 'array',
      group: 'basic',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', title: '항목', type: 'string' }),
          defineField({ name: 'value', title: '값',   type: 'string' }),
        ],
        preview: { select: { title: 'label', subtitle: 'value' } },
      }],
      description: '예: {label: "참가팀", value: "87팀"}, {label: "관람객", value: "12,000명"}',
    }),

    /* ── 챔피언 ────────────────────────────────────────────── */
    defineField({
      name: 'champions',
      title: '클래스별 챔피언',
      type: 'array',
      group: 'champions',
      of: [{
        type: 'object',
        fields: [
          defineField({
            name: 'classCode',
            title: '클래스',
            type: 'string',
            options: {
              list: [
                { title: 'GT1',     value: 'GT1' },
                { title: 'GT2',     value: 'GT2' },
                { title: 'GT3',     value: 'GT3' },
                { title: 'DRIFT',   value: 'DRIFT' },
                { title: 'BIKE',    value: 'BIKE' },
                { title: 'SUPERCAR',value: 'SUPERCAR' },
              ],
            },
          }),
          defineField({ name: 'teamName',  title: '팀명',       type: 'string' }),
          defineField({ name: 'driver1',   title: '드라이버 1', type: 'string' }),
          defineField({ name: 'driver2',   title: '드라이버 2', type: 'string' }),
          defineField({ name: 'carModel',  title: '차량',       type: 'string' }),
          defineField({ name: 'carNumber', title: '차량 번호',  type: 'string' }),
          defineField({ name: 'photo',     title: '수상 사진',  type: 'image',
            options: { hotspot: true } }),
        ],
        preview: {
          select: { cls: 'classCode', team: 'teamName', d1: 'driver1' },
          prepare({ cls, team, d1 }: any) {
            return { title: `[${cls}] ${team ?? ''}`, subtitle: d1 }
          },
        },
      }],
    }),

    /* ── 상세 내용 ─────────────────────────────────────────── */
    defineField({
      name: 'milestones',
      title: '주요 사건/기록',
      type: 'array',
      group: 'content',
      of: [{ type: 'block' }],
      description: '포디엄 장면, 서킷 기록 갱신, 특별 이벤트 등',
    }),

    /* ── 미디어 ────────────────────────────────────────────── */
    defineField({
      name: 'heroImage',
      title: '연도 대표 이미지',
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
    defineField({
      name: 'highlightVideoUrl',
      title: '시즌 하이라이트 영상 URL (YouTube)',
      type: 'url',
      group: 'media',
    }),

    /* ── 공개 ──────────────────────────────────────────────── */
    defineField({
      name: 'isPublished',
      title: '공개',
      type: 'boolean',
      initialValue: true,
    }),
  ],

  orderings: [
    { title: '연도 최신순', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] },
  ],

  preview: {
    select: {
      year:     'year',
      edition:  'edition',
      headline: 'headline',
      media:    'heroImage',
    },
    prepare({ year, edition, headline, media }: any) {
      return {
        title:    `${year}${edition ? ` — ${edition}` : ''}`,
        subtitle: headline,
        media,
      }
    },
  },
})
