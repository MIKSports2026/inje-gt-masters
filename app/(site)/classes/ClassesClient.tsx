'use client'
// ClassesClient.tsx — Sanity classInfo 데이터 기반 클래스 소개 페이지
import { useState } from 'react'
import type { ClassPageData } from './page'
import styles from './ClassesPage.module.css'

// classCode → 짧은 탭 태그
const TAG_MAP: Record<string, string> = {
  'masters-1':     'M1',
  'masters-2':     'M2',
  'masters-n':     'MN',
  'masters-n-evo': 'NE',
  'masters-3':     'M3',
}

interface Props { classes: ClassPageData[] }

export default function ClassesClient({ classes }: Props) {
  const [activeTab, setActiveTab] = useState(0)

  /* Sanity 데이터 없을 때 빈 화면 */
  if (classes.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={`container ${styles.classesContainer}`}>
          <p style={{ color: '#555', padding: '100px 0', textAlign: 'center' }}>
            클래스 정보를 준비 중입니다.
          </p>
        </div>
      </div>
    )
  }

  const cls        = classes[activeTab]
  const tag        = TAG_MAP[cls.classCode] ?? cls.classCode.slice(0, 2).toUpperCase()
  const displayName = cls.nameEn ?? cls.name
  const imageUrl   = cls.heroImage?.asset?.url ?? cls.cardImage?.asset?.url

  return (
    <div className={styles.wrapper}>

      {/* 배경 사선 패턴 */}
      <div className={styles.diagonalBgPattern} aria-hidden="true" />

      <div className={`container ${styles.classesContainer}`}>

        {/* ── TABS ────────────────────────────────────────────── */}
        <div className={styles.classTabs} role="tablist">
          {classes.map((item, idx) => (
            <button
              key={item._id}
              role="tab"
              aria-selected={activeTab === idx}
              className={`${styles.classTabBtn} ${activeTab === idx ? styles.active : ''}`}
              onClick={() => setActiveTab(idx)}
            >
              <span className={styles.tabSkewBg}     aria-hidden="true" />
              <span className={styles.tabActiveLine} aria-hidden="true" />
              <span className={styles.tabText}>{item.nameEn ?? item.name}</span>
            </button>
          ))}
        </div>

        {/* ── MAIN PANEL ──────────────────────────────────────── */}
        <div className={styles.telemetryPanel} key={cls._id}>

          {/* LEFT — 차량 이미지 */}
          <div className={styles.panelLeft}>
            <div className={styles.imgDiagonalBackdrop} aria-hidden="true" />
            <div
              className={styles.carImageWrap}
              style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
            />
          </div>

          {/* RIGHT — 스펙 */}
          <div className={styles.panelRight}>
            <h2 className={styles.specTitle}>{displayName}</h2>
            <div className={styles.specDiagonalRule} aria-hidden="true" />
            {cls.tagline && (
              <p className={styles.specDesc}>{cls.tagline}</p>
            )}

            <div className={styles.specRows}>
              {cls.eligibility && (
                <div className={styles.specRow}>
                  <span className={styles.specRowLabel}>참가 가능 차량</span>
                  <span className={styles.specRowValue}>{
                    typeof cls.eligibility === 'string'
                      ? cls.eligibility
                      : Array.isArray(cls.eligibility)
                        ? cls.eligibility.map((b: any) => b?.children?.map((c: any) => c.text).join('')).filter(Boolean).join(' ')
                        : ''
                  }</span>
                </div>
              )}
              {cls.tuningRange && (
                <div className={styles.specRow}>
                  <span className={styles.specRowLabel}>개조 범위</span>
                  <span className={styles.specRowValue} style={{whiteSpace: 'pre-line'}}>{cls.tuningRange}</span>
                </div>
              )}
              {cls.tireSpec && (
                <div className={styles.specRow}>
                  <span className={styles.specRowLabel}>타이어 규정</span>
                  <span className={styles.specRowValue}>{cls.tireSpec}</span>
                </div>
              )}
              {cls.safetySpec && (
                <div className={styles.specRow}>
                  <span className={styles.specRowLabel}>안전 규정</span>
                  <span className={styles.specRowValue}>{cls.safetySpec}</span>
                </div>
              )}
              {cls.minWeight && (
                <div className={styles.specRow}>
                  <span className={styles.specRowLabel}>최저 중량</span>
                  <span className={styles.specRowValue}>{cls.minWeight}</span>
                </div>
              )}
            </div>

            {(cls.entryFeePerRound || cls.entryFeePerSeason) && (
              <div className={styles.specRow}>
                <span className={styles.specRowLabel}>참가비</span>
                <span className={styles.specRowValue} style={{whiteSpace: 'pre-line'}}>
                  {[
                    cls.entryFeePerRound ? `라운드 ${cls.entryFeePerRound.toLocaleString('ko-KR')}원` : '',
                    cls.entryFeePerSeason ? `시즌 ${cls.entryFeePerSeason.toLocaleString('ko-KR')}원` : ''
                  ].filter(Boolean).join('\n')}
                </span>
              </div>
            )}
          </div>

        </div>

        {/* ── 하단 인디케이터 ──────────────────────────────────── */}
        <div className={styles.classIndicators} aria-hidden="true">
          {classes.map((_, idx) => (
            <button
              key={idx}
              className={`${styles.indicatorDot} ${activeTab === idx ? styles.active : ''}`}
              onClick={() => setActiveTab(idx)}
            />
          ))}
        </div>

      </div>
    </div>
  )
}
