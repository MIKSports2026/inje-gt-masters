// app/api/entry/route.ts — 참가신청 이메일 발송
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const ADMIN = process.env.ADMIN_EMAIL ?? 'miksports2026@gmail.com'
const FROM  = 'onboarding@resend.dev'

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const body = await req.json()
    const {
      teamName, driver1, driver2, phone, email,
      className, rounds, carModel, carNumber, licenseNum,
      totalFee,
    } = body

    const roundList  = (rounds as string[]).join(', ')
    const driver2str = driver2 ? driver2 : '—'
    const carNumStr  = carNumber ? carNumber : '—'
    const licenseStr = licenseNum ? licenseNum : '—'
    const feeStr     = totalFee ? `${Number(totalFee).toLocaleString()}원` : '결제 페이지에서 확인'

    // ── 1. 관리자 수신 이메일 ────────────────────────────
    const adminHtml = `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Apple SD Gothic Neo',Pretendard,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-top:4px solid #DC001A;max-width:600px;width:100%;">
        <tr>
          <td style="padding:32px 40px 20px;border-bottom:1px solid #eee;">
            <p style="margin:0 0 4px;font-size:12px;color:#DC001A;font-weight:800;letter-spacing:2px;text-transform:uppercase;">NEW ENTRY</p>
            <h1 style="margin:0;font-size:22px;color:#0c1730;">새 참가신청이 접수되었습니다</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${[
                ['팀명',       teamName],
                ['드라이버 1', driver1],
                ['드라이버 2', driver2str],
                ['연락처',     phone],
                ['이메일',     email],
                ['클래스',     className],
                ['라운드',     roundList],
                ['차종',       carModel],
                ['차량 번호',  carNumStr],
                ['라이선스',   licenseStr],
                ['결제 예정',  feeStr],
              ].map(([label, value]) => `
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;width:120px;">
                  <span style="font-size:13px;color:#666;font-weight:700;">${label}</span>
                </td>
                <td style="padding:10px 0 10px 16px;border-bottom:1px solid #f0f0f0;">
                  <span style="font-size:14px;color:#111;font-weight:600;">${value}</span>
                </td>
              </tr>`).join('')}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px 32px;background:#fafafa;border-top:1px solid #eee;">
            <p style="margin:0;font-size:12px;color:#999;line-height:1.7;">
              본 메일은 인제 GT 마스터즈 홈페이지 참가신청 폼에서 자동 발송되었습니다.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

    // ── 2. 신청자 확인 이메일 ────────────────────────────
    const userHtml = `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Apple SD Gothic Neo',Pretendard,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-top:4px solid #DC001A;max-width:600px;width:100%;">

        <!-- 헤더 -->
        <tr>
          <td style="padding:32px 40px 24px;background:#0c1730;">
            <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:3px;text-transform:uppercase;">INJE GT MASTERS 2026</p>
            <h1 style="margin:0;font-size:24px;color:#fff;letter-spacing:1px;">참가신청 접수 완료</h1>
          </td>
        </tr>

        <!-- 인사말 -->
        <tr>
          <td style="padding:28px 40px 16px;">
            <p style="margin:0;font-size:15px;line-height:1.8;color:#333;">
              안녕하세요, <strong>${driver1}</strong>님.<br>
              <strong>${teamName}</strong> 팀의 참가신청이 정상 접수되었습니다.
            </p>
          </td>
        </tr>

        <!-- 신청 내용 -->
        <tr>
          <td style="padding:0 40px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fa;border:1px solid #eee;">
              <tr>
                <td colspan="2" style="padding:12px 16px;background:#DC001A;">
                  <span style="font-size:12px;font-weight:800;color:#fff;letter-spacing:2px;text-transform:uppercase;">신청 내용</span>
                </td>
              </tr>
              ${[
                ['클래스',     className],
                ['라운드',     roundList],
                ['팀명',       teamName],
                ['드라이버 1', driver1],
                ['드라이버 2', driver2str],
                ['차종',       carModel],
              ].map(([label, value], i) => `
              <tr style="background:${i % 2 === 0 ? '#fff' : '#fafafa'};">
                <td style="padding:11px 16px;width:110px;font-size:13px;color:#666;font-weight:700;border-bottom:1px solid #f0f0f0;">${label}</td>
                <td style="padding:11px 16px;font-size:13px;color:#111;font-weight:600;border-bottom:1px solid #f0f0f0;">${value}</td>
              </tr>`).join('')}
            </table>
          </td>
        </tr>

        <!-- 결제 안내 -->
        <tr>
          <td style="padding:0 40px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8f8;border:1px solid rgba(220,0,26,0.2);padding:20px;">
              <tr>
                <td>
                  <p style="margin:0 0 8px;font-size:13px;font-weight:800;color:#DC001A;">💳 결제 안내</p>
                  <p style="margin:0 0 6px;font-size:13px;color:#333;line-height:1.7;">
                    결제 예정 금액: <strong style="font-size:16px;color:#DC001A;">${feeStr}</strong>
                  </p>
                  <p style="margin:0;font-size:12px;color:#666;line-height:1.7;">
                    운영팀에서 토스페이먼츠 결제 링크를 <strong>${email}</strong> 및 카카오톡으로 별도 발송드립니다.<br>
                    결제 완료 시 최종 접수가 확정됩니다. 라운드별 선착순 마감이 적용되오니 빠른 결제를 권장합니다.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- 문의 -->
        <tr>
          <td style="padding:0 40px 32px;">
            <p style="margin:0;font-size:13px;color:#666;line-height:1.8;">
              문의사항이 있으시면 아래로 연락해 주세요.<br>
              📧 <a href="mailto:${ADMIN}" style="color:#DC001A;">${ADMIN}</a>
            </p>
          </td>
        </tr>

        <!-- 푸터 -->
        <tr>
          <td style="padding:20px 40px;background:#0c1730;border-top:1px solid rgba(255,255,255,0.1);">
            <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.4);line-height:1.7;">
              © 2026 INJE GT MASTERS. All rights reserved.<br>
              강원도 인제군 기린면 상하답로 130 · 인제스피디움
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

    // ── 발송 ────────────────────────────────────────────
    const [adminResult, userResult] = await Promise.all([
      resend.emails.send({
        from:    FROM,
        to:      ADMIN,
        subject: `[참가신청] ${teamName} - ${className}`,
        html:    adminHtml,
        replyTo: email,
      }),
      resend.emails.send({
        from:    FROM,
        to:      email,
        subject: '[인제 GT 마스터즈] 참가신청 접수 완료',
        html:    userHtml,
      }),
    ])

    if (adminResult.error || userResult.error) {
      console.error('Resend error:', adminResult.error ?? userResult.error)
      return NextResponse.json({ ok: false, error: 'email_failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Entry API error:', err)
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
}
