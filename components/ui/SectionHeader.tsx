// components/ui/SectionHeader.tsx — 공통 섹션 타이틀
interface Props {
  subtitle?: string
  title: string
}

export default function SectionHeader({ subtitle, title }: Props) {
  return (
    <div className="shdr">
      {subtitle && <div className="shdr__sub">{subtitle}</div>}
      <div className="shdr__row">
        <h2 className="shdr__title">{title}</h2>
        <div className="shdr__line" />
      </div>

      <style>{`
        .shdr { margin-bottom: 40px; }
        .shdr__sub {
          font-family: var(--font-heading, 'Oswald', sans-serif);
          font-size: 0.75rem; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--text-secondary, #AAAAAA);
          margin-bottom: 8px;
        }
        .shdr__row {
          display: flex; align-items: center; gap: 24px;
        }
        .shdr__title {
          font-family: var(--font-heading, 'Oswald', sans-serif);
          font-size: 2.5rem; font-weight: 700;
          letter-spacing: -0.02em; text-transform: uppercase;
          color: var(--text-primary, #FFFFFF);
          margin: 0; white-space: nowrap;
        }
        .shdr__line {
          flex: 1; height: 2px;
          background: var(--primary-red, #E60023);
        }
      `}</style>
    </div>
  )
}
