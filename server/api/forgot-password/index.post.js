// server/api/forgot-password.post.ts

import { defineEventHandler, readBody } from 'h3'
import { google } from 'googleapis'
import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  // 1. Parse incoming payload
  const { email, resetToken } = await readBody(event)

  // 2. Configure OAuth2 client
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI ?? 'https://developers.google.com/oauthplayground'
  )
  oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN })

  // 3. Retrieve a fresh access token
  const accessTokenResponse = await oAuth2Client.getAccessToken()
  const accessToken =
    typeof accessTokenResponse === 'string'
      ? accessTokenResponse
      : accessTokenResponse?.token

  // 4. Create a Nodemailer transporter using Gmail’s API
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_USER,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken,
    },
  })

  // 5. Build the password‐reset URL
  const resetUrl = `${process.env.PUBLIC_URL}/reset-password?token=${resetToken}`

  // 6. Send the email (await to ensure delivery)
  await transporter.sendMail({
    from: `"Your Store" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Reset your password',
    html: `
      <p>Hi there,</p>
      <p>Click <a href="${resetUrl}">here</a> to choose a new password.</p>
      <p>If you didn’t request this, just ignore this message.</p>
    `,
  })

  // 7. Respond with a simple status
  return { status: 'ok' }
})
