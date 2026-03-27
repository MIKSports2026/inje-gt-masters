// components/ui/Eyebrow.tsx
import clsx from 'clsx'

interface Props {
  children:  React.ReactNode
  className?: string
  light?:    boolean   // 어두운 배경 위에서 사용할 때
}

export default function Eyebrow({ children, className, light }: Props) {
  return (
    <span
      className={clsx(
        'eyebrow',
        light && 'text-white/80 before:bg-white/80',
        className
      )}
    >
      {children}
    </span>
  )
}
