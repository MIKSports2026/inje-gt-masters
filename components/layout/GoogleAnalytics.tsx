'use client'

// components/layout/GoogleAnalytics.tsx — GA4(gtag) 로더
// - 관리자·스튜디오 경로, 운영자 브라우저(va-disable 표시)는 로드하지 않음 (AnalyticsGuard와 동일 기준)
// - App Router 클라이언트 전환 시 page_view 를 직접 전송
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? 'G-QTD9M65NYV'
const INTERNAL_PREFIXES = ['/admin', '/studio', '/api/']
const DISABLE_KEY = 'va-disable'

declare global {
  interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }
}

function isInternalPath(pathname: string) {
  return INTERNAL_PREFIXES.some((p) => pathname.startsWith(p))
}
function isOperatorBrowser() {
  try { return window.localStorage.getItem(DISABLE_KEY) === '1' } catch { return false }
}

/** 전환 이벤트 전송 헬퍼 (예: 참가신청 제출) */
export function gaEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', name, params ?? {})
}

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const [enabled, setEnabled] = useState(false)
  const [booted, setBooted] = useState(false)

  // 마운트 후 운영자/내부 경로 여부 판정
  useEffect(() => {
    if (isInternalPath(window.location.pathname) || isOperatorBrowser()) return
    setEnabled(true)
  }, [])

  // 클라이언트 라우팅 page_view (첫 로드는 gtag config 가 전송)
  useEffect(() => {
    if (!enabled || !window.gtag) return
    if (!booted) { setBooted(true); return }
    if (isInternalPath(pathname)) return
    window.gtag('event', 'page_view', { page_path: pathname, page_location: window.location.href, page_title: document.title })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, enabled])

  if (!enabled) return null
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${GA_ID}', { anonymize_ip: true });
      `}</Script>
    </>
  )
}
