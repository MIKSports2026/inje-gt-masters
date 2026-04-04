// sanity/schemas/application.ts — 참가신청
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'application',
  title: '참가신청',
  type: 'document',
  fields: [
    defineField({ name: 'roundId', title: '라운드', type: 'reference', to: [{ type: 'round' }] }),
    defineField({ name: 'roundLabel', title: '라운드명', type: 'string' }),
    defineField({ name: 'className', title: '클래스', type: 'string' }),
    defineField({ name: 'teamName', title: '팀명', type: 'string', validation: R => R.required() }),
    defineField({ name: 'carModel', title: '차량', type: 'string' }),

    // 드라이버 배열
    defineField({
      name: 'drivers',
      title: '드라이버',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'name', title: '이름', type: 'string', validation: R => R.required() }),
          defineField({ name: 'birthDate', title: '생년월일', type: 'string' }),
          defineField({
            name: 'bloodType',
            title: '혈액형',
            type: 'string',
            options: { list: ['A', 'B', 'O', 'AB'] },
          }),
          defineField({ name: 'phone', title: '연락처', type: 'string' }),
          defineField({ name: 'email', title: '이메일', type: 'string' }),
          defineField({ name: 'karaLicense', title: 'KARA 라이선스', type: 'string' }),
        ],
      }],
      validation: R => R.min(1).max(3),
    }),

    defineField({ name: 'contactPhone', title: '대표 연락처', type: 'string' }),
    defineField({ name: 'contactEmail', title: '대표 이메일', type: 'string' }),
    defineField({ name: 'agreedRules', title: '규정 동의', type: 'boolean', initialValue: false }),
    defineField({ name: 'agreedPrivacy', title: '개인정보 동의', type: 'boolean', initialValue: false }),
    defineField({ name: 'submittedAt', title: '신청일시', type: 'datetime' }),
    defineField({
      name: 'status',
      title: '상태',
      type: 'string',
      options: { list: ['pending', 'confirmed', 'cancelled'] },
      initialValue: 'pending',
    }),
  ],
  preview: {
    select: { title: 'teamName', subtitle: 'className', round: 'roundLabel' },
    prepare: ({ title, subtitle, round }) => ({
      title: `${title} — ${subtitle ?? ''}`,
      subtitle: round ?? '',
    }),
  },
})
