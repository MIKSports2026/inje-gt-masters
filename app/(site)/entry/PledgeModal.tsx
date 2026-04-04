'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  onAgree: () => void;
  onClose: () => void;
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
];

export default function PledgeModal({ onAgree, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const div = document.createElement('div');
    div.id = 'pledge-portal';
    document.body.appendChild(div);
    document.body.style.overflow = 'hidden';
    setMounted(true);

    return () => {
      document.body.removeChild(div);
      document.body.style.overflow = '';
    };
  }, []);

  if (!mounted) return null;

  const portalEl = document.getElementById('pledge-portal');
  if (!portalEl) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.88)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: '580px',
          maxHeight: '80vh',
          background: '#1A1A1A',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1rem',
            letterSpacing: '2px',
            color: '#fff',
            textTransform: 'uppercase',
          }}>참가 서약서</span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#aaa',
              fontSize: '1.2rem',
              cursor: 'pointer',
            }}
          >✕</button>
        </div>

        <div style={{
          padding: '24px 32px',
          overflowY: 'auto',
          flex: 1,
        }}>
          {PLEDGE_ITEMS.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '16px',
            }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                color: '#E60023',
                fontSize: '0.85rem',
                flexShrink: 0,
                marginTop: '2px',
              }}>{i + 1}.</span>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                color: '#AAA',
                lineHeight: 1.8,
                margin: 0,
                wordBreak: 'keep-all',
              }}>{item}</p>
            </div>
          ))}
        </div>

        <div style={{
          padding: '20px 32px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          flexShrink: 0,
        }}>
          <button
            onClick={onAgree}
            style={{
              width: '100%',
              background: '#E60023',
              color: '#fff',
              fontFamily: 'var(--font-heading)',
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '3px',
              padding: '16px',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >동의합니다</button>
        </div>
      </div>
    </div>,
    portalEl
  );
}
