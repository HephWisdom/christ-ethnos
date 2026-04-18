const RESEND_SEND_EMAIL_URL = 'https://api.resend.com/emails'
const DEFAULT_SITE_NAME = 'Christ Ethnos Global Ministries'
const DEFAULT_SITE_URL = 'https://christethnos.org'
const DEFAULT_NOTIFICATION_EMAIL = 'info@christethnos.org'

function getSiteName() {
  return process.env.SITE_NAME || DEFAULT_SITE_NAME
}

function getPublicSiteUrl() {
  const rawUrl = process.env.PUBLIC_SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL
  return String(rawUrl || '').replace(/\/$/, '')
}

function getEmailLogoUrl() {
  return process.env.EMAIL_LOGO_URL || `${getPublicSiteUrl()}/favicon.png`
}

function getNotificationEmail() {
  return process.env.FORM_NOTIFICATION_EMAIL || DEFAULT_NOTIFICATION_EMAIL
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

function formatMultilineHtml(value) {
  return escapeHtml(value).replaceAll('\n', '<br />')
}

function buildLogoHtml() {
  const siteName = escapeHtml(getSiteName())
  const logoUrl = escapeHtml(getEmailLogoUrl())

  if (!logoUrl) return ''

  return `
                <img src="${logoUrl}" width="72" height="72" alt="${siteName}" style="display:block;width:72px;height:72px;margin:0 0 18px;object-fit:contain;" />`
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
${buildLogoHtml()}
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

function buildFieldRows(fields) {
  return fields
    .filter((field) => field.value !== undefined && field.value !== null && String(field.value).trim() !== '')
    .map((field) => `
                  <tr>
                    <td style="padding:10px 12px;border-bottom:1px solid #eee5da;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#8a6a4c;width:34%;vertical-align:top;">${escapeHtml(field.label)}</td>
                    <td style="padding:10px 12px;border-bottom:1px solid #eee5da;font-size:15px;line-height:1.55;color:#2a241f;vertical-align:top;">${formatMultilineHtml(field.value)}</td>
                  </tr>`)
    .join('')
}

function buildNotificationHtml({ title, intro, fields }) {
  const siteName = escapeHtml(getSiteName())

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f6f3ee;padding:24px;font-family:Arial,sans-serif;color:#222;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;border-collapse:collapse;background:#ffffff;border:1px solid #e8e0d5;">
            <tr>
              <td style="padding:32px;">
${buildLogoHtml()}
                <p style="margin:0 0 18px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#8a6a4c;">${siteName}</p>
                <h1 style="margin:0 0 16px;font-size:26px;line-height:1.25;color:#1f1b17;">${escapeHtml(title)}</h1>
                <p style="margin:0 0 24px;font-size:16px;line-height:1.65;color:#4a3f35;">${escapeHtml(intro)}</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-top:1px solid #eee5da;">
${buildFieldRows(fields)}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function buildNotificationText({ title, intro, fields }) {
  return [
    title,
    '',
    intro,
    '',
    ...fields
      .filter((field) => field.value !== undefined && field.value !== null && String(field.value).trim() !== '')
      .flatMap((field) => [`${field.label}: ${field.value}`, '']),
  ].join('\n').trim()
}

function formatSubmittedAt(value) {
  const date = value ? new Date(value) : new Date()
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
}

async function sendResendEmail({ to, subject, html, text, idempotencyKey, tags, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  const replyToEmail = replyTo || getReplyToEmail()

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
      ...(replyToEmail ? { reply_to: replyToEmail } : {}),
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

export function sendPrayerNotificationEmail({ requestId, name, email, request, isPrivate, createdAt }) {
  const notification = {
    title: 'New prayer request',
    intro: 'A prayer request was submitted through the website.',
    fields: [
      { label: 'Name', value: name },
      { label: 'Email', value: email || 'Not provided' },
      { label: 'Private', value: isPrivate ? 'Yes' : 'No' },
      { label: 'Prayer Request', value: request },
      { label: 'Submitted At', value: formatSubmittedAt(createdAt) },
      { label: 'Request ID', value: requestId },
    ],
  }

  return sendResendEmail({
    to: getNotificationEmail(),
    subject: `New prayer request from ${formatGreetingName(name)}`,
    html: buildNotificationHtml(notification),
    text: buildNotificationText(notification),
    idempotencyKey: requestId ? `prayer-request-${requestId}-team-notification` : undefined,
    tags: [{ name: 'category', value: 'prayer_team_notification' }],
    replyTo: email || undefined,
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

export function sendZoomNotificationEmail({
  messageId,
  name,
  email,
  phone,
  visitType,
  preferredFollowUp,
  message,
  createdAt,
}) {
  const notification = {
    title: 'New Zoom link request',
    intro: 'A visitor requested Zoom access or follow-up through the website.',
    fields: [
      { label: 'Name', value: name },
      { label: 'Email', value: email },
      { label: 'Phone', value: phone || 'Not provided' },
      { label: 'Visit Type', value: visitType },
      { label: 'Preferred Follow-up', value: preferredFollowUp },
      { label: 'Message', value: message },
      { label: 'Submitted At', value: formatSubmittedAt(createdAt) },
      { label: 'Message ID', value: messageId },
    ],
  }

  return sendResendEmail({
    to: getNotificationEmail(),
    subject: `New Zoom link request from ${formatGreetingName(name)}`,
    html: buildNotificationHtml(notification),
    text: buildNotificationText(notification),
    idempotencyKey: messageId ? `zoom-request-${messageId}-team-notification` : undefined,
    tags: [{ name: 'category', value: 'zoom_team_notification' }],
    replyTo: email,
  })
}
