'use client'
// components/sections/SectionResults.tsx — v3 table + news sidebar
import { useState } from 'react'
import Link from 'next/link'
import type { Round, Post } from '@/types/sanity'

interface Props {
  rounds: Round[]
  posts?: Post[]
}

const TABS = ['드라이버 순위', '팀 순위', '클래스별'] as const

export default function SectionResults({ rounds, posts = [] }: Props) {
  const [activeTab, setActiveTab] = useState(0)

  const catLabel: Record<string, string> = {
    notice: '공지사항', news: '대회소식', regulation: '규정 업데이트',
    press: '보도자료', event: '이벤트',
  }

  return (
    <section className="sec sec-darker" id="results" aria-labelledby="res-ttl">
      <div className="inner">
        <div className="sec-hd">
          <div>
            <div className="sec-ey">2025 FINAL STANDINGS</div>
            <h2 className="sec-ttl" id="res-ttl">Race Results</h2>
          </div>
          <Link href="/results" className="sec-more">전체 결과</Link>
        </div>

        <div className="results-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 288px', gap: '48px' }}>

          {/* 좌측 — 순위표 */}
          <div>
            <div className="tab-row" role="tablist">
              {TABS.map((t, i) => (
                <button key={t} className={`tab-btn${activeTab === i ? ' on' : ''}`}
                  role="tab" aria-selected={activeTab === i}
                  onClick={() => setActiveTab(i)}>
                  {t}
                </button>
              ))}
            </div>

            {/* 빈 상태 */}
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-sub)' }}>
              <i className="fa-solid fa-chart-bar" style={{ fontSize: '2.5rem', opacity: .2, display: 'block', marginBottom: '14px' }} />
              <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '18px', letterSpacing: '2px' }}>
                {activeTab === 0 ? '드라이버' : activeTab === 1 ? '팀' : '클래스'} 순위 데이터를 준비중입니다.
              </p>
              <Link href="/results" style={{ display: 'inline-block', marginTop: '16px', color: 'var(--red)', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '16.5px', fontWeight: 700, letterSpacing: '2px', textDecoration: 'none' }}>
                결과 페이지 바로가기 →
              </Link>
            </div>
          </div>

          {/* 우측 — 최신 소식 */}
          <div>
            <div className="sec-ey" style={{ marginBottom: '16px' }}>LATEST NEWS</div>
            {posts.length === 0 ? (
              <div style={{ padding: '24px 0', color: 'var(--text-sub)', textAlign: 'center' }}>
                <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '16px', letterSpacing: '2px' }}>
                  소식을 준비중입니다.
                </p>
              </div>
            ) : (
              <div className="news-list">
                {posts.slice(0, 5).map((p) => (
                  <Link key={p._id} href={`/news/${p.slug.current}`}
                    style={{ display: 'block', textDecoration: 'none' }}>
                    <article className="news-item" tabIndex={0}>
                      <div className="news-cat">{catLabel[p.category] ?? p.category}</div>
                      <h4 className="news-ttl">{p.title}</h4>
                      <div className="news-dt">
                        <i className="fa fa-calendar-alt" style={{ marginRight: '5px' }} />
                        {p.publishedAt?.slice(0, 10).replace(/-/g, '.')}
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
            <Link href="/news" className="sec-more" style={{ marginTop: '16px', display: 'inline-flex' }}>
              전체 뉴스 보기
            </Link>
          </div>
        </div>
      </div>

      
    </section>
  )
}
