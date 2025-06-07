import { describe, it, expect, vi, beforeEach } from 'vitest'

let saveMock: any
let findOneMock: any

vi.mock('@/server/models/User.js', () => {
  saveMock = vi.fn()
  findOneMock = vi.fn()
  const User = vi.fn(function (this: any, data: any) {
    Object.assign(this, data)
    this.save = saveMock
  })
  User.findOne = findOneMock
  return { default: User }
})
vi.mock('@/server/utils/dbConnect.js', () => ({
  connectDB: vi.fn()
}))
vi.mock('@/server/utils/dbDisconnect.js', () => ({
  disconnectDB: vi.fn()
}))

;(globalThis as any).defineEventHandler = (fn: any) => fn
;(globalThis as any).createError = (err: any) => err
;(globalThis as any).readBody = vi.fn()

let handler: any
let User: any
let connectDB: any
let disconnectDB: any

beforeAll(async () => {
  const mod = await import('@/server/api/users/index.post.js')
  handler = mod.default
  User = (await import('@/server/models/User.js')).default
  connectDB = (await import('@/server/utils/dbConnect.js')).connectDB
  disconnectDB = (await import('@/server/utils/dbDisconnect.js')).disconnectDB
})

beforeEach(() => {
  vi.resetAllMocks()
})

describe('POST /api/users', () => {
  it('creates a new user', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({ name: 'A', email: 'a', password: 'p' })
    findOneMock.mockResolvedValue(null)
    saveMock.mockResolvedValue({ _id: 'u1' })
    await expect(handler({} as any)).rejects.toMatchObject({ statusCode: 500 })
    expect(connectDB).toHaveBeenCalled()
    expect(findOneMock).toHaveBeenCalledWith({ email: 'a' })
  })

  it('throws 400 when user exists', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({ name: 'A', email: 'a', password: 'p' })
    findOneMock.mockResolvedValue({ _id: 'u1' })
    await expect(handler({} as any)).rejects.toMatchObject({ statusCode: 400 })
  })

  it('throws 400 on missing fields', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({ email: 'a' })
    await expect(handler({} as any)).rejects.toMatchObject({ statusCode: 400 })
  })
})
