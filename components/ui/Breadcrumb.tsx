// components/ui/Breadcrumb.tsx — 공통 브레드크럼
import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        overflow: 'hidden',
        fontSize: '.8rem',
        marginBottom: '14px',
        letterSpacing: '.02em',
      }}
    >
      {items.map((item, i) => (
        <span
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            minWidth: 0,
            flexShrink: i === items.length - 1 ? 1 : 0,
          }}
        >
          {i > 0 && (
            <span style={{
              margin: '0 7px',
              color: 'rgba(255,255,255,.25)',
              userSelect: 'none',
              flexShrink: 0,
              fontSize: '.72rem',
            }}>
              &gt;
            </span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="bc-link"
              style={{
                color: 'rgba(255,255,255,.48)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                fontWeight: 700,
              }}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{
              color: 'rgba(255,255,255,.78)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontWeight: 600,
            }}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
