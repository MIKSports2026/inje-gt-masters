// components/ui/RevealOnScroll.tsx
'use client'
import { useEffect, useRef } from 'react'
import clsx from 'clsx'

interface Props {
  children:   React.ReactNode
  className?: string
  style?:     React.CSSProperties
  delay?:     0 | 1 | 2 | 3
}

const delayClass = { 0: '', 1: 'delay-1', 2: 'delay-2', 3: 'delay-3' } as const

export default function RevealOnScroll({
  children,
  className,
  style,
  delay = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={clsx('reveal', delayClass[delay], className)}
      style={style}
    >
      {children}
    </div>
  )
}
