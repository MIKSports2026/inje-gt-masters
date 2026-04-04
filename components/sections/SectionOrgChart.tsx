import styles from './SectionOrgChart.module.css'

export default function SectionOrgChart() {
  return (
    <section id="organization" className={`section ${styles.orgSection}`}>
      <div className="container">

        <div className={styles.orgTreeWrapper}>

          {/* Top Leaders */}
          <div className={styles.orgLeadersGroup}>
            <div className={`${styles.orgNode} ${styles.leaderNode}`}>
              <div className={styles.nodeAccentBar}></div>
              <span className={styles.nodeTitle}>조직위원장</span>
              <h3 className={styles.nodeName}>이정민</h3>
            </div>

            <div className={styles.treeLineVertical}></div>

            <div className={`${styles.orgNode} ${styles.leaderNode}`}>
              <div className={styles.nodeAccentBar}></div>
              <span className={styles.nodeTitle}>부조직위원장</span>
              <h3 className={styles.nodeName}>김동빈</h3>
            </div>
          </div>

          <div className={styles.treeSplitBridge}></div>

          {/* Dual Branch Structure */}
          <div className={styles.orgBranches}>

            {/* Left Branch: Judging Committee */}
            <div className={`${styles.orgBranch} ${styles.judgeBranch}`}>

              <div className={`${styles.orgNode} ${styles.branchHead}`}>
                <span className={styles.nodeTitle}>심사위원회</span>
                <h3 className={styles.nodeName}>
                  김광진 <span className={styles.subTag}>심사위원장</span>
                </h3>
              </div>

              <div className={`${styles.treeLineVertical} ${styles.short}`}></div>

              <div className={`${styles.orgNode} ${styles.cleanNode}`}>
                <span className={styles.nodeTitle}>심사위원</span>
                <span className={styles.nodeNameLight}>오일기 / 김의수</span>
              </div>

              <div className={`${styles.treeLineVertical} ${styles.short}`}></div>

              <div className={`${styles.orgNode} ${styles.cleanNode}`}>
                <span className={styles.nodeTitle}>심사보조</span>
                <span className={styles.nodeNameLight}>양원용</span>
              </div>

            </div>

            {/* Right Branch: Race Committee & Ops */}
            <div className={`${styles.orgBranch} ${styles.raceBranch}`}>

              <div className={`${styles.orgNode} ${styles.branchHead} ${styles.raceHead}`}>
                <div className={styles.nodeAccentBar}></div>
                <span className={styles.nodeTitle}>경기위원회</span>
                <h3 className={styles.nodeName}>
                  양돈규 <span className={styles.subTag}>레이스 디렉터</span>
                </h3>
              </div>

              <div className={`${styles.treeLineVertical} ${styles.short}`}></div>

              <div className={styles.splitNodes}>
                <div className={`${styles.orgNode} ${styles.cleanNode}`}>
                  <span className={styles.nodeTitle}>SC드라이버</span>
                  <span className={styles.nodeNameLight}>최종석 / 고건</span>
                </div>
                <div className={`${styles.orgNode} ${styles.cleanNode}`}>
                  <span className={styles.nodeTitle}>경기위원장</span>
                  <span className={styles.nodeNameBold}>윤연정</span>
                </div>
              </div>

              <div
                className={`${styles.treeLineVertical} ${styles.medium}`}
                style={{ alignSelf: 'flex-end', marginRight: '20%' }}
              ></div>

              <div className={`${styles.splitNodes} ${styles.opsSplit}`}>
                <div className={`${styles.orgNode} ${styles.cleanNode}`}>
                  <span className={styles.nodeTitle}>CMO</span>
                  <span className={styles.nodeNameBold}>박일환</span>
                </div>
                <div className={`${styles.orgNode} ${styles.cleanNode}`}>
                  <span className={styles.nodeTitle}>사무국장</span>
                  <span className={styles.nodeNameBold}>한광규</span>
                </div>
              </div>

              <div
                className={`${styles.treeLineVertical} ${styles.short}`}
                style={{ alignSelf: 'flex-start', marginLeft: '25%' }}
              ></div>
              <div className={styles.horizontalConnectorBar}></div>

              {/* Floor Committees */}
              <div className={styles.floorCommittees}>
                <div className={`${styles.orgNode} ${styles.microNode}`}>
                  <span className={styles.nodeTitle}>피트위원장</span>
                  <span className={styles.nodeNameLight}>오성욱</span>
                </div>
                <div className={`${styles.orgNode} ${styles.microNode}`}>
                  <span className={styles.nodeTitle}>코스위원장</span>
                  <span className={styles.nodeNameLight}>박정수</span>
                </div>
                <div className={`${styles.orgNode} ${styles.microNode}`}>
                  <span className={styles.nodeTitle}>안전위원장</span>
                  <span className={styles.nodeNameLight}>김상현</span>
                </div>
                <div className={`${styles.orgNode} ${styles.microNode}`}>
                  <span className={styles.nodeTitle}>기술위원장</span>
                  <span className={styles.nodeNameLight}>허경환</span>
                </div>
                <div className={`${styles.orgNode} ${styles.microNode}`}>
                  <span className={styles.nodeTitle}>기록위원장</span>
                  <span className={styles.nodeNameLight}>이형곤</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
