// app/api/entry/route.ts — 참가신청 API (Sanity + Sheets + Email)
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { google } from 'googleapis'

const ADMIN = process.env.ADMIN_EMAIL ?? 'miksports2026@gmail.com'
const FROM  = 'onboarding@resend.dev'

interface Driver {
  name: string
  birthDate?: string
  bloodType?: string
  phone?: string
  email?: string
  karaLicense?: string
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      entryType, roundId, roundLabel, className, teamName, carModel,
      drivers, contactPhone, contactEmail,
      agreedRules, agreedPrivacy, entryFee, preferredNumber,
    } = body as {
      entryType: 'round' | 'season'; roundId?: string; roundLabel: string; className: string;
      teamName: string; carModel: string;
      drivers: Driver[]; contactPhone: string; contactEmail: string;
      agreedRules: boolean; agreedPrivacy: boolean; entryFee?: string; preferredNumber?: string;
    }
    const entryTypeLabel = entryType === 'season' ? '시즌 전체' : '라운드'

    const d1 = drivers[0] ?? {} as Driver
    const d2 = drivers[1] ?? {} as Driver
    const d3 = drivers[2] ?? {} as Driver
    const now = new Date().toISOString()

    // ── ① Sanity 저장 ─────────────────────────────────
    const sanityToken = process.env.SANITY_API_WRITE_TOKEN
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    if (sanityToken && projectId) {
      await fetch(`https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/production`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sanityToken}`,
        },
        body: JSON.stringify({
          mutations: [{
            create: {
              _type: 'application',
              entryType,
              ...(roundId ? { roundId: { _type: 'reference', _ref: roundId } } : {}),
              roundLabel,
              className,
              teamName,
              carModel,
              preferredNumber: preferredNumber ?? '',
              drivers: drivers.map((d, i) => ({
                _key: `driver-${i}`,
                name: d.name,
                birthDate: d.birthDate ?? '',
                bloodType: d.bloodType ?? '',
                phone: d.phone ?? '',
                email: d.email ?? '',
                karaLicense: d.karaLicense ?? '',
              })),
              contactPhone,
              contactEmail,
              agreedRules,
              agreedPrivacy,
              submittedAt: now,
              status: 'pending',
            },
          }],
        }),
      })
    }

    // ── ② Google Sheets 저장 ───────────────────────────
    const sheetId = process.env.GOOGLE_SHEET_ID
    const saEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const saKey   = process.env.GOOGLE_PRIVATE_KEY
    if (sheetId && saEmail && saKey) {
      try {
        const auth = new google.auth.JWT({
          email: saEmail,
          key: saKey.replace(/\\n/g, '\n'),
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        })
        const sheets = google.sheets({ version: 'v4', auth })
        await sheets.spreadsheets.values.append({
          spreadsheetId: sheetId,
          range: 'Sheet1!A:T',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[
              entryTypeLabel, roundLabel, className, teamName, carModel,
              d1.name ?? '', d1.birthDate ?? '', d1.bloodType ?? '', d1.phone ?? contactPhone, d1.email ?? contactEmail, d1.karaLicense ?? '',
              d2.name ?? '', d2.birthDate ?? '', d2.bloodType ?? '', d2.karaLicense ?? '',
              d3.name ?? '', d3.birthDate ?? '', d3.bloodType ?? '', d3.karaLicense ?? '',
              preferredNumber ?? '',
              now,
            ]],
          },
        })
      } catch (e) {
        console.error('Sheets error:', e)
      }
    }

    // ── ③④ 이메일 발송 ────────────────────────────────
    const resend = new Resend(process.env.RESEND_API_KEY)

    const preferredNumberRow = preferredNumber ? `
  <tr style="background:#fff">
    <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;width:100px;font-size:13px;color:#666;font-weight:700;">희망 번호</td>
    <td style="padding:8px 0 8px 16px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#111;font-weight:600;">${preferredNumber}</td>
  </tr>` : ''

    const driverRows = drivers.map((d, i) => `
      <tr style="background:${i % 2 === 0 ? '#fff' : '#fafafa'}">
        <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#666;font-weight:700;">드라이버 ${i + 1}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#111;font-weight:600;">
          ${d.name} / ${d.birthDate ?? '—'} / ${d.bloodType ?? '—'}${d.karaLicense ? ` / ${d.karaLicense}` : ''}
        </td>
      </tr>`).join('')

    const adminHtml = `
<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-top:4px solid #E60023;max-width:600px;">
        <tr><td style="padding:32px 40px 20px;border-bottom:1px solid #eee;">
          <p style="margin:0 0 4px;font-size:12px;color:#E60023;font-weight:800;letter-spacing:2px;">NEW ENTRY</p>
          <h1 style="margin:0;font-size:20px;color:#111;">새 참가신청 접수</h1>
        </td></tr>
        <tr><td style="padding:24px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${[
              ['참가유형', entryTypeLabel],
              ['라운드', roundLabel],
              ['클래스', className],
              ['팀명', teamName],
              ['차량', carModel],
              ...(preferredNumber ? [['희망 번호', preferredNumber]] : []),
              ['대표 연락처', contactPhone],
              ['대표 이메일', contactEmail],
            ].map(([l, v]) => `
            <tr><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;width:100px;font-size:13px;color:#666;font-weight:700;">${l}</td>
            <td style="padding:8px 0 8px 16px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#111;font-weight:600;">${v}</td></tr>`).join('')}
            ${driverRows}
          </table>
        </td></tr>
        <tr><td style="padding:16px 40px;background:#fafafa;font-size:11px;color:#999;">자동 발송 메일</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

    const userHtml = `
<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-top:4px solid #E60023;max-width:600px;">
        <tr><td style="padding:32px 40px 24px;background:#0c1730;">
          <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:3px;">INJE GT MASTERS 2026</p>
          <h1 style="margin:0;font-size:22px;color:#fff;">참가신청 접수 완료</h1>
        </td></tr>
        <tr><td style="padding:24px 40px;">
          <p style="margin:0 0 16px;font-size:14px;color:#333;line-height:1.8;">
            <strong>${d1.name}</strong>님, <strong>${teamName}</strong> 팀 참가신청이 접수되었습니다.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fa;border:1px solid #eee;">
            <tr><td colspan="2" style="padding:10px 16px;background:#E60023;font-size:12px;font-weight:800;color:#fff;letter-spacing:2px;">신청 내용</td></tr>
            ${[
              ['참가유형', entryTypeLabel],
              ['라운드', roundLabel],
              ['클래스', className],
              ['팀명', teamName],
              ['차량', carModel],
              ...(preferredNumber ? [['희망 번호', preferredNumber]] : []),
            ].map(([l, v], i) => `
            <tr style="background:${i % 2 === 0 ? '#fff' : '#fafafa'}">
              <td style="padding:10px 16px;width:100px;font-size:13px;color:#666;font-weight:700;border-bottom:1px solid #f0f0f0;">${l}</td>
              <td style="padding:10px 16px;font-size:13px;color:#111;font-weight:600;border-bottom:1px solid #f0f0f0;">${v}</td>
            </tr>`).join('')}
            ${driverRows}
          </table>
        </td></tr>
        <tr><td style="padding:16px 40px 28px;">
          <p style="margin:0;font-size:12px;color:#666;line-height:1.7;">
            담당자 검토 후 결제 링크를 <strong>${contactEmail}</strong>로 발송합니다. (1~2 영업일)<br>
            문의: <a href="mailto:${ADMIN}" style="color:#E60023;">${ADMIN}</a>
          </p>
        </td></tr>
        <tr><td style="padding:16px 40px;background:#0c1730;font-size:11px;color:rgba(255,255,255,0.4);">
          © 2026 INJE GT MASTERS
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

    await Promise.all([
      resend.emails.send({
        from: FROM, to: ADMIN,
        subject: `[참가신청] ${teamName} - ${className} - ${roundLabel}`,
        html: adminHtml, replyTo: contactEmail,
      }),
      resend.emails.send({
        from: FROM, to: contactEmail,
        subject: '[인제 GT 마스터즈] 참가신청 접수 완료',
        html: userHtml,
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Entry API error:', err)
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
}
