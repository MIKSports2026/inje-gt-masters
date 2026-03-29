'use client'
// app/(site)/entry/EntryForm.tsx — 토스페이먼츠 연동 참가신청 폼
import { useState, useEffect, useCallback, FormEvent } from 'react'
import type { ClassInfo, Round } from '@/types/sanity'

interface Props {
  isOpen:      boolean
  classes:     ClassInfo[]
  rounds:      Round[]
  tossBaseUrl?: string
}

interface FormData {
  teamName:    string
  driver1:     string
  driver2:     string
  phone:       string
  email:       string
  classId:     string
  roundIds:    string[]
  carModel:    string
  carNumber:   string
  licenseNum:  string
  agree:       boolean
}

const EMPTY: FormData = {
  teamName: '', driver1: '', driver2: '', phone: '', email: '',
  classId: '', roundIds: [], carModel: '', carNumber: '', licenseNum: '', agree: false,
}

const DRAFT_KEY = 'inje-gt-entry-draft'
function saveDraft(form: FormData) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, ts: Date.now() })) } catch {}
}
function loadDraft(): FormData | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (data?.form) return data.form
  } catch {}
  return null
}
function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY) } catch {}
}

export default function EntryForm({ isOpen, classes, rounds, tossBaseUrl }: Props) {
  const [form, setForm]     = useState<FormData>(EMPTY)
  const [step, setStep]     = useState<'form' | 'confirm' | 'done'>('form')
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [showDraftBanner, setShowDraftBanner] = useState(false)

  useEffect(() => {
    const draft = loadDraft()
    if (draft && (draft.teamName || draft.driver1)) setShowDraftBanner(true)
  }, [])

  const restoreDraft = useCallback(() => {
    const draft = loadDraft()
    if (draft) setForm({ ...draft, agree: false })
    setShowDraftBanner(false)
  }, [])

  const dismissDraft = useCallback(() => {
    clearDraft()
    setShowDraftBanner(false)
  }, [])

  const selectedClass = classes.find(c => c._id === form.classId)
  const totalFee = selectedClass?.entryFeePerRound
    ? selectedClass.entryFeePerRound * form.roundIds.length
    : null

  // ── 입력 핸들러 ─────────────────────────────────────────
  const set = (key: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm(f => ({ ...f, [key]: e.target.value }))

  const toggleRound = (id: string) => {
    setForm(f => ({
      ...f,
      roundIds: f.roundIds.includes(id)
        ? f.roundIds.filter(r => r !== id)
        : [...f.roundIds, id],
    }))
  }

  // ── 유효성 검사 ─────────────────────────────────────────
  const validate = (): boolean => {
    const e: typeof errors = {}
    if (!form.teamName.trim())  e.teamName   = '팀명을 입력해주세요.'
    if (!form.driver1.trim())   e.driver1    = '드라이버 1 이름을 입력해주세요.'
    if (!form.phone.trim())     e.phone      = '연락처를 입력해주세요.'
    if (!form.email.trim())     e.email      = '이메일을 입력해주세요.'
    if (!form.classId)          e.classId    = '클래스를 선택해주세요.'
    if (form.roundIds.length === 0) e.roundIds = '라운드를 1개 이상 선택해주세요.'
    if (!form.carModel.trim())  e.carModel   = '차종을 입력해주세요.'
    if (!form.agree)            e.agree      = '이용약관에 동의해주세요.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── 제출 → 확인 단계 ────────────────────────────────────
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (validate()) { saveDraft(form); setStep('confirm') }
  }

  // ── 토스페이먼츠 결제 링크로 이동 ───────────────────────
  const handlePayment = () => {
    // 선택한 라운드의 tossPaymentUrl 우선 사용, 없으면 base URL 사용
    const selectedRounds = rounds.filter(r => form.roundIds.includes(r._id))
    const paymentUrl =
      selectedRounds[0]?.tossPaymentUrl ??
      tossBaseUrl ??
      'https://toss.im'   // fallback (실제 URL은 Sanity에서 관리)

    // 참가자 메타데이터를 쿼리 파라미터로 전달 (토스 커스텀 필드)
    const params = new URLSearchParams({
      orderId:     `GT-${Date.now()}`,
      orderName:   `인제GT마스터즈 ${form.classId} 참가비`,
      customerName: form.driver1,
      customerEmail: form.email,
      customerMobilePhone: form.phone,
    })

    // 토스페이먼츠 결제 링크 페이지로 이동
    window.open(`${paymentUrl}?${params.toString()}`, '_blank', 'noopener,noreferrer')
    clearDraft()
    setStep('done')
  }

  const cut = 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)'
  const fieldStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', fontSize: '.95rem',
    border: '1px solid var(--line)', background: '#fff',
    fontFamily: 'inherit', outline: 'none',
    clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)',
    transition: 'border-color .2s',
  }
  const errStyle: React.CSSProperties = { color: '#e60023', fontSize: '.8rem', marginTop: '4px', display: 'block' }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '.85rem', fontWeight: 800, marginBottom: '6px', color: '#1d2630' }

  // ── 완료 화면 ───────────────────────────────────────────
  if (step === 'done') {
    return (
      <div style={{ background: '#fff', border: '1px solid var(--line)', clipPath: cut, padding: '48px 32px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,var(--red),rgba(230,0,35,.35) 35%,transparent 75%)' }} />
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(34,197,94,.1)', border: '2px solid rgba(34,197,94,.3)', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
          <i className="fa-solid fa-check" style={{ fontSize: '2rem', color: '#16a34a' }} />
        </div>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '10px' }}>신청이 접수되었습니다!</h2>
        <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '24px' }}>
          결제 창에서 결제를 완료해 주세요.<br />
          결제 완료 후 <strong>{form.email}</strong>로<br />
          접수 확정 메일이 발송됩니다.
        </p>
        <p style={{ fontSize: '.88rem', color: 'var(--muted)', marginBottom: '28px' }}>
          결제 창이 열리지 않았다면{' '}
          <button
            type="button"
            onClick={handlePayment}
            style={{ color: 'var(--red)', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit' }}
          >
            여기를 클릭
          </button>
          하세요.
        </p>
        <button type="button" className="btn btn-secondary" onClick={() => { setForm(EMPTY); setStep('form') }}>
          추가 신청하기
        </button>
      </div>
    )
  }

  // ── 확인 단계 ───────────────────────────────────────────
  if (step === 'confirm') {
    const selectedRounds = rounds.filter(r => form.roundIds.includes(r._id))
    return (
      <div style={{ background: '#fff', border: '1px solid var(--line)', clipPath: cut, padding: '28px 32px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,var(--red),rgba(230,0,35,.35) 35%,transparent 75%)' }} />
        <h2 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>신청 내용 확인</h2>

        <div style={{ display: 'grid', gap: '10px', marginBottom: '24px' }}>
          {[
            { label: '팀명',      value: form.teamName },
            { label: '드라이버 1', value: form.driver1 },
            { label: '드라이버 2', value: form.driver2 || '—' },
            { label: '클래스',    value: selectedClass?.name ?? form.classId },
            { label: '라운드',    value: selectedRounds.map(r => r.title).join(', ') },
            { label: '차종',      value: form.carModel },
            { label: '차량 번호', value: form.carNumber || '—' },
            { label: '연락처',    value: form.phone },
            { label: '이메일',    value: form.email },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--surface-2)', borderRadius: '4px' }}>
              <span style={{ fontSize: '.88rem', color: 'var(--muted)', fontWeight: 700 }}>{label}</span>
              <strong style={{ fontSize: '.92rem' }}>{value}</strong>
            </div>
          ))}
        </div>

        {totalFee && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'rgba(230,0,35,.06)', border: '1px solid rgba(230,0,35,.2)', borderRadius: '6px', marginBottom: '20px' }}>
            <span style={{ fontWeight: 800 }}>결제 예정 금액</span>
            <strong style={{ fontSize: '1.3rem', color: 'var(--red)' }}>{totalFee.toLocaleString()}원</strong>
          </div>
        )}

        <p style={{ fontSize: '.84rem', color: 'var(--muted)', marginBottom: '20px', lineHeight: 1.6 }}>
          &#39;결제하기&#39; 클릭 시 토스페이먼츠 결제 페이지로 이동합니다.<br />
          결제 완료 후 <strong>{form.email}</strong>로 접수 확정 메일이 발송됩니다.
        </p>

        <div className="btns">
          <button type="button" onClick={handlePayment} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            <i className="fa-solid fa-credit-card" />
            토스페이먼츠로 결제하기
          </button>
          <button type="button" onClick={() => setStep('form')} className="btn btn-secondary">
            수정하기
          </button>
        </div>
      </div>
    )
  }

  // ── 메인 폼 ─────────────────────────────────────────────
  if (!isOpen) {
    return (
      <div style={{ background: '#fff', border: '1px solid var(--line)', clipPath: cut, padding: '40px 32px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,var(--red),rgba(230,0,35,.35) 35%,transparent 75%)' }} />
        <i className="fa-solid fa-clock" style={{ fontSize: '2.5rem', color: 'var(--red)', marginBottom: '16px', display: 'block' }} />
        <h2 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>참가 신청 준비 중</h2>
        <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
          현재 참가 신청 접수 기간이 아닙니다.<br />
          공지사항을 확인하거나 카카오 채널로 문의해 주세요.
        </p>
      </div>
    )
  }

  return (
    <>
    {showDraftBanner && (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '14px 18px', marginBottom: '16px', background: 'rgba(59,130,246,.06)', border: '1px solid rgba(59,130,246,.25)', borderRadius: '8px' }}>
        <span style={{ fontSize: '.9rem', fontWeight: 700, color: '#2563eb' }}>
          <i className="fa-solid fa-rotate-left" style={{ marginRight: '8px' }} />이전에 작성 중인 내용이 있습니다. 불러올까요?
        </span>
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button type="button" onClick={restoreDraft} style={{ padding: '6px 14px', fontSize: '.82rem', fontWeight: 800, background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>불러오기</button>
          <button type="button" onClick={dismissDraft} style={{ padding: '6px 14px', fontSize: '.82rem', fontWeight: 700, background: 'transparent', color: '#6b7280', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}>새로 작성</button>
        </div>
      </div>
    )}
    <form onSubmit={handleSubmit} noValidate style={{ background: '#fff', border: '1px solid var(--line)', clipPath: cut, padding: '28px 32px', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,var(--red),rgba(230,0,35,.35) 35%,transparent 75%)' }} />

      <h2 style={{ marginBottom: '22px', fontSize: '1.3rem' }}>
        <i className="fa-solid fa-flag-checkered" style={{ color: 'var(--red)', marginRight: '10px' }} />
        온라인 참가 신청서
      </h2>

      <div style={{ display: 'grid', gap: '18px' }}>

        {/* 팀 & 드라이버 */}
        <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
          <legend style={{ fontSize: '.8rem', fontWeight: 900, letterSpacing: '.1em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '12px' }}>팀 & 드라이버 정보</legend>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={labelStyle}>팀명 <span style={{ color: 'var(--red)' }}>*</span></label>
              <input style={fieldStyle} value={form.teamName} onChange={set('teamName')} placeholder="Team Apex Racing" />
              {errors.teamName && <span style={errStyle}>{errors.teamName}</span>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>드라이버 1 <span style={{ color: 'var(--red)' }}>*</span></label>
                <input style={fieldStyle} value={form.driver1} onChange={set('driver1')} placeholder="홍길동" />
                {errors.driver1 && <span style={errStyle}>{errors.driver1}</span>}
              </div>
              <div>
                <label style={labelStyle}>드라이버 2</label>
                <input style={fieldStyle} value={form.driver2} onChange={set('driver2')} placeholder="선택사항" />
              </div>
            </div>
          </div>
        </fieldset>

        {/* 연락처 */}
        <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
          <legend style={{ fontSize: '.8rem', fontWeight: 900, letterSpacing: '.1em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '12px' }}>연락처</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>휴대폰 번호 <span style={{ color: 'var(--red)' }}>*</span></label>
              <input style={fieldStyle} type="tel" value={form.phone} onChange={set('phone')} placeholder="010-0000-0000" />
              {errors.phone && <span style={errStyle}>{errors.phone}</span>}
            </div>
            <div>
              <label style={labelStyle}>이메일 <span style={{ color: 'var(--red)' }}>*</span></label>
              <input style={fieldStyle} type="email" value={form.email} onChange={set('email')} placeholder="race@example.com" />
              {errors.email && <span style={errStyle}>{errors.email}</span>}
            </div>
          </div>
        </fieldset>

        {/* 클래스 & 라운드 */}
        <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
          <legend style={{ fontSize: '.8rem', fontWeight: 900, letterSpacing: '.1em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '12px' }}>클래스 & 라운드</legend>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={labelStyle}>참가 클래스 <span style={{ color: 'var(--red)' }}>*</span></label>
              <select style={{ ...fieldStyle, appearance: 'auto' }} value={form.classId} onChange={set('classId')}>
                <option value="">— 클래스 선택 —</option>
                {classes.filter(c => c.isEntryOpen).map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              {errors.classId && <span style={errStyle}>{errors.classId}</span>}
            </div>
            <div>
              <label style={labelStyle}>참가 라운드 <span style={{ color: 'var(--red)' }}>*</span> (중복 선택 가능)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '8px' }}>
                {rounds.map(r => (
                  <label key={r._id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 14px', cursor: 'pointer',
                    background: form.roundIds.includes(r._id) ? 'rgba(230,0,35,.06)' : 'var(--surface-2)',
                    border: `1px solid ${form.roundIds.includes(r._id) ? 'rgba(230,0,35,.3)' : 'var(--line)'}`,
                    clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)',
                    fontSize: '.88rem', fontWeight: 700,
                    transition: 'all .15s',
                  }}>
                    <input type="checkbox" checked={form.roundIds.includes(r._id)} onChange={() => toggleRound(r._id)} style={{ accentColor: 'var(--red)' }} />
                    <span>
                      <strong style={{ display: 'block', fontSize: '.9rem' }}>R{r.roundNumber} — {r.title.replace(/R\d — /, '')}</strong>
                      <span style={{ color: 'var(--muted)', fontSize: '.78rem' }}>{r.dateStart}</span>
                    </span>
                  </label>
                ))}
              </div>
              {errors.roundIds && <span style={errStyle}>{errors.roundIds}</span>}
            </div>
          </div>
        </fieldset>

        {/* 차량 정보 */}
        <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
          <legend style={{ fontSize: '.8rem', fontWeight: 900, letterSpacing: '.1em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '12px' }}>차량 정보</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>차종 <span style={{ color: 'var(--red)' }}>*</span></label>
              <input style={fieldStyle} value={form.carModel} onChange={set('carModel')} placeholder="BMW M4 GT3" />
              {errors.carModel && <span style={errStyle}>{errors.carModel}</span>}
            </div>
            <div>
              <label style={labelStyle}>차량 번호판</label>
              <input style={fieldStyle} value={form.carNumber} onChange={set('carNumber')} placeholder="123가 4567" />
            </div>
          </div>
        </fieldset>

        {/* 라이선스 */}
        <div>
          <label style={labelStyle}>레이싱 라이선스 번호</label>
          <input style={fieldStyle} value={form.licenseNum} onChange={set('licenseNum')} placeholder="KAF-2025-XXXX" />
        </div>

        {/* 결제 금액 미리보기 */}
        {totalFee !== null && totalFee > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'rgba(230,0,35,.04)', border: '1px solid rgba(230,0,35,.16)', borderRadius: '6px' }}>
            <span style={{ fontWeight: 700, fontSize: '.92rem' }}>
              예상 결제 금액 ({form.roundIds.length}라운드)
            </span>
            <strong style={{ fontSize: '1.2rem', color: 'var(--red)' }}>{totalFee.toLocaleString()}원</strong>
          </div>
        )}

        {/* 약관 동의 */}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '.9rem', lineHeight: 1.5 }}>
          <input type="checkbox" checked={form.agree} onChange={e => setForm(f => ({ ...f, agree: e.target.checked }))} style={{ accentColor: 'var(--red)', marginTop: '2px', flexShrink: 0 }} />
          <span>
            <strong>참가 규정 및 이용약관에 동의합니다.</strong>
            {' '}대회 규정, 개인정보 처리방침, 부상·사고에 대한 면책 동의 사항을 모두 확인하였습니다.
          </span>
        </label>
        {errors.agree && <span style={errStyle}>{errors.agree}</span>}

        {/* 제출 버튼 */}
        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', minHeight: '56px', fontSize: '1.05rem' }}>
          <i className="fa-solid fa-flag-checkered" />
          신청서 제출 → 결제 진행
        </button>
      </div>
    </form>
    </>
  )
}
