import JobApplication from '~/server/models/JobApplication.js'
import { connectDB } from '~/server/utils/dbConnect'
import { disconnectDB } from '~/server/utils/dbDisconnect'

export default defineEventHandler(async (event) => {
  await connectDB()
  const { id } = event.context.params
  const updates = await readBody(event)
  try {
    const updated = await JobApplication.findByIdAndUpdate(id, updates, { new: true })
    await disconnectDB()
    return updated
  } catch (error) {
    console.error(error)
    await disconnectDB()
    throw createError({ statusCode: 500, message: 'Server Error' })
  }
})
