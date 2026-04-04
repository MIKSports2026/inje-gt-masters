'use client'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  onAgree: () => void
  onClose: () => void
}

const PLEDGE_ITEMS = [
  '본인은 대회조직위원회의 제반 규정(경기 운영, 경기차량규정, 경기장 안전 관리 규정)에 동의하며, 규정 해석에 대한 어떠한 이의제기도 하지 않을 것을 서약합니다.',
  '경기 참가와 관련해서 발생한 사망, 부상, 기타 사고로 인한 모든 참가자, 선수, PIT요원 및 차량 등의 피해에 대해 절대로 주최자 및 경기 임원(경기장 소유자 포함), 그리고 다른 참가자(선수, 미케닉, PIT요원)등에 대해 비난하거나 책임을 묻거나, 또 손해배상을 요구하지 않고, 자신의 책임으로 할 것을 서약합니다.',
  '본인은 대회 조직위원회 자동차 경기 참가자격 기준을 준수할 것을 서약합니다.',
  '본 대회의 참가함에 있어 대회조직위원회 차량규정에 따라 위반되지 않게 차량을 개조할 것과 규정에 관한 어떠한 이의제기도 하지 않을 것을 서약합니다.',
  '드라이버 브리핑(예선, 결승), 메디컬체크, 검차시간에 지각하지 않을 것을 서약하며, 불참시 출전거부를 당하더라도 어떠한 이의제기도 하지 않을 것을 서약합니다.',
  '항의절차를 준수할 것을 서약합니다.',
  '본 대회에 참가하는 참가 대표자, 선수, 미케닉, PIT 요원 및 참가 차량의 소리, 사진 영상 등의 보도, 방송, 출판 등에 관한 권한이 주최자에 있음을 승낙합니다.',
  '주최측이 준비한 대회 홍보를 위해 실시하는 행사에 대해 적극 협조할 것을 약속합니다.',
  '본인의 과실로 경기장의 시설, 기재, 차량 등에 손해를 끼쳤을 경우에는 이에 대한 손해를 배상할 것을 서약합니다.',
]

export default function PledgeModal({ onAgree, onClose }: Props) {
  const el = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    el.current = document.createElement('div')
    document.body.appendChild(el.current)
    document.body.style.overflow = 'hidden'
    return () => {
      if (el.current) document.body.removeChild(el.current)
      document.body.style.overflow = ''
    }
  }, [])

  if (!el.current) return null

  return createPortal(
    <div className="pledge-overlay" onClick={onClose}>
      <div className="pledge-modal" onClick={e => e.stopPropagation()}>
        <div className="pledge-modal__head">
          <h3 className="pledge-modal__title">참가 서약서</h3>
          <button type="button" onClick={onClose} className="pledge-modal__close">✕</button>
        </div>
        <div className="pledge-modal__body">
          {PLEDGE_ITEMS.map((text, i) => (
            <div key={i} className="pledge-modal__item">
              <span className="pledge-modal__num">{String(i + 1).padStart(2, '0')}</span>
              <p className="pledge-modal__text">{text}</p>
            </div>
          ))}
        </div>
        <div className="pledge-modal__foot">
          <button type="button" onClick={onAgree} className="ef-btn-submit" style={{ width: '100%' }}>
            동의합니다
          </button>
        </div>
      </div>
    </div>,
    el.current
  )
}
