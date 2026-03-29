'use client'
// app/(site)/entry/EntryForm.tsx — Step 1→2→3 참가신청 폼 (A방식: 신청→검토→결제링크 발송)
import { useState, useEffect, useCallback } from 'react'
import type { ClassInfo, Round } from '@/types/sanity'

interface Props {
  isOpen: boolean
  classes: ClassInfo[]
  rounds: Round[]
  initialRoundNumber?: number
}

interface FormData {
  // Step 1: 팀 & 차량
  teamName: string
  classId: string
  roundId: string
  carNumber: string
  carModel: string
  // Step 2: 드라이버
  driver1Name: string
  driver1Phone: string
  driver1Email: string
  driver1Birth: string
  driver2Name: string
  driver2Phone: string
  driver2Email: string
  // Step 3
  agree: boolean
}

const EMPTY: FormData = {
  teamName: '', classId: '', roundId: '', carNumber: '', carModel: '',
  driver1Name: '', driver1Phone: '', driver1Email: '', driver1Birth: '',
  driver2Name: '', driver2Phone: '', driver2Email: '',
  agree: false,
}

// ── 유틸 ──────────────────────────────────────────────────
function formatPhone(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
}

function formatCarNumber(v: string) {
  return v.replace(/[^0-9가-힣a-zA-Z\s]/g, '').slice(0, 12)
}

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

function isOver18(birth: string) {
  if (!birth) return false
  const b = new Date(birth)
  const today = new Date()
  let age = today.getFullYear() - b.getFullYear()
  const m = today.getMonth() - b.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--
  return age >= 18
}

function getStatusBadge(status: string) {
  if (status === 'entry_open') return { text: '접수중', color: '#16a34a', bg: 'rgba(34,197,94,.1)' }
  if (status === 'upcoming') return { text: '접수 예정', color: '#3b82f6', bg: 'rgba(59,130,246,.08)' }
  if (status === 'entry_closed') return { text: '접수마감', color: '#d97706', bg: 'rgba(217,119,6,.08)' }
  return { text: '마감', color: '#6b7280', bg: 'rgba(107,114,128,.08)' }
}

const cut = 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)'

const DRAFT_KEY = 'inje-gt-entry-draft'

function saveDraft(form: FormData, step: number) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, step, ts: Date.now() })) } catch {}
}
function loadDraft(): { form: FormData; step: number } | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (data?.form && data?.step) return data
  } catch {}
  return null
}
function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY) } catch {}
}

// ── 컴포넌트 ────────────────────────────────────────────────
export default function EntryForm({ isOpen, classes, rounds, initialRoundNumber }: Props) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(() => {
    const init = { ...EMPTY }
    if (initialRoundNumber) {
      const r = rounds.find(r => r.roundNumber === initialRoundNumber && r.status === 'entry_open')
      if (r) init.roundId = r._id
    }
    return init
  })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [showDraftBanner, setShowDraftBanner] = useState(false)

  // 초기 로드 시 임시저장 데이터 확인
  useEffect(() => {
    const draft = loadDraft()
    if (draft && (draft.form.teamName || draft.form.driver1Name)) {
      setShowDraftBanner(true)
    }
  }, [])

  const restoreDraft = useCallback(() => {
    const draft = loadDraft()
    if (draft) {
      setForm({ ...draft.form, agree: false })
      setStep(draft.step)
    }
    setShowDraftBanner(false)
  }, [])

  const dismissDraft = useCallback(() => {
    clearDraft()
    setShowDraftBanner(false)
  }, [])

  const set = (k: keyof FormData, v: string | boolean) => setForm(p => ({ ...p, [k]: v }))

  const selectedClass = classes.find(c => c._id === form.classId)
  const selectedRound = rounds.find(r => r._id === form.roundId)

  // ── Step 유효성 ────────────────────────────────────────
  const step1Valid =
    form.teamName.length >= 2 && form.teamName.length <= 20 &&
    form.classId !== '' &&
    form.roundId !== '' &&
    form.carModel.length >= 1

  const step2Valid =
    form.driver1Name.length >= 2 && form.driver1Name.length <= 10 &&
    /^010-\d{4}-\d{4}$/.test(form.driver1Phone) &&
    isValidEmail(form.driver1Email) &&
    isOver18(form.driver1Birth)

  // ── 제출 ───────────────────────────────────────────────
  async function handleSubmit() {
    if (!form.agree) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName: form.teamName,
          driver1: form.driver1Name,
          driver2: form.driver2Name || '',
          phone: form.driver1Phone,
          email: form.driver1Email,
          className: selectedClass?.name ?? '',
          rounds: [selectedRound?.title ?? ''],
          carModel: form.carModel,
          carNumber: form.carNumber,
          licenseNum: '',
          totalFee: selectedClass?.entryFeePerRound ?? 0,
        }),
      })
      if (!res.ok) throw new Error('서버 오류')
      clearDraft()
      setDone(true)
    } catch {
      setError('신청 처리 중 오류가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: '#fff', border: '1px solid var(--line)', clipPath: cut }}>
        <i className="fa-solid fa-clock" style={{ fontSize: '2rem', color: 'var(--red)', marginBottom: '12px', display: 'block' }} />
        <p style={{ fontSize: '1rem', fontWeight: 700 }}>현재 참가 신청 접수 기간이 아닙니다.</p>
      </div>
    )
  }

  // ── 완료 화면 ──────────────────────────────────────────
  if (done) {
    return (
      <div style={{ padding: '40px', background: '#fff', border: '1px solid var(--line)', clipPath: cut, textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', margin: '0 auto 16px', borderRadius: '50%', background: 'rgba(34,197,94,.1)', display: 'grid', placeItems: 'center' }}>
          <i className="fa-solid fa-circle-check" style={{ fontSize: '2rem', color: '#16a34a' }} />
        </div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>신청이 접수되었습니다</h3>
        <p style={{ fontSize: '.95rem', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 20px', wordBreak: 'keep-all' }}>
          담당자 검토 후 결제 링크를 이메일로 발송해드립니다.<br />
          보통 1~2 영업일 이내 발송됩니다.
        </p>
        <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '6px', padding: '16px 24px', background: 'var(--surface-2)', border: '1px solid var(--line)', clipPath: cut, textAlign: 'left', fontSize: '.9rem' }}>
          <div><strong style={{ color: 'var(--red)', marginRight: '8px' }}>신청자</strong>{form.driver1Name}</div>
          <div><strong style={{ color: 'var(--red)', marginRight: '8px' }}>클래스</strong>{selectedClass?.name ?? '-'}</div>
          <div><strong style={{ color: 'var(--red)', marginRight: '8px' }}>라운드</strong>{selectedRound?.title ?? '-'}</div>
        </div>
        <p style={{ fontSize: '.85rem', color: 'var(--muted)', marginTop: '16px' }}>
          문의: <a href="mailto:miksports2026@gmail.com" style={{ color: 'var(--red)', fontWeight: 700 }}>miksports2026@gmail.com</a>
        </p>
      </div>
    )
  }

  // ── 스텝 인디케이터 ────────────────────────────────────
  const steps = [
    { n: 1, label: '팀 & 차량' },
    { n: 2, label: '드라이버' },
    { n: 3, label: '확인 & 제출' },
  ]

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', fontSize: '.95rem',
    border: '1px solid var(--line)', background: '#fff',
    clipPath: cut, transition: 'border-color .2s',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '.82rem', fontWeight: 700,
    color: 'var(--text-sub)', marginBottom: '6px',
    letterSpacing: '.5px',
  }
  const reqDot: React.CSSProperties = { color: 'var(--red)', marginLeft: '2px' }

  return (
    <div>
      {/* 임시저장 복원 배너 */}
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

      {/* 스텝 인디케이터 */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '24px' }}>
        {steps.map((s, i) => (
          <div key={s.n} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', display: 'grid', placeItems: 'center',
              fontSize: '.82rem', fontWeight: 900,
              background: step >= s.n ? 'var(--red)' : 'var(--surface-2)',
              color: step >= s.n ? '#fff' : 'var(--muted)',
              border: step >= s.n ? '2px solid var(--red)' : '2px solid var(--line)',
              transition: 'all .2s',
            }}>{s.n}</div>
            <span style={{ fontSize: '.82rem', fontWeight: 700, marginLeft: '8px', color: step >= s.n ? 'var(--text)' : 'var(--muted)' }}>{s.label}</span>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: '2px', background: step > s.n ? 'var(--red)' : 'var(--line)', margin: '0 12px', transition: 'background .2s' }} />
            )}
          </div>
        ))}
      </div>

      {/* ── Step 1: 팀 & 차량 ──────────────────────────── */}
      {step === 1 && (
        <div style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={labelStyle}>팀명<span style={reqDot}>*</span></label>
            <input style={inputStyle} placeholder="한글/영문/숫자, 2~20자"
              value={form.teamName}
              onChange={e => set('teamName', e.target.value.replace(/[^가-힣a-zA-Z0-9\s]/g, '').slice(0, 20))}
            />
          </div>

          <div>
            <label style={labelStyle}>클래스 선택<span style={reqDot}>*</span></label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '8px' }}>
              {classes.map(c => {
                const color = c.accentColor ?? '#e60023'
                const sel = form.classId === c._id
                return (
                  <button key={c._id} type="button" onClick={() => set('classId', c._id)} style={{
                    padding: '12px', border: sel ? `2px solid ${color}` : '1px solid var(--line)',
                    background: sel ? `${color}0a` : '#fff', clipPath: cut, cursor: 'pointer',
                    textAlign: 'left', transition: 'all .15s',
                  }}>
                    <div style={{ fontSize: '.78rem', fontWeight: 900, color, marginBottom: '4px' }}>{c.classCode}</div>
                    <div style={{ fontSize: '.88rem', fontWeight: 700 }}>{c.name}</div>
                    {c.entryFeePerRound && c.isFeePublic !== false && (
                      <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: '4px' }}>{c.entryFeePerRound.toLocaleString()}원/R</div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label style={labelStyle}>라운드 선택<span style={reqDot}>*</span></label>
            <div style={{ display: 'grid', gap: '8px' }}>
              {rounds.map(r => {
                const isEntryOpen = r.status === 'entry_open'
                const badge = getStatusBadge(r.status)
                const sel = form.roundId === r._id
                return (
                  <button key={r._id} type="button" disabled={!isEntryOpen}
                    onClick={() => isEntryOpen && set('roundId', r._id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                      padding: '14px 16px', border: sel ? '2px solid var(--red)' : '1px solid var(--line)',
                      background: sel ? 'rgba(230,0,35,.04)' : '#fff', clipPath: cut, cursor: isEntryOpen ? 'pointer' : 'not-allowed',
                      opacity: isEntryOpen ? 1 : 0.55, textAlign: 'left', transition: 'all .15s',
                    }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '.95rem' }}>R{r.roundNumber} — {r.title}</div>
                      <div style={{ fontSize: '.82rem', color: 'var(--muted)', marginTop: '2px' }}>{r.dateStart}</div>
                    </div>
                    <span style={{ fontSize: '.76rem', fontWeight: 900, padding: '3px 10px', background: badge.bg, color: badge.color, border: `1px solid ${badge.color}33`, borderRadius: '4px', whiteSpace: 'nowrap' }}>{badge.text}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>차량번호</label>
              <input style={inputStyle} placeholder="예: 12가 3456"
                value={form.carNumber}
                onChange={e => set('carNumber', formatCarNumber(e.target.value))}
              />
            </div>
            <div>
              <label style={labelStyle}>차량모델<span style={reqDot}>*</span></label>
              <input style={inputStyle} placeholder="예: BMW E46 M3"
                value={form.carModel}
                onChange={e => set('carModel', e.target.value)}
              />
            </div>
          </div>

          <button type="button" disabled={!step1Valid} onClick={() => { saveDraft(form, 2); setStep(2) }} style={{
            padding: '14px', fontWeight: 800, fontSize: '1rem',
            background: step1Valid ? 'var(--red)' : 'var(--surface-2)',
            color: step1Valid ? '#fff' : 'var(--muted)',
            border: 'none', clipPath: cut, cursor: step1Valid ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
            다음: 드라이버 정보 <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
      )}

      {/* ── Step 2: 드라이버 정보 ──────────────────────── */}
      {step === 2 && (
        <div style={{ display: 'grid', gap: '16px' }}>
          <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-user" style={{ color: 'var(--red)' }} /> 드라이버 1 (필수)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>이름<span style={reqDot}>*</span></label>
              <input style={inputStyle} placeholder="한글/영문, 2~10자"
                value={form.driver1Name}
                onChange={e => set('driver1Name', e.target.value.replace(/[^가-힣a-zA-Z\s]/g, '').slice(0, 10))}
              />
            </div>
            <div>
              <label style={labelStyle}>연락처<span style={reqDot}>*</span></label>
              <input style={inputStyle} placeholder="010-0000-0000"
                value={form.driver1Phone}
                onChange={e => set('driver1Phone', formatPhone(e.target.value))}
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>이메일<span style={reqDot}>*</span></label>
              <input style={inputStyle} type="email" placeholder="example@email.com"
                value={form.driver1Email}
                onChange={e => set('driver1Email', e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>생년월일<span style={reqDot}>*</span> <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(만 18세 이상)</span></label>
              <input style={inputStyle} type="date" max={new Date(Date.now() - 18 * 365.25 * 86400000).toISOString().slice(0, 10)}
                value={form.driver1Birth}
                onChange={e => set('driver1Birth', e.target.value)}
              />
            </div>
          </div>

          <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
            <i className="fa-solid fa-user-plus" style={{ color: 'var(--muted)' }} /> 드라이버 2 (선택)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>이름</label>
              <input style={inputStyle} placeholder="한글/영문"
                value={form.driver2Name}
                onChange={e => set('driver2Name', e.target.value.replace(/[^가-힣a-zA-Z\s]/g, '').slice(0, 10))}
              />
            </div>
            <div>
              <label style={labelStyle}>연락처</label>
              <input style={inputStyle} placeholder="010-0000-0000"
                value={form.driver2Phone}
                onChange={e => set('driver2Phone', formatPhone(e.target.value))}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>이메일</label>
            <input style={inputStyle} type="email" placeholder="example@email.com"
              value={form.driver2Email}
              onChange={e => set('driver2Email', e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => { saveDraft(form, 1); setStep(1) }} style={{
              flex: 1, padding: '14px', fontWeight: 700, fontSize: '.95rem',
              background: '#fff', color: 'var(--text-sub)', border: '1px solid var(--line)',
              clipPath: cut, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              <i className="fa-solid fa-arrow-left" /> 이전
            </button>
            <button type="button" disabled={!step2Valid} onClick={() => { saveDraft(form, 3); setStep(3) }} style={{
              flex: 2, padding: '14px', fontWeight: 800, fontSize: '1rem',
              background: step2Valid ? 'var(--red)' : 'var(--surface-2)',
              color: step2Valid ? '#fff' : 'var(--muted)',
              border: 'none', clipPath: cut, cursor: step2Valid ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              다음: 최종 확인 <i className="fa-solid fa-arrow-right" />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: 최종 확인 & 제출 ──────────────────── */}
      {step === 3 && (
        <div style={{ display: 'grid', gap: '16px' }}>
          <h3 style={{ fontSize: '1rem' }}>
            <i className="fa-solid fa-clipboard-check" style={{ color: 'var(--red)', marginRight: '8px' }} />
            신청 내용 확인
          </h3>

          <div style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', clipPath: cut, padding: '20px' }}>
            {[
              { label: '팀명', value: form.teamName },
              { label: '클래스', value: selectedClass?.name ?? '-' },
              { label: '라운드', value: selectedRound ? `R${selectedRound.roundNumber} — ${selectedRound.title}` : '-' },
              { label: '차량모델', value: form.carModel },
              { label: '차량번호', value: form.carNumber || '—' },
              { label: '드라이버 1', value: `${form.driver1Name} / ${form.driver1Phone}` },
              { label: '이메일', value: form.driver1Email },
              { label: '생년월일', value: form.driver1Birth },
              ...(form.driver2Name ? [{ label: '드라이버 2', value: `${form.driver2Name}${form.driver2Phone ? ' / ' + form.driver2Phone : ''}` }] : []),
              ...(selectedClass?.entryFeePerRound && selectedClass.isFeePublic !== false
                ? [{ label: '참가비', value: `${selectedClass.entryFeePerRound.toLocaleString()}원 (라운드당)` }]
                : []),
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line)', gap: '12px' }}>
                <span style={{ fontSize: '.85rem', color: 'var(--muted)', fontWeight: 700, minWidth: '80px' }}>{row.label}</span>
                <span style={{ fontSize: '.9rem', fontWeight: 600, textAlign: 'right' }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* 개인정보 동의 */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '14px', background: '#fff', border: '1px solid var(--line)', clipPath: cut, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.agree} onChange={e => set('agree', e.target.checked)}
              style={{ marginTop: '2px', width: '18px', height: '18px', accentColor: 'var(--red)' }}
            />
            <span style={{ fontSize: '.88rem', color: 'var(--text-mid)', lineHeight: 1.6 }}>
              개인정보 수집 및 이용에 동의합니다. 수집 항목: 팀명, 드라이버 이름, 연락처, 이메일, 차량 정보. 수집 목적: 참가신청 접수 및 대회 운영. 보유 기간: 해당 시즌 종료 후 1년.
            </span>
          </label>

          {error && (
            <div style={{ padding: '12px 16px', background: 'rgba(230,0,35,.06)', border: '1px solid rgba(230,0,35,.2)', borderRadius: '6px', fontSize: '.88rem', color: 'var(--red)', fontWeight: 700 }}>
              <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '6px' }} />{error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => { saveDraft(form, 2); setStep(2) }} style={{
              flex: 1, padding: '14px', fontWeight: 700, fontSize: '.95rem',
              background: '#fff', color: 'var(--text-sub)', border: '1px solid var(--line)',
              clipPath: cut, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              <i className="fa-solid fa-arrow-left" /> 이전
            </button>
            <button type="button" disabled={!form.agree || submitting} onClick={handleSubmit} style={{
              flex: 2, padding: '14px', fontWeight: 800, fontSize: '1rem',
              background: form.agree && !submitting ? 'var(--red)' : 'var(--surface-2)',
              color: form.agree && !submitting ? '#fff' : 'var(--muted)',
              border: 'none', clipPath: cut, cursor: form.agree && !submitting ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              {submitting ? (
                <><i className="fa-solid fa-spinner fa-spin" /> 제출 중...</>
              ) : (
                <><i className="fa-solid fa-flag-checkered" /> 참가 신청 제출</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
