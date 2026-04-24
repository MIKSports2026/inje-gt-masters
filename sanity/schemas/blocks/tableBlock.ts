import { defineField, defineType } from 'sanity'
import { ThListIcon } from '@sanity/icons'

export default defineType({
  name: 'tableBlock',
  title: '표 (Table)',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({
      name: 'headers',
      title: '헤더 (첫 번째 행)',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (R) => R.min(1),
    }),
    defineField({
      name: 'rows',
      title: '행 목록',
      type: 'array',
      of: [{
        type: 'object',
        name: 'row',
        fields: [
          defineField({
            name: 'cells',
            title: '셀',
            type: 'array',
            of: [{ type: 'string' }],
          }),
        ],
        preview: {
          select: { cells: 'cells' },
          prepare: ({ cells }) => ({ title: (cells ?? []).join(' | ') }),
        },
      }],
    }),
    defineField({
      name: 'caption',
      title: '표 설명 (선택)',
      type: 'string',
    }),
  ],
  preview: {
    select: { headers: 'headers', caption: 'caption' },
    prepare: ({ headers, caption }) => ({
      title: caption ?? '표',
      subtitle: headers ? `헤더: ${headers.join(', ')}` : '',
    }),
  },
})
