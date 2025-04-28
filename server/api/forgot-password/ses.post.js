// server/api/auth/forgot-password.post.js

import { defineEventHandler, readBody, createError } from 'h3'
import { SESClient, SendTemplatedEmailCommand } from '@aws-sdk/client-ses'

const forgotPasswordRequests = new Map()

export default defineEventHandler(async (event) => {
  // 1. Parse incoming payload
  const { email, resetLink } = await readBody(event)
  const config = useRuntimeConfig()

  // 2. Validate email format & rate-limit
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email address' })
  }
  const now = Date.now()
  const RATE_LIMIT_MS = 5 * 60 * 1000  // 5 minutes
  const lastRequestTime = forgotPasswordRequests.get(email) || 0
  if (now - lastRequestTime < RATE_LIMIT_MS) {
    throw createError({ statusCode: 429, statusMessage: 'Password reset already requested. Try again later.' })
  }
  forgotPasswordRequests.set(email, now)

  // 3. Configure SES client
  const ses = new SESClient({
    region: config.public.AWS_REGION,
    credentials: {
      accessKeyId:     config.private.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.private.AWS_SECRET_ACCESS_KEY
    }
  })

  // 4. Send the templated email
  await ses.send(new SendTemplatedEmailCommand({
    Source:       config.public.SES_SOURCE_EMAIL,    // e.g. "no-reply@yourdomain.com"
    Destination:  { ToAddresses: [email] },
    Template:     config.public.SES_TEMPLATE_NAME,   // the SES template name
    TemplateData: JSON.stringify({ resetLink })
  }))

  // 5. Return success
  return { status: 'ok' }
})
