// components/layout/Footer.tsx
import Link from 'next/link'
import type { SiteSettings } from '@/types/sanity'

export default function Footer({ settings }: { settings: SiteSettings | null }) {
  const year = new Date().getFullYear()

  return (
    <footer
      className="mt-0"
      style={{ background: 'linear-gradient(180deg, var(--surface-2), #e8ecf0)' }}
    >
      <div className="container py-12">

        {/* ── 상단 패널 ─────────────────────────────────────── */}
        <div
          className="panel p-8 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div>
            <span className="eyebrow">INJE GT MASTERS 2026</span>
            <h3 className="mt-1" style={{ fontSize: 'clamp(1.28rem, 2vw, 1.7rem)' }}>
              인제 GT 마스터즈 — {settings?.slogan ?? 'Where Legends Begin'}
            </h3>
            <p className="muted mt-2 text-sm">
              강원도 인제스피디움에서 펼쳐지는 대한민국 정통 GT 내구레이스.<br />
              2026 시즌 참가 신청 접수 중.
            </p>
          </div>
          <div className="btns shrink-0">
            <Link href="/entry" className="btn btn-primary">
              <i className="fa fa-flag-checkered" />
              참가 신청
            </Link>
            <Link href="#top" className="btn btn-secondary">
              맨 위로
            </Link>
          </div>
        </div>

        {/* ── 링크 그리드 ───────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: '대회',
              links: [
                { label: '대회 소개',   href: '/#about' },
                { label: '대회 역사',   href: '/#history' },
                { label: '인제스피디움', href: '/#speedium' },
              ],
            },
            {
              title: '시즌',
              links: [
                { label: '2026 라운드', href: '/#season' },
                { label: '클래스 정보', href: '/#classes' },
                { label: '경기 결과',   href: '/#results' },
              ],
            },
            {
              title: '참가',
              links: [
                { label: '참가 신청',   href: '/entry' },
                { label: '참가 안내',   href: '/entry#guide' },
                { label: '규정 PDF',   href: '/entry#regulations' },
              ],
            },
            {
              title: '미디어',
              links: [
                { label: '포토 갤러리', href: '/media' },
                { label: '동영상',      href: '/media?type=video' },
                { label: '소식 / 공지', href: '/news' },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-900 tracking-widest text-muted uppercase mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#39434d] hover:text-red transition-colors font-[700]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── SNS ──────────────────────────────────────────── */}
        <div className="flex items-center gap-4 mb-6">
          {settings?.instagram && (
            <a href={settings.instagram} target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 border border-line bg-white grid place-items-center text-muted hover:text-red hover:border-red transition-colors rounded-sm">
              <i className="fab fa-instagram" />
            </a>
          )}
          {settings?.youtube && (
            <a href={settings.youtube} target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 border border-line bg-white grid place-items-center text-muted hover:text-red hover:border-red transition-colors rounded-sm">
              <i className="fab fa-youtube" />
            </a>
          )}
          {settings?.facebook && (
            <a href={settings.facebook} target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 border border-line bg-white grid place-items-center text-muted hover:text-red hover:border-red transition-colors rounded-sm">
              <i className="fab fa-facebook-f" />
            </a>
          )}
          {settings?.kakaoChannelUrl && (
            <a href={settings.kakaoChannelUrl} target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 border border-line bg-white grid place-items-center text-muted hover:text-yellow-500 hover:border-yellow-400 transition-colors rounded-sm">
              <i className="fas fa-comment" />
            </a>
          )}
        </div>

        {/* ── 하단 ─────────────────────────────────────────── */}
        <div className="border-t border-line pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-sm text-muted">
          <span>© {year} INJE GT MASTERS. All rights reserved.</span>
          <span>
            운영 주체 : {settings?.circuitName ?? '인제스피디움'} / 인제군
          </span>
          {(settings?.email || settings?.phone) && (
            <span>
              {settings.phone && <span className="mr-3">{settings.phone}</span>}
              {settings.email && <a href={`mailto:${settings.email}`} className="hover:text-red">{settings.email}</a>}
            </span>
          )}
        </div>

      </div>
    </footer>
  )
}
