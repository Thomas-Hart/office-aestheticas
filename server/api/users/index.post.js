import User from '~/server/models/User.js'
import { connectDB } from '~/server/utils/dbConnect'
import { disconnectDB } from '~/server/utils/dbDisconnect'

export default defineEventHandler(async (event) => {
  await connectDB()

  try {
    const body = await readBody(event)

    if (!body.name || !body.email || !body.password) {
      throw createError({ statusCode: 400, message: 'Missing required fields: name, email, or password' })
    }

    const existingUser = await User.findOne({ email: body.email })
    if (existingUser) {
      throw createError({ statusCode: 400, message: 'User with this email already exists' })
    }

    const newUser = new User({
      name: body.name,
      email: body.email,
      password: body.password,
      profilePicture: body.profilePicture || '',
      bio: body.bio || '',
      shippingAddresses: body.shippingAddresses || [],
      cart: body.cart || [],
      wishlist: body.wishlist || [],
      recentlyViewedItems: body.recentlyViewedItems || [],
      paymentMethods: body.paymentMethods || [],
      accountSettings: {
        emailPreferences: body.accountSettings?.emailPreferences || true,
        notifications: body.accountSettings?.notifications || true,
      },
    })

    const savedUser = await newUser.save()
    await disconnectDB()
    return { statusCode: 201, message: 'User created successfully', user: savedUser }

  } catch (error) {
    await disconnectDB()
    if (error.statusCode && error.message) throw error
    throw createError({ statusCode: 500, message: 'Server Error' })
  }
})
