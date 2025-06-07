import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/server/models/User.js', () => ({
  default: { findByIdAndUpdate: vi.fn() }
}))
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
  const mod = await import('@/server/api/users/cart/remove/[id].put.js')
  handler = mod.default
  User = (await import('@/server/models/User.js')).default
  connectDB = (await import('@/server/utils/dbConnect.js')).connectDB
  disconnectDB = (await import('@/server/utils/dbDisconnect.js')).disconnectDB
})

beforeEach(() => {
  vi.resetAllMocks()
})

describe('PUT /api/users/cart/remove/[id]', () => {
  it('removes item from cart', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({ itemId: '1' })
    ;(User.findByIdAndUpdate as any).mockResolvedValue({ cart: [] })
    const result = await handler({ context: { params: { id: 'u1' } } } as any)
    expect(connectDB).toHaveBeenCalled()
    expect(User.findByIdAndUpdate).toHaveBeenCalled()
    expect(disconnectDB).toHaveBeenCalled()
    expect(result).toEqual([])
  })

  it('throws 404 when user missing', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({ itemId: '1' })
    ;(User.findByIdAndUpdate as any).mockResolvedValue(null)
    await expect(
      handler({ context: { params: { id: 'x' } } } as any)
    ).rejects.toMatchObject({ statusCode: 404 })
  })
})
