import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'cq465tvw',
  dataset: 'production',
  apiVersion: '2021-10-21',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const classData = [
  {
    _id: 'class-masters-1',
    nameEn: 'Masters 1',
    tagline: '최상위 퍼포먼스를 지향하며 강력한 출력과 폭넓은 튜닝이 허용되는 클래스입니다.',
    tireSpec: '금호타이어 ECSTA V730 (265/35R18 이하)',
    minWeight: '1,230kg ~ 1,350kg (DCT·시퀀셜 미션 +30kg)',
    safetySpec: '6점식 이상의 롤케이지 장착 의무',
    tuningRange: '엔진: 동일 형식의 엔진으로 교체할 수 있으며, 순정 외 과급기(터보) 변경 및 ECU 데이터 변경이 자유롭습니다.\n구동/제동: 트랜스미션, 서스펜션, 브레이크 시스템의 개조가 자유롭습니다.\n하체: 쇽업소버 변경, 후륜 스프링의 코일오버 방식 변경, 휠 스페이서 사용 등이 허용됩니다.',
    entryFeePerSeason: 3000000,
    features: [
      { _key: 'f1', _type: 'specItem', label: '참가 가능 차량', value: '3,800cc 미만 자연흡기(N/A) 또는 2,000cc 미만 터보 차량' },
      { _key: 'f2', _type: 'specItem', label: '타이어 규정', value: '금호타이어 ECSTA V730 (265/35R18 이하)' },
      { _key: 'f3', _type: 'specItem', label: '안전 규정', value: '6점식 이상의 롤케이지 장착 의무' },
      { _key: 'f4', _type: 'specItem', label: '최저 중량', value: '1,230kg ~ 1,350kg (DCT·시퀀셜 미션 +30kg)' },
    ],
  },
  {
    _id: 'class-masters-2',
    nameEn: 'Masters 2',
    tagline: '중형급 엔진 사양을 바탕으로 차량 셋업과 드라이빙의 균형을 겨루는 클래스입니다.',
    tireSpec: '금호타이어 ECSTA V730 (265/35R18 이하)',
    minWeight: '1,200kg ~ 1,250kg (시퀀셜 미션 +20kg)',
    safetySpec: '4점식 이상의 롤케이지 장착 의무, 6점식 이상 강력 권장',
    tuningRange: '엔진: 동일 형식의 엔진 교체 및 ECU 데이터 변경이 허용됩니다.\n구동/제동: 트랜스미션, 서스펜션, 브레이크 시스템을 자유롭게 개조할 수 있습니다.\n하체: 부싱 변경(작동 중심 동일 조건), 쇽업소버 및 스프링 변경, 휠 스페이서 사용이 가능합니다.',
    entryFeePerSeason: 2500000,
    features: [
      { _key: 'f1', _type: 'specItem', label: '참가 가능 차량', value: '2,400cc 미만 자연흡기(N/A) 또는 1,600cc 미만 터보 차량' },
      { _key: 'f2', _type: 'specItem', label: '타이어 규정', value: '금호타이어 ECSTA V730 (265/35R18 이하)' },
      { _key: 'f3', _type: 'specItem', label: '안전 규정', value: '4점식 이상의 롤케이지 장착 의무, 6점식 강력 권장' },
      { _key: 'f4', _type: 'specItem', label: '최저 중량', value: '1,200kg ~ 1,250kg (시퀀셜 미션 +20kg)' },
    ],
  },
  {
    _id: 'class-masters-n',
    nameEn: 'Masters N',
    tagline: '현대 N 차량 본연의 성능을 유지하며 드라이버의 기량을 순수하게 겨루는 클래스입니다.',
    tireSpec: '금호타이어 ECSTA V730 (235/40R18 고정)',
    minWeight: '1,330kg ~ 1,430kg (MT 기준, DCT +30kg)',
    safetySpec: '4점식 이상의 롤케이지 장착 의무. 조수석 시트 탈거 금지(변경은 가능), 아반떼 N 차종은 2열 시트 탈거 불가.',
    tuningRange: '엔진/성능: 터빈과 ECU는 반드시 순정이어야 하며, 고급유 맵핑 또한 허용되지 않습니다.\n외관/하체: 외관 튜닝은 불가하며, 서스펜션 역시 순정 상태를 유지해야 합니다.\n제동: 브레이크 시스템 및 패드는 자유롭게 변경할 수 있습니다.',
    entryFeePerSeason: 2500000,
    features: [
      { _key: 'f1', _type: 'specItem', label: '참가 가능 차량', value: '현대 N 브랜드의 2,000cc 미만 터보 차량 (순정 상태 지향)' },
      { _key: 'f2', _type: 'specItem', label: '타이어 규정', value: '금호타이어 ECSTA V730 (235/40R18 고정)' },
      { _key: 'f3', _type: 'specItem', label: '안전 규정', value: '4점식 이상 롤케이지 의무, 조수석 탈거 금지, 아반떼 N 2열 탈거 불가' },
      { _key: 'f4', _type: 'specItem', label: '최저 중량', value: '1,330kg ~ 1,430kg (MT 기준, DCT +30kg)' },
    ],
  },
  {
    _id: 'class-masters-nevo',
    nameEn: 'Masters N-evo',
    tagline: '현대 N 차량을 베이스로 하드웨어 개조와 에어로 튜닝을 통해 극한의 성능을 뽑아내는 클래스입니다.',
    tireSpec: '금호타이어 ECSTA V730 (235/40R18 고정)',
    minWeight: '1,320kg ~ 1,420kg (MT 기준, DCT +30kg)',
    safetySpec: '4점식 이상의 롤케이지 장착 의무. Masters N과 달리 모든 해당 차종에서 2열 시트 탈거가 허용됩니다.',
    tuningRange: '엔진/성능: 터빈 변경이 가능하며, ECU 데이터 변경(맵핑)이 자유롭게 허용됩니다.\n외관: 보닛, 리어윙, 프론트 스플리터, 카나드, 리어 디퓨저 등 에어로 파츠 튜닝이 가능합니다.\n하체/제동: 서스펜션과 브레이크 시스템 모두 자유롭게 개조할 수 있습니다.',
    entryFeePerSeason: 2500000,
    features: [
      { _key: 'f1', _type: 'specItem', label: '참가 가능 차량', value: '현대 N 브랜드의 2,000cc 미만 터보 차량' },
      { _key: 'f2', _type: 'specItem', label: '타이어 규정', value: '금호타이어 ECSTA V730 (235/40R18 고정)' },
      { _key: 'f3', _type: 'specItem', label: '안전 규정', value: '4점식 이상 롤케이지 의무, 2열 시트 탈거 허용' },
      { _key: 'f4', _type: 'specItem', label: '최저 중량', value: '1,320kg ~ 1,420kg (MT 기준, DCT +30kg)' },
    ],
  },
  {
    _id: 'class-masters-3',
    nameEn: 'Masters 3',
    tagline: '소형 자연흡기 차량을 통해 내구 레이스의 기초를 다지고 효율적인 레이스를 운영하는 클래스입니다.',
    tireSpec: '금호타이어 ECSTA V730 (225/45R17)',
    minWeight: '1,150kg (모든 클래스 중 가장 가벼운 기준)',
    safetySpec: '4점식 이상의 롤케이지 장착 의무.',
    tuningRange: '엔진/구동: 동일 형식 엔진 교체, ECU 데이터 변경 및 트랜스미션 개조가 자유롭습니다.\n하체/제동: 서스펜션과 브레이크 시스템을 자유롭게 개조할 수 있습니다.',
    entryFeePerSeason: 2000000,
    features: [
      { _key: 'f1', _type: 'specItem', label: '참가 가능 차량', value: '1,600cc 미만 자연흡기(N/A) 차량' },
      { _key: 'f2', _type: 'specItem', label: '타이어 규정', value: '금호타이어 ECSTA V730 (225/45R17)' },
      { _key: 'f3', _type: 'specItem', label: '안전 규정', value: '4점식 이상의 롤케이지 장착 의무' },
      { _key: 'f4', _type: 'specItem', label: '최저 중량', value: '1,150kg' },
    ],
  },
]

async function seed() {
  for (const data of classData) {
    const { _id, ...fields } = data
    await client.patch(_id).set(fields).commit()
    console.log(`✅ ${_id} 완료`)
  }
  console.log('🎉 전체 완료')
}

seed().catch(console.error)
