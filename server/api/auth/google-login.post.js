import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import { connectDB } from '~/server/utils/dbConnect'
import { disconnectDB } from '~/server/utils/dbDisconnect'
import User from '~/server/models/User.js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const client = new OAuth2Client(config.public.GOOGLE_CLIENT_ID)
  await connectDB()

  try {
    const { token } = await readBody(event)
    if (!token) {
      throw createError({ statusCode: 400, statusMessage: 'No token provided' })
    }

    let payload

    // 1) If it's a JWT (ID token), verify it directly:
    if (token.split('.').length === 3) {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: config.public.GOOGLE_CLIENT_ID,
      })
      payload = ticket.getPayload()
      if (!payload) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid ID token' })
      }
    }
    // 2) Otherwise treat it as an OAuth2 access token:
    else {
      const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!resp.ok) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid access token' })
      }
      payload = await resp.json()
      // userinfo fields: payload.sub, payload.email, payload.name, payload.picture
    }

    // At this point `payload` has: .sub, .email, .name, .picture
    let user = await User.findOne({ email: payload.email })
    if (!user) {
      user = new User({
        email: payload.email,
        name: payload.name,
        googleId: payload.sub,
        profilePicture: payload.picture,
      })
      await user.save()
    } else {
      user.googleId = payload.sub
      user.name = payload.name
      user.profilePicture = payload.picture
      await user.save()
    }

    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email, name: user.name, picture: user.profilePicture },
      config.private.JWT_SECRET,
      { expiresIn: '1h' }
    )
    return { token: jwtToken, user }
  } catch (err) {
    console.error('Error in POST /api/auth/google-login:', err)
    throw createError({ statusCode: 500, message: 'Server Error' })
  } finally {
    await disconnectDB()
  }
})
