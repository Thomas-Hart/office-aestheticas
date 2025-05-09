import JobApplication from '~/server/models/JobApplication.js'
import { connectDB } from '~/server/utils/dbConnect'
import { disconnectDB } from '~/server/utils/dbDisconnect'

export default defineEventHandler(async (event) => {
  await connectDB()
  try {
    const allApps = await JobApplication.find({})
    await disconnectDB()
    return allApps
  } catch (error) {
    console.error(error)
    await disconnectDB()
    throw createError({ statusCode: 500, message: 'Server Error' })
  }
})
