// sanity/schemas/driverProfile.ts — 드라이버 프로필
import { defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'

export default defineType({
  name: 'driverProfile',
  title: '드라이버 프로필',
  type: 'document',
  icon: UserIcon,

  groups: [
    { name: 'basic',   title: '기본 정보', default: true },
    { name: 'profile', title: '프로필 상세' },
    { name: 'meta',    title: '관리' },
  ],

  fields: [
    /* ── 필수 정보 ──────────────────────────────────────────── */
    defineField({
      name: 'carNumber',
      title: '차량 번호',
      type: 'string',
      group: 'basic',
      description: '예: 2, 26, 44 (앞자리 0 포함 가능)',
      validation: R => R.required(),
    }),
    defineField({
      name: 'driverName',
      title: '드라이버 이름',
      type: 'string',
      group: 'basic',
      validation: R => R.required(),
    }),
    defineField({
      name: 'teamName',
      title: '소속 팀',
      type: 'string',
      group: 'basic',
      validation: R => R.required(),
    }),
    defineField({
      name: 'className',
      title: '클래스',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Masters 1',     value: 'Masters 1' },
          { title: 'Masters 2',     value: 'Masters 2' },
          { title: 'Masters N',     value: 'Masters N' },
          { title: 'Masters N-evo', value: 'Masters N-evo' },
          { title: 'Masters 3',     value: 'Masters 3' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'slug',
      title: '슬러그',
      type: 'slug',
      group: 'basic',
      options: {
        source: (doc: any) => `${doc.carNumber ?? ''}-${doc.driverName ?? ''}`,
        maxLength: 96,
      },
      validation: R => R.required(),
    }),

    /* ── 프로필 상세 ─────────────────────────────────────────── */
    defineField({
      name: 'photo',
      title: '프로필 사진',
      type: 'image',
      group: 'profile',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt 텍스트', type: 'string' }),
      ],
    }),
    defineField({
      name: 'birthDate',
      title: '생년월일',
      type: 'string',
      group: 'profile',
      description: 'YYYY-MM-DD 형식으로 입력. 예: 1985-03-22',
    }),
    defineField({
      name: 'bloodType',
      title: '혈액형',
      type: 'string',
      group: 'profile',
      options: {
        list: [
          { title: 'A',  value: 'A'  },
          { title: 'B',  value: 'B'  },
          { title: 'O',  value: 'O'  },
          { title: 'AB', value: 'AB' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'karaLicense',
      title: 'KARA 라이선스',
      type: 'string',
      group: 'profile',
      description: '예: 국내 A급 / 국내 B급',
    }),
    defineField({
      name: 'bio',
      title: '소개',
      type: 'array',
      group: 'profile',
      of: [{ type: 'block' }],
    }),

    /* ── 관리 ────────────────────────────────────────────────── */
    defineField({
      name: 'season',
      title: '시즌',
      type: 'number',
      group: 'meta',
      initialValue: 2026,
      validation: R => R.required().integer().min(2020),
    }),
    defineField({
      name: 'isActive',
      title: '활동 여부',
      type: 'boolean',
      group: 'meta',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: '정렬 순서',
      type: 'number',
      group: 'meta',
      description: '낮을수록 앞에 표시',
    }),
  ],

  orderings: [
    {
      title: '차량 번호 오름차순',
      name: 'carNumberAsc',
      by: [{ field: 'carNumber', direction: 'asc' }],
    },
    {
      title: '드라이버명 가나다순',
      name: 'driverNameAsc',
      by: [{ field: 'driverName', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      carNumber:  'carNumber',
      driverName: 'driverName',
      teamName:   'teamName',
      className:  'className',
      media:      'photo',
    },
    prepare({ carNumber, driverName, teamName, className, media }: any) {
      return {
        title:    `${carNumber ?? '?'}. ${driverName ?? ''}`,
        subtitle: `${teamName ?? ''} · ${className ?? ''}`,
        media,
      }
    },
  },
})
