const RESEND_SEND_EMAIL_URL = 'https://api.resend.com/emails'
const DEFAULT_SITE_NAME = 'Christ Ethnos Global Ministries'

function getSiteName() {
  return process.env.SITE_NAME || DEFAULT_SITE_NAME
}

function getReplyToEmail() {
  return process.env.RESEND_REPLY_TO_EMAIL || process.env.RESEND_REPLY_TO || ''
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function formatGreetingName(name) {
  const cleanName = String(name || '').trim()
  return cleanName || 'there'
}

function buildEmailHtml({ greetingName, intro, body, closing }) {
  const siteName = escapeHtml(getSiteName())

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f6f3ee;padding:24px;font-family:Arial,sans-serif;color:#222;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;border-collapse:collapse;background:#ffffff;border:1px solid #e8e0d5;">
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 18px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#8a6a4c;">${siteName}</p>
                <h1 style="margin:0 0 20px;font-size:26px;line-height:1.25;color:#1f1b17;">Request received</h1>
                <p style="margin:0 0 16px;font-size:16px;line-height:1.65;">Dear ${escapeHtml(greetingName)},</p>
                <p style="margin:0 0 16px;font-size:16px;line-height:1.65;">${escapeHtml(intro)}</p>
                <p style="margin:0 0 16px;font-size:16px;line-height:1.65;">${escapeHtml(body)}</p>
                <p style="margin:0 0 24px;font-size:16px;line-height:1.65;">${escapeHtml(closing)}</p>
                <p style="margin:0;font-size:16px;line-height:1.65;">Grace and peace,<br />${siteName}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function buildEmailText({ greetingName, intro, body, closing }) {
  return [
    `Dear ${greetingName},`,
    '',
    intro,
    '',
    body,
    '',
    closing,
    '',
    'Grace and peace,',
    getSiteName(),
  ].join('\n')
}

async function sendResendEmail({ to, subject, html, text, idempotencyKey, tags }) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  const replyTo = getReplyToEmail()

  if (!apiKey || !from) {
    return { sent: false, skipped: true, reason: 'resend_not_configured' }
  }

  const response = await fetch(RESEND_SEND_EMAIL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
      ...(tags?.length ? { tags } : {}),
    }),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message = payload?.message || payload?.error?.message || response.statusText || 'Resend request failed.'
    throw new Error(message)
  }

  return { sent: true, id: payload?.id || null }
}

async function sendAcknowledgementEmail({ to, name, subject, intro, body, closing, idempotencyKey, tags }) {
  const greetingName = formatGreetingName(name)
  const content = { greetingName, intro, body, closing }

  return sendResendEmail({
    to,
    subject,
    html: buildEmailHtml(content),
    text: buildEmailText(content),
    idempotencyKey,
    tags,
  })
}

export function sendPrayerAcknowledgementEmail({ to, name, requestId }) {
  return sendAcknowledgementEmail({
    to,
    name,
    subject: 'We received your prayer request',
    intro: 'Thank you for trusting us with your prayer request. This email confirms that your request has been received by our pastoral care team.',
    body: 'Your request will be handled with care and discretion. A member of the team will review it prayerfully and follow up soon if a response is needed.',
    closing: 'You do not need to send the request again. We are standing with you in prayer.',
    idempotencyKey: requestId ? `prayer-request-${requestId}-acknowledgement` : undefined,
    tags: [{ name: 'category', value: 'prayer_acknowledgement' }],
  })
}

export function sendZoomAcknowledgementEmail({ to, name, messageId }) {
  return sendAcknowledgementEmail({
    to,
    name,
    subject: 'We received your Zoom link request',
    intro: 'Thank you for reaching out. This email confirms that we have received your request for the online service Zoom details.',
    body: 'Our welcome team will review your message and send the access information as soon as possible. They may also follow up to make sure you have everything you need before service.',
    closing: 'You do not need to submit another request. We will get back to you soon.',
    idempotencyKey: messageId ? `zoom-request-${messageId}-acknowledgement` : undefined,
    tags: [{ name: 'category', value: 'zoom_acknowledgement' }],
  })
}
