// components/sections/SectionSEO.tsx — v3 about/SEO text section
export default function SectionSEO() {
  const blocks = [
    {
      title: '대회 소개',
      body: [
        '인제 GT 마스터즈는 강원도 인제스피디움(3.9km)에서 개최되는 대한민국 대표 아마추어 GT 내구레이스입니다. 2026 시즌 5라운드 구성으로 Masters 1·Masters 2·Masters N·Masters 3·Masters N-evo 총 5개 클래스가 운영됩니다.',
        'Masters 1·Masters 2·Masters N·Masters 3·Masters N-evo 참가 신청 접수 중.',
      ],
      keywords: ['인제스피디움', 'GT내구레이스', '아마추어레이싱', '2026시즌'],
    },
    {
      title: '참가 안내',
      body: [
        '참가 신청은 온라인 폼으로 진행됩니다. 신청서 제출 후 운영팀이 토스페이먼츠 결제 링크를 이메일 및 카카오톡으로 발송합니다. 결제 완료 즉시 접수가 확정됩니다.',
        '라운드당 클래스별 선착순 마감이 적용되므로 조기 신청을 권장합니다. 참가 자격, 차량 규정, 안전 장비 기준 등 상세 규정은 경기 규정 문서를 참조하세요.',
      ],
      keywords: ['참가신청', '토스페이먼츠', '경기규정'],
    },
    {
      title: '오시는 길',
      body: [
        '인제스피디움은 강원도 인제군 기린면 상하답로 130에 위치합니다. 서울 기준 약 2시간 30분 소요. 경기 당일 셔틀버스와 현장 주차장이 운영됩니다.',
        '관람은 무료이며 그랜드스탠드에서 레이스 전 구간을 조망할 수 있습니다. 피트레인 투어, 포토존 등 다양한 부대행사도 함께 진행됩니다.',
      ],
      keywords: ['인제군', '강원도레이스', '관람무료'],
    },
  ]

  return (
    <section aria-label="대회 소개 및 정보" style={{
      background: 'var(--bg-2)',
      padding: '64px 0',
      borderTop: '1px solid var(--line)',
    }}>
      <div className="inner">
        <div className="sec-ey">About</div>
        <h2 className="sec-ttl" style={{ marginBottom: '40px' }}>인제 GT 마스터즈란?</h2>

        <div className="seo-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '40px',
        }}>
          {blocks.map((b) => (
            <div key={b.title}>
              <h3 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '22px', letterSpacing: '2px', color: 'var(--navy)',
                marginBottom: '12px', paddingBottom: '10px',
                borderBottom: '1px solid var(--line)',
              }}>
                {b.title}
              </h3>
              {b.body.map((p, i) => (
                <p key={i} style={{
                  fontSize: '15px', lineHeight: 2,
                  color: 'var(--text-sub)', wordBreak: 'keep-all',
                  marginTop: i > 0 ? '10px' : 0,
                }}>
                  {p}
                </p>
              ))}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
                {b.keywords.map((kw) => (
                  <span key={kw} style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '16.5px', fontWeight: 700,
                    letterSpacing: '1.5px', textTransform: 'uppercase' as const,
                    padding: '4px 10px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--line)',
                    color: 'var(--text-sub)',
                  }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      
    </section>
  )
}
