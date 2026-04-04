// schemas/regulation.ts — 기술 규정 문서
import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export default defineType({
  name: 'regulation',
  title: '규정 문서',
  type: 'document',
  icon: DocumentIcon,

  fields: [
    defineField({
      name: 'title',
      title: '문서 제목',
      type: 'string',
      description: '예: 2026 공통 기술 규정 v1.2',
      validation: R => R.required(),
    }),
    defineField({
      name: 'file',
      title: 'PDF 파일',
      type: 'file',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'version',
      title: '버전',
      type: 'string',
      description: '예: v1.2',
    }),
    defineField({
      name: 'season',
      title: '시즌 연도',
      type: 'number',
      initialValue: 2026,
    }),
    defineField({
      name: 'order',
      title: '정렬 순서',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'isHidden',
      title: '비노출 (숨김)',
      type: 'boolean',
      description: '체크 시 프론트엔드에서 노출되지 않습니다.',
      initialValue: false,
    }),
  ],

  orderings: [
    { title: '정렬순', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],

  preview: {
    select: { title: 'title', version: 'version', hidden: 'isHidden' },
    prepare({ title, version, hidden }: any) {
      return {
        title: `${hidden ? '🙈 [숨김] ' : ''}${title}`,
        subtitle: version ?? '',
      }
    },
  },
})
