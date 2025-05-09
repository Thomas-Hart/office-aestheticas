import JobApplication from '~/server/models/JobApplication.js'
import { connectDB } from '~/server/utils/dbConnect'
import { disconnectDB } from '~/server/utils/dbDisconnect'

export default defineEventHandler(async (event) => {
  await connectDB()
  const { id } = event.context.params
  try {
    const deleted = await JobApplication.findByIdAndDelete(id)
    await disconnectDB()
    return deleted
  } catch (error) {
    console.error(error)
    await disconnectDB()
    throw createError({ statusCode: 500, message: 'Server Error' })
  }
})
