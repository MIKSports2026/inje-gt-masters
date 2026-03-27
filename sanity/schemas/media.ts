// schemas/media.ts — 미디어 (사진 앨범 / 동영상)
import { defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons'

export default defineType({
  name: 'media',
  title: '미디어',
  type: 'document',
  icon: ImagesIcon,

  groups: [
    { name: 'basic',  title: '기본 정보', default: true },
    { name: 'photos', title: '사진' },
    { name: 'video',  title: '동영상' },
  ],

  fields: [
    /* ── 유형 ──────────────────────────────────────────────── */
    defineField({
      name: 'mediaType',
      title: '미디어 유형',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: '📷 사진 앨범',            value: 'photoAlbum' },
          { title: '▶️  동영상 (YouTube)',     value: 'video' },
          { title: '🎬 영상 파일 (업로드)',    value: 'uploadedVideo' },
        ],
        layout: 'radio',
      },
      initialValue: 'photoAlbum',
      validation: R => R.required(),
    }),

    /* ── 기본 정보 ─────────────────────────────────────────── */
    defineField({
      name: 'title',
      title: '제목',
      type: 'string',
      group: 'basic',
      validation: R => R.required(),
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
    }),
    defineField({
      name: 'description',
      title: '설명',
      type: 'text',
      rows: 2,
      group: 'basic',
    }),
    defineField({
      name: 'relatedRound',
      title: '관련 라운드',
      type: 'reference',
      group: 'basic',
      to: [{ type: 'round' }],
    }),
    defineField({
      name: 'relatedClass',
      title: '관련 클래스',
      type: 'reference',
      group: 'basic',
      to: [{ type: 'classInfo' }],
    }),
    defineField({
      name: 'tags',
      title: '태그',
      type: 'array',
      group: 'basic',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'R1 개막전',    value: 'r1' },
          { title: 'R2 서머',      value: 'r2' },
          { title: 'R3 나이트레이스', value: 'r3' },
          { title: 'R4 파이널',    value: 'r4' },
          { title: 'GT1',          value: 'gt1' },
          { title: 'GT2',          value: 'gt2' },
          { title: 'GT3',          value: 'gt3' },
          { title: '드리프트',     value: 'drift' },
          { title: '바이크',       value: 'bike' },
          { title: '슈퍼카',       value: 'supercar' },
        ],
        layout: 'tags',
      },
    }),

    /* ── 사진 앨범 ─────────────────────────────────────────── */
    defineField({
      name: 'coverImage',
      title: '커버 이미지',
      type: 'image',
      group: 'photos',
      options: { hotspot: true },
    }),
    defineField({
      name: 'photos',
      title: '사진 목록',
      type: 'array',
      group: 'photos',
      hidden: ({ document }) => document?.mediaType !== 'photoAlbum',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'image',   title: '이미지', type: 'image',
            options: { hotspot: true }, validation: R => R.required() }),
          defineField({ name: 'alt',     title: 'Alt 텍스트', type: 'string' }),
          defineField({ name: 'caption', title: '캡션',       type: 'string' }),
          defineField({ name: 'credit',  title: '촬영자/출처', type: 'string' }),
        ],
        preview: {
          select: { media: 'image', title: 'caption' },
          prepare({ media, title }: any) {
            return { media, title: title || '(캡션 없음)' }
          },
        },
      }],
    }),

    /* ── YouTube 동영상 ────────────────────────────────────── */
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      group: 'video',
      hidden: ({ document }) => document?.mediaType === 'photoAlbum',
    }),
    defineField({
      name: 'youtubeThumbnail',
      title: 'YouTube 썸네일 URL',
      type: 'url',
      group: 'video',
      hidden: ({ document }) => document?.mediaType !== 'video',
      description: '비워두면 YouTube 기본 썸네일 자동 사용',
    }),
    defineField({
      name: 'duration',
      title: '재생 시간',
      type: 'string',
      group: 'video',
      hidden: ({ document }) => document?.mediaType === 'photoAlbum',
      description: '예: 3:24',
    }),
    defineField({
      name: 'videoFile',
      title: '영상 파일',
      type: 'file',
      group: 'video',
      hidden: ({ document }) => document?.mediaType !== 'uploadedVideo',
      options: { accept: 'video/*' },
    }),

    /* ── 표시 제어 ─────────────────────────────────────────── */
    defineField({
      name: 'isFeatured',
      title: '메인 페이지 노출',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isPublished',
      title: '공개',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'sortOrder',
      title: '정렬 순서 (낮을수록 앞)',
      type: 'number',
      initialValue: 100,
    }),
  ],

  orderings: [
    {
      title: '발행일 최신순',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      title:     'title',
      mediaType: 'mediaType',
      date:      'publishedAt',
      media:     'coverImage',
      featured:  'isFeatured',
    },
    prepare({ title, mediaType, date, media, featured }: any) {
      const typeIcon: Record<string, string> = {
        photoAlbum: '📷', video: '▶️', uploadedVideo: '🎬',
      }
      return {
        title:    `${featured ? '⭐ ' : ''}${title}`,
        subtitle: `${typeIcon[mediaType] ?? ''} ${date ? String(date).slice(0, 10) : ''}`,
        media,
      }
    },
  },
})
