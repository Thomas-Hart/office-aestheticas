import { defineEventHandler, readBody } from 'h3'
import { google } from 'googleapis'
import nodemailer from 'nodemailer'
import mjml2html from 'mjml'

export default defineEventHandler(async (event) => {
  // 1. Parse incoming payload
  const { email, link, resetToken } = await readBody(event)
  const config = useRuntimeConfig();

  // 2. Generate your custom email HTML via MJML
  const mjmlTemplate = `
  <mjml>
    <mj-body background-color="#f0f0f0">
      <mj-section>
        <mj-column>
          <mj-text font-size="20px" font-weight="bold">Password Reset</mj-text>
          <mj-text>
            Click the button below to reset your password.
          </mj-text>
          <mj-button href="${link}/reset-password?token=${resetToken}">
            Reset Password
          </mj-button>
          <mj-text font-size="12px" color="#888">
            If you didn't request this, just ignore this email.
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
  `
  const { html, errors } = mjml2html(mjmlTemplate)
  if (errors.length) {
    console.warn('MJML errors:', errors)
  }

  // 3. Configure OAuth2 client (as before)
  const oAuth2Client = new google.auth.OAuth2(
    config.public.GMAIL_CLIENT_ID,
    config.private.GMAIL_CLIENT_SECRET,
    config.private.GMAIL_REDIRECT_URI ?? 'https://developers.google.com/oauthplayground'
  )
  oAuth2Client.setCredentials({ refresh_token: config.private.GMAIL_REFRESH_TOKEN })
  const accessTokenRes = await oAuth2Client.getAccessToken()
  const accessToken = typeof accessTokenRes === 'string' ? accessTokenRes : accessTokenRes?.token

  // 4. Create the transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: config.public.GMAIL_USER,
      clientId: config.public.GMAIL_CLIENT_ID,
      clientSecret: config.private.GMAIL_CLIENT_SECRET,
      refreshToken: config.private.GMAIL_REFRESH_TOKEN,
      accessToken,
    },
  })

  // 5. Send the email with your MJML-generated HTML
  await transporter.sendMail({
    from: `"Your Store" <${config.public.GMAIL_USER}>`,
    to: email,
    subject: 'Reset your password',
    html,  // MJML output here
  })

  return { status: 'ok' }
})
