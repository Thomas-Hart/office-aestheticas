import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/server/models/User.js', () => ({
  default: { findOne: vi.fn() }
}))
vi.mock('@/server/utils/dbConnect.js', () => ({
  connectDB: vi.fn()
}))
vi.mock('@/server/utils/dbDisconnect.js', () => ({
  disconnectDB: vi.fn()
}))
vi.mock('bcrypt', () => ({
  default: { compare: vi.fn() }
}))
vi.mock('jsonwebtoken', () => ({
  default: { sign: vi.fn() }
}))

;(globalThis as any).defineEventHandler = (fn: any) => fn
;(globalThis as any).createError = (err: any) => err
;(globalThis as any).useRuntimeConfig = () => ({ private: { JWT_SECRET: 'sec' } })
;(globalThis as any).readBody = vi.fn()

let handler: any
let User: any
let connectDB: any
let disconnectDB: any
let bcryptCmp: any
let jwtSign: any

beforeAll(async () => {
  const mod = await import('@/server/api/auth/login.post.js')
  handler = mod.default
  User = (await import('@/server/models/User.js')).default
  connectDB = (await import('@/server/utils/dbConnect.js')).connectDB
  disconnectDB = (await import('@/server/utils/dbDisconnect.js')).disconnectDB
  bcryptCmp = (await import('bcrypt')).default.compare
  jwtSign = (await import('jsonwebtoken')).default.sign
})

beforeEach(() => {
  vi.resetAllMocks()
})

describe('POST /api/auth/login', () => {
  it('returns token when credentials valid', async () => {
    (globalThis as any).readBody.mockResolvedValue({ email: 'e', password: 'p' })
    User.findOne.mockResolvedValue({ _id: 'u1', email: 'e', password: 'h' })
    bcryptCmp.mockResolvedValue(true)
    jwtSign.mockReturnValue('tok')

    const result = await handler({} as any)

    expect(connectDB).toHaveBeenCalled()
    expect(User.findOne).toHaveBeenCalledWith({ email: 'e' })
    expect(bcryptCmp).toHaveBeenCalledWith('p', 'h')
    expect(jwtSign).toHaveBeenCalled()
    expect(disconnectDB).toHaveBeenCalled()
    expect(result).toEqual({ token: 'tok', user: { _id: 'u1', email: 'e', password: 'h' } })
  })

  it('throws 401 on invalid credentials', async () => {
    (globalThis as any).readBody.mockResolvedValue({ email: 'e', password: 'p' })
    User.findOne.mockResolvedValue({ _id: 'u1', email: 'e', password: 'h' })
    bcryptCmp.mockResolvedValue(false)

    await expect(handler({} as any)).rejects.toMatchObject({ statusCode: 401 })
  })
})
