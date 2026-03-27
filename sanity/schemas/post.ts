// schemas/post.ts — 소식 / 공지 / 보도자료
import { defineField, defineType } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'

export default defineType({
  name: 'post',
  title: '소식 / 공지',
  type: 'document',
  icon: DocumentTextIcon,

  groups: [
    { name: 'basic',   title: '기본 정보', default: true },
    { name: 'content', title: '본문' },
    { name: 'seo',     title: 'SEO' },
  ],

  fields: [
    /* ── 분류 ──────────────────────────────────────────────── */
    defineField({
      name: 'category',
      title: '카테고리',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: '공지사항',   value: 'notice' },
          { title: '대회소식',   value: 'news' },
          { title: '보도자료',   value: 'press' },
          { title: '참가안내',   value: 'entry' },
          { title: '기술규정',   value: 'regulation' },
          { title: '이벤트',     value: 'event' },
        ],
        layout: 'radio',
      },
      initialValue: 'news',
      validation: R => R.required(),
    }),
    defineField({
      name: 'isPinned',
      title: '상단 고정',
      type: 'boolean',
      group: 'basic',
      initialValue: false,
    }),

    /* ── 제목 / 슬러그 ─────────────────────────────────────── */
    defineField({
      name: 'title',
      title: '제목',
      type: 'string',
      group: 'basic',
      validation: R => R.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: '슬러그',
      type: 'slug',
      group: 'basic',
      options: { source: 'title', maxLength: 96 },
      validation: R => R.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: '발행일',
      type: 'datetime',
      group: 'basic',
      initialValue: () => new Date().toISOString(),
      validation: R => R.required(),
    }),
    defineField({
      name: 'author',
      title: '작성자',
      type: 'string',
      group: 'basic',
      initialValue: '인제 GT 마스터즈 운영사무국',
    }),
    defineField({
      name: 'excerpt',
      title: '요약 (목록 미리보기)',
      type: 'text',
      rows: 3,
      group: 'basic',
      validation: R => R.max(200),
    }),
    defineField({
      name: 'coverImage',
      title: '대표 이미지',
      type: 'image',
      group: 'basic',
      options: { hotspot: true },
    }),
    defineField({
      name: 'relatedRound',
      title: '관련 라운드',
      type: 'reference',
      group: 'basic',
      to: [{ type: 'round' }],
    }),

    /* ── 본문 (Portable Text) ──────────────────────────────── */
    defineField({
      name: 'body',
      title: '본문',
      type: 'array',
      group: 'content',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'caption', title: '캡션', type: 'string' }),
            defineField({ name: 'alt',     title: 'Alt 텍스트', type: 'string' }),
          ],
        },
        {
          type: 'object',
          name: 'videoEmbed',
          title: '영상 임베드',
          fields: [
            defineField({ name: 'url',     title: 'YouTube URL', type: 'url' }),
            defineField({ name: 'caption', title: '캡션', type: 'string' }),
          ],
          preview: { select: { title: 'url' } },
        },
        {
          type: 'object',
          name: 'fileAttachment',
          title: '파일 첨부',
          fields: [
            defineField({ name: 'file',  title: '파일',       type: 'file' }),
            defineField({ name: 'label', title: '파일 레이블', type: 'string' }),
          ],
          preview: { select: { title: 'label' } },
        },
      ],
    }),

    /* ── SEO ────────────────────────────────────────────────── */
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      group: 'seo',
      validation: R => R.max(160),
    }),
  ],

  orderings: [
    {
      title: '발행일 최신순',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: '고정 → 최신순',
      name: 'pinnedFirst',
      by: [
        { field: 'isPinned',    direction: 'desc' },
        { field: 'publishedAt', direction: 'desc' },
      ],
    },
  ],

  preview: {
    select: {
      title:    'title',
      category: 'category',
      date:     'publishedAt',
      media:    'coverImage',
      pinned:   'isPinned',
    },
    prepare({ title, category, date, media, pinned }: any) {
      const catLabel: Record<string, string> = {
        notice: '공지', news: '소식', press: '보도',
        entry: '참가', regulation: '규정', event: '이벤트',
      }
      return {
        title:    `${pinned ? '📌 ' : ''}${title}`,
        subtitle: `[${catLabel[category] ?? category}] ${date ? String(date).slice(0, 10) : ''}`,
        media,
      }
    },
  },
})
