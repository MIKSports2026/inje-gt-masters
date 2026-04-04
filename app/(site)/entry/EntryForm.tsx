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
  showDriver2: boolean;
  showDriver3: boolean;
  agreedRules: boolean; agreedPrivacy: boolean;
}

const init = (): FormState => ({
  entryType: 'round',
  roundId: '', roundLabel: '', className: '',
  teamName: '', carModel: '',
  drivers: [emptyDriver(), emptyDriver(), emptyDriver()],
  showDriver2: false, showDriver3: false, agreedRules: false, agreedPrivacy: false,
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
    && form.agreedRules && form.agreedPrivacy

  async function handleSubmit() {
    setSubmitting(true); setError('')
    try {
      const maxDrivers = form.showDriver3 ? 3 : form.showDriver2 ? 2 : 1
      const driversToSend = form.drivers.slice(0, maxDrivers).filter(d => d.name)
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
    <div className="ef-summary" style={{ textAlign: 'center', padding: 40 }}>
      <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>현재 참가 신청 접수 기간이 아닙니다.</p>
    </div>
  )

  if (done) return (
    <div className="ef-summary" style={{ textAlign: 'center', padding: 40 }}>
      <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 12 }}>신청이 접수되었습니다</h3>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>담당자 검토 후 결제 링크를 이메일로 발송합니다.</p>
    </div>
  )

  const stepLabel = `STEP ${String(step).padStart(2, '0')} / 02`

  return (
    <div className="ef-card">
      <div className="ef-card__head">
        <h3 className="ef-card__head-title">OFFICIAL APPLICATION</h3>
        <span className="ef-card__head-step">{stepLabel}</span>
      </div>
      <div className="ef-card__progress">
        <div className="ef-card__progress-fill" style={{ width: step === 1 ? '50%' : '100%' }} />
      </div>
      <div className="ef-card__body" key={step}>

      {step === 1 && (
        <div className="ef-step">
          {/* 참가 정보 */}
          <div className="form-group">
            <label>ENTRY TYPE *</label>
            <div className="form-row">
              {([
                { value: 'round' as const, label: 'ROUND ENTRY', desc: '원하는 라운드 선택 참가' },
                { value: 'season' as const, label: 'SEASON ENTRY', desc: '2026 시즌 전체 참가' },
              ]).map(opt => (
                <button key={opt.value} type="button" onClick={() => { set('entryType', opt.value); if (opt.value === 'season') { set('roundId', ''); set('roundLabel', '2026 시즌 전체') } }}
                  className={`ef-chip ef-chip--lg ${form.entryType === opt.value ? 'ef-chip--active' : ''}`}>
                  <strong>{opt.label}</strong>
                  <span>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {form.entryType === 'round' && (
            <div className="form-group">
              <label>ROUND *</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {openRounds.length === 0 && <span style={{ color: '#888', fontSize: '.9rem' }}>접수 중인 라운드가 없습니다</span>}
                {openRounds.map(r => (
                  <button key={r._id} type="button" onClick={() => { set('roundId', r._id); set('roundLabel', `R${r.roundNumber} ${r.title}`) }}
                    className={`ef-chip ${form.roundId === r._id ? 'ef-chip--active' : ''}`}>
                    R{r.roundNumber} — {r.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>RACING CLASS *</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CLASSES.map(c => (
                <button key={c} type="button" onClick={() => set('className', c)}
                  className={`ef-chip ${form.className === c ? 'ef-chip--active' : ''}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>TEAM NAME *</label>
              <input type="text" placeholder="팀이 없는 경우 '없음' 기재" value={form.teamName} onChange={e => set('teamName', e.target.value)} />
            </div>
            <div className="form-group">
              <label>VEHICLE *</label>
              <input type="text" placeholder="제조사 / 모델" value={form.carModel} onChange={e => set('carModel', e.target.value)} />
            </div>
          </div>

          {/* 드라이버 1 */}
          <div className="form-group" style={{ borderTop: '1px dashed rgba(255,255,255,.1)', paddingTop: 20 }}>
            <label>DRIVER 1 — 대표</label>
          </div>
          <DriverFields driver={form.drivers[0]} idx={0} setDriver={setDriver} showContact />

          {/* 드라이버 2 */}
          {form.showDriver2 ? (<>
            <div className="form-group" style={{ borderTop: '1px dashed rgba(255,255,255,.1)', paddingTop: 20 }}>
              <label>DRIVER 2</label>
            </div>
            <DriverFields driver={form.drivers[1]} idx={1} setDriver={setDriver} />
            <button type="button" onClick={() => { set('showDriver2', false); set('showDriver3', false) }} className="ef-chip" style={{ color: '#E60023', alignSelf: 'flex-start' }}>- 드라이버 2 제거</button>
          </>) : (
            <button type="button" onClick={() => set('showDriver2', true)} className="ef-chip" style={{ color: 'var(--primary-red)', alignSelf: 'flex-start' }}>+ 드라이버 2 추가</button>
          )}

          {/* 드라이버 3 */}
          {form.showDriver2 && (
            form.showDriver3 ? (<>
              <div className="form-group" style={{ borderTop: '1px dashed rgba(255,255,255,.1)', paddingTop: 20 }}>
                <label>DRIVER 3</label>
              </div>
              <DriverFields driver={form.drivers[2]} idx={2} setDriver={setDriver} />
              <button type="button" onClick={() => set('showDriver3', false)} className="ef-chip" style={{ color: '#E60023', alignSelf: 'flex-start' }}>- 드라이버 3 제거</button>
            </>) : (
              <button type="button" onClick={() => set('showDriver3', true)} className="ef-chip" style={{ color: 'var(--primary-red)', alignSelf: 'flex-start' }}>+ 드라이버 3 추가</button>
            )
          )}

          {/* 동의 */}
          <div className="form-agreements">
            <label className="ef-checkbox">
              <input type="checkbox" checked={form.agreedRules} onChange={e => set('agreedRules', e.target.checked)} />
              <span className="ef-checkmark" />
              대회 규정 및 참가 조건에 동의합니다. <Link href="/entry/rules" style={{ color: '#E60023', marginLeft: 4 }}>규정 보기</Link>
            </label>
            <label className="ef-checkbox">
              <input type="checkbox" checked={form.agreedPrivacy} onChange={e => set('agreedPrivacy', e.target.checked)} />
              <span className="ef-checkmark" />
              개인정보 수집 및 이용에 동의합니다.
            </label>
          </div>

          <button type="button" disabled={!step1Valid} onClick={() => setStep(2)} className="ef-btn-submit">
            NEXT STEP
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="ef-step">
          <div className="ef-summary">
            <h4 className="ef-summary__title">APPLICATION SUMMARY</h4>
            {[
              ['ENTRY TYPE', form.entryType === 'season' ? '시즌 전체' : '라운드'],
              ['ROUND', form.entryType === 'season' ? '2026 시즌 전체' : form.roundLabel],
              ['CLASS', form.className],
              ['TEAM', form.teamName],
              ['VEHICLE', form.carModel],
              ['DRIVER 1', `${d1.name} / ${d1.birthDate} / ${d1.bloodType}`],
              ...(form.showDriver2 && form.drivers[1].name ? [['DRIVER 2', `${form.drivers[1].name} / ${form.drivers[1].birthDate} / ${form.drivers[1].bloodType}`]] : []),
              ...(form.showDriver3 && form.drivers[2].name ? [['DRIVER 3', `${form.drivers[2].name} / ${form.drivers[2].birthDate} / ${form.drivers[2].bloodType}`]] : []),
              ...(form.className ? [['ENTRY FEE', FEE[form.className]?.[form.entryType] ?? '—']] : []),
            ].map(([l, v], i) => (
              <div key={i} className="ef-summary__row">
                <span className="ef-summary__label">{l}</span>
                <span className="ef-summary__value">{v}</span>
              </div>
            ))}
          </div>

          {error && <div style={{ padding: '12px 16px', background: 'rgba(230,0,35,.08)', border: '1px solid rgba(230,0,35,.2)', fontSize: '.88rem', color: '#E60023' }}>{error}</div>}

          <div className="ef-step2-actions">
            <button type="button" onClick={() => setStep(1)} className="ef-btn-back">← BACK</button>
            <button type="button" disabled={submitting} onClick={handleSubmit} className="ef-btn-submit">
              {submitting ? 'PROCESSING...' : 'SUBMIT APPLICATION'}
            </button>
          </div>
        </div>
      )}

      </div>
    </div>
  )
}

function DriverFields({ driver, idx, setDriver, showContact }: {
  driver: Driver; idx: number;
  setDriver: (idx: number, field: keyof Driver, val: string) => void;
  showContact?: boolean;
}) {
  return (<>
    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
      <div className="form-group">
        <label>NAME *</label>
        <input type="text" value={driver.name} onChange={e => setDriver(idx, 'name', e.target.value)} />
      </div>
      <div className="form-group">
        <label>DATE OF BIRTH</label>
        <input type="date" value={driver.birthDate} onChange={e => setDriver(idx, 'birthDate', e.target.value)} />
      </div>
      <div className="form-group">
        <label>BLOOD TYPE</label>
        <select value={driver.bloodType} onChange={e => setDriver(idx, 'bloodType', e.target.value)}>
          <option value="">선택</option>
          {BLOOD.map(b => <option key={b} value={b}>{b}형</option>)}
        </select>
      </div>
    </div>
    {showContact && (
      <div className="form-row">
        <div className="form-group">
          <label>CONTACT *</label>
          <input type="text" placeholder="010-0000-0000" value={driver.phone} onChange={e => setDriver(idx, 'phone', e.target.value)} />
        </div>
        <div className="form-group">
          <label>EMAIL *</label>
          <input type="email" placeholder="driver@example.com" value={driver.email} onChange={e => setDriver(idx, 'email', e.target.value)} />
        </div>
      </div>
    )}
    <div className="form-group">
      <label>KARA LICENSE</label>
      <input type="text" placeholder="라이선스 번호" value={driver.karaLicense} onChange={e => setDriver(idx, 'karaLicense', e.target.value)} />
    </div>
  </>)
}
