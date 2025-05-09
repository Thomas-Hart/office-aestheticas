import JobApplication from '~/server/models/JobApplication.js'
import { connectDB } from '~/server/utils/dbConnect'
import { disconnectDB } from '~/server/utils/dbDisconnect'

export default defineEventHandler(async (event) => {
  await connectDB()
  const { id } = event.context.params
  try {
    const app = await JobApplication.findById(id)
    await disconnectDB()
    return app
  } catch (error) {
    console.error(error)
    await disconnectDB()
    throw createError({ statusCode: 500, message: 'Server Error' })
  }
})
