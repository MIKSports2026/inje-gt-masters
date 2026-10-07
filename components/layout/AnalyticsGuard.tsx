'use client'

// components/layout/AnalyticsGuard.tsx — Vercel Web Analytics 래퍼
// 1) 관리자·스튜디오 경로의 조회는 집계하지 않는다.
// 2) 관리자 페이지를 한 번이라도 연 브라우저는 표시(va-disable)를 남겨
//    이후 공개 페이지 조회도 집계에서 제외한다 (운영자 트래픽 분리).
import { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/next'
import type { BeforeSendEvent } from '@vercel/analytics'

const INTERNAL_PREFIXES = ['/admin', '/studio', '/api/']
const DISABLE_KEY = 'va-disable'

function isInternalPath(pathname: string) {
  return INTERNAL_PREFIXES.some((p) => pathname.startsWith(p))
}

function isOperatorBrowser() {
  try {
    return window.localStorage.getItem(DISABLE_KEY) === '1'
  } catch {
    return false
  }
}

function beforeSend(event: BeforeSendEvent) {
  try {
    const url = new URL(event.url)
    if (isInternalPath(url.pathname)) return null
  } catch {
    /* URL 파싱 실패 시 그대로 전송 */
  }
  if (isOperatorBrowser()) return null
  return event
}

export default function AnalyticsGuard() {
  // 관리자/스튜디오 진입 시 이 브라우저를 운영자로 표시
  useEffect(() => {
    if (!isInternalPath(window.location.pathname)) return
    try {
      window.localStorage.setItem(DISABLE_KEY, '1')
    } catch {
      /* 저장 불가 환경은 무시 */
    }
  }, [])

  return <Analytics beforeSend={beforeSend} />
}
