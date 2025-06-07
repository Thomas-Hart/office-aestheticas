import { describe, it, expect, vi } from 'vitest'

vi.mock('@/server/models/User.js', () => ({
  default: { findById: vi.fn() }
}))
vi.mock('@/server/models/Order.js', () => ({
  default: { findOne: vi.fn() }
}))
vi.mock('@/server/models/Item.js', () => ({
  default: { findOne: vi.fn() }
}))
vi.mock('@/server/utils/dbConnect.js', () => ({
  connectDB: vi.fn()
}))
vi.mock('@/server/utils/dbDisconnect.js', () => ({
  disconnectDB: vi.fn()
}))

;(globalThis as any).defineEventHandler = (fn: any) => fn
;(globalThis as any).createError = (err: any) => err

let handler: any
let User: any
let connectDB: any
let disconnectDB: any
let populate: any

beforeAll(async () => {
  const mod = await import('@/server/api/users/[id].get.js')
  handler = mod.default
  User = (await import('@/server/models/User.js')).default
  connectDB = (await import('@/server/utils/dbConnect.js')).connectDB
  disconnectDB = (await import('@/server/utils/dbDisconnect.js')).disconnectDB
})

describe('GET /api/users/[id]', () => {
  it('returns user when found', async () => {
    const user = { _id: 'u1' }
    populate = vi.fn().mockReturnThis()
    const query = {
      populate,
      then: (resolve: any) => Promise.resolve(resolve(user))
    }
    ;(User.findById as any).mockReturnValue(query)

    const result = await handler({ context: { params: { id: 'u1' } } } as any)

    expect(connectDB).toHaveBeenCalled()
    expect(User.findById).toHaveBeenCalledWith('u1')
    expect(populate).toHaveBeenCalledTimes(2)
    expect(disconnectDB).toHaveBeenCalled()
    expect(result).toEqual(user)
  })

  it('throws 404 when user missing', async () => {
    populate = vi.fn().mockReturnThis()
    const query = {
      populate,
      then: (resolve: any) => Promise.resolve(resolve(null))
    }
    ;(User.findById as any).mockReturnValue(query)
    await expect(
      handler({ context: { params: { id: 'x' } } } as any)
    ).rejects.toMatchObject({ statusCode: 500 })
  })
})
