// app/not-found.tsx — 커스텀 404 페이지
import Link from 'next/link'

export default function NotFound() {
  return (
    <section style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg,#111 0%,#1a0008 55%,#0d0d0d 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 배경 패턴 */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(135deg,rgba(230,0,35,.04) 0 1px,transparent 1px 60px)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '40px 20px' }}>
        <p style={{
          fontSize: 'clamp(5rem,18vw,12rem)',
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 700,
          color: 'rgba(230,0,35,.18)',
          lineHeight: 1,
          margin: '0 0 -20px',
          letterSpacing: '-.02em',
        }}>404</p>

        <h1 style={{
          color: '#fff',
          fontSize: 'clamp(1.6rem,4vw,2.8rem)',
          marginBottom: '14px',
        }}>
          페이지를 찾을 수 없습니다
        </h1>

        <p style={{
          color: 'rgba(255,255,255,.55)',
          fontSize: 'clamp(.9rem,1.4vw,1.06rem)',
          marginBottom: '32px',
          lineHeight: 1.7,
          maxWidth: '480px',
          margin: '0 auto 32px',
        }}>
          요청하신 페이지가 존재하지 않거나,<br />
          아직 준비 중입니다.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">
            <i className="fa-solid fa-house" />
            홈으로 돌아가기
          </Link>
          <Link href="/season" className="btn btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.25)' }}>
            <i className="fa-solid fa-calendar" />
            시즌 일정 보기
          </Link>
          <Link href="/entry" className="btn btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.25)' }}>
            <i className="fa-solid fa-flag-checkered" />
            Register
          </Link>
        </div>
      </div>
    </section>
  )
}
