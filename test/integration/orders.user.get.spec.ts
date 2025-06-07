import { describe, it, expect, vi } from 'vitest'

vi.mock('@/server/models/Order.js', () => ({
  default: { find: vi.fn() }
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
let Order: any
let connectDB: any
let disconnectDB: any

beforeAll(async () => {
  const mod = await import('@/server/api/orders/[id].get.js')
  handler = mod.default
  Order = (await import('@/server/models/Order.js')).default
  connectDB = (await import('@/server/utils/dbConnect.js')).connectDB
  disconnectDB = (await import('@/server/utils/dbDisconnect.js')).disconnectDB
})

describe('GET /api/orders/[id]', () => {
  it('returns orders for user', async () => {
    ;(Order.find as any).mockResolvedValue([{ userId: 'u1' }])
    const result = await handler({ context: { params: { id: 'u1' } } } as any)
    expect(connectDB).toHaveBeenCalled()
    expect(Order.find).toHaveBeenCalledWith({ userId: 'u1' })
    expect(disconnectDB).toHaveBeenCalled()
    expect(result).toEqual([{ userId: 'u1' }])
  })

  it('throws server error on failure', async () => {
    ;(Order.find as any).mockRejectedValue(new Error('fail'))
    await expect(
      handler({ context: { params: { id: 'u1' } } } as any)
    ).rejects.toMatchObject({ statusCode: 500 })
  })
})
