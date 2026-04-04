// sanity/schemas/mediaKit.ts — 미디어킷 다운로드 자료
export default {
  name: 'mediaKit',
  title: '미디어킷',
  type: 'document',
  fields: [
    { name: 'title', title: '제목', type: 'string' },
    { name: 'description', title: '설명', type: 'text' },
    {
      name: 'category', title: '카테고리', type: 'string',
      options: {
        list: [
          { title: '로고',     value: 'logo'       },
          { title: '사진',     value: 'photo'      },
          { title: '규정문서', value: 'regulation' },
          { title: '보도자료', value: 'press'      },
          { title: '기타',     value: 'etc'        },
        ],
      },
    },
    {
      name: 'file', title: '첨부파일', type: 'file',
      options: { accept: '.pdf,.zip,.png,.jpg,.ai,.eps' },
    },
    { name: 'thumbnail', title: '썸네일', type: 'image' },
    { name: 'publishedAt', title: '공개일', type: 'date' },
    { name: 'isPublic', title: '공개 여부', type: 'boolean', initialValue: true },
    { name: 'order', title: '노출 순서', type: 'number' },
  ],
}
