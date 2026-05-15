// app/api/entry/route.ts — 참가신청 API (Sanity + Sheets + Email)
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { google } from 'googleapis'

const ADMIN = process.env.ADMIN_EMAIL ?? 'miksports2026@gmail.com'
const FROM  = 'noreply@injegtmasters.com'

interface Driver {
  name: string
  birthDate?: string
  bloodType?: string
  phone?: string
  email?: string
  karaLicense?: string
}

function buildEntryEmail({
  entryTypeLabel, roundLabel, className, teamName, carModel,
  teamRepresentative, entryFee, preferredNumber, preferredNumber2,
  drivers, contactPhone, contactEmail, now,
}: {
  entryTypeLabel: string; roundLabel: string; className: string
  teamName: string; carModel: string; teamRepresentative?: string
  entryFee?: string; preferredNumber: string; preferredNumber2: string
  drivers: Driver[]; contactPhone: string; contactEmail: string; now: string
}): string {
  const greeting = teamRepresentative || teamName

  const r = (label: string, value: string, idx: number) =>
    `<tr style="background:${idx % 2 === 0 ? '#fff' : '#fafafa'}">` +
    `<td style="padding:9px 14px;width:130px;font-size:12px;color:#666;font-weight:700;border-bottom:1px solid #f0f0f0;">${label}</td>` +
    `<td style="padding:9px 14px;font-size:12px;color:#111;font-weight:600;border-bottom:1px solid #f0f0f0;">${value || '—'}</td>` +
    `</tr>`

  const infoRows = [
    ['참가 유형', entryTypeLabel],
    ['라운드', roundLabel],
    ['클래스', className],
    ...(entryFee ? [['참가비', entryFee]] : []),
  ].map((item, i) => r(item[0], item[1], i)).join('')

  const teamRows = [
    ['팀명', teamName],
    ['대표자', teamRepresentative ?? '—'],
    ['차량', carModel],
    ['희망 엔트리 1순위', `No. ${preferredNumber}`],
    ['희망 엔트리 2순위', `No. ${preferredNumber2}`],
  ].map((item, i) => r(item[0], item[1], i)).join('')

  const driverRowHtml = drivers.map((d, i) => {
    const parts = i === 0
      ? [d.name, d.birthDate, d.bloodType, d.phone || contactPhone, d.email || contactEmail, d.karaLicense]
      : [d.name, d.birthDate, d.bloodType, d.karaLicense]
    return r(`드라이버 ${i + 1}`, parts.filter(Boolean).join(' / '), i)
  }).join('')

  const section = (title: string, rows: string) =>
    `<tr><td style="padding:20px 32px 0;">` +
    `<p style="margin:0 0 8px;font-size:11px;font-weight:800;letter-spacing:2px;color:#E60023;">${title}</p>` +
    `<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;">${rows}</table>` +
    `</td></tr>`

  return `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;max-width:600px;border-top:4px solid #E60023;">
<tr><td style="padding:28px 32px 20px;background:#0c1730;">
<p style="margin:0 0 4px;font-size:10px;color:rgba(255,255,255,.5);letter-spacing:3px;">INJE GT MASTERS 2026</p>
<h1 style="margin:0;font-size:20px;color:#fff;font-weight:800;">참가 신청 접수 확인</h1>
</td></tr>
<tr><td style="padding:24px 32px 0;">
<p style="margin:0;font-size:14px;color:#333;line-height:1.8;">안녕하세요, <strong>${greeting}</strong> 님.<br><strong>${roundLabel}</strong> 참가 신청이 정상 접수되었습니다.</p>
</td></tr>
<tr><td style="padding:16px 32px 0;">
<div style="background:#f8f9fa;border-left:3px solid #aaa;padding:12px 16px;">
<p style="margin:0;font-size:12px;color:#666;line-height:1.7;">※ 1·2순위 번호는 희망사항으로 접수됩니다. 신청 현황을 함께 검토해 최종 엔트리 넘버를 배정한 뒤 별도로 안내 드립니다.</p>
</div>
</td></tr>
${section('신청 내용', infoRows)}
${section('팀 / 차량', teamRows)}
${section('드라이버', driverRowHtml)}
<tr><td style="padding:16px 32px 24px;">
<p style="margin:0;font-size:12px;color:#999;">접수 일시: ${now.replace('T', ' ').slice(0, 19)} (UTC)</p>
</td></tr>
<tr><td style="padding:16px 32px;background:#f4f6f8;border-top:1px solid #eee;">
<p style="margin:0;font-size:11px;color:#999;line-height:1.7;">문의: <a href="mailto:hynam@miksports.com" style="color:#E60023;">hynam@miksports.com</a><br>인제 GT 마스터즈 운영팀</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      entryType, roundId, roundLabel, className, teamName, carModel,
      teamRepresentative,
      drivers, contactPhone, contactEmail,
      agreedRules, agreedPrivacy, entryFee, preferredNumber, preferredNumber2,
    } = body as {
      entryType: 'round' | 'season'; roundId?: string; roundLabel: string; className: string;
      teamName: string; carModel: string;
      teamRepresentative?: string;
      drivers: Driver[]; contactPhone: string; contactEmail: string;
      agreedRules: boolean; agreedPrivacy: boolean; entryFee?: string; preferredNumber?: string; preferredNumber2?: string;
    }
    const entryTypeLabel = entryType === 'season' ? '시즌 전체' : '라운드'

    const numRegex = /^[1-9][0-9]?$/
    if (!preferredNumber || !preferredNumber2 || !numRegex.test(preferredNumber) || !numRegex.test(preferredNumber2)) {
      return NextResponse.json({ ok: false, error: '희망 엔트리 번호를 1~99 사이 정수로 입력하세요.' }, { status: 400 })
    }
    if (preferredNumber === preferredNumber2) {
      return NextResponse.json({ ok: false, error: '희망 엔트리 1·2순위는 서로 달라야 합니다.' }, { status: 400 })
    }

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
              teamRepresentative: teamRepresentative ?? '',
              preferredNumber: preferredNumber ?? '',
              preferredNumber2: preferredNumber2 ?? '',
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
          range: 'Sheet1!A:X',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[
              entryTypeLabel, roundLabel, className, teamName, carModel,
              teamRepresentative ?? '',                                                            // [5]
              entryFee ?? '',                                                                      // [6]
              d1.name ?? '', d1.birthDate ?? '', d1.bloodType ?? '', d1.phone ?? contactPhone, d1.email ?? contactEmail, d1.karaLicense ?? '', // [7-12]
              d2.name ?? '', d2.birthDate ?? '', d2.bloodType ?? '', d2.karaLicense ?? '',        // [13-16]
              d3.name ?? '', d3.birthDate ?? '', d3.bloodType ?? '', d3.karaLicense ?? '',        // [17-20]
              preferredNumber ?? '',                                                               // [21]
              preferredNumber2 ?? '',                                                              // [22]
              now,                                                                                 // [23]
            ]],
          },
        })
      } catch (e) {
        console.error('Sheets error:', e)
      }
    }

    // ── ③④ 이메일 발송 ────────────────────────────────
    const resend = new Resend(process.env.RESEND_API_KEY)
    const emailHtml = buildEntryEmail({
      entryTypeLabel, roundLabel, className, teamName, carModel,
      teamRepresentative, entryFee,
      preferredNumber: preferredNumber!,
      preferredNumber2: preferredNumber2!,
      drivers, contactPhone, contactEmail, now,
    })
    const emailSubject = `[인제 GT 마스터즈] 참가 신청 접수 확인 - ${teamName}`

    await Promise.all([
      resend.emails.send({ from: FROM, to: ADMIN, cc: 'hynam@miksports.com', subject: emailSubject, html: emailHtml, replyTo: contactEmail }),
      resend.emails.send({ from: FROM, to: contactEmail, subject: emailSubject, html: emailHtml }),
    ])

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Entry API error:', err)
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
}
