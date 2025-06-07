import { describe, it, expect, vi } from 'vitest'

vi.mock('@/server/models/Order.js', () => ({
  default: { findById: vi.fn(), find: vi.fn() }
}))
vi.mock('@/server/utils/dbConnect.js', () => ({
  connectDB: vi.fn()
}))
vi.mock('@/server/utils/dbDisconnect.js', () => ({
  disconnectDB: vi.fn()
}))

;(globalThis as any).defineEventHandler = (fn: any) => fn
;(globalThis as any).createError = (err: any) => err
;(globalThis as any).getQuery = vi.fn()

let handler: any
let Order: any
let connectDB: any
let disconnectDB: any

beforeAll(async () => {
  const mod = await import('@/server/api/orders/index.get.js')
  handler = mod.default
  Order = (await import('@/server/models/Order.js')).default
  connectDB = (await import('@/server/utils/dbConnect.js')).connectDB
  disconnectDB = (await import('@/server/utils/dbDisconnect.js')).disconnectDB
})

describe('GET /api/orders', () => {
  it('returns order by id', async () => {
    ;(globalThis as any).getQuery.mockReturnValue({ _id: 'o1' })
    ;(Order.findById as any).mockResolvedValue({ _id: 'o1' })
    const result = await handler({} as any)
    expect(connectDB).toHaveBeenCalled()
    expect(Order.findById).toHaveBeenCalledWith('o1')
    expect(disconnectDB).toHaveBeenCalled()
    expect(result).toEqual({ _id: 'o1' })
  })

  it('returns all orders when no id', async () => {
    ;(globalThis as any).getQuery.mockReturnValue({})
    ;(Order.find as any).mockResolvedValue([{ _id: 'o1' }])
    const result = await handler({} as any)
    expect(Order.find).toHaveBeenCalledWith({})
    expect(result).toEqual([{ _id: 'o1' }])
  })

  it('throws server error on failure', async () => {
    ;(globalThis as any).getQuery.mockReturnValue({})
    ;(Order.find as any).mockRejectedValue(new Error('fail'))
    await expect(handler({} as any)).rejects.toMatchObject({ statusCode: 500 })
  })
})
