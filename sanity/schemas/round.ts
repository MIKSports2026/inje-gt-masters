// schemas/round.ts — 시즌 라운드 (R1~R4)
import { defineField, defineType } from 'sanity'
import { CalendarIcon } from '@sanity/icons'

export default defineType({
  name: 'round',
  title: '라운드',
  type: 'document',
  icon: CalendarIcon,

  groups: [
    { name: 'basic',    title: '기본 정보', default: true },
    { name: 'schedule', title: '세부 일정' },
    { name: 'entry',    title: '참가신청' },
    { name: 'media',    title: '미디어' },
    { name: 'content',  title: '안내 본문' },
  ],

  fields: [
    /* ── 식별 ──────────────────────────────────────────────── */
    defineField({
      name: 'season',
      title: '시즌 연도',
      type: 'number',
      group: 'basic',
      initialValue: 2026,
      validation: R => R.required().integer(),
    }),
    defineField({
      name: 'roundNumber',
      title: '라운드 번호',
      type: 'number',
      group: 'basic',
      validation: R => R.required().integer().min(1).max(10),
    }),
    defineField({
      name: 'slug',
      title: '슬러그',
      type: 'slug',
      group: 'basic',
      options: {
        source: (doc: any) => `${doc.season}-r${doc.roundNumber}`,
      },
      validation: R => R.required(),
    }),

    /* ── 명칭 ──────────────────────────────────────────────── */
    defineField({
      name: 'title',
      title: '라운드 타이틀',
      type: 'string',
      group: 'basic',
      description: '예: 개막전 / 서머 / 나이트레이스 / 파이널',
      validation: R => R.required(),
    }),
    defineField({
      name: 'titleEn',
      title: '라운드 타이틀 (영문)',
      type: 'string',
      group: 'basic',
      description: '예: Opening Round',
    }),
    defineField({
      name: 'subtitle',
      title: '부제',
      type: 'string',
      group: 'basic',
      description: '예: 2026 인제 GT 마스터즈 R1',
    }),
    defineField({
      name: 'campaignCopy',
      title: '캠페인 카피',
      type: 'string',
      group: 'basic',
      description: '히어로 영역에 표시되는 슬로건. 예: PUSH YOUR LIMIT — 전설의 시작',
    }),
    defineField({
      name: 'badge',
      title: '뱃지 레이블',
      type: 'string',
      group: 'basic',
      description: '야간경기, 특별전 등 강조 표시. 예: NIGHT RACE',
    }),

    /* ── 일정 ──────────────────────────────────────────────── */
    defineField({
      name: 'dateStart',
      title: '시작일',
      type: 'date',
      group: 'basic',
      options: { dateFormat: 'YYYY-MM-DD' },
      validation: R => R.required(),
    }),
    defineField({
      name: 'dateEnd',
      title: '종료일',
      type: 'date',
      group: 'basic',
      options: { dateFormat: 'YYYY-MM-DD' },
    }),

    /* ── 상태 ──────────────────────────────────────────────── */
    defineField({
      name: 'status',
      title: '라운드 상태',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: '예정', value: 'upcoming' },
          { title: '접수중', value: 'entry_open' },
          { title: '접수마감', value: 'entry_closed' },
          { title: '진행중', value: 'ongoing' },
          { title: '종료', value: 'finished' },
        ],
        layout: 'radio',
      },
      initialValue: 'upcoming',
      validation: R => R.required(),
    }),

    /* ── 세부 일정 ─────────────────────────────────────────── */
    defineField({
      name: 'schedule',
      title: '세부 일정표',
      type: 'array',
      group: 'schedule',
      of: [
        {
          type: 'object',
          name: 'scheduleDay',
          title: '일자',
          fields: [
            defineField({ name: 'dayLabel', title: '날짜 표시', type: 'string',
              description: '예: DAY 1 — 05.17 Sat' }),
            defineField({
              name: 'items',
              title: '세션 목록',
              type: 'array',
              of: [{
                type: 'object',
                fields: [
                  defineField({ name: 'time',  title: '시간',    type: 'string' }),
                  defineField({ name: 'label', title: '세션명',  type: 'string' }),
                  defineField({
                    name: 'sessionType',
                    title: '유형',
                    type: 'string',
                    options: {
                      list: [
                        { title: '자유연습', value: 'practice' },
                        { title: '예선',     value: 'qualifying' },
                        { title: '결승',     value: 'race' },
                        { title: '기타',     value: 'other' },
                      ],
                    },
                  }),
                ],
                preview: {
                  select: { title: 'time', subtitle: 'label' },
                },
              }],
            }),
          ],
          preview: { select: { title: 'dayLabel' } },
        },
      ],
    }),

    /* ── 참가신청 ─────────────────────────────────────────── */
    defineField({
      name: 'entryOpenDate',
      title: '접수 시작일시',
      type: 'datetime',
      group: 'entry',
    }),
    defineField({
      name: 'entryCloseDate',
      title: '접수 마감일시',
      type: 'datetime',
      group: 'entry',
    }),
    defineField({
      name: 'tossPaymentUrl',
      title: '토스페이먼츠 결제 링크 (이 라운드 전용)',
      type: 'url',
      group: 'entry',
      description: '없으면 사이트 설정의 기본값 사용',
    }),
    defineField({
      name: 'entryFeeNote',
      title: '참가비 안내 (공개용)',
      type: 'text',
      rows: 2,
      group: 'entry',
    }),
    defineField({
      name: 'maxEntries',
      title: '최대 참가 대수',
      type: 'number',
      group: 'entry',
      initialValue: 107,
    }),

    /* ── 미디어 ────────────────────────────────────────────── */
    defineField({
      name: 'heroImage',
      title: '대표 이미지',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
    }),
    defineField({
      name: 'posterImage',
      title: '포스터 이미지',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
    }),
    defineField({
      name: 'resultImage',
      title: '경기 결과 이미지',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      description: '경기 완료 후 사진 (종료된 라운드에 표시)',
    }),
    defineField({
      name: 'resultUrl',
      title: '결과 보기 링크',
      type: 'string',
      group: 'media',
      description: '예: /results?round=R1',
    }),
    defineField({
      name: 'gallery',
      title: '갤러리',
      type: 'array',
      group: 'media',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),

    /* ── 안내 본문 ─────────────────────────────────────────── */
    defineField({
      name: 'description',
      title: '라운드 소개',
      type: 'array',
      group: 'content',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'notices',
      title: '공지사항 (라운드별)',
      type: 'array',
      group: 'content',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title',   title: '제목', type: 'string' }),
          defineField({ name: 'content', title: '내용', type: 'text' }),
        ],
        preview: { select: { title: 'title' } },
      }],
    }),
    defineField({
      name: 'hasResults',
      title: '결과 공개',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    }),
    defineField({
      name: 'isHidden',
      title: '비노출 (숨김)',
      type: 'boolean',
      group: 'basic',
      description: '체크 시 프론트엔드에서 노출되지 않습니다.',
      initialValue: false,
    }),
  ],

  orderings: [
    {
      title: '시즌 · 라운드순',
      name: 'seasonRoundAsc',
      by: [
        { field: 'season',      direction: 'desc' },
        { field: 'roundNumber', direction: 'asc'  },
      ],
    },
  ],

  preview: {
    select: {
      season:      'season',
      roundNumber: 'roundNumber',
      title:       'title',
      dateStart:   'dateStart',
      media:       'heroImage',
      status:      'status',
      hidden:      'isHidden',
    },
    prepare({ season, roundNumber, title, dateStart, media, status, hidden }) {
      const statusIcon: Record<string, string> = {
        upcoming: '🔵', entry_open: '🟢', entry_closed: '🟡', ongoing: '🔴', finished: '⚫',
      }
      return {
        title: `${hidden ? '🙈 [숨김] ' : ''}${season} R${roundNumber} — ${title}`,
        subtitle: `${statusIcon[status] ?? ''} ${dateStart ?? ''}`,
        media,
      }
    },
  },
})
