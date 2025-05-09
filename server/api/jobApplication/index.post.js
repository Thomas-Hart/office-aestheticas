import JobApplication from '~/server/models/JobApplication.js'
import { connectDB } from '~/server/utils/dbConnect'
import { disconnectDB } from '~/server/utils/dbDisconnect'

export default defineEventHandler(async (event) => {
  await connectDB()
  const body = await readBody(event)
  try {
    const created = await new JobApplication(body).save()
    await disconnectDB()
    return created
  } catch (error) {
    console.error(error)
    await disconnectDB()
    throw createError({ statusCode: 500, message: 'Server Error' })
  }
})
