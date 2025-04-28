// server/api/email-templates.post.js

import { defineEventHandler, readBody, createError } from 'h3'
import { SESClient, CreateTemplateCommand } from '@aws-sdk/client-ses'

export default defineEventHandler(async (event) => {
  // 1. Parse and validate incoming payload
  const { templateName, subjectPart, htmlPart, textPart } = await readBody(event)
  if (!templateName || !subjectPart || !htmlPart) {
    throw createError({
      statusCode: 400,
      statusMessage: 'templateName, subjectPart and htmlPart are required'
    })
  }

  // 2. Configure SES client
  const config = useRuntimeConfig()
  const ses = new SESClient({
    region: config.public.AWS_REGION,
    credentials: {
      accessKeyId:     config.private.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.private.AWS_SECRET_ACCESS_KEY
    }
  })

  // 3. Build and send the CreateTemplateCommand
  const command = new CreateTemplateCommand({
    Template: {
      TemplateName: templateName,
      SubjectPart:  subjectPart,
      HtmlPart:     htmlPart,
      TextPart:     textPart || ''
    }
  })

  try {
    await ses.send(command)
  } catch (err) {
    // If the template already exists or another error occurs, surface it
    throw createError({
      statusCode: err.$metadata?.httpStatusCode || 500,
      statusMessage: err.message
    })
  }

  // 4. Return success
  return {
    status:       'ok',
    templateName
  }
})
