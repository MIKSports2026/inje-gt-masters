// schemas/driverStanding.ts — 드라이버 스탠딩 (시즌 누적 드라이버 포인트)
import { defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'
import { StandingsImportLinkButton } from '../components/StandingsImportLinkButton'

export default defineType({
  name: 'driverStanding',
  title: 'Driver Standing (드라이버 스탠딩)',
  type: 'document',
  icon: UserIcon,

  fields: [
    /* ── 일괄 입력 버튼 ────────────────────────────────────── */
    defineField({
      name: 'importAction',
      title: '📥 엑셀로 일괄 입력',
      type: 'string',
      readOnly: true,
      components: { input: StandingsImportLinkButton },
    }),

    /* ── 시즌 / 클래스 ─────────────────────────────────────── */
    defineField({
      name: 'season',
      title: '시즌',
      type: 'number',
      initialValue: 2026,
      validation: R => R.required().integer().min(2020),
    }),
    defineField({
      name: 'classInfo',
      title: '클래스',
      type: 'reference',
      to: [{ type: 'classInfo' }],
      validation: R => R.required(),
    }),

    /* ── 순위표 ────────────────────────────────────────────── */
    defineField({
      name: 'entries',
      title: '드라이버 순위표',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'position',           title: '순위',              type: 'number', validation: R => R.integer().min(1) }),
          defineField({ name: 'driverName',          title: '드라이버명',        type: 'string', validation: R => R.required() }),
          defineField({ name: 'carNumber',           title: '차량번호',          type: 'string' }),
          defineField({ name: 'teamName',            title: '팀명',              type: 'string' }),
          defineField({ name: 'racePoints',          title: '결승 포인트',       type: 'number', initialValue: 0 }),
          defineField({ name: 'finishBonusPoints',   title: '완주 보너스 포인트', type: 'number', initialValue: 0 }),
          defineField({ name: 'qualifyingPoints',    title: '예선 포인트',       type: 'number', initialValue: 0 }),
          defineField({ name: 'totalPoints',         title: '합계 포인트',       type: 'number', initialValue: 0 }),
        ],
        preview: {
          select: { pos: 'position', driver: 'driverName', pts: 'totalPoints' },
          prepare({ pos, driver, pts }: any) {
            return { title: `${pos}위 — ${driver ?? ''}`, subtitle: `${pts ?? 0}pt` }
          },
        },
      }],
    }),

    /* ── 공개 / 업데이트 ───────────────────────────────────── */
    defineField({
      name: 'isPublished',
      title: '공개',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'updatedAt',
      title: '업데이트 일시',
      type: 'datetime',
    }),
  ],

  orderings: [
    {
      title: '시즌 최신순',
      name: 'seasonDesc',
      by: [{ field: 'season', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      season:    'season',
      className: 'classInfo.name',
      published: 'isPublished',
    },
    prepare({ season, className, published }: any) {
      return {
        title:    `${season ?? ''} — ${className ?? '클래스 미선택'}`,
        subtitle: `드라이버 스탠딩 ${published ? '✅' : '🔒'}`,
      }
    },
  },
})
