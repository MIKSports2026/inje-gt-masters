'use client'
import { useState } from 'react'
import styles from './ClassesPage.module.css'

const classesData = [
  {
    id: 1,
    name: 'MASTERS 1',
    tag: 'M1',
    image: '/images/classes/master_1.png',
    specs: [
      { label: 'ENGINE SPEC',    value: '2,000cc 이하 터보 / 3,800cc 이하' },
      { label: 'MAX HORSEPOWER', value: 'UNRESTRICTED' },
      { label: 'DRIVETRAIN',     value: 'FR / MR / AWD' },
      { label: 'TIRE TARGET',    value: 'RACING SLICK' },
    ],
    desc: '가장 강력한 배기량과 출력을 뽐내는 퍼포먼스 클래스입니다. 폭발적인 가속력의 투어링 쿠페와 하드코어 튜닝 머신들의 압도적인 경합을 보여줍니다.',
  },
  {
    id: 2,
    name: 'MASTERS 2',
    tag: 'M2',
    image: '/images/classes/master_2.png',
    specs: [
      { label: 'ENGINE SPEC',    value: '1,600cc 이하 터보 / 2,000cc 이하' },
      { label: 'AERO PACKAGE',   value: 'WIDEBODY ALLOWED' },
      { label: 'DRIVETRAIN',     value: 'FF / FR' },
      { label: 'TIRE TARGET',    value: 'SEMI-SLICK' },
    ],
    desc: '터보차저가 장착된 고성능 해치백과 펀카(Fun Car)들이 대거 참전하는 가장 치열한 접전의 아마추어 메인스트림 클래스입니다.',
  },
  {
    id: 3,
    name: 'MASTERS N',
    tag: 'MN',
    image: '/images/classes/master_n.png',
    specs: [
      { label: 'ENGINE SPEC',  value: '2,000cc 이하 터보 (현대 N 차량)' },
      { label: 'BASE VEHICLE', value: 'HYUNDAI N MODELS' },
      { label: 'DRIVETRAIN',   value: 'FF' },
      { label: 'TIRE TARGET',  value: 'SEMI-SLICK' },
    ],
    desc: '현대 N 브랜드 차량 오너들의 자존심을 건 치열한 원메이크 스타일의 매치. N 브랜드만의 강렬한 배기음과 민첩한 코너링이 인제스피디움 서킷을 장악합니다.',
  },
  {
    id: 4,
    name: 'MASTERS 3',
    tag: 'M3',
    image: '/images/classes/master_3.png',
    specs: [
      { label: 'ENGINE SPEC',    value: '1,600cc 이하 (자연흡기)' },
      { label: 'VEHICLE WEIGHT', value: 'LIGHTWEIGHT CHASSIS' },
      { label: 'DRIVETRAIN',     value: 'FF' },
      { label: 'TIRE TARGET',    value: 'SPORTS RADIAL' },
    ],
    desc: '엔트리 레벨 스포츠카와 경량화된 컴팩트 세단들이 보여주는 코너링 예술. 레이싱의 기본기와 치열한 슬립스트림 꼬리물기 배틀이 가장 큰 뷰 포인트입니다.',
  },
  {
    id: 5,
    name: 'MASTERS N-EVO',
    tag: 'NE',
    image: '/images/classes/master_n_evo.png',
    specs: [
      { label: 'ENGINE SPEC',  value: '1,600cc 이하 자연흡기' },
      { label: 'BASE VEHICLE', value: 'HYUNDAI N-EVO MODELS' },
      { label: 'DRIVETRAIN',   value: 'FF' },
      { label: 'TIRE TARGET',  value: 'SPORTS RADIAL' },
    ],
    desc: '현대 N-evo 기반 차량들의 순수한 드라이빙 실력을 겨루는 클래스. 경량 차체와 자연흡기 엔진의 조화로 가장 순수한 레이싱의 본질을 보여줍니다.',
  },
]

export default function ClassesClient() {
  const [activeTab, setActiveTab] = useState(0)
  const currentClass = classesData[activeTab]

  return (
    <div className={styles.wrapper}>

      {/* 배경 사선 패턴 */}
      <div className={styles.diagonalBgPattern} aria-hidden="true" />

      <div className={`container ${styles.classesContainer}`}>

        {/* HEADER */}
        <div className={styles.classesHeader}>
          <p className={styles.classesEyebrow}>2026 INJE GT MASTERS</p>
          <h1 className={styles.classesTitle}>RACE CLASSES</h1>
          <div className={styles.diagonalAccentBar} />
          <p className={styles.classesSubtitle}>튜닝 아마추어 한계 돌파전</p>
        </div>

        {/* TABS */}
        <div className={styles.classTabs} role="tablist">
          {classesData.map((cls, idx) => (
            <button
              key={cls.id}
              role="tab"
              aria-selected={activeTab === idx}
              className={`${styles.classTabBtn} ${activeTab === idx ? styles.active : ''}`}
              onClick={() => setActiveTab(idx)}
            >
              <span className={styles.tabSkewBg} aria-hidden="true" />
              <span className={styles.tabActiveLine} aria-hidden="true" />
              <span className={styles.tabTag}>{cls.tag}</span>
              <span className={styles.tabText}>{cls.name}</span>
            </button>
          ))}
        </div>

        {/* MAIN PANEL */}
        <div className={styles.telemetryPanel} key={currentClass.id}>

          {/* LEFT — 차량 이미지 */}
          <div className={styles.panelLeft}>
            <div className={styles.imgDiagonalBackdrop} aria-hidden="true" />
            <div
              className={styles.carImageWrap}
              style={{ backgroundImage: `url(${currentClass.image})` }}
            />
            <div className={styles.classBadge}>
              <span className={styles.badgeLabel}>CLASS</span>
              <span className={styles.badgeName}>{currentClass.name}</span>
            </div>
            <span className={styles.classWatermark}>{String(activeTab + 1).padStart(2, '0')}</span>
          </div>

          {/* RIGHT — 스펙 */}
          <div className={styles.panelRight}>
            <h2 className={styles.specTitle}>{currentClass.name}</h2>
            <div className={styles.specDiagonalRule} aria-hidden="true" />
            <p className={styles.specDesc}>{currentClass.desc}</p>

            {/* 스펙 그리드 */}
            <div className={styles.specGrid}>
              {currentClass.specs.map((spec, i) => (
                <div key={i} className={styles.specBox}>
                  <span className={styles.specBoxCorner} aria-hidden="true" />
                  <span className={styles.specLabel}>{spec.label}</span>
                  <span className={styles.specValue}>{spec.value}</span>
                </div>
              ))}
            </div>

            <button className={styles.btnRegulation}>
              <span className={styles.btnSkewBg} aria-hidden="true" />
              <span className={styles.btnContent}>
                DOWNLOAD DETAILED REGULATION
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 2v8M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </span>
            </button>
          </div>

        </div>

        {/* 하단 인디케이터 */}
        <div className={styles.classIndicators} aria-hidden="true">
          {classesData.map((_, idx) => (
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
