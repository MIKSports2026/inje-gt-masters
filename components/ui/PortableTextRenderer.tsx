// components/ui/PortableTextRenderer.tsx
// NOTE: app/(site)/media/news/[slug]/page.tsx 인라인 렌더러와 동기화 유지 필수
// 새 block type 추가 시 두 파일 모두 업데이트할 것
// → 이 파일 ↔ app/(site)/media/news/[slug]/page.tsx
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import type { SanityImage } from '@/types/sanity'

type TableBlockValue = {
  _type: 'tableBlock'
  headers?: string[]
  rows?: { cells?: string[] }[]
  caption?: string
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImage & { caption?: string; alt?: string; metadata?: { dimensions?: { width?: number; height?: number } } } }) => {
      if (!value?.asset?.url) return null
      const w = (value.asset as any)?.metadata?.dimensions?.width ?? 1200
      const h = (value.asset as any)?.metadata?.dimensions?.height ?? 675
      return (
        <figure className="my-6"
          style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)' }}
        >
          <Image
            src={value.asset.url}
            alt={value.alt ?? value.caption ?? ''}
            width={w}
            height={h}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            unoptimized
          />
          {value.caption && (
            <figcaption className="text-sm text-muted mt-2 text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },

    videoEmbed: ({ value }: { value: { url?: string; caption?: string } }) => {
      if (!value?.url) return null
      // YouTube URL → embed URL 변환
      const videoId = value.url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
      )?.[1]
      if (!videoId) return null
      return (
        <figure className="my-6">
          <div className="relative w-full aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={value.caption ?? 'Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            />
          </div>
          {value.caption && (
            <figcaption className="text-sm text-muted mt-2 text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },

    fileAttachment: ({ value }: { value: { file?: { asset?: { url: string } }; label?: string } }) => {
      if (!value?.file?.asset?.url) return null
      return (
        <a
          href={value.file.asset.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 border border-line bg-surface2 rounded-lg my-4 hover:border-red transition-colors"
          style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)' }}
        >
          <i className="fa-solid fa-file-pdf text-red text-xl" />
          <span className="font-bold">{value.label ?? '첨부 파일 다운로드'}</span>
          <i className="fa-solid fa-download ml-auto text-muted" />
        </a>
      )
    },

    tableBlock: ({ value }: { value: TableBlockValue }) => {
      if (!value?.headers?.length) return null
      return (
        <div className="overflow-x-auto my-6">
          <table className="w-full border-collapse bg-black/50">
            <thead>
              <tr className="bg-red-600">
                {value.headers.map((h: string, i: number) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left text-white font-semibold uppercase tracking-wider text-sm min-w-[60px]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(value.rows ?? []).map(
                (row: { cells?: string[] }, ri: number) => (
                  <tr
                    key={ri}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    {(row.cells ?? []).map((cell: string, ci: number) => (
                      <td
                        key={ci}
                        className="px-4 py-3 text-sm text-gray-300 whitespace-normal"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                )
              )}
            </tbody>
            {value.caption && (
              <caption className="caption-bottom text-xs text-gray-500 mt-2 text-center">
                {value.caption}
              </caption>
            )}
          </table>
        </div>
      )
    },
  },

  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl font-900 mt-10 mb-4 leading-tight tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-850 mt-8 mb-3 leading-tight">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="text-[1.05rem] leading-relaxed text-ink/90 mb-4">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-red pl-4 my-4 text-muted italic">
        {children}
      </blockquote>
    ),
  },

  marks: {
    strong: ({ children }) => <strong className="font-900">{children}</strong>,
    em:     ({ children }) => <em className="italic">{children}</em>,
    link:   ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-red font-bold underline hover:text-red-dark"
      >
        {children}
      </a>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="list my-4 pl-0">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 my-4 space-y-2">{children}</ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start gap-2">
        <span className="dot mt-2 shrink-0" />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => <li>{children}</li>,
  },
}

export default function PortableTextRenderer({ value }: { value: any[] }) {
  if (!value?.length) return null
  return (
    <div className="portable-text">
      <PortableText value={value} components={components} />
    </div>
  )
}
