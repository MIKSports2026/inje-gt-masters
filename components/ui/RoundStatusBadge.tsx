// components/ui/RoundStatusBadge.tsx
import clsx from 'clsx'
import type { RoundStatus } from '@/types/sanity'

const STATUS_MAP: Record<RoundStatus, { label: string; cls: string }> = {
  upcoming:      { label: '예정',     cls: 'bg-blue-50 border-blue-200 text-blue-700' },
  entry_open:    { label: '접수중',   cls: 'bg-green-50 border-green-200 text-green-700' },
  entry_closed:  { label: '접수마감', cls: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  ongoing:       { label: '진행중',   cls: 'bg-red-50 border-red-200 text-red-700' },
  finished:      { label: '종료',     cls: 'bg-gray-100 border-gray-300 text-gray-500' },
}

export default function RoundStatusBadge({ status }: { status: RoundStatus }) {
  const { label, cls } = STATUS_MAP[status] ?? STATUS_MAP.upcoming
  return (
    <span
      className={clsx(
        'inline-flex items-center px-3 h-8 text-xs font-900 border rounded-sm',
        'clip-path-cut',
        cls
      )}
      style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
    >
      {label}
    </span>
  )
}
