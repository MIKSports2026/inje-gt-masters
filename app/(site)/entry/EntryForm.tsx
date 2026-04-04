'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Round } from '@/types/sanity'

interface Props {
  isOpen: boolean
  classes: any[]
  rounds: Round[]
  initialRoundNumber?: number
}

const CLASSES = ['Master 1', 'Master 2', 'Master N', 'Master 3']
const BLOOD = ['A', 'B', 'O', 'AB']
const DRAFT_KEY = 'inje-entry-draft-v2'

interface Driver {
  name: string; birthDate: string; bloodType: string;
  phone: string; email: string; karaLicense: string;
}
const emptyDriver = (): Driver => ({ name: '', birthDate: '', bloodType: '', phone: '', email: '', karaLicense: '' })

const FEE: Record<string, { round: string; season: string }> = {
  'Master 1': { round: '700,000원', season: '3,000,000원' },
  'Master 2': { round: '600,000원', season: '2,500,000원' },
  'Master N': { round: '600,000원', season: '2,500,000원' },
  'Master 3': { round: '500,000원', season: '2,000,000원' },
}

interface FormState {
  entryType: 'round' | 'season';
  roundId: string; roundLabel: string; className: string;
  teamName: string; carModel: string;
  drivers: Driver[];
  showDriver3: boolean;
  agreedRules: boolean; agreedPrivacy: boolean;
}

const init = (): FormState => ({
  entryType: 'round',
  roundId: '', roundLabel: '', className: '',
  teamName: '', carModel: '',
  drivers: [emptyDriver(), emptyDriver(), emptyDriver()],
  showDriver3: false, agreedRules: false, agreedPrivacy: false,
})

export default function EntryForm({ isOpen, rounds, initialRoundNumber }: Props) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormState>(() => {
    const f = init()
    if (initialRoundNumber) {
      const r = rounds.find(r => r.roundNumber === initialRoundNumber && r.status === 'entry_open')
      if (r) { f.roundId = r._id; f.roundLabel = `R${r.roundNumber} ${r.title}` }
    }
    return f
  })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  // localStorage 임시저장
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY)
      if (saved) { const d = JSON.parse(saved); if (d.teamName) setForm(d) }
    } catch {}
  }, [])
  useEffect(() => {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(form)) } catch {}
  }, [form])

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm(p => ({ ...p, [k]: v }))
  const setDriver = (idx: number, field: keyof Driver, val: string) => {
    setForm(p => {
      const drivers = [...p.drivers]
      drivers[idx] = { ...drivers[idx], [field]: val }
      return { ...p, drivers }
    })
  }

  const openRounds = rounds.filter(r => r.status === 'entry_open')
  const d1 = form.drivers[0]

  const roundOk = form.entryType === 'season' || form.roundId
  const step1Valid = roundOk && form.className && form.teamName.length >= 1 && form.carModel.length >= 1
    && d1.name.length >= 2 && d1.birthDate && d1.bloodType && d1.phone && d1.email
    && form.drivers[1].name.length >= 2
    && form.agreedRules && form.agreedPrivacy

  async function handleSubmit() {
    setSubmitting(true); setError('')
    try {
      const driversToSend = form.drivers.slice(0, form.showDriver3 ? 3 : 2).filter(d => d.name)
      const res = await fetch('/api/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entryType: form.entryType,
          roundId: form.entryType === 'round' ? form.roundId : undefined,
          roundLabel: form.entryType === 'season' ? '2026 시즌 전체' : form.roundLabel,
          className: form.className, teamName: form.teamName, carModel: form.carModel,
          drivers: driversToSend,
          contactPhone: d1.phone, contactEmail: d1.email,
          agreedRules: form.agreedRules, agreedPrivacy: form.agreedPrivacy,
          entryFee: form.className ? FEE[form.className]?.[form.entryType] : undefined,
        }),
      })
      if (!res.ok) throw new Error('서버 오류')
      localStorage.removeItem(DRAFT_KEY)
      setDone(true)
    } catch { setError('신청 중 오류가 발생했습니다. 다시 시도해 주세요.') }
    finally { setSubmitting(false) }
  }

  if (!isOpen) return (
    <div style={cardStyle}>
      <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>현재 참가 신청 접수 기간이 아닙니다.</p>
    </div>
  )

  if (done) return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 12 }}>신청이 접수되었습니다</h3>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
        담당자 검토 후 결제 링크를 이메일로 발송합니다.
      </p>
    </div>
  )

  const stepLabel = `STEP ${String(step).padStart(2, '0')} / 02`

  return (
    <div className="ef-card">
      {/* Card header */}
      <div className="ef-card__head">
        <h3 className="ef-card__head-title">OFFICIAL APPLICATION</h3>
        <span className="ef-card__head-step">{stepLabel}</span>
      </div>
      {/* Progress bar */}
      <div className="ef-card__progress">
        <div className="ef-card__progress-fill" style={{ width: step === 1 ? '50%' : '100%' }} />
      </div>
      <div className="ef-card__body">

      {step === 1 && (
        <div style={{ display: 'grid', gap: 16 }}>
          {/* 참가 정보 */}
          <fieldset style={fieldsetStyle}><legend style={legendStyle}>참가 정보</legend>
            <label style={labelStyle}>참가 유형 *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
              {([
                { value: 'round' as const, label: 'ROUND ENTRY', desc: '원하는 라운드 선택 참가' },
                { value: 'season' as const, label: 'SEASON ENTRY', desc: '2026 시즌 전체 참가' },
              ]).map(opt => (
                <button key={opt.value} type="button" onClick={() => { set('entryType', opt.value); if (opt.value === 'season') { set('roundId', ''); set('roundLabel', '2026 시즌 전체') } }}
                  style={{ ...chipStyle, padding: '14px 16px', textAlign: 'left' as const, display: 'flex', flexDirection: 'column' as const, gap: 4, ...(form.entryType === opt.value ? chipActiveStyle : {}) }}>
                  <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: '.95rem', fontWeight: 700, letterSpacing: '.08em' }}>{opt.label}</span>
                  <span style={{ fontSize: '.75rem', opacity: .6 }}>{opt.desc}</span>
                </button>
              ))}
            </div>

            {form.entryType === 'round' && (<>
              <label style={labelStyle}>라운드 선택 *</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {openRounds.length === 0 && <span style={{ color: 'var(--text-secondary)', fontSize: '.9rem' }}>접수 중인 라운드가 없습니다</span>}
                {openRounds.map(r => (
                  <button key={r._id} type="button" onClick={() => { set('roundId', r._id); set('roundLabel', `R${r.roundNumber} ${r.title}`) }}
                    style={{ ...chipStyle, ...(form.roundId === r._id ? chipActiveStyle : {}) }}>
                    R{r.roundNumber} — {r.title}
                </button>
              ))}
              </div>
            </>)}

            <label style={labelStyle}>클래스 *</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CLASSES.map(c => (
                <button key={c} type="button" onClick={() => set('className', c)}
                  style={{ ...chipStyle, ...(form.className === c ? chipActiveStyle : {}) }}>
                  {c}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>팀명 *</label>
                <input style={inputStyle} placeholder="팀명 (없으면 '없음')" value={form.teamName} onChange={e => set('teamName', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>차량 *</label>
                <input style={inputStyle} placeholder="제조사 / 모델" value={form.carModel} onChange={e => set('carModel', e.target.value)} />
              </div>
            </div>
          </fieldset>

          {/* 드라이버 1 */}
          <fieldset style={fieldsetStyle}><legend style={legendStyle}>드라이버 1 — 대표</legend>
            <DriverFields driver={form.drivers[0]} idx={0} setDriver={setDriver} showContact />
          </fieldset>

          {/* 드라이버 2 */}
          <fieldset style={fieldsetStyle}><legend style={legendStyle}>드라이버 2</legend>
            <DriverFields driver={form.drivers[1]} idx={1} setDriver={setDriver} />
          </fieldset>

          {/* 드라이버 3 */}
          {form.showDriver3 ? (
            <fieldset style={fieldsetStyle}><legend style={legendStyle}>드라이버 3</legend>
              <DriverFields driver={form.drivers[2]} idx={2} setDriver={setDriver} />
              <button type="button" onClick={() => set('showDriver3', false)} style={{ ...chipStyle, marginTop: 8, color: '#E60023' }}>- 드라이버 3 제거</button>
            </fieldset>
          ) : (
            <button type="button" onClick={() => set('showDriver3', true)} style={{ ...chipStyle, color: 'var(--primary-red)' }}>+ 드라이버 3 추가</button>
          )}

          {/* 동의 */}
          <fieldset style={fieldsetStyle}><legend style={legendStyle}>동의</legend>
            <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', cursor: 'pointer', fontSize: '.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <input type="checkbox" checked={form.agreedRules} onChange={e => set('agreedRules', e.target.checked)} style={{ marginTop: 3, accentColor: '#E60023' }} />
              <span>대회 규정 및 참가 조건에 동의합니다. <Link href="/entry/rules" style={{ color: '#E60023' }}>규정 보기</Link></span>
            </label>
            <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', cursor: 'pointer', fontSize: '.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 8 }}>
              <input type="checkbox" checked={form.agreedPrivacy} onChange={e => set('agreedPrivacy', e.target.checked)} style={{ marginTop: 3, accentColor: '#E60023' }} />
              <span>개인정보 수집 및 이용에 동의합니다.</span>
            </label>
          </fieldset>

          <button type="button" disabled={!step1Valid} onClick={() => setStep(2)}
            style={{ ...btnStyle, background: step1Valid ? '#E60023' : '#333', cursor: step1Valid ? 'pointer' : 'not-allowed' }}>
            다음: 확인 및 제출 →
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={cardStyle}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 16 }}>신청 내용 확인</h3>
            {[
              ['참가유형', form.entryType === 'season' ? '시즌 전체' : '라운드'],
              ['라운드', form.entryType === 'season' ? '2026 시즌 전체' : form.roundLabel],
              ['클래스', form.className],
              ['팀명', form.teamName],
              ['차량', form.carModel],
              ['드라이버 1', `${d1.name} / ${d1.birthDate} / ${d1.bloodType} / ${d1.phone} / ${d1.email}`],
              ['드라이버 2', `${form.drivers[1].name} / ${form.drivers[1].birthDate} / ${form.drivers[1].bloodType}`],
              ...(form.showDriver3 && form.drivers[2].name ? [['드라이버 3', `${form.drivers[2].name} / ${form.drivers[2].birthDate} / ${form.drivers[2].bloodType}`]] : []),
              ...(form.className ? [['참가비', FEE[form.className]?.[form.entryType] ?? '—']] : []),
            ].map(([l, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.06)', gap: 12 }}>
                <span style={{ fontSize: '.82rem', color: 'var(--text-secondary)', minWidth: 80 }}>{l}</span>
                <span style={{ fontSize: '.88rem', color: 'var(--text-primary)', textAlign: 'right' }}>{v}</span>
              </div>
            ))}
          </div>

          {error && <div style={{ padding: '12px 16px', background: 'rgba(230,0,35,.08)', border: '1px solid rgba(230,0,35,.2)', fontSize: '.88rem', color: '#E60023' }}>{error}</div>}

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={() => setStep(1)} style={{ ...btnStyle, flex: 1, background: 'transparent', border: '2px solid rgba(255,255,255,.15)', color: '#fff' }}>← BACK</button>
            <button type="button" disabled={submitting} onClick={handleSubmit} style={{ ...btnStyle, flex: 2, background: submitting ? '#333' : '#E60023' }}>
              {submitting ? '제출 중...' : '참가 신청 제출'}
            </button>
          </div>
        </div>
      )}
      </div>{/* ef-card__body */}

      <style>{`
        .ef-card {
          background: #0b0b0b;
          border-top: 1px solid rgba(255,255,255,.1);
          box-shadow: 0 20px 50px rgba(0,0,0,.5);
          position: relative;
          clip-path: polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px);
        }
        .ef-card::before {
          content: ''; position: absolute; top: 0; left: 0;
          width: 100%; height: 3px;
          background: linear-gradient(90deg, var(--primary-red, #E60023), transparent);
        }
        .ef-card__head {
          padding: 30px 40px; border-bottom: 1px solid rgba(255,255,255,.05);
          display: flex; justify-content: space-between; align-items: center;
          background: #111;
        }
        .ef-card__head-title {
          font-family: var(--font-heading, 'Oswald'); font-size: 1.5rem;
          letter-spacing: 2px; color: #fff; margin: 0;
        }
        .ef-card__head-step {
          font-family: var(--font-heading, 'Oswald');
          color: var(--primary-red); font-weight: 700; letter-spacing: 2px;
        }
        .ef-card__progress { width: 100%; height: 2px; background: rgba(255,255,255,.1); }
        .ef-card__progress-fill {
          height: 100%; background: var(--primary-red);
          transition: width .4s cubic-bezier(.25,1,.5,1);
        }
        .ef-card__body { padding: 40px; display: flex; flex-direction: column; gap: 24px; }

        @media (max-width: 768px) {
          .ef-card { clip-path: polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px); }
          .ef-card__head { padding: 20px 24px; }
          .ef-card__head-title { font-size: 1.1rem; }
          .ef-card__body { padding: 24px; }
        }
      `}</style>
    </div>
  )
}

function DriverFields({ driver, idx, setDriver, showContact }: {
  driver: Driver; idx: number;
  setDriver: (idx: number, field: keyof Driver, val: string) => void;
  showContact?: boolean;
}) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <div><label style={labelStyle}>이름 *</label><input style={inputStyle} value={driver.name} onChange={e => setDriver(idx, 'name', e.target.value)} /></div>
        <div><label style={labelStyle}>생년월일</label><input style={inputStyle} type="date" value={driver.birthDate} onChange={e => setDriver(idx, 'birthDate', e.target.value)} /></div>
        <div>
          <label style={labelStyle}>혈액형</label>
          <select style={inputStyle} value={driver.bloodType} onChange={e => setDriver(idx, 'bloodType', e.target.value)}>
            <option value="">선택</option>
            {BLOOD.map(b => <option key={b} value={b}>{b}형</option>)}
          </select>
        </div>
      </div>
      {showContact && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div><label style={labelStyle}>연락처 *</label><input style={inputStyle} placeholder="010-0000-0000" value={driver.phone} onChange={e => setDriver(idx, 'phone', e.target.value)} /></div>
          <div><label style={labelStyle}>이메일 *</label><input style={inputStyle} type="email" value={driver.email} onChange={e => setDriver(idx, 'email', e.target.value)} /></div>
        </div>
      )}
      <div><label style={labelStyle}>KARA 라이선스</label><input style={inputStyle} placeholder="라이선스 번호" value={driver.karaLicense} onChange={e => setDriver(idx, 'karaLicense', e.target.value)} /></div>
    </div>
  )
}

const cardStyle: React.CSSProperties = { padding: 25, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.1)' }
const fieldsetStyle: React.CSSProperties = { border: 'none', padding: 0, margin: 0 }
const legendStyle: React.CSSProperties = { fontFamily: "var(--font-heading, 'Oswald')", fontSize: '.85rem', fontWeight: 700, letterSpacing: '1px', color: '#888', textTransform: 'uppercase', padding: 0, marginBottom: 16 }
const labelStyle: React.CSSProperties = { display: 'block', fontFamily: "var(--font-heading, 'Oswald')", fontSize: '.85rem', color: '#888', letterSpacing: '1px', marginBottom: 8, marginTop: 16 }
const inputStyle: React.CSSProperties = { width: '100%', padding: '16px 20px', fontSize: '1rem', border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.03)', color: '#fff', borderRadius: 0, transition: 'all .3s ease', outline: 'none' }
const chipStyle: React.CSSProperties = { padding: '12px 20px', fontSize: '.85rem', fontWeight: 600, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.05)', color: '#aaa', cursor: 'pointer', fontFamily: "var(--font-heading, 'Oswald')", letterSpacing: '1px', transition: 'all .3s ease' }
const chipActiveStyle: React.CSSProperties = { borderColor: '#E60023', color: '#fff', background: 'rgba(230,0,35,.1)' }
const btnStyle: React.CSSProperties = { padding: '25px 0', fontFamily: "var(--font-heading, 'Oswald')", fontSize: '1.3rem', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#fff', border: 'none', cursor: 'pointer', clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)', transition: 'all .3s ease' }
